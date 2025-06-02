'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Game, GameStatus, Genre } from '@/types';

export interface SearchSuggestion {
  type: 'title' | 'developer' | 'genre' | 'recent';
  value: string;
  count?: number;
  game?: Game;
}

export interface SmartSearchOptions {
  debounceMs?: number;
  maxSuggestions?: number;
  enableHistory?: boolean;
  enableHighlighting?: boolean;
}

export interface SmartSearchResult {
  searchTerm: string;
  debouncedSearchTerm: string;
  isSearching: boolean;
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  filteredGames: Game[];
  highlightedResults: Game[];
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  clearHistory: () => void;
  selectSuggestion: (suggestion: SearchSuggestion) => void;
  addToHistory: (term: string) => void;
}

const SEARCH_HISTORY_KEY = 'levelist-search-history';
const MAX_HISTORY_ITEMS = 10;

export function useSmartSearch(
  games: Game[],
  statusFilter: GameStatus | 'all' = 'all',
  genreFilter: Genre | 'all' = 'all',
  options: SmartSearchOptions = {}
): SmartSearchResult {
  const {
    debounceMs = 300,
    maxSuggestions = 8,
    enableHistory = true,
    enableHighlighting = true
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debounceTimeoutRef = useRef<any>(null);

  // Load search history from localStorage
  useEffect(() => {
    if (enableHistory) {
      try {
        const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.warn('Failed to load search history:', error);
      }
    }
  }, [enableHistory]);

  // Debounced search term
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setIsSearching(searchTerm.length > 0);

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Generate suggestions based on current search term
  const suggestions = useMemo((): SearchSuggestion[] => {
    if (!searchTerm || searchTerm.length < 2) {
      // Show recent searches when no search term
      return searchHistory.slice(0, 5).map(term => ({
        type: 'recent' as const,
        value: term
      }));
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const suggestionSet = new Set<string>();
    const result: SearchSuggestion[] = [];

    // Title suggestions
    games.forEach(game => {
      if (game.title.toLowerCase().includes(lowerSearchTerm) && 
          !suggestionSet.has(game.title.toLowerCase())) {
        suggestionSet.add(game.title.toLowerCase());
        result.push({
          type: 'title',
          value: game.title,
          game
        });
      }
    });

    // Developer suggestions
    const developers = new Map<string, number>();
    games.forEach(game => {
      if (game.developer && 
          game.developer.toLowerCase().includes(lowerSearchTerm) &&
          !suggestionSet.has(game.developer.toLowerCase())) {
        const dev = game.developer;
        developers.set(dev, (developers.get(dev) || 0) + 1);
      }
    });

    developers.forEach((count, developer) => {
      result.push({
        type: 'developer',
        value: developer,
        count
      });
    });

    // Genre suggestions
    const matchingGenres = Array.from(new Set(games.flatMap(game => game.genres)))
      .filter(genre => genre.toLowerCase().includes(lowerSearchTerm) &&
                      !suggestionSet.has(genre.toLowerCase()));

    matchingGenres.forEach(genre => {
      const count = games.filter(game => game.genres.includes(genre)).length;
      result.push({
        type: 'genre',
        value: genre,
        count
      });
    });

    return result.slice(0, maxSuggestions);
  }, [searchTerm, games, searchHistory, maxSuggestions]);

  // Filter games based on all criteria
  const filteredGames = useMemo((): Game[] => {
    return games.filter(game => {
      // Status filter
      const matchesStatus = statusFilter === 'all' || game.status === statusFilter;
      
      // Genre filter
      const matchesGenre = genreFilter === 'all' || game.genres.includes(genreFilter);
      
      // Search filter
      const matchesSearch = !debouncedSearchTerm || 
        game.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        game.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        game.developer?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        game.genres.some(genre => genre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      return matchesStatus && matchesGenre && matchesSearch;
    });
  }, [games, statusFilter, genreFilter, debouncedSearchTerm]);

  // Highlighted results for search term emphasis
  const highlightedResults = useMemo((): Game[] => {
    if (!enableHighlighting || !debouncedSearchTerm) {
      return filteredGames;
    }

    // Sort by relevance: exact title matches first, then partial matches
    return [...filteredGames].sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const searchLower = debouncedSearchTerm.toLowerCase();

      // Exact match priority
      if (aTitle === searchLower && bTitle !== searchLower) return -1;
      if (bTitle === searchLower && aTitle !== searchLower) return 1;

      // Starts with priority
      if (aTitle.startsWith(searchLower) && !bTitle.startsWith(searchLower)) return -1;
      if (bTitle.startsWith(searchLower) && !aTitle.startsWith(searchLower)) return 1;

      // Default alphabetical
      return aTitle.localeCompare(bTitle);
    });
  }, [filteredGames, debouncedSearchTerm, enableHighlighting]);

  // Add search term to history
  const addToHistory = useCallback((term: string) => {
    if (!enableHistory || !term.trim() || searchHistory.includes(term)) {
      return;
    }

    const newHistory = [term, ...searchHistory].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
    
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, [searchHistory, enableHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }, []);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.value);
    addToHistory(suggestion.value);
  }, [addToHistory]);

  // Enhanced setSearchTerm that handles history
  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() && term.length > 2) {
      // Add to history when user types a meaningful search
      const timeoutId = setTimeout(() => {
        addToHistory(term);
      }, 2000); // Add to history after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [addToHistory]);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    suggestions,
    searchHistory,
    filteredGames,
    highlightedResults,
    setSearchTerm: handleSetSearchTerm,
    clearSearch,
    clearHistory,
    selectSuggestion,
    addToHistory
  };
} 