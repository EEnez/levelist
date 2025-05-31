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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Add New Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add a new game to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genres *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.values(Genre).map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platforms *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.values(Platform).map((platform) => (
                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {platform.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
            {errors.platforms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.platforms}</p>
            )}
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Hours played"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 