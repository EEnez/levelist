'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from 'react';
import { Game, GameFormData } from '@/types';
import { gameCollection } from '@/data/gameData';
import { useToastHelpers } from '@/hooks/useToastHelpers';
import { useAutoSave, SaveStatus } from '@/hooks/useAutoSave';

// Types for the context
interface GameState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_GAMES'; payload: Game[] }
  | { type: 'ADD_GAME'; payload: Game }
  | { type: 'ADD_BULK_GAMES'; payload: Game[] }
  | { type: 'UPDATE_GAME'; payload: Game }
  | { type: 'DELETE_GAME'; payload: string };

interface GameContextType extends GameState {
  addGame: (gameData: GameFormData) => Promise<void>;
  addBulkGames: (games: Game[]) => Promise<void>;
  updateGame: (id: string, gameData: GameFormData) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  getGameById: (id: string) => Game | undefined;
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  saveError: string | null;
}

// Initial state
const initialState: GameState = {
  games: [],
  isLoading: false,
  error: null,
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_GAMES':
      return { ...state, games: action.payload, isLoading: false };
    case 'ADD_GAME':
      return { ...state, games: [...state.games, action.payload] };
    case 'ADD_BULK_GAMES':
      return { ...state, games: [...state.games, ...action.payload] };
    case 'UPDATE_GAME':
      return {
        ...state,
        games: state.games.map(game =>
          game.id === action.payload.id ? action.payload : game
        ),
      };
    case 'DELETE_GAME':
      return {
        ...state,
        games: state.games.filter(game => game.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'levelist-games';

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const toast = useToastHelpers();

  // Auto-save setup - more stable implementation
  const { status, lastSaved, error: saveError, save } = useAutoSave<Game[]>({
    storageKey: STORAGE_KEY,
  });

  // Save games when they change (but avoid initial load)
  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    // Skip auto-save on initial load to avoid saving before data is loaded
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only save if we have games and they're not empty
    if (state.games.length > 0) {
      save(state.games);
    }
  }, [state.games]); // Remove 'save' from dependencies to avoid loop

  // Load games from localStorage on mount
  useEffect(() => {
    const loadGames = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const games = JSON.parse(stored) as Game[];
          // Convert date strings back to Date objects
          const gamesWithDates = games.map((game) => ({
            ...game,
            releaseDate: game.releaseDate ? new Date(game.releaseDate) : undefined,
            completionDate: game.completionDate ? new Date(game.completionDate) : undefined,
            startDate: game.startDate ? new Date(game.startDate) : undefined,
            createdAt: new Date(game.createdAt),
            updatedAt: new Date(game.updatedAt),
          }));
          dispatch({ type: 'LOAD_GAMES', payload: gamesWithDates });
        } else {
          // First time - load sample data
          dispatch({ type: 'LOAD_GAMES', payload: gameCollection });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(gameCollection));
        }
      } catch (error) {
        console.error('Failed to load games from localStorage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load games' });
        // Fallback to sample data
        dispatch({ type: 'LOAD_GAMES', payload: gameCollection });
      }
    };

    loadGames();
  }, []);

  // Generate unique ID
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Convert form data to Game object
  const formDataToGame = (gameData: GameFormData, id?: string): Game => {
    const now = new Date();
    return {
      id: id || generateId(),
      title: gameData.title,
      description: gameData.description,
      genres: gameData.genres,
      platforms: gameData.platforms,
      status: gameData.status,
      rating: gameData.rating,
      hoursPlayed: gameData.hoursPlayed,
      completionDate: gameData.completionDate ? new Date(gameData.completionDate) : undefined,
      notes: gameData.notes,
      coverImageUrl: gameData.coverImageUrl,
      releaseDate: gameData.releaseDate ? new Date(gameData.releaseDate) : undefined,
      developer: gameData.developer,
      publisher: gameData.publisher,
      createdAt: id ? state.games.find(g => g.id === id)?.createdAt || now : now,
      updatedAt: now,
    };
  };

  // Actions
  const addGame = async (gameData: GameFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const newGame = formDataToGame(gameData);
      dispatch({ type: 'ADD_GAME', payload: newGame });
      
      toast.success('Game added!', `${gameData.title} has been added to your collection.`);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add game' });
      toast.error('Failed to add game', 'Please try again.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addBulkGames = async (games: Game[]): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Ensure each imported game has proper IDs and timestamps
      const newGames = games.map(game => ({
        ...game,
        id: game.id || generateId(),
        createdAt: game.createdAt || new Date(),
        updatedAt: new Date(),
      }));
      
      dispatch({ type: 'ADD_BULK_GAMES', payload: newGames });
      
      toast.success('Games added!', `${games.length} games have been added to your collection.`);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add games' });
      toast.error('Failed to add', 'Please try again.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateGame = async (id: string, gameData: GameFormData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const updatedGame = formDataToGame(gameData, id);
      dispatch({ type: 'UPDATE_GAME', payload: updatedGame });
      
      toast.success('Game updated!', `${gameData.title} has been updated.`);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update game' });
      toast.error('Failed to update game', 'Please try again.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteGame = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const gameToDelete = state.games.find(game => game.id === id);
      dispatch({ type: 'DELETE_GAME', payload: id });
      
      if (gameToDelete) {
        toast.success('Game deleted', `${gameToDelete.title} has been removed from your collection.`);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete game' });
      toast.error('Failed to delete game', 'Please try again.');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getGameById = (id: string): Game | undefined => {
    return state.games.find(game => game.id === id);
  };

  const value: GameContextType = {
    ...state,
    addGame,
    addBulkGames,
    updateGame,
    deleteGame,
    getGameById,
    saveStatus: status,
    lastSaved,
    saveError,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook to use the context
export function useGames() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
} 