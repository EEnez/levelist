'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGames } from '@/contexts/GameContext';
import { useToastHelpers } from '@/hooks/useToastHelpers';
import { 
  ExportFormat, 
  ExportOptions, 
  ImportResult,
  exportGames, 
  importGames,
  downloadFile,
  getExportFilename
} from '@/utils/importExport';
import { downloadSampleFile } from '@/utils/sampleExportData';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'import' | 'export';
}

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'export' 
}: ImportExportModalProps) {
  const { games, addBulkGames } = useGames();
  const toast = useToastHelpers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mode, setMode] = useState<'import' | 'export'>(defaultMode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: ExportFormat.JSON,
    includeMetadata: true,
    includeNotes: true,
    includeRatings: true,
  });
  const [importFormat, setImportFormat] = useState<ExportFormat>(ExportFormat.JSON);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      
      const content = exportGames(games, exportOptions);
      const filename = getExportFilename(exportOptions.format);
      const mimeType = exportOptions.format === ExportFormat.CSV 
        ? 'text/csv' 
        : 'application/json';
      
      downloadFile(content, filename, mimeType);
      
      toast.success(
        'Export réussi !', 
        `${games.length} jeux exportés au format ${exportOptions.format.toUpperCase()}`
      );
      
      onClose();
    } catch {
      toast.error('Erreur d&apos;export', 'Impossible d&apos;exporter les données');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setIsProcessing(true);
      
      const content = await file.text();
      const result = await importGames(content, importFormat, games);
      
      setImportResult(result);
      
      if (result.success && result.imported.length > 0) {
        // Actually add the imported games using the context
        await addBulkGames(result.imported);
        
        toast.success(
          'Import réussi !',
          `${result.imported.length} jeux importés, ${result.duplicates} doublons ignorés`
        );
        
        // Close modal after successful import
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh to show imported games
        }, 2000);
      } else {
        toast.error('Erreur d&apos;import', result.errors[0] || 'Format invalide');
      }
    } catch {
      toast.error('Erreur d&apos;import', 'Impossible de lire le fichier');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImport(file);
    }
  };

  const formatOptions = [
    { value: ExportFormat.JSON, label: 'JSON', description: 'Format standard, complet' },
    { value: ExportFormat.CSV, label: 'CSV', description: 'Compatible Excel/Sheets' },
    { value: ExportFormat.STEAM, label: 'Steam', description: 'Format Steam Library' },
    { value: ExportFormat.BACKUP, label: 'Backup', description: 'Sauvegarde complète' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Import / Export
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mode Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMode('export')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === 'export'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📤 Export
              </button>
              <button
                onClick={() => setMode('import')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === 'import'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📥 Import
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {mode === 'export' ? (
              <div className="space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Format d&apos;export
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {formatOptions.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setExportOptions(prev => ({ ...prev, format: format.value }))}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          exportOptions.format === format.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Options d&apos;export
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeMetadata}
                        onChange={(e) => setExportOptions(prev => ({ 
                          ...prev, 
                          includeMetadata: e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Inclure les métadonnées (développeur, éditeur, dates)
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeNotes}
                        onChange={(e) => setExportOptions(prev => ({ 
                          ...prev, 
                          includeNotes: e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Inclure les notes personnelles
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeRatings}
                        onChange={(e) => setExportOptions(prev => ({ 
                          ...prev, 
                          includeRatings: e.target.checked 
                        }))}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Inclure les évaluations et temps de jeu
                      </span>
                    </label>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>📊 {games.length} jeux seront exportés</div>
                    <div>📁 Format: {exportOptions.format.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Format Selection for Import */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Format d&apos;import
                  </label>
                  <select
                    value={importFormat}
                    onChange={(e) => setImportFormat(e.target.value as ExportFormat)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {formatOptions.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="text-4xl">📁</div>
                    <div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        Glissez votre fichier ici
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ou cliquez pour sélectionner
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Choisir un fichier
                      </button>
                      <button
                        onClick={() => downloadSampleFile(importFormat as 'json' | 'csv' | 'steam' | 'backup')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        title="Télécharger un fichier d&apos;exemple pour tester l&apos;import"
                      >
                        📥 Exemple
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Import Result */}
                {importResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Résultat de l&apos;import:
                      </div>
                      <div className="text-green-600 dark:text-green-400">
                        ✅ {importResult.imported.length} jeux importés
                      </div>
                      {importResult.duplicates > 0 && (
                        <div className="text-yellow-600 dark:text-yellow-400">
                          ⚠️ {importResult.duplicates} doublons ignorés
                        </div>
                      )}
                      {importResult.errors.length > 0 && (
                        <div className="text-red-600 dark:text-red-400">
                          ❌ {importResult.errors.length} erreurs
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
            >
              Annuler
            </button>
            {mode === 'export' && (
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Export...
                  </>
                ) : (
                  <>
                    📤 Exporter
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 