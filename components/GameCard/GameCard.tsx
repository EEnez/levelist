'use client';

import { Game, GameStatus, Genre, Platform } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface GameCardProps {
  game: Game;
  onEdit?: (game: Game) => void;
  onDelete?: (gameId: string) => void;
}

export default function GameCard({ game, onEdit, onDelete }: GameCardProps) {
  const router = useRouter();
  const [isTouched, setIsTouched] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleCardClick = () => {
    router.push(`/games/${game.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(game);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(game.id);
    }
  };

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsTouched(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouched(false);
    
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Check if it's a tap (small movement, quick time)
    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300;
    
    if (isTap) {
      handleCardClick();
    }
    
    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    setIsTouched(false);
    touchStartRef.current = null;
  };

  const formatGenres = (genres: Genre[]): string => {
    return genres.slice(0, 2).map(genre => 
      genre.charAt(0).toUpperCase() + genre.slice(1).replace('_', ' ')
    ).join(', ');
  };

  const formatPlatforms = (platforms: Platform[]): string => {
    return platforms.slice(0, 2).map(platform => {
      switch (platform) {
        case Platform.PLAYSTATION_5:
          return 'PS5';
        case Platform.PLAYSTATION_4:
          return 'PS4';
        case Platform.XBOX_SERIES:
          return 'Xbox Series';
        case Platform.XBOX_ONE:
          return 'Xbox One';
        case Platform.NINTENDO_SWITCH:
          return 'Switch';
        default:
          return platform.toUpperCase();
      }
    }).join(', ');
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group relative transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] md:hover:-translate-y-2 md:hover:scale-[1.02] transform-gpu will-change-transform ${
        isTouched ? 'scale-95 shadow-lg' : ''
      }`}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {game.coverImageUrl ? (
          <Image
            src={game.coverImageUrl}
            alt={`${game.title} cover`}
            fill
            className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-600 dark:group-hover:to-gray-700 transition-all duration-300">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
        
        {/* Overlay gradient on hover/touch */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isTouched ? 'opacity-100' : ''
        }`}></div>

        {/* Action Buttons - Always visible on mobile, hover on desktop */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-2 md:group-hover:translate-y-0">
          <button
            onClick={handleEditClick}
            className="p-2 md:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation"
            title="Edit game"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-700 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 md:p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation"
            title="Delete game"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-700 hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Game Info - Better mobile spacing */}
      <div className="p-3 md:p-4 relative z-10 bg-white dark:bg-gray-800 transition-colors duration-300">
        {/* Title - Better mobile typography */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {game.title}
        </h3>

        {/* Genres - Hide on small screens if too crowded */}
        {game.genres.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 hidden sm:block">
            <span className="font-medium">Genre:</span> {formatGenres(game.genres)}
            {game.genres.length > 2 && <span className="text-gray-400 dark:text-gray-500"> +{game.genres.length - 2}</span>}
          </p>
        )}

        {/* Platforms - Simplified on mobile */}
        {game.platforms.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            <span className="font-medium sm:inline hidden">Platform:</span> 
            <span className="sm:hidden font-medium">📱</span> {formatPlatforms(game.platforms)}
            {game.platforms.length > 2 && <span className="text-gray-400 dark:text-gray-500"> +{game.platforms.length - 2}</span>}
          </p>
        )}

        {/* Hours Played - More prominent on mobile */}
        {game.hoursPlayed && game.hoursPlayed > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 font-medium">
            🕒 {game.hoursPlayed}h played
          </p>
        )}

        {/* Completion Date - Hide on very small screens */}
        {game.completionDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 hidden xs:block">
            ✅ {new Date(game.completionDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
} 