'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGames } from '@/contexts/GameContext';
import { GameFormData } from '@/types/game';
import { GameStatus, Genre, Platform } from '@/types/enums';

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default function EditGamePage({ params }: EditGamePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getGameById, updateGame, isLoading } = useGames();

  const game = getGameById(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: GameStatus.WANT_TO_PLAY,
    genres: [] as Genre[],
    platforms: [] as Platform[],
    rating: '',
    hoursPlayed: '',
    releaseDate: '',
    completionDate: '',
    developer: '',
    publisher: '',
    coverImageUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with existing game data
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title,
        description: game.description || '',
        status: game.status,
        genres: game.genres,
        platforms: game.platforms,
        rating: game.rating?.toString() || '',
        hoursPlayed: game.hoursPlayed?.toString() || '',
        releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
        completionDate: game.completionDate ? new Date(game.completionDate).toISOString().split('T')[0] : '',
        developer: game.developer || '',
        publisher: game.publisher || '',
        coverImageUrl: game.coverImageUrl || '',
        notes: game.notes || ''
      });
    }
  }, [game]);

  const statusOptions: { value: GameStatus; label: string }[] = [
    { value: GameStatus.WANT_TO_PLAY, label: 'Want to Play' },
    { value: GameStatus.CURRENTLY_PLAYING, label: 'Currently Playing' },
    { value: GameStatus.COMPLETED, label: 'Completed' },
    { value: GameStatus.ON_HOLD, label: 'On Hold' },
    { value: GameStatus.DROPPED, label: 'Dropped' }
  ];

  const genreOptions: { value: Genre; label: string }[] = [
    { value: Genre.ACTION, label: 'Action' },
    { value: Genre.ADVENTURE, label: 'Adventure' },
    { value: Genre.RPG, label: 'RPG' },
    { value: Genre.STRATEGY, label: 'Strategy' },
    { value: Genre.SIMULATION, label: 'Simulation' },
    { value: Genre.SPORTS, label: 'Sports' },
    { value: Genre.RACING, label: 'Racing' },
    { value: Genre.FIGHTING, label: 'Fighting' },
    { value: Genre.PUZZLE, label: 'Puzzle' },
    { value: Genre.HORROR, label: 'Horror' },
    { value: Genre.SHOOTER, label: 'Shooter' },
    { value: Genre.PLATFORMER, label: 'Platformer' },
    { value: Genre.INDIE, label: 'Indie' }
  ];

  const platformOptions: { value: Platform; label: string }[] = [
    { value: Platform.PC, label: 'PC' },
    { value: Platform.PLAYSTATION_5, label: 'PlayStation 5' },
    { value: Platform.PLAYSTATION_4, label: 'PlayStation 4' },
    { value: Platform.XBOX_SERIES, label: 'Xbox Series X/S' },
    { value: Platform.XBOX_ONE, label: 'Xbox One' },
    { value: Platform.NINTENDO_SWITCH, label: 'Nintendo Switch' },
    { value: Platform.MOBILE, label: 'Mobile' },
    { value: Platform.VR, label: 'VR' }
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedGameData: GameFormData = {
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
      };

      await updateGame(id, updatedGameData);
      router.push(`/games/${id}`);
    } catch (error) {
      console.error('Failed to update game:', error);
      setErrors({ submit: 'Failed to update game. Please try again.' });
    }
  };

  const handleGenreChange = (genre: Genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handlePlatformChange = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Game not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The game you are trying to edit does not exist or could not be loaded.
          </p>
          <Link
            href="/games"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/games/${id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 inline-flex items-center"
          >
            ← Back to Game Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Game
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update the information for &quot;{game.title}&quot;
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
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter game title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as GameStatus }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genres *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genreOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(option.value)}
                    onChange={() => handleGenreChange(option.value)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platforms *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platformOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(option.value)}
                    onChange={() => handlePlatformChange(option.value)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.platforms && <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>}
          </div>

          {/* Rating and Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating (0-10)
              </label>
              <input
                type="number"
                id="rating"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.0"
              />
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label htmlFor="hoursPlayed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours Played
              </label>
              <input
                type="number"
                id="hoursPlayed"
                min="0"
                step="0.5"
                value={formData.hoursPlayed}
                onChange={(e) => setFormData(prev => ({ ...prev, hoursPlayed: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
              {errors.hoursPlayed && <p className="text-red-500 text-sm mt-1">{errors.hoursPlayed}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                value={formData.releaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Completion Date
              </label>
              <input
                type="date"
                id="completionDate"
                value={formData.completionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Developer and Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="developer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Developer
              </label>
              <input
                type="text"
                id="developer"
                value={formData.developer}
                onChange={(e) => setFormData(prev => ({ ...prev, developer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter developer name"
              />
            </div>

            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publisher
              </label>
              <input
                type="text"
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter publisher name"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Personal notes about the game"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Game'}
            </button>
            <Link
              href={`/games/${id}`}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}