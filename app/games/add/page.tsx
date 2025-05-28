'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GameForm from '@/components/GameForm/GameForm';
import { GameFormData, Game } from '@/types';

export default function AddGamePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: GameFormData) => {
    setIsLoading(true);
    
    try {
      const newGame: Game = {
        id: Date.now().toString(),
        ...data,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        completionDate: data.completionDate ? new Date(data.completionDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Adding new game:', newGame);
      
      router.push('/games');
    } catch (error) {
      console.error('Error adding game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
          <span className="text-gray-900">Add Game</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Game</h1>
        <p className="text-gray-600 mt-2">
          Fill in the information below to add a game to your collection.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <GameForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 