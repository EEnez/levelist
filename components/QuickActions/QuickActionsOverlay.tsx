'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GameStatus } from '@/types';
import { getStatusLabel } from '@/utils/gameUtils';

interface QuickAction {
  status: GameStatus;
  icon: string;
  color: string;
  bgColor: string;
}

interface QuickActionsOverlayProps {
  isVisible: boolean;
  currentStatus: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  onClose: () => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    status: GameStatus.WANT_TO_PLAY,
    icon: '📋',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-400/50'
  },
  {
    status: GameStatus.CURRENTLY_PLAYING,
    icon: '🎮',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/50'
  },
  {
    status: GameStatus.ON_HOLD,
    icon: '⏸️',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/50'
  },
  {
    status: GameStatus.COMPLETED,
    icon: '✅',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/20 hover:bg-green-500/30 border-green-400/50'
  },
  {
    status: GameStatus.DROPPED,
    icon: '❌',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/20 hover:bg-red-500/30 border-red-400/50'
  }
];

export default function QuickActionsOverlay({
  isVisible,
  currentStatus,
  onStatusChange,
  onClose
}: QuickActionsOverlayProps) {
  const handleStatusClick = (status: GameStatus) => {
    if (status !== currentStatus) {
      onStatusChange(status);
      
      if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.2 
            }}
            className="absolute top-1 left-1 right-1 z-30"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-between p-2 gap-1">
                {QUICK_ACTIONS.map((action) => {
                  const isActive = action.status === currentStatus;
                  
                  return (
                    <motion.button
                      key={action.status}
                      onClick={() => handleStatusClick(action.status)}
                      className={`
                        flex-1 flex flex-col items-center justify-center p-2 rounded-md border transition-all duration-200 min-w-0
                        ${action.bgColor}
                        ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                        touch-manipulation
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={getStatusLabel(action.status)}
                    >
                      <span className="text-base leading-none">{action.icon}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 