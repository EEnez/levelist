'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameForm from '@/components/GameForm/GameForm';
import { GameFormData } from '@/types';

export default function AddGamePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (_gameData: GameFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Game would be saved to backend here
      router.push('/games');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to save game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/games');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Game</h1>
        <p className="text-gray-600">Add a new game to your collection</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <GameForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
} 