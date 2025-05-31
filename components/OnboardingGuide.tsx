'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  action?: {
    text: string;
    href: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to LevelList! 🎮",
    description: "Your personal video game collection tracker. We've added some sample games to get you started.",
  },
  {
    id: 2,
    title: "Add Your First Game 📝",
    description: "Click 'Add Game' to start building your personal collection. You can track status, rating, hours played, and more!",
    action: {
      text: "Add Game",
      href: "/games/add"
    }
  },
  {
    id: 3,
    title: "Explore Your Collection 📚",
    description: "Use filters and search to organize your library. Sort by rating, status, or hours played.",
    action: {
      text: "View Collection",
      href: "/games"
    }
  },
  {
    id: 4,
    title: "Track Your Progress 📊",
    description: "Check your gaming statistics to see your progress, completion rates, and favorite genres.",
    action: {
      text: "View Statistics",
      href: "/statistics"
    }
  },
  {
    id: 5,
    title: "You're All Set! ✨",
    description: "You now know the basics of LevelList. Start tracking your gaming journey and discover new insights about your gaming habits!",
  }
];

export default function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('levelist-onboarding-seen');
    if (!seen) {
      setIsOpen(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('levelist-onboarding-seen', 'true');
    setIsOpen(false);
    setHasSeenOnboarding(true);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const reopenOnboarding = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen && hasSeenOnboarding) {
    return (
      <button
        onClick={reopenOnboarding}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Show onboarding guide"
      >
        <span className="text-lg">❓</span>
      </button>
    );
  }

  if (!isOpen) return null;

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {step.id}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {step.description}
          </p>

          {step.action && (
            <div className="mb-6">
              <Link
                href={step.action.href}
                onClick={handleComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                {step.action.text}
              </Link>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="space-x-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 