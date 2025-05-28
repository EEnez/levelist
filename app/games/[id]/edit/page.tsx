'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GameForm from '@/components/GameForm/GameForm';
import { GameFormData, Game } from '@/types';
import { sampleGames } from '@/components/GameCard/GameCard.stories';

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGame, setIsLoadingGame] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load game data
  useEffect(() => {
    const loadGame = async () => {
      try {
        // TODO: Replace with actual API call
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
        setIsLoadingGame(false);
      }
    };

    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  const handleSubmit = async (data: GameFormData) => {
    if (!game) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      const updatedGame: Game = {
        ...game,
        ...data,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : game.releaseDate,
        completionDate: data.completionDate ? new Date(data.completionDate) : game.completionDate,
        updatedAt: new Date()
      };
      
      console.log('Updating game:', updatedGame);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to games collection
      router.push('/games');
    } catch (error) {
      console.error('Error updating game:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingGame) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Game not found'}
          </h3>
          <p className="text-gray-600 mb-4">
            The game you are trying to edit does not exist or could not be loaded.
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => router.push('/games')}
            className="hover:text-gray-900 transition-colors"
          >
            My Games
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">Edit {game.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Game</h1>
        <p className="text-gray-600 mt-2">
          Modify the information for <span className="font-medium">{game.title}</span>.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <GameForm
          game={game}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 