'use client';

import { useState } from 'react';
import GameCard from '@/components/GameCard/GameCard';
import { useGames } from '@/contexts/GameContext';
import { GameStatus, Genre } from '@/types';
import Link from 'next/link';

export default function GamesPage() {
  const { games, isLoading, error } = useGames();
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading games...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  // Get unique genres from all games
  const allGenres = Array.from(
    new Set(games.flatMap(game => game.genres))
  ).sort();

  // Filter games based on selected filters and search term
  const filteredGames = games.filter(game => {
    const matchesStatus = selectedStatus === 'all' || game.status === selectedStatus;
    const matchesGenre = selectedGenre === 'all' || game.genres.includes(selectedGenre);
    const matchesSearch = searchTerm === '' || 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesGenre && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Collection
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {games.length} game{games.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Title, description, developer..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as GameStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All statuses</option>
              <option value="want_to_play">Want to Play</option>
              <option value="currently_playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value as Genre | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All genres</option>
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters summary */}
        {(selectedStatus !== 'all' || selectedGenre !== 'all' || searchTerm) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            )}
            {selectedGenre !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Genre: {selectedGenre}
                <button
                  onClick={() => setSelectedGenre('all')}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedGenre('all');
                setSearchTerm('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No games found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {games.length === 0 
              ? "Your collection is empty. Start by adding your first game!"
              : "No games match your search criteria. Try adjusting your filters."
            }
          </p>
          {games.length === 0 && (
            <Link href="/games/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Add Game
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 