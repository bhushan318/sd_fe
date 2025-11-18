/**
 * useProjectState Hook - Centralized project state management
 * 
 * Purpose: Track current project, dirty state, and provide file operations
 * Integrates with storage service and canvas service
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProjectData } from '../types/project';
import { storageService } from '../services/storageService';
import { fileService } from '../services/fileService';
import { canvasService } from '../services/canvasService';
import { toast } from 'react-toastify';

export function useProjectState() {
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Track initial state for comparison
  const initialStateRef = useRef<string>('');

  /**
   * Initialize new project
   */
  const createNewProject = useCallback((name?: string) => {
    const newProject = fileService.createNewProject(name);
    setCurrentProject(newProject);
    setIsDirty(false);
    initialStateRef.current = JSON.stringify(newProject);
    
    toast.success('New project created');
    return newProject;
  }, []);

  /**
   * Load project from storage
   */
  const loadProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    
    try {
      const project = await storageService.loadProject(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      setCurrentProject(project);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(project);
      
      // Restore canvas state
      const elements = canvasService.deserialize(project.canvas.elements);
      if (project.canvas.viewport) {
        canvasService.setViewport(project.canvas.viewport);
      }
      
      toast.success(`Loaded project: ${project.metadata.name}`);
      return project;
    } catch (error) {
      console.error('Load project error:', error);
      toast.error('Failed to load project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load project from file
   */
  const loadFromFile = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      const project = await fileService.parseFile(file);
      
      setCurrentProject(project);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(project);
      
      // Restore canvas state
      const elements = canvasService.deserialize(project.canvas.elements);
      if (project.canvas.viewport) {
        canvasService.setViewport(project.canvas.viewport);
      }
      
      toast.success(`Loaded: ${project.metadata.name}`);
      return project;
    } catch (error: any) {
      console.error('Load from file error:', error);
      toast.error(error.message || 'Failed to load file');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save current project
   */
  const saveProject = useCallback(async () => {
    if (!currentProject) {
      toast.error('No project to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update timestamp
      const updatedProject: ProjectData = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          updatedAt: new Date().toISOString()
        }
      };
      
      await storageService.saveProject(updatedProject);
      
      setCurrentProject(updatedProject);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(updatedProject);
      
      toast.success('Project saved successfully');
      return updatedProject;
    } catch (error: any) {
      console.error('Save project error:', error);
      toast.error(error.message || 'Failed to save project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  /**
   * Save project with new name (Save As)
   */
  const saveProjectAs = useCallback(async (newName: string) => {
    if (!currentProject) {
      toast.error('No project to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const clonedProject = fileService.cloneProject(currentProject, newName);
      
      await storageService.saveProject(clonedProject);
      
      setCurrentProject(clonedProject);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(clonedProject);
      
      toast.success(`Project saved as: ${newName}`);
      return clonedProject;
    } catch (error: any) {
      console.error('Save As error:', error);
      toast.error(error.message || 'Failed to save project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  /**
   * Download project file
   */
  const downloadProject = useCallback((filename?: string) => {
    if (!currentProject) {
      toast.error('No project to download');
      return;
    }
    
    fileService.downloadFile(currentProject, filename);
    toast.success('Project downloaded');
  }, [currentProject]);

  /**
   * Update canvas elements and mark as dirty
   */
  const updateCanvas = useCallback((elements: any) => {
    if (!currentProject) return;
    
    const serialized = canvasService.serialize(elements);
    const viewport = canvasService.getViewport();
    
    const updated: ProjectData = {
      ...currentProject,
      canvas: {
        elements: serialized,
        viewport
      }
    };
    
    setCurrentProject(updated);
    
    // Check if state changed
    const currentState = JSON.stringify(updated);
    const hasChanged = currentState !== initialStateRef.current;
    setIsDirty(hasChanged);
  }, [currentProject]);

  /**
   * Mark project as modified (for external changes)
   */
  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  /**
   * Check for unsaved changes before action
   */
  const checkUnsaved = useCallback((): boolean => {
    return isDirty;
  }, [isDirty]);

  /**
   * Clear current project (for "New" after save)
   */
  const clearProject = useCallback(() => {
    setCurrentProject(null);
    setIsDirty(false);
    initialStateRef.current = '';
    canvasService.clear();
  }, []);

  // Auto-save to localStorage every 30 seconds if dirty
  useEffect(() => {
    if (!currentProject || !isDirty) return;
    
    const autoSaveInterval = setInterval(() => {
      const autoSaveKey = 'simulytics_autosave';
      localStorage.setItem(autoSaveKey, JSON.stringify(currentProject));
      console.log('Auto-saved to localStorage');
    }, 30000); // 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [currentProject, isDirty]);

  return {
    // State
    currentProject,
    isDirty,
    isLoading,
    
    // Actions
    createNewProject,
    loadProject,
    loadFromFile,
    saveProject,
    saveProjectAs,
    downloadProject,
    updateCanvas,
    markDirty,
    checkUnsaved,
    clearProject
  };
}