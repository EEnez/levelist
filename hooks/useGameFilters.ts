import { useMemo } from 'react';
import { Game } from '@/types';
import { FilterOptions } from '@/components/FilterPanel/FilterPanel';

export function useGameFilters(games: Game[], filters: FilterOptions, searchTerm: string) {
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(term) ||
        game.genres.some(genre => genre.toLowerCase().includes(term)) ||
        game.platforms.some(platform => platform.toLowerCase().includes(term)) ||
        game.developer?.toLowerCase().includes(term) ||
        game.publisher?.toLowerCase().includes(term)
      );
    }

    // Apply genre filter
    if (filters.genres.length > 0) {
      result = result.filter(game => 
        filters.genres.some(genre => game.genres.includes(genre))
      );
    }

    // Apply platform filter
    if (filters.platforms.length > 0) {
      result = result.filter(game => 
        filters.platforms.some(platform => game.platforms.includes(platform))
      );
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      result = result.filter(game => 
        filters.statuses.includes(game.status)
      );
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      result = result.filter(game => 
        game.rating !== undefined && game.rating >= filters.minRating!
      );
    }

    if (filters.maxRating !== undefined) {
      result = result.filter(game => 
        game.rating !== undefined && game.rating <= filters.maxRating!
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dateAdded':
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          comparison = dateA - dateB;
          break;
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          comparison = ratingA - ratingB;
          break;
        case 'hoursPlayed':
          const hoursA = a.hoursPlayed || 0;
          const hoursB = b.hoursPlayed || 0;
          comparison = hoursA - hoursB;
          break;
        case 'completionDate':
          const compDateA = a.completionDate ? new Date(a.completionDate).getTime() : 0;
          const compDateB = b.completionDate ? new Date(b.completionDate).getTime() : 0;
          comparison = compDateA - compDateB;
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [games, filters, searchTerm]);

  return filteredAndSortedGames;
} 