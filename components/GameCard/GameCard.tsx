'use client';

import { Game, GameStatus, Genre, Platform } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface GameCardProps {
  game: Game;
  onEdit?: (game: Game) => void;
  onDelete?: (gameId: string) => void;
}

export default function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/games/${game.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(game);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(game.id);
    }
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

  const getStatusLabel = (status: GameStatus) => {
    switch (status) {
      case GameStatus.COMPLETED:
        return 'Completed';
      case GameStatus.CURRENTLY_PLAYING:
        return 'Playing';
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

  const formatGenres = (genres: Genre[]) => {
    return genres.slice(0, 2).map(genre => 
      genre.charAt(0).toUpperCase() + genre.slice(1).replace('_', ' ')
    ).join(', ');
  };

  const formatPlatforms = (platforms: Platform[]) => {
    return platforms.slice(0, 2).map(platform => {
      switch (platform) {
        case Platform.PLAYSTATION_5:
          return 'PS5';
        case Platform.PLAYSTATION_4:
          return 'PS4';
        case Platform.XBOX_SERIES:
          return 'Xbox Series';
        case Platform.XBOX_ONE:
          return 'Xbox One';
        case Platform.NINTENDO_SWITCH:
          return 'Switch';
        default:
          return platform.toUpperCase();
      }
    }).join(', ');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        {game.coverImageUrl ? (
          <Image
            src={game.coverImageUrl}
            alt={`${game.title} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(game.status)}`}>
            {getStatusLabel(game.status)}
          </span>
        </div>

        {/* Rating Badge */}
        {game.rating && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-70 text-white">
              ⭐ {game.rating}/10
            </span>
          </div>
        )}

        {/* Action Buttons - Show on hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-1.5 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                aria-label="Edit game"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1.5 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                aria-label="Delete game"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
          {game.title}
        </h3>

        {/* Genres */}
        {game.genres.length > 0 && (
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium">Genre:</span> {formatGenres(game.genres)}
            {game.genres.length > 2 && <span className="text-gray-400"> +{game.genres.length - 2}</span>}
          </p>
        )}

        {/* Platforms */}
        {game.platforms.length > 0 && (
          <p className="text-xs text-gray-600 mb-2">
            <span className="font-medium">Platform:</span> {formatPlatforms(game.platforms)}
            {game.platforms.length > 2 && <span className="text-gray-400"> +{game.platforms.length - 2}</span>}
          </p>
        )}

        {/* Hours Played */}
        {game.hoursPlayed && game.hoursPlayed > 0 && (
          <p className="text-xs text-gray-500">
            {game.hoursPlayed}h played
          </p>
        )}

        {/* Completion Date */}
        {game.completionDate && (
          <p className="text-xs text-gray-500">
            Completed {new Date(game.completionDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
} 