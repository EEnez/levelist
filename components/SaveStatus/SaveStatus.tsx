'use client';

import type { SaveStatus } from '@/hooks/useAutoSave';
import { useState } from 'react';

interface SaveStatusProps {
  status: SaveStatus;
  lastSaved: Date | null;
}

export default function SaveStatus({ status, lastSaved }: SaveStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Format last saved time
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  // Don't show anything if status is idle and no lastSaved
  if (status === 'idle' && !lastSaved) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Status Icon */}
        <div className="relative w-3 h-3">
          {status === 'saving' && (
            <div className="absolute inset-0 animate-spin">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          {status === 'saved' && (
            <svg
              className="w-3 h-3 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {status === 'error' && (
            <svg
              className="w-3 h-3 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Status Text */}
        <span className="transition-opacity duration-200 text-xs">
          {status === 'saving' && 'Saving...'}
          {status === 'saved' && lastSaved && `Saved ${formatLastSaved(lastSaved)}`}
          {status === 'error' && 'Save failed'}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
          <div className="whitespace-nowrap">
            {status === 'saving' && 'Saving your changes...'}
            {status === 'saved' && lastSaved && `Last saved at ${lastSaved.toLocaleTimeString()}`}
            {status === 'error' && 'Failed to save changes. Please try again.'}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
} 