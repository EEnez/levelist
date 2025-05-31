import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system' | 'auto';

const THEME_STORAGE_KEY = 'levelist-theme';

// Configuration for intelligent auto mode
const AUTO_THEME_CONFIG = {
  morningStart: 6,    // 6:00 AM - start transition to light
  morningEnd: 8,      // 8:00 AM - end transition to light
  eveningStart: 18,   // 6:00 PM - start transition to dark
  eveningEnd: 20,     // 8:00 PM - end transition to dark
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Get time-based theme (intelligent auto mode)
  const getTimeBasedTheme = (): 'light' | 'dark' => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInHours = hour + minute / 60;

    const { morningStart, morningEnd, eveningStart, eveningEnd } = AUTO_THEME_CONFIG;

    // Night period (8:00 PM - 6:00 AM)
    if (timeInHours >= eveningEnd || timeInHours < morningStart) {
      return 'dark';
    }
    
    // Day period (8:00 AM - 6:00 PM)
    if (timeInHours >= morningEnd && timeInHours < eveningStart) {
      return 'light';
    }
    
    // Gradual transitions
    if (timeInHours >= morningStart && timeInHours < morningEnd) {
      // Morning transition: gradually to light
      const progress = (timeInHours - morningStart) / (morningEnd - morningStart);
      return progress > 0.5 ? 'light' : 'dark';
    }
    
    if (timeInHours >= eveningStart && timeInHours < eveningEnd) {
      // Evening transition: gradually to dark
      const progress = (timeInHours - eveningStart) / (eveningEnd - eveningStart);
      return progress > 0.5 ? 'dark' : 'light';
    }

    return 'light'; // Fallback
  };

  // Resolve theme based on current setting
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    switch (currentTheme) {
      case 'system':
        return getSystemTheme();
      case 'auto':
        return getTimeBasedTheme();
      case 'light':
      case 'dark':
        return currentTheme;
      default:
        return 'light';
    }
  };

  // Apply theme to document with smooth transition
  const applyTheme = (resolvedTheme: 'light' | 'dark', withTransition = false) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;
      
      if (withTransition) {
        setIsTransitioning(true);
        // Add temporary transition class
        body.classList.add('theme-transitioning');
        
        setTimeout(() => {
          setIsTransitioning(false);
          body.classList.remove('theme-transitioning');
        }, 300);
      }
      
      // Remove both classes from html and body
      root.classList.remove('dark', 'light');
      body.classList.remove('dark', 'light');
      
      // Add the appropriate class to both
      root.classList.add(resolvedTheme);
      body.classList.add(resolvedTheme);
      
      // Force immediate update
      root.style.colorScheme = resolvedTheme;
    }
  };

  // Check if we're in a transition period
  const isInTransitionPeriod = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInHours = hour + minute / 60;

    const { morningStart, morningEnd, eveningStart, eveningEnd } = AUTO_THEME_CONFIG;

    return (
      (timeInHours >= morningStart && timeInHours < morningEnd) ||
      (timeInHours >= eveningStart && timeInHours < eveningEnd)
    );
  };

  // Initialize theme immediately on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedTheme: Theme = 'system';
    let resolved: 'light' | 'dark' = 'light';

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (stored && ['light', 'dark', 'system', 'auto'].includes(stored)) {
        savedTheme = stored;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }

    resolved = resolveTheme(savedTheme);
    
    // Apply theme immediately
    applyTheme(resolved);
    
    // Update state
    setTheme(savedTheme);
    setResolvedTheme(resolved);
    setIsLoaded(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = getSystemTheme();
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme, true);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Auto theme timer for time-based switching
  useEffect(() => {
    if (theme !== 'auto') return;

    const checkTimeBasedTheme = () => {
      const newResolvedTheme = getTimeBasedTheme();
      if (newResolvedTheme !== resolvedTheme) {
        setResolvedTheme(newResolvedTheme);
        applyTheme(newResolvedTheme, true);
      }
    };

    // Check every minute during transition periods, every 30 minutes otherwise
    const interval = isInTransitionPeriod() ? 60000 : 1800000; // 1min or 30min
    
    const timer = setInterval(checkTimeBasedTheme, interval);
    
    return () => clearInterval(timer);
  }, [theme, resolvedTheme]);

  // Update theme
  const updateTheme = (newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    const shouldTransition = resolved !== resolvedTheme;
    
    // Apply immediately
    applyTheme(resolved, shouldTransition);
    
    // Update state
    setTheme(newTheme);
    setResolvedTheme(resolved);

    // Save to localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Get next transition info for auto mode
  const getNextTransition = () => {
    if (theme !== 'auto') return null;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInHours = hour + minute / 60;

    const { morningStart, eveningStart } = AUTO_THEME_CONFIG;

    let nextTransitionTime: number;
    let nextTheme: 'light' | 'dark';

    if (timeInHours < morningStart) {
      nextTransitionTime = morningStart;
      nextTheme = 'light';
    } else if (timeInHours < eveningStart) {
      nextTransitionTime = eveningStart;
      nextTheme = 'dark';
    } else {
      nextTransitionTime = morningStart + 24; // Next day
      nextTheme = 'light';
    }

    const nextTransitionDate = new Date();
    nextTransitionDate.setHours(Math.floor(nextTransitionTime % 24));
    nextTransitionDate.setMinutes((nextTransitionTime % 1) * 60);
    nextTransitionDate.setSeconds(0);

    if (nextTransitionTime >= 24) {
      nextTransitionDate.setDate(nextTransitionDate.getDate() + 1);
    }

    return {
      time: nextTransitionDate,
      theme: nextTheme,
    };
  };

  return {
    theme,
    resolvedTheme,
    updateTheme,
    isLoaded,
    isTransitioning,
    isInTransitionPeriod: isInTransitionPeriod(),
    nextTransition: getNextTransition(),
  };
} 