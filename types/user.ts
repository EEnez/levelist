import { Platform, Genre } from './enums';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  gamesPerPage: number;
  favoriteGenres: Genre[];
  favoritePlatforms: Platform[];
  showCompletionPercentage: boolean;
  showHoursPlayed: boolean;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 
  | 'title' 
  | 'rating' 
  | 'hoursPlayed' 
  | 'completionDate' 
  | 'createdAt' 
  | 'updatedAt'
  | 'releaseDate';

export interface FilterOptions {
  genres: Genre[];
  platforms: Platform[];
  status: string[];
  ratingRange: [number, number];
  hoursPlayedRange: [number, number];
  searchQuery: string;
}

export interface AppSettings {
  userPreferences: UserPreferences;
  lastBackupDate?: Date;
  totalGamesCount: number;
  totalHoursPlayed: number;
} 