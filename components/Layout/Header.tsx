'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-cyber-dark shadow-sm border-b border-gray-200 dark:border-cyber-lighter sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 dark:bg-cyber-electric rounded-lg flex items-center justify-center shadow-lg dark:shadow-cyber-electric/20">
                <span className="text-white dark:text-cyber-dark font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-cyber-text">LevelList</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/games" 
              className="text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Games
            </Link>
            <Link 
              href="/games/add" 
              className="text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add Game
            </Link>
            <Link 
              href="/statistics" 
              className="text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Statistics
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              href="/games/add"
              className="bg-blue-600 dark:bg-cyber-electric hover:bg-blue-700 dark:hover:bg-cyber-magenta text-white dark:text-cyber-dark px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg dark:shadow-cyber-electric/20 dark:hover:shadow-cyber-magenta/20"
            >
              Add Game
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric p-2 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-cyber-dark border-t border-gray-200 dark:border-cyber-lighter">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric hover:bg-gray-50 dark:hover:bg-cyber-lighter rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/games"
              className="block px-3 py-2 text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric hover:bg-gray-50 dark:hover:bg-cyber-lighter rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Games
            </Link>
            <Link
              href="/games/add"
              className="block px-3 py-2 text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric hover:bg-gray-50 dark:hover:bg-cyber-lighter rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Add Game
            </Link>
            <Link
              href="/statistics"
              className="block px-3 py-2 text-gray-700 dark:text-cyber-muted hover:text-blue-600 dark:hover:text-cyber-electric hover:bg-gray-50 dark:hover:bg-cyber-lighter rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Statistics
            </Link>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 dark:border-cyber-lighter">
            <div className="flex items-center justify-between mb-3">
              <ThemeToggle />
            </div>
            <Link
              href="/games/add"
              className="block w-full bg-blue-600 dark:bg-cyber-electric hover:bg-blue-700 dark:hover:bg-cyber-magenta text-white dark:text-cyber-dark px-4 py-2 rounded-lg text-center font-medium transition-all duration-200 shadow-lg dark:shadow-cyber-electric/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Add Game
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 