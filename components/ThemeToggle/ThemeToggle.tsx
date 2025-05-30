'use client';

import { useState } from 'react';
import { useTheme, Theme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, resolvedTheme, updateTheme, isLoaded, isTransitioning, isInTransitionPeriod, nextTransition } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  const themeOptions: { value: Theme; label: string; icon: string; description?: string }[] = [
    { value: 'light', label: 'Dawn Light', icon: '☀️', description: 'Clean and modern light theme' },
    { value: 'dark', label: 'Midnight Pro', icon: '🌙', description: 'Professional dark theme' },
    { value: 'system', label: 'System', icon: '💻', description: 'Follow system preferences' },
    { value: 'auto', label: 'Smart Auto', icon: '🌅', description: 'Switch based on time' },
  ];

  const getCurrentIcon = () => {
    if (theme === 'auto') {
      return isInTransitionPeriod ? '🌇' : (resolvedTheme === 'dark' ? '🌙' : '☀️');
    }
    return themeOptions.find(opt => opt.value === theme)?.icon || '💻';
  };

  const formatNextTransition = () => {
    if (!nextTransition) return '';
    const now = new Date();
    const diff = nextTransition.time.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `in ${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `in ${minutes}min`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 ${
          isTransitioning ? 'animate-pulse' : ''
        } ${
          theme === 'auto' && isInTransitionPeriod ? 'ring-2 ring-blue-400 dark:ring-cyan-400' : ''
        }`}
        aria-label="Toggle theme"
        title={theme === 'auto' && nextTransition ? `Next transition: ${nextTransition.theme} ${formatNextTransition()}` : undefined}
      >
        <span className="text-lg">{getCurrentIcon()}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 glass-card">
            <div className="py-1">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-3 text-left text-sm flex items-start space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === option.value 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-base mt-0.5">{option.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {option.description}
                      </div>
                    )}
                    {theme === option.value && option.value === 'auto' && nextTransition && (
                      <div className="text-xs text-blue-500 dark:text-cyan-400 mt-1">
                        → {nextTransition.theme === 'dark' ? 'Midnight Pro' : 'Dawn Light'} {formatNextTransition()}
                      </div>
                    )}
                  </div>
                  {theme === option.value && (
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {theme === 'auto' && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>🌅</span>
                    <span>Morning: 6AM-8AM</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <span>🌇</span>
                    <span>Evening: 6PM-8PM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 