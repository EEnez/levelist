'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Game } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStatusColor, getStatusLabel } from '@/utils/gameUtils';
import { useGames } from '@/contexts/GameContext';
import { useToastHelpers } from '@/hooks/useToastHelpers';
import QuickActionsOverlay from '@/components/QuickActions/QuickActionsOverlay';

interface EnhancedGameCardProps {
  game: Game;
  index?: number;
  onEdit?: (game: Game) => void;
}

export default function EnhancedGameCard({ 
  game, 
  index = 0, 
  onEdit 
}: EnhancedGameCardProps) {
  const router = useRouter();
  const { updateGame } = useGames();
  const toast = useToastHelpers();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCardClick = () => {
    if (!showQuickActions) {
      router.push(`/games/${game.id}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(game);
    } else {
      router.push(`/games/${game.id}/edit`);
    }
  };

  const handleStatusChange = async (newStatus: typeof game.status) => {
    try {
      const gameFormData = {
        title: game.title,
        description: game.description || '',
        genres: game.genres,
        platforms: game.platforms,
        status: newStatus,
        rating: game.rating,
        hoursPlayed: game.hoursPlayed,
        completionDate: game.completionDate?.toISOString().split('T')[0],
        notes: game.notes,
        coverImageUrl: game.coverImageUrl,
        releaseDate: game.releaseDate?.toISOString().split('T')[0],
        developer: game.developer,
        publisher: game.publisher,
        startDate: game.startDate?.toISOString().split('T')[0],
      };
      
      await updateGame(game.id, gameFormData);
      toast.success('Status Updated', `${game.title} marked as ${getStatusLabel(newStatus).toLowerCase()}`);
    } catch {
      toast.error('Update Failed', 'Could not update game status. Please try again.');
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowQuickActions(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowQuickActions(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsTouched(true);
    
    touchTimeoutRef.current = setTimeout(() => {
      if (touchStartRef.current) {
        setShowQuickActions(true);
        if (navigator.vibrate) {
          navigator.vibrate([10]);
        }
      }
    }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouched(false);
    
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    if (!touchStartRef.current || showQuickActions) {
      touchStartRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300;
    
    if (isTap) {
      handleCardClick();
    }
    
    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    setIsTouched(false);
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    touchStartRef.current = null;
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 transition-all duration-200 cursor-pointer select-none ${
        isHovered || showQuickActions
          ? 'border-gray-300 dark:border-gray-600 shadow-lg' 
          : 'border-gray-200 dark:border-gray-700'
      } ${
        isTouched ? 'scale-95 shadow-lg' : ''
      }`}
    >
      <QuickActionsOverlay
        isVisible={showQuickActions}
        currentStatus={game.status}
        onStatusChange={handleStatusChange}
        onClose={() => setShowQuickActions(false)}
      />

      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        <Image
          src={game.coverImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzAgMTcwSDE3MFYyMTBIMTMwVjE3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+dGggZD0iTTE0MCAyMjBIMTYwVjI0MEgxNDBWMjIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9IjUwMCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
          alt={game.title}
          fill
          className="object-cover transition-all duration-300"
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-200 ${
            isHovered || isTouched || showQuickActions ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm ${getStatusColor(game.status)}`}>
            {getStatusLabel(game.status)}
          </span>
        </div>

        {game.rating && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded-full shadow-sm backdrop-blur-sm">
              ⭐ {game.rating}/10
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 md:hidden">
          <button
            onClick={handleEditClick}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm touch-manipulation"
            title="Edit game"
          >
            <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {game.title}
        </h3>

        {game.developer && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 truncate">
            {game.developer}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mb-2">
          {game.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
          {game.genres.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
              +{game.genres.length - 2}
            </span>
          )}
        </div>

        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEditClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleCardClick}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-1.5 rounded transition-colors"
            title="View details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 