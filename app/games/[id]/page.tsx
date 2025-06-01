'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useGames } from '@/contexts/GameContext';
import { useToastHelpers } from '@/hooks/useToastHelpers';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getGameById, deleteGame, isLoading } = useGames();
  const toast = useToastHelpers();

  const game = getGameById(id);

  const handleDelete = async () => {
    toast.confirm(
      'Delete Game',
      `Are you sure you want to delete "${game?.title}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteGame(id);
          router.push('/games');
        } catch (error) {
          console.error('Failed to delete game:', error);
        }
      },
      undefined, // onCancel - just close the toast
      'Delete',
      'Cancel'
    );
  };

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Game not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The game you are looking for does not exist or could not be loaded.
          </p>
          <Link
            href="/games"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'currently_playing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'want_to_play':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'dropped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'currently_playing':
        return 'Currently Playing';
      case 'want_to_play':
        return 'Want to Play';
      case 'on_hold':
        return 'On Hold';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/games"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Back to Collection
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {game.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(game.status)}`}>
                  {getStatusLabel(game.status)}
                </span>
                {game.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {game.rating}/10
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/games/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {game.description && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {game.description}
                </p>
              </div>
            )}

            {/* Notes */}
            {game.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Notes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {game.notes}
                </p>
              </div>
            )}

            {/* Genres & Platforms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {genre.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {platform.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Game Stats
              </h2>
              <div className="space-y-4">
                {game.hoursPlayed !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hours Played:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {game.hoursPlayed}h
                    </span>
                  </div>
                )}
                {game.completionDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(game.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {game.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Released:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {game.developer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Developer:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {game.developer}
                    </span>
                  </div>
                )}
                {game.publisher && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Publisher:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {game.publisher}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            {game.coverImageUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Cover
                </h2>
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={game.coverImageUrl}
                    alt={`${game.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 