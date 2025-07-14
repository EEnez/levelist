'use client';

import GameCard from '@/components/GameCard/GameCard';
import { useGames } from '@/contexts/GameContext';
import Link from 'next/link';

export default function Home() {
  const { games, isLoading, error } = useGames();

  // Check if user is new (has sample data)
  const isNewUser = games.length > 0 && games.some(game => 
    game.title === 'The Legend of Zelda: Breath of the Wild' || 
    game.title === 'The Witcher 3: Wild Hunt'
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

  // Get recently played games (last 6 games)
  const recentGames = games
    .filter(game => game.status === 'completed' || game.status === 'currently_playing')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section for New Users */}
        {isNewUser && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">🎮</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to LevelList! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We&apos;ve added some sample games to help you get started. These are just examples - feel free to edit or delete them and add your own games! You can remove all sample games at once using the &quot;Clear Samples&quot; button in your collection.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✨ What you can do:</h3>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                      <li>• Add your own games</li>
                      <li>• Track your progress</li>
                      <li>• Filter and search</li>
                      <li>• View detailed statistics</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Quick actions:</h3>
                    <div className="space-y-2">
                      <Link
                        href="/games/add"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Add your first game →
                      </Link>
                      <br />
                      <Link
                        href="/games"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Explore sample games →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
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

        {/* Latest Memories Section */}
        {games.filter(game => game.notes && game.notes.trim() !== '').length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
              <span role="img" aria-label="memory">💬</span> Your Latest Memories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games
                .filter(game => game.notes && game.notes.trim() !== '')
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 4)
                .map(game => (
                  <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 dark:text-blue-400">🎮</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{game.title}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 italic">{game.notes}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

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
    </div>
  );
}
