'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme hook
  useTheme();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render children, just prevent hydration issues
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <>{children}</>;
} 