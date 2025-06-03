'use client';

import { useState } from 'react';
import ImportExportModal from './ImportExportModal';

interface ImportExportButtonProps {
  variant?: 'default' | 'icon-only' | 'compact';
  defaultMode?: 'import' | 'export';
  className?: string;
}

export default function ImportExportButton({ 
  variant = 'default', 
  defaultMode = 'export',
  className = ''
}: ImportExportButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const getButtonContent = () => {
    switch (variant) {
      case 'icon-only':
        return (
          <>
            <span className="text-lg">📁</span>
          </>
        );
      case 'compact':
        return (
          <>
            <span className="text-base">📁</span>
            <span>I/E</span>
          </>
        );
      default:
        return (
          <>
            <span className="text-base">📁</span>
            <span className="hidden xs:inline">Import/Export</span>
          </>
        );
    }
  };

  const defaultClasses = "bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 touch-manipulation shadow-sm hover:shadow-md";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${defaultClasses} ${className}`}
        title="Import or export your game collection"
      >
        {getButtonContent()}
      </button>
      
      <ImportExportModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultMode={defaultMode}
      />
    </>
  );
} 