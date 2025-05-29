import { useState, useEffect } from 'react';
import { FilterOptions } from '@/components/FilterPanel/FilterPanel';

const FILTER_PREFERENCES_KEY = 'levelist-filter-preferences';

const defaultFilters: FilterOptions = {
  genres: [],
  platforms: [],
  statuses: [],
  sortBy: 'title',
  sortOrder: 'asc',
  minRating: undefined,
  maxRating: undefined,
};

export function useFilterPreferences() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FILTER_PREFERENCES_KEY);
      if (saved) {
        const parsedFilters = JSON.parse(saved);
        setFilters({ ...defaultFilters, ...parsedFilters });
      }
    } catch (error) {
      console.warn('Failed to load filter preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage when filters change
  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    try {
      localStorage.setItem(FILTER_PREFERENCES_KEY, JSON.stringify(newFilters));
    } catch (error) {
      console.warn('Failed to save filter preferences:', error);
    }
  };

  // Reset to default filters
  const resetFilters = () => {
    setFilters(defaultFilters);
    
    try {
      localStorage.removeItem(FILTER_PREFERENCES_KEY);
    } catch (error) {
      console.warn('Failed to clear filter preferences:', error);
    }
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    isLoaded,
  };
} 