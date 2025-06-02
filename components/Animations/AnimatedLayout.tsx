'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import PageTransition from './PageTransition';

interface AnimatedLayoutProps {
  children: ReactNode;
  showAnimation?: boolean;
  className?: string;
}

export default function AnimatedLayout({ 
  children, 
  showAnimation = true, 
  className = '' 
}: AnimatedLayoutProps) {
  if (!showAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <PageTransition>
        {children}
      </PageTransition>
    </motion.div>
  );
}

// Composant pour animer l'apparition de listes
export function AnimatedList({ 
  children, 
  className = '',
  staggerDelay = 0.05 
}: { 
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Item de liste animé
export function AnimatedListItem({ 
  children, 
  className = ''
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
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
            duration: 0.3,
            ease: "easeOut"
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Conteneur avec animation de fade-in
export function FadeInContainer({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Conteneur avec animation de slide-in
export function SlideInContainer({ 
  children, 
  className = '',
  direction = 'left',
  delay = 0 
}: { 
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -30, y: 0 };
      case 'right': return { x: 30, y: 0 };
      case 'up': return { x: 0, y: -30 };
      case 'down': return { x: 0, y: 30 };
      default: return { x: -30, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 