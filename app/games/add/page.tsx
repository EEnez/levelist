'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGames } from '@/contexts/GameContext';
import { GameStatus, Platform, Genre } from '@/types';

export default function AddGamePage() {
  const router = useRouter();
  const { addGame, isLoading } = useGames();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [] as Genre[],
    platforms: [] as Platform[],
    status: 'want_to_play' as GameStatus,
    rating: undefined as number | undefined,
    hoursPlayed: undefined as number | undefined,
    completionDate: '',
    notes: '',
    coverImageUrl: '',
    releaseDate: '',
    developer: '',
    publisher: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'At least one genre is required';
    }
    
    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform is required';
    }
    
    if (formData.rating && (isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 10)) {
      newErrors.rating = 'Rating must be a number between 0 and 10';
    }
    
    if (formData.hoursPlayed && (isNaN(Number(formData.hoursPlayed)) || Number(formData.hoursPlayed) < 0)) {
      newErrors.hoursPlayed = 'Hours played must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await addGame({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        genres: formData.genres,
        platforms: formData.platforms,
        rating: formData.rating ? Number(formData.rating) : undefined,
        hoursPlayed: formData.hoursPlayed ? Number(formData.hoursPlayed) : undefined,
        releaseDate: formData.releaseDate || undefined,
        completionDate: formData.completionDate || undefined,
        developer: formData.developer.trim() || undefined,
        publisher: formData.publisher.trim() || undefined,
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
        notes: formData.notes.trim() || undefined
      });

      router.push('/games');
    } catch (error) {
      console.error('Failed to add game:', error);
      setErrors({ submit: 'Failed to add game. Please try again.' });
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number | Genre[] | Platform[] | GameStatus | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
            Add New Game
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Add a new game to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 md:px-3 md:py-2 border rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter game title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation resize-none"
              placeholder="Enter game description"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value as GameStatus)}
              className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation"
            >
              <option value="want_to_play">Want to Play</option>
              <option value="currently_playing">Currently Playing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Genres *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(Genre).map((genre) => (
                <label key={genre} className="flex items-center space-x-3 cursor-pointer p-3 md:p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(genre)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('genres', [...formData.genres, genre]);
                      } else {
                        handleInputChange('genres', formData.genres.filter(g => g !== genre));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 md:w-auto md:h-auto"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize font-medium">
                    {genre.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
            {errors.genres && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.genres}</p>
            )}
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Platforms *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(Platform).map((platform) => (
                <label key={platform} className="flex items-center space-x-3 cursor-pointer p-3 md:p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('platforms', [...formData.platforms, platform]);
                      } else {
                        handleInputChange('platforms', formData.platforms.filter(p => p !== platform));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 md:w-auto md:h-auto"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize font-medium">
                    {platform.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
            {errors.platforms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.platforms}</p>
            )}
          </div>

          {/* Rating & Hours Played - Side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating (1-10)
              </label>
              <input
                type="number"
                id="rating"
                min="1"
                max="10"
                value={formData.rating || ''}
                onChange={(e) => handleInputChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                placeholder="Rate from 1 to 10"
              />
            </div>

            {/* Hours Played */}
            <div>
              <label htmlFor="hoursPlayed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours Played
              </label>
              <input
                type="number"
                id="hoursPlayed"
                min="0"
                value={formData.hoursPlayed || ''}
                onChange={(e) => handleInputChange('hoursPlayed', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 md:px-3 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base touch-manipulation"
                placeholder="Hours played"
              />
            </div>
          </div>

          {/* Form Actions - Better mobile layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="order-2 sm:order-1 sm:flex-1 px-6 py-3 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg md:rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="order-1 sm:order-2 sm:flex-1 px-6 py-3 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg md:rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium touch-manipulation shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </span>
              ) : (
                'Add Game'
              )}
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 