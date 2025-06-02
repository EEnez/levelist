'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Game } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getStatusColor, getStatusLabel } from '@/utils/gameUtils';

interface AnimatedGameCardProps {
  game: Game;
  index?: number;
}

export default function AnimatedGameCard({ game, index = 0 }: AnimatedGameCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Navigation handlers
  const handleCardClick = () => {
    router.push(`/games/${game.id}`);
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
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      brightness: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.2 }
    },
    hover: {
      y: -2,
      transition: { duration: 0.15 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.3,
        type: "spring",
        stiffness: 200 
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer ${
        isTouched ? 'scale-95 shadow-lg' : ''
      }`}
      style={{
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <AnimatePresence>
          {!imageLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          )}
        </AnimatePresence>

        <motion.div
          variants={imageVariants}
          className="relative w-full h-full"
        >
          <Image
            src={game.coverImageUrl || '/placeholder-game.jpg'}
            alt={game.title}
            fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          
          {/* Overlay gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isTouched ? 0.1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
          />
        </motion.div>

        {/* Status Badge */}
        <motion.div
          variants={badgeVariants}
          className="absolute top-3 right-3"
        >
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(game.status)} shadow-sm backdrop-blur-sm`}>
            {getStatusLabel(game.status)}
          </span>
        </motion.div>

        {/* Rating Badge (if present) */}
        {game.rating && (
          <motion.div
            variants={badgeVariants}
            className="absolute top-3 left-3"
          >
            <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-white rounded-full shadow-sm backdrop-blur-sm">
              ⭐ {game.rating}/10
            </span>
          </motion.div>
        )}

        {/* Action Buttons - Always visible on mobile, hover on desktop */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform md:translate-y-2 md:group-hover:translate-y-0">
          <Link href={`/games/${game.id}/edit`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation"
              title="Edit game"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-700 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="font-semibold text-gray-900 dark:text-white text-sm md:text-base mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
        >
          {game.title}
        </motion.h3>

        {/* Developer */}
        {game.developer && (
          <motion.p
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0.8 }}
            className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 truncate"
          >
            {game.developer}
          </motion.p>
        )}

        {/* Genres */}
        <motion.div 
          className="flex flex-wrap gap-1 mb-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {game.genres.slice(0, 2).map((genre) => (
            <motion.span
              key={genre}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {genre}
            </motion.span>
          ))}
          {game.genres.length > 2 && (
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full"
            >
              +{game.genres.length - 2}
            </motion.span>
          )}
        </motion.div>

        {/* Action Buttons - Mobile simplified version */}
        <motion.div
          variants={buttonVariants}
          className="flex gap-2 md:hidden"
        >
          <Link href={`/games/${game.id}/edit`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors shadow-sm touch-manipulation"
            >
              Edit
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCardClick}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-md transition-colors shadow-sm touch-manipulation"
            title="View details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Action Buttons - Desktop version */}
        <motion.div
          variants={buttonVariants}
          className="hidden md:flex gap-2"
        >
          <Link href={`/games/${game.id}/edit`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Edit
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCardClick}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-md transition-colors shadow-sm"
            title="View details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Hover effect overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isTouched ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none rounded-lg"
      />
    </motion.div>
  );
} 