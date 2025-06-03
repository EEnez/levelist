'use client';

import { useState, useMemo } from 'react';
import { GameGridSkeleton, PageHeaderSkeleton } from '@/components/Skeletons/SkeletonLoader';
import { FadeInContainer } from '@/components/Animations/AnimatedLayout';
import { useGames } from '@/contexts/GameContext';
import { GameStatus, Genre, Game } from '@/types';
import Link from 'next/link';
import { useToastHelpers } from '@/hooks/useToastHelpers';
import SmartSearchInput from '@/components/SmartSearch/SmartSearchInput';
import ImportExportButton from '@/components/ImportExport/ImportExportButton';
import { SimpleGameGrid } from '@/components/GameGrid/SimpleGameGrid';

export default function GamesPage() {
  const { games, isLoading, error } = useGames();
  const toast = useToastHelpers();
  
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  // Memoized filter calculations
  const statusFilteredGames = useMemo(() => {
    if (selectedStatus === 'all') return games;
    return games.filter(game => game.status === selectedStatus);
  }, [games, selectedStatus]);

  const genreFilteredGames = useMemo(() => {
    if (selectedGenre === 'all') return statusFilteredGames;
    return statusFilteredGames.filter(game => game.genres.includes(selectedGenre));
  }, [statusFilteredGames, selectedGenre]);

  const clearSampleData = () => {
    const sampleTitles = [
      'The Legend of Zelda: Breath of the Wild',
      'The Witcher 3: Wild Hunt', 
      'Hades',
      'Cyberpunk 2077',
      'Red Dead Redemption 2',
      'Hollow Knight'
    ];
    
    const hasSampleGames = games.some(game => sampleTitles.includes(game.title));
    
    if (!hasSampleGames) {
      toast.info('No Sample Data', 'No sample data found in your collection.');
      return;
    }

    toast.confirm(
      'Clear Sample Data',
      'Are you sure you want to remove all sample games? This will only delete the example games, not your personal games.',
      () => {
        const personalGames = games.filter(game => !sampleTitles.includes(game.title));
        localStorage.setItem('levelist-games', JSON.stringify(personalGames));
        window.location.reload();
      },
      undefined,
      'Clear Samples',
      'Cancel'
    );
  };

  const hasSampleData = games.some(game => 
    game.title === 'The Legend of Zelda: Breath of the Wild' || 
    game.title === 'The Witcher 3: Wild Hunt' ||
    game.title === 'Hades'
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeaderSkeleton />
        <div className="mb-8">
          <FadeInContainer delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </FadeInContainer>
        </div>
        <GameGridSkeleton count={12} />
      </div>
    );
  }

  if (error) {
    return (
      <FadeInContainer className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </FadeInContainer>
    );
  }

  const allGenres = Array.from(
    new Set(games.flatMap(game => game.genres))
  ).sort();

  const handleSearchResults = (searchFilteredGames: Game[]) => {
    setFilteredGames(searchFilteredGames);
  };

  const displayGames = filteredGames.length > 0 || filteredGames.length === 0 ? filteredGames : genreFilteredGames;

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeInContainer>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
              My Game Collection
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {displayGames.length} {displayGames.length === 1 ? 'game' : 'games'} in your collection
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
            <div className="flex gap-2">
              <ImportExportButton 
                variant="default"
                className="flex-1 sm:flex-none"
              />
              {hasSampleData && (
                <button
                  onClick={clearSampleData}
                  className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation shadow-sm hover:shadow-md"
                  title="Remove sample games from your collection"
                >
                  <span className="text-base">🗑️</span>
                  <span className="hidden xs:inline">Clear</span>
                </button>
              )}
            </div>
            
            <Link
              href="/games/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 md:px-6 md:py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Game</span>
            </Link>
          </div>
        </div>
      </FadeInContainer>

      <FadeInContainer delay={0.1}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 mb-6 md:mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Smart Search
              </label>
              <SmartSearchInput
                games={games}
                statusFilter={selectedStatus}
                genreFilter={selectedGenre}
                onFiltersChange={handleSearchResults}
                placeholder="Search games, developers, genres..."
                options={{
                  debounceMs: 300,
                  maxSuggestions: 8,
                  enableHistory: true,
                  enableHighlighting: true
                }}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as GameStatus | 'all')}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation"
              >
                <option value="all">All statuses</option>
                <option value="want_to_play">Want to Play</option>
                <option value="currently_playing">Playing</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value as Genre | 'all')}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation"
              >
                <option value="all">All genres</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </FadeInContainer>

      {/* Games Grid */}
      <FadeInContainer delay={0.2}>
        {displayGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No games found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or add some games to your collection
            </p>
            <Link
              href="/games/add"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Game
            </Link>
          </div>
        ) : (
          <SimpleGameGrid
            games={displayGames}
            isLoading={isLoading}
          />
        )}
      </FadeInContainer>
    </div>
  );
} 