/**
 * Save Confirmation Modal
 * 
 * Purpose: Warn user about unsaved changes before destructive actions
 * Used in: New, Open, Close operations
 */

import React from 'react';

interface SaveConfirmationModalProps {
  isOpen: boolean;
  onSave: () => void;
  onDontSave: () => void;
  onCancel: () => void;
  projectName?: string;
}

export const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  isOpen,
  onSave,
  onDontSave,
  onCancel,
  projectName = 'Untitled'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Save Changes?
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Do you want to save changes to <strong>"{projectName}"</strong> before continuing?
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            Cancel
          </button>
          
          <button
            onClick={onDontSave}
            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
          >
            Don't Save
          </button>
          
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};