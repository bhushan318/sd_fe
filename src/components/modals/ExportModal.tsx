/**
 * Export Modal
 * 
 * Purpose: Export canvas in various formats (PNG, SVG, JSON)
 */

import React, { useState } from 'react';
import { ExportFormat } from '../../types/project';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg' | 'json'>('png');
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.95);

  const handleExport = () => {
    const format: ExportFormat = {
      type: selectedFormat,
      options: {
        scale,
        quality,
        backgroundColor: '#ffffff'
      }
    };
    
    onExport(format);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Export Canvas
        </h2>
        
        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Export Format
          </label>
          
          <div className="space-y-2">
            {[
              { value: 'png', label: 'PNG Image', desc: 'High-quality raster image' },
              { value: 'svg', label: 'SVG Vector', desc: 'Scalable vector graphics' },
              { value: 'json', label: 'JSON Data', desc: 'Raw project data' }
            ].map(format => (
              <label
                key={format.value}
                className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {format.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* PNG Options */}
        {selectedFormat === 'png' && (
          <div className="mb-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Scale: {scale}x
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Higher scale = better quality, larger file
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};