'use client';

import { useState, useEffect } from 'react';
import { Game, GameFormData, GameStatus, Platform, Genre } from '@/types';

interface GameFormProps {
  game?: Game;
  onSubmit: (data: GameFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function GameForm({ game, onSubmit, onCancel, isLoading = false }: GameFormProps) {
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    genres: [],
    platforms: [],
    developer: '',
    publisher: '',
    releaseDate: '',
    status: GameStatus.WANT_TO_PLAY,
    rating: undefined,
    hoursPlayed: undefined,
    completionDate: undefined,
    coverImageUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData, string>>>({});

  // Initialize form with existing game data if editing
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        description: game.description || '',
        genres: game.genres,
        platforms: game.platforms,
        developer: game.developer || '',
        publisher: game.publisher || '',
        releaseDate: game.releaseDate ? game.releaseDate.toISOString().split('T')[0] : '',
        status: game.status,
        rating: game.rating,
        hoursPlayed: game.hoursPlayed,
        completionDate: game.completionDate ? game.completionDate.toISOString().split('T')[0] : undefined,
        coverImageUrl: game.coverImageUrl || '',
        notes: game.notes || ''
      });
    }
  }, [game]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.genres.length === 0) {
      newErrors.genres = 'At least one genre is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform is required';
    }

    if (formData.rating !== undefined && (formData.rating < 1 || formData.rating > 10)) {
      newErrors.rating = 'Rating must be between 1 and 10';
    }

    if (formData.hoursPlayed !== undefined && formData.hoursPlayed < 0) {
      newErrors.hoursPlayed = 'Hours played cannot be negative';
    }

    if (formData.coverImageUrl && !isValidUrl(formData.coverImageUrl)) {
      newErrors.coverImageUrl = 'Invalid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleGenreToggle = (genre: Genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handlePlatformToggle = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const allGenres = Object.values(Genre);
  const allPlatforms = Object.values(Platform);
  const allStatuses = Object.values(GameStatus);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Game title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Game description..."
        />
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genres *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {allGenres.map((genre) => (
            <label key={genre} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.genres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{genre}</span>
            </label>
          ))}
        </div>
        {errors.genres && <p className="mt-1 text-sm text-red-600">{errors.genres}</p>}
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {allPlatforms.map((platform) => (
            <label key={platform} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.platforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{platform}</span>
            </label>
          ))}
        </div>
        {errors.platforms && <p className="mt-1 text-sm text-red-600">{errors.platforms}</p>}
      </div>

      {/* Developer & Publisher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="developer" className="block text-sm font-medium text-gray-700 mb-2">
            Developer
          </label>
          <input
            type="text"
            id="developer"
            value={formData.developer}
            onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Development studio"
          />
        </div>
        <div>
          <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
            Publisher
          </label>
          <input
            type="text"
            id="publisher"
            value={formData.publisher}
            onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Game publisher"
          />
        </div>
      </div>

      {/* Release Date & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-2">
            Release Date
          </label>
          <input
            type="date"
            id="releaseDate"
            value={formData.releaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as GameStatus }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status === GameStatus.WANT_TO_PLAY && 'Want to Play'}
                {status === GameStatus.CURRENTLY_PLAYING && 'Currently Playing'}
                {status === GameStatus.COMPLETED && 'Completed'}
                {status === GameStatus.ON_HOLD && 'On Hold'}
                {status === GameStatus.DROPPED && 'Dropped'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rating & Hours Played */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating (1-10)
          </label>
          <input
            type="number"
            id="rating"
            min="1"
            max="10"
            step="0.1"
            value={formData.rating || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              rating: e.target.value ? parseFloat(e.target.value) : undefined 
            }))}
            className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.rating ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="8.5"
          />
          {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
        </div>
        <div>
          <label htmlFor="hoursPlayed" className="block text-sm font-medium text-gray-700 mb-2">
            Hours Played
          </label>
          <input
            type="number"
            id="hoursPlayed"
            min="0"
            step="0.5"
            value={formData.hoursPlayed || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              hoursPlayed: e.target.value ? parseFloat(e.target.value) : undefined 
            }))}
            className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.hoursPlayed ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="25.5"
          />
          {errors.hoursPlayed && <p className="mt-1 text-sm text-red-600">{errors.hoursPlayed}</p>}
        </div>
      </div>

      {/* Completion Date */}
      {(formData.status === GameStatus.COMPLETED) && (
        <div>
          <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 mb-2">
            Completion Date
          </label>
          <input
            type="date"
            id="completionDate"
            value={formData.completionDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Cover Image URL */}
      <div>
        <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          id="coverImageUrl"
          value={formData.coverImageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.coverImageUrl ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://example.com/cover.jpg"
        />
        {errors.coverImageUrl && <p className="mt-1 text-sm text-red-600">{errors.coverImageUrl}</p>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Personal Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your thoughts, comments..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            game ? 'Update Game' : 'Add Game'
          )}
        </button>
      </div>
    </form>
  );
} 