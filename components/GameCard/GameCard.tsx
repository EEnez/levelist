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
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      case GameStatus.CURRENTLY_PLAYING:
        return 'bg-blue-100 dark:bg-cyber-electric/20 text-blue-800 dark:text-cyber-electric border-blue-200 dark:border-cyber-electric/50';
      case GameStatus.WANT_TO_PLAY:
        return 'bg-gray-100 dark:bg-cyber-lighter/30 text-gray-800 dark:text-cyber-muted border-gray-200 dark:border-cyber-lighter';
      case GameStatus.ON_HOLD:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case GameStatus.DROPPED:
        return 'bg-red-100 dark:bg-cyber-magenta/20 text-red-800 dark:text-cyber-magenta border-red-200 dark:border-cyber-magenta/50';
      default:
        return 'bg-gray-100 dark:bg-cyber-lighter/30 text-gray-800 dark:text-cyber-muted border-gray-200 dark:border-cyber-lighter';
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
      className="bg-white dark:bg-cyber-lighter rounded-lg shadow-sm dark:shadow-cyber-electric/10 border border-gray-200 dark:border-cyber-lighter overflow-hidden hover:shadow-md dark:hover:shadow-cyber-electric/20 transition-all duration-200 group cursor-pointer hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-100 dark:bg-cyber-darker">
        {game.coverImageUrl ? (
          <Image
            src={game.coverImageUrl}
            alt={`${game.title} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-cyber-darker dark:to-cyber-dark">
            <svg className="w-12 h-12 text-gray-400 dark:text-cyber-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black dark:bg-cyber-electric/20 bg-opacity-70 dark:bg-opacity-100 text-white dark:text-cyber-electric backdrop-blur-sm">
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
                className="p-1.5 bg-white dark:bg-cyber-electric bg-opacity-90 dark:bg-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-30 rounded-full shadow-sm transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                aria-label="Edit game"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-cyber-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1.5 bg-white dark:bg-cyber-magenta bg-opacity-90 dark:bg-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-30 rounded-full shadow-sm transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                aria-label="Delete game"
              >
                <svg className="w-4 h-4 text-red-600 dark:text-cyber-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h3 className="font-semibold text-gray-900 dark:text-cyber-text text-sm mb-2 line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-cyber-electric transition-colors">
          {game.title}
        </h3>

        {/* Genres */}
        {game.genres.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-cyber-muted mb-1">
            <span className="font-medium">Genre:</span> {formatGenres(game.genres)}
            {game.genres.length > 2 && <span className="text-gray-400 dark:text-cyber-muted/70"> +{game.genres.length - 2}</span>}
          </p>
        )}

        {/* Platforms */}
        {game.platforms.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-cyber-muted mb-2">
            <span className="font-medium">Platform:</span> {formatPlatforms(game.platforms)}
            {game.platforms.length > 2 && <span className="text-gray-400 dark:text-cyber-muted/70"> +{game.platforms.length - 2}</span>}
          </p>
        )}

        {/* Hours Played */}
        {game.hoursPlayed && game.hoursPlayed > 0 && (
          <p className="text-xs text-gray-500 dark:text-cyber-muted/80">
            {game.hoursPlayed}h played
          </p>
        )}

        {/* Completion Date */}
        {game.completionDate && (
          <p className="text-xs text-gray-500 dark:text-cyber-muted/80">
            Completed {new Date(game.completionDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
} 