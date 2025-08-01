'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Toast as ToastType, useToast } from '@/contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
}

export default function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Exit animation duration
  }, [removeToast, toast.id]);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 50); // Small delay to trigger entry animation

    return () => clearTimeout(timer);
  }, []);

  // Auto-close after delay (except for confirmations)
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [toast.duration, toast.id, handleClose]);

  const getToastStyles = () => {
    const baseStyles = "flex flex-col p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`;
      case 'confirm':
        return `${baseStyles} bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200`;
      default:
        return `${baseStyles} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 mt-0.5 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'confirm':
        return (
          <svg className={`${iconClass} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getButtonStyles = (variant?: string) => {
    const baseStyles = "px-3 py-1.5 text-sm font-medium rounded transition-colors";
    
    switch (variant) {
      case 'danger':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white`;
      case 'primary':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white`;
      case 'secondary':
      default:
        return `${baseStyles} bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200`;
    }
  };

  // Animation handling
  const getAnimationClass = () => {
    if (isLeaving) {
      return "translate-x-full opacity-0 scale-95";
    }
    if (isEntering) {
      return "translate-x-full opacity-0 scale-95";
    }
    return "translate-x-0 opacity-100 scale-100";
  };

  return (
    <div className={`${getToastStyles()} ${getAnimationClass()} max-w-sm w-full`}>
      {/* Header with icon and close button */}
      <div className="flex items-start">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-1">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm opacity-90">{toast.message}</p>
          )}
        </div>
        {/* Only show close button for non-confirmation toasts */}
        {toast.type !== 'confirm' && (
          <button
            onClick={handleClose}
            className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Action buttons for confirmations */}
      {toast.actions && toast.actions.length > 0 && (
        <div className="flex gap-2 mt-3 justify-end">
          {toast.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                handleClose();
              }}
              className={getButtonStyles(action.variant)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 