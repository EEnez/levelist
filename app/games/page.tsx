'use client';

import { useState } from 'react';
import GameCard from '@/components/GameCard/GameCard';
import { useGames } from '@/contexts/GameContext';
import { GameStatus, Genre } from '@/types';
import Link from 'next/link';
import { useToastHelpers } from '@/hooks/useToastHelpers';

export default function GamesPage() {
  const { games, isLoading, error } = useGames();
  const toast = useToastHelpers();
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Export/Import functions
  const exportData = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `levelist-games-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedGames = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedGames)) {
          localStorage.setItem('levelist-games', JSON.stringify(importedGames));
          window.location.reload(); // Reload to refresh context
        } else {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      } catch {
        alert('Error reading file. Please make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const clearSampleData = () => {
    // Check if there are any sample games
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
        window.location.reload(); // Reload to refresh context
      },
      undefined, // onCancel - just close the toast
      'Clear Samples',
      'Cancel'
    );
  };

  // Check if user has sample data
  const hasSampleData = games.some(game => 
    game.title === 'The Legend of Zelda: Breath of the Wild' || 
    game.title === 'The Witcher 3: Wild Hunt' ||
    game.title === 'Hades'
  );

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Game Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} in your collection
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          {/* Export/Import buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>📤</span>
              Export
            </button>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2">
              <span>📥</span>
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            {hasSampleData && (
              <button
                onClick={clearSampleData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                title="Remove sample games from your collection"
              >
                <span>🗑️</span>
                Clear Samples
              </button>
            )}
          </div>
          <Link
            href="/games/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Add Game
          </Link>
        </div>
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