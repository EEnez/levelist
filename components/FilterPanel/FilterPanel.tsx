'use client';

import { useState } from 'react';
import { GameStatus, Genre, Platform } from '@/types';

export interface FilterOptions {
  genres: Genre[];
  platforms: Platform[];
  statuses: GameStatus[];
  sortBy: 'title' | 'dateAdded' | 'rating' | 'hoursPlayed' | 'completionDate';
  sortOrder: 'asc' | 'desc';
  minRating?: number;
  maxRating?: number;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleGenreToggle = (genre: Genre) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter(g => g !== genre)
      : [...localFilters.genres, genre];
    handleFilterChange({ genres: newGenres });
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = localFilters.platforms.includes(platform)
      ? localFilters.platforms.filter(p => p !== platform)
      : [...localFilters.platforms, platform];
    handleFilterChange({ platforms: newPlatforms });
  };

  const handleStatusToggle = (status: GameStatus) => {
    const newStatuses = localFilters.statuses.includes(status)
      ? localFilters.statuses.filter(s => s !== status)
      : [...localFilters.statuses, status];
    handleFilterChange({ statuses: newStatuses });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      genres: [],
      platforms: [],
      statuses: [],
      sortBy: 'title',
      sortOrder: 'asc',
      minRating: undefined,
      maxRating: undefined,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.genres.length > 0 || 
                          localFilters.platforms.length > 0 || 
                          localFilters.statuses.length > 0 ||
                          localFilters.minRating !== undefined ||
                          localFilters.maxRating !== undefined;

  const formatLabel = (value: string) => {
    return value.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case GameStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case GameStatus.CURRENTLY_PLAYING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case GameStatus.WANT_TO_PLAY:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case GameStatus.ON_HOLD:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case GameStatus.DROPPED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
        </svg>
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {localFilters.genres.length + localFilters.platforms.length + localFilters.statuses.length}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Sort by</h4>
            <div className="space-y-2">
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="title">Title</option>
                <option value="dateAdded">Date Added</option>
                <option value="rating">Rating</option>
                <option value="hoursPlayed">Hours Played</option>
                <option value="completionDate">Completion Date</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange({ sortOrder: 'asc' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    localFilters.sortOrder === 'asc'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Ascending
                </button>
                <button
                  onClick={() => handleFilterChange({ sortOrder: 'desc' })}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                    localFilters.sortOrder === 'desc'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Descending
                </button>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Rating</h4>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={localFilters.minRating || ''}
                  onChange={(e) => handleFilterChange({ 
                    minRating: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={localFilters.maxRating || ''}
                  onChange={(e) => handleFilterChange({ 
                    maxRating: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
            <div className="space-y-2">
              {Object.values(GameStatus).map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.statuses.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {formatLabel(status)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Genres</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.values(Genre).map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{formatLabel(genre)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Platforms</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.values(Platform).map((platform) => (
                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{formatLabel(platform)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 