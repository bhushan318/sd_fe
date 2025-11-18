/**
 * Save As Modal
 * 
 * Purpose: Allow users to save project with a new name
 */

import React, { useState } from 'react';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName?: string;
}

export const SaveAsModal: React.FC<SaveAsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName = ''
}) => {
  const [projectName, setProjectName] = useState(currentName || 'Untitled Project');

  const handleSave = () => {
    if (projectName.trim()) {
      onSave(projectName.trim());
      onClose();
    }
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
          Save Project As
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter project name"
            autoFocus
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!projectName.trim()}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};