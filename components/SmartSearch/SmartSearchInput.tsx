'use client';

import { useState, useRef, useEffect } from 'react';
import { useSmartSearch, SmartSearchOptions, SearchSuggestion } from '@/hooks/useSmartSearch';
import { Game, GameStatus, Genre } from '@/types';
import SearchSuggestions from '@/components/SearchSuggestions/SearchSuggestions';

interface SmartSearchInputProps {
  games: Game[];
  statusFilter?: GameStatus | 'all';
  genreFilter?: Genre | 'all';
  onFiltersChange?: (filteredGames: Game[]) => void;
  placeholder?: string;
  className?: string;
  options?: SmartSearchOptions;
}

export default function SmartSearchInput({
  games,
  statusFilter = 'all',
  genreFilter = 'all',
  onFiltersChange,
  placeholder = "Search games, developers, genres...",
  className = '',
  options = {}
}: SmartSearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    suggestions,
    searchHistory,
    filteredGames,
    highlightedResults,
    setSearchTerm,
    clearSearch,
    clearHistory,
    selectSuggestion,
    addToHistory
  } = useSmartSearch(games, statusFilter, genreFilter, options);

  // Update parent component with filtered games
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(highlightedResults);
    }
  }, [highlightedResults, onFiltersChange]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    selectSuggestion(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle clear button
  const handleClear = () => {
    clearSearch();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle search submission (Enter key)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToHistory(searchTerm);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pl-10 pr-12 py-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation transition-all duration-200 ${
              isFocused ? 'ring-2 ring-blue-500' : ''
            }`}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute inset-y-0 right-10 flex items-center">
              <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {/* Clear button */}
          {searchTerm && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-3 flex items-center touch-manipulation group"
            >
              <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search suggestions */}
      {showSuggestions && (isFocused || suggestions.length > 0) && (
        <SearchSuggestions
          suggestions={suggestions}
          searchHistory={searchHistory}
          isLoading={isSearching}
          onSelect={handleSuggestionSelect}
          onClearHistory={clearHistory}
        />
      )}

      {/* Search stats */}
      {debouncedSearchTerm && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
          {filteredGames.length} result{filteredGames.length !== 1 ? 's' : ''} for &quot;{debouncedSearchTerm}&quot;
        </div>
      )}
    </div>
  );
} 