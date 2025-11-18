/**
 * Open File Modal
 * 
 * Purpose: Allow users to open projects from storage or upload files
 * Supports: localStorage list, file upload, cloud storage (future)
 */

import React, { useState, useEffect } from 'react';
import { ProjectData } from '../../types/project';
import { storageService } from '../../services/storageService';

interface OpenFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (projectId: string) => void;
  onLoadFile: (file: File) => void;
}

export const OpenFileModal: React.FC<OpenFileModalProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  onLoadFile
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'upload'>('recent');

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectList = await storageService.listProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoadFile(file);
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
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Open Project
        </h2>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'recent'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Recent Projects
          </button>
          
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Upload File
          </button>
        </div>
        
        {/* Content */}
        <div className="min-h-[300px]">
          {activeTab === 'recent' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No recent projects found
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {projects.map(project => (
                    <button
                      key={project.metadata.id}
                      onClick={() => {
                        onLoadProject(project.metadata.id);
                        onClose();
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition border border-gray-200 dark:border-gray-700"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {project.metadata.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last modified: {new Date(project.metadata.updatedAt).toLocaleString()}
                      </div>
                      {project.metadata.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {project.metadata.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-full max-w-md">
                <label className="flex flex-col items-center px-4 py-8 bg-white dark:bg-gray-700 text-blue-600 rounded-lg shadow-lg border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 transition">
                  <svg className="w-12 h-12 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="text-base font-medium">
                    Click to upload project file
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Supports .json files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};