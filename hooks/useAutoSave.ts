import { useState, useEffect, useCallback, useRef } from 'react';
import { useToastHelpers } from './useToastHelpers';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  saveInterval?: number; // Interval in milliseconds
  debounceTime?: number; // Debounce time in milliseconds
  storageKey: string;
  onSave?: (data: any) => Promise<void>;
}

export function useAutoSave<T>({
  saveInterval = 30000, // 30 seconds
  debounceTime = 1000, // 1 second
  storageKey,
  onSave
}: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToastHelpers();
  
  // Use refs to store the latest data and avoid dependency issues
  const dataRef = useRef<T | null>(null);
  const saveTimeoutRef = useRef<any>(undefined);

  // Stable save function
  const performSave = useCallback(
    async (data: T) => {
      try {
        setStatus('saving');
        setError(null);

        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(data));

        // Call custom save function if provided
        if (onSave) {
          await onSave(data);
        }

        setStatus('saved');
        setLastSaved(new Date());
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to save');
        toast.error('Save Failed', 'Your changes could not be saved. Please try again.');
      }
    },
    [storageKey, onSave, toast]
  );

  // Debounced save function
  const debouncedSave = useCallback(
    (data: T) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Store data in ref
      dataRef.current = data;

      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        if (dataRef.current) {
          performSave(dataRef.current);
        }
      }, debounceTime);
    },
    [performSave, debounceTime]
  );

  // Manual save function (stable reference)
  const save = useCallback(
    (data: T) => {
      debouncedSave(data);
    },
    [debouncedSave]
  );

  // Auto-save interval effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dataRef.current && status !== 'saving') {
        performSave(dataRef.current);
      }
    }, saveInterval);

    return () => clearInterval(intervalId);
  }, [saveInterval, performSave, status]);

  // Reset status after a delay
  useEffect(() => {
    if (status === 'saved') {
      const timeoutId = setTimeout(() => {
        setStatus('idle');
      }, 2000); // Reset to idle after 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    save,
    isSaving: status === 'saving',
    hasError: status === 'error'
  };
} 