'use client';

import { Game } from '@/types';
import { GameCardSkeleton } from '@/components/Skeletons/SkeletonLoader';
import EnhancedGameCard from '@/components/GameCard/EnhancedGameCard';

interface SimpleGameGridProps {
  games: Game[];
  onEdit?: (game: Game) => void;
  isLoading?: boolean;
  className?: string;
}

export function SimpleGameGrid({
  games,
  onEdit,
  isLoading = false,
  className = ''
}: SimpleGameGridProps) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {games.map((game: Game, index: number) => (
        <EnhancedGameCard
          key={game.id}
          game={game}
          index={index}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
} 