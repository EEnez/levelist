import { GameStatus, Genre, Platform } from '@/types';

export const getStatusColor = (status: GameStatus): string => {
  switch (status) {
    case GameStatus.COMPLETED:
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
    case GameStatus.CURRENTLY_PLAYING:
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    case GameStatus.WANT_TO_PLAY:
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
    case GameStatus.ON_HOLD:
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700';
    case GameStatus.DROPPED:
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

export const getStatusLabel = (status: GameStatus): string => {
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

export const formatGenres = (genres: Genre[]): string => {
  return genres.slice(0, 2).map(genre => 
    genre.charAt(0).toUpperCase() + genre.slice(1).replace('_', ' ')
  ).join(', ');
};

export const formatPlatforms = (platforms: Platform[]): string => {
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