'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import GameCard from '@/components/GameCard/GameCard';
import FilterPanel, { FilterOptions } from '@/components/FilterPanel/FilterPanel';
import { gameCollection } from '@/data/gameData';
import { Game } from '@/types';

type ViewMode = 'grid' | 'list';

export default function GamesPage() {
  const router = useRouter();
  const [games] = useState<Game[]>(gameCollection);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    platforms: [],
    statuses: [],
    sortBy: 'title',
    sortOrder: 'asc',
    minRating: undefined,
    maxRating: undefined,
  });

  // Apply filters and sorting
  const filteredGames = useMemo(() => {
    const filtered = games.filter(game => {
      // Search filter
      if (searchTerm && !game.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Genre filter
      if (filters.genres.length > 0 && !filters.genres.some(genre => game.genres.includes(genre))) {
        return false;
      }

      // Platform filter
      if (filters.platforms.length > 0 && !filters.platforms.some(platform => game.platforms.includes(platform))) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(game.status)) {
        return false;
      }

      // Rating filter
      if (filters.minRating !== undefined && (!game.rating || game.rating < filters.minRating)) {
        return false;
      }
      if (filters.maxRating !== undefined && (!game.rating || game.rating > filters.maxRating)) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'hoursPlayed':
          aValue = a.hoursPlayed || 0;
          bValue = b.hoursPlayed || 0;
          break;
        case 'completionDate':
          aValue = a.completionDate ? new Date(a.completionDate).getTime() : 0;
          bValue = b.completionDate ? new Date(b.completionDate).getTime() : 0;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (filters.sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [games, searchTerm, filters]);

  const handleEdit = (game: Game) => {
    router.push(`/games/${game.id}/edit`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteGame = (_gameId: string) => {
    // Delete functionality would be implemented here
  };

  const handleAddGame = () => {
    router.push('/games/add');
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Games</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredGames.length} of {games.length} {games.length === 1 ? 'game' : 'games'} 
            {filteredGames.length !== games.length && ' (filtered)'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddGame}
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Game</span>
          </button>
        </div>
      </div>

      {/* Search, Filters and View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
            isOpen={isFilterPanelOpen}
            onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          />

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">View:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-blue-500 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-blue-500 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.genres.length > 0 || filters.platforms.length > 0 || filters.statuses.length > 0 || 
        filters.minRating !== undefined || filters.maxRating !== undefined) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-400">Active filters:</span>
              
              {filters.genres.map(genre => (
                <span key={genre} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {genre.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </span>
              ))}
              
              {filters.platforms.map(platform => (
                <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {platform.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </span>
              ))}
              
              {filters.statuses.map(status => (
                <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </span>
              ))}
              
              {(filters.minRating !== undefined || filters.maxRating !== undefined) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                  Rating: {filters.minRating || 0}-{filters.maxRating || 10}
                </span>
              )}
            </div>
            
            <button
              onClick={() => updateFilters({
                genres: [],
                platforms: [],
                statuses: [],
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
                minRating: undefined,
                maxRating: undefined,
              })}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Games Collection */}
      {filteredGames.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          {searchTerm || filters.genres.length > 0 || filters.platforms.length > 0 || filters.statuses.length > 0 ? (
            // No search/filter results
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No games found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No games match your current search and filter criteria.
              </p>
              <div className="space-x-2">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Clear search
                  </button>
                )}
                <button
                  onClick={() => updateFilters({
                    genres: [],
                    platforms: [],
                    statuses: [],
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    minRating: undefined,
                    maxRating: undefined,
                  })}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            // No games in collection
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No games yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start building your game collection by adding your first game.
              </p>
              <button
                onClick={handleAddGame}
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Your First Game</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        // Games Grid/List
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
            : 'space-y-4'
        }>
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={handleEdit}
              onDelete={handleDeleteGame}
            />
          ))}
        </div>
      )}
    </div>
  );
} 