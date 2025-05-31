'use client';

import GameCard from '@/components/GameCard/GameCard';
import { useGames } from '@/contexts/GameContext';
import Link from 'next/link';

export default function Home() {
  const { games, isLoading, error } = useGames();

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

  // Get recently played games (last 6 games)
  const recentGames = games
    .filter(game => game.status === 'completed' || game.status === 'currently_playing')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to LevelList
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your video game collection and track your progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Games
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {games.length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {games.filter(game => game.status === 'completed').length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Playing
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {games.filter(game => game.status === 'currently_playing').length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Want to Play
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {games.filter(game => game.status === 'want_to_play').length}
          </p>
        </div>
      </div>

      {recentGames.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {games.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No games in your collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding your first games!
          </p>
          <Link href="/games/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Add Game
          </Link>
        </div>
      )}
    </div>
  );
}
