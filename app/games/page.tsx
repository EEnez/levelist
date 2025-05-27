'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import GameCard from '@/components/GameCard/GameCard';
import { sampleGames } from '@/components/GameCard/GameCard.stories';
import { Game } from '@/types';

type ViewMode = 'grid' | 'list';

export default function GamesPage() {
  const [games] = useState<Game[]>(sampleGames);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter games based on search term
  const filteredGames = useMemo(() => {
    if (!searchTerm.trim()) return games;
    
    const term = searchTerm.toLowerCase();
    return games.filter(game => 
      game.title.toLowerCase().includes(term) ||
      game.genres.some(genre => genre.toLowerCase().includes(term)) ||
      game.platforms.some(platform => platform.toLowerCase().includes(term)) ||
      game.developer?.toLowerCase().includes(term) ||
      game.publisher?.toLowerCase().includes(term)
    );
  }, [games, searchTerm]);

  const handleEdit = (game: Game) => {
    console.log('Edit game:', game.title);
    // TODO: Implement edit functionality
  };

  const handleDelete = (gameId: string) => {
    console.log('Delete game:', gameId);
    // TODO: Implement delete functionality
  };

  const handleAddGame = () => {
    console.log('Add new game');
    // TODO: Navigate to add game page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Games</h1>
          <p className="text-gray-600">
            {games.length} {games.length === 1 ? 'game' : 'games'} in your collection
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddGame}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Game</span>
          </button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Games Collection */}
      {filteredGames.length === 0 ? (
        // Empty State
        <div className="text-center py-12">
          {searchTerm ? (
            // No search results
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games found</h3>
              <p className="text-gray-600 mb-4">
                No games match your search for &quot;{searchTerm}&quot;. Try a different search term.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            // No games in collection
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No games yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your collection by adding your first game.
              </p>
              <button
                onClick={handleAddGame}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
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
            <div key={game.id} className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm border border-gray-200 p-4' : ''}>
              {viewMode === 'grid' ? (
                <GameCard
                  game={game}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                // List view layout
                <div className="flex items-center space-x-4">
                                     <div className="flex-shrink-0 w-16 h-20 bg-gray-100 rounded overflow-hidden relative">
                                         {game.coverImageUrl ? (
                       <Image
                         src={game.coverImageUrl}
                         alt={`${game.title} cover`}
                         fill
                         className="object-cover"
                         sizes="64px"
                       />
                     ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{game.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {game.genres.slice(0, 2).join(', ')} • {game.platforms.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        game.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        game.status === 'currently_playing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        game.status === 'want_to_play' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        game.status === 'on_hold' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {game.status.replace('_', ' ')}
                      </span>
                      {game.rating && (
                        <span className="text-sm text-gray-600">⭐ {game.rating}/10</span>
                      )}
                      {game.hoursPlayed && (
                        <span className="text-sm text-gray-600">{game.hoursPlayed}h</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(game)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Edit game"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Delete game"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredGames.length > 0 && searchTerm && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Showing {filteredGames.length} of {games.length} games
          </p>
        </div>
      )}
    </div>
  );
} 