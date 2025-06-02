'use client';

import { useState, useEffect } from 'react';

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setMobileInfo({
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 1024,
        isTouch: isTouchDevice,
        screenWidth: width,
        screenHeight: height,
        orientation: height > width ? 'portrait' : 'landscape',
      });
    };

    // Initial check
    updateMobileInfo();

    // Listen for window resize and orientation changes
    window.addEventListener('resize', updateMobileInfo);
    window.addEventListener('orientationchange', updateMobileInfo);

    return () => {
      window.removeEventListener('resize', updateMobileInfo);
      window.removeEventListener('orientationchange', updateMobileInfo);
    };
  }, []);

  return mobileInfo;
}

export function useIsMobile(): boolean {
  const { isMobile } = useMobile();
  return isMobile;
}

export function useIsTouch(): boolean {
  const { isTouch } = useMobile();
  return isTouch;
} 