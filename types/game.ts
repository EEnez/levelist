import { GameStatus, Platform, Genre } from './enums';

export interface Game {
  id: string;
  title: string;
  genres: Genre[];
  platforms: Platform[];
  status: GameStatus;
  rating?: number; // 1-10 scale
  hoursPlayed?: number;
  completionDate?: Date;
  startDate?: Date;
  notes?: string;
  coverImageUrl?: string;
  releaseDate?: Date;
  developer?: string;
  publisher?: string;
  metacriticScore?: number;
  personalScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameFormData {
  title: string;
  genres: Genre[];
  platforms: Platform[];
  status: GameStatus;
  rating?: number;
  hoursPlayed?: number;
  notes?: string;
  coverImageUrl?: string;
  releaseDate?: Date;
  developer?: string;
  publisher?: string;
} 