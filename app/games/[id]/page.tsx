'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Game, GameStatus } from '@/types';
import { sampleGames } from '@/components/GameCard/GameCard.stories';

export default function GameDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const foundGame = sampleGames.find(g => g.id === gameId);
        
        if (!foundGame) {
          setError('Game not found');
          return;
        }
        
        setGame(foundGame);
      } catch (error) {
        console.error('Error loading game:', error);
        setError('Error loading game');
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  const handleEdit = () => {
    if (game) {
      router.push(`/games/${game.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (game && confirm('Are you sure you want to remove this game from your collection?')) {
      console.log('Game deleted:', game.id);
      router.push('/games');
    }
  };

  const getStatusColor = (status: GameStatus) => {
    switch (status) {
      case GameStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case GameStatus.CURRENTLY_PLAYING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case GameStatus.WANT_TO_PLAY:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case GameStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case GameStatus.DROPPED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: GameStatus) => {
    switch (status) {
      case GameStatus.COMPLETED:
        return 'Completed';
      case GameStatus.CURRENTLY_PLAYING:
        return 'Currently Playing';
      case GameStatus.WANT_TO_PLAY:
        return 'Want to Play';
      case GameStatus.ON_HOLD:
        return 'On Hold';
      case GameStatus.DROPPED:
        return 'Dropped';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Loading game...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Game not found'}
          </h3>
          <p className="text-gray-600 mb-4">
            The game you are looking for does not exist or could not be loaded.
          </p>
          <button
            onClick={() => router.push('/games')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => router.push('/games')}
          className="hover:text-gray-900 transition-colors"
        >
          My Games
        </button>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 truncate">{game.title}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cover & Actions */}
        <div className="lg:col-span-1">
          {/* Cover Image */}
          <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative mb-6">
            {game.coverImageUrl ? (
              <Image
                src={game.coverImageUrl}
                alt={`${game.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleEdit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Game</span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove from Collection</span>
            </button>
          </div>
        </div>

        {/* Right Column - Game Details */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>
            {game.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{game.description}</p>
            )}
          </div>

          {/* Status & Rating */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(game.status)}`}>
              {getStatusText(game.status)}
            </span>
            {game.rating && (
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">{game.rating}/10</span>
              </div>
            )}
          </div>

          {/* Game Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Game Information</h3>
              
              {game.developer && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Developer</dt>
                  <dd className="text-sm text-gray-900">{game.developer}</dd>
                </div>
              )}
              
              {game.publisher && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                  <dd className="text-sm text-gray-900">{game.publisher}</dd>
                </div>
              )}
              
              {game.releaseDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(game.releaseDate).toLocaleDateString()}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Genres</dt>
                <dd className="text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Platforms</dt>
                <dd className="text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            </div>

            {/* Progress & Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress & Stats</h3>
              
              {game.hoursPlayed !== undefined && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Hours Played</dt>
                  <dd className="text-sm text-gray-900">{game.hoursPlayed} hours</dd>
                </div>
              )}
              
              {game.completionDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Completed On</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(game.completionDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              
              {game.startDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Started On</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(game.startDate).toLocaleDateString()}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Added to Collection</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(game.createdAt).toLocaleDateString()}
                </dd>
              </div>

              {game.updatedAt && new Date(game.updatedAt).getTime() !== new Date(game.createdAt).getTime() && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(game.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </div>
          </div>

          {/* Personal Notes */}
          {game.notes && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{game.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 