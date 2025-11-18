/**
 * Project Context - Centralized state management
 * This wraps your app and tracks all canvas changes
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { fileService } from '../services/fileService';
import { toast } from 'react-toastify';
import { historyManager } from '../utils/historyManager';
import { clipboardManager } from '../utils/clipboardManager';


const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);

// Add this useEffect to track history
useEffect(() => {
  if (canvasElements.length > 0 || historyManager.history.length === 0) {
    historyManager.push(canvasElements);
  }
}, [canvasElements]);

/**
 * SELECTION MANAGEMENT
 */
const selectElement = useCallback((elementId) => {
  setSelectedElements(prev => {
    if (prev.includes(elementId)) {
      return prev;
    }
    return [...prev, elementId];
  });
}, []);

const deselectElement = useCallback((elementId) => {
  setSelectedElements(prev => prev.filter(id => id !== elementId));
}, []);

const selectMultiple = useCallback((elementIds) => {
  setSelectedElements(elementIds);
}, []);

const selectAll = useCallback(() => {
  const allIds = canvasElements.map(el => el.id);
  setSelectedElements(allIds);
  toast.success(`Selected ${allIds.length} elements`);
}, [canvasElements]);

const clearSelection = useCallback(() => {
  setSelectedElements([]);
}, []);

const getSelectedElements = useCallback(() => {
  return canvasElements.filter(el => selectedElements.includes(el.id));
}, [canvasElements, selectedElements]);

/**
 * UNDO / REDO
 */
const undo = useCallback(() => {
  if (!historyManager.canUndo()) {
    toast.info('Nothing to undo');
    return;
  }
  
  const previousState = historyManager.undo();
  if (previousState) {
    setCanvasElements(previousState);
    setIsDirty(true);
    toast.success('Undo successful');
  }
}, []);

const redo = useCallback(() => {
  if (!historyManager.canRedo()) {
    toast.info('Nothing to redo');
    return;
  }
  
  const nextState = historyManager.redo();
  if (nextState) {
    setCanvasElements(nextState);
    setIsDirty(true);
    toast.success('Redo successful');
  }
}, []);

const canUndo = useCallback(() => {
  return historyManager.canUndo();
}, []);

const canRedo = useCallback(() => {
  return historyManager.canRedo();
}, []);

/**
 * CUT / COPY / PASTE
 */
const cutSelected = useCallback(() => {
  const selected = getSelectedElements();
  
  if (selected.length === 0) {
    toast.warning('No elements selected to cut');
    return;
  }
  
  clipboardManager.cut(selected);
  
  // Remove cut elements from canvas
  setCanvasElements(prev => 
    prev.filter(el => !selectedElements.includes(el.id))
  );
  
  setSelectedElements([]);
  setIsDirty(true);
  toast.success(`Cut ${selected.length} element(s)`);
}, [selectedElements, getSelectedElements]);

const copySelected = useCallback(() => {
  const selected = getSelectedElements();
  
  if (selected.length === 0) {
    toast.warning('No elements selected to copy');
    return;
  }
  
  clipboardManager.copy(selected);
  toast.success(`Copied ${selected.length} element(s)`);
}, [selectedElements, getSelectedElements]);

const paste = useCallback(() => {
  const pastedElements = clipboardManager.paste();
  
  if (!pastedElements) {
    toast.warning('Clipboard is empty');
    return;
  }
  
  // Add pasted elements to canvas
  setCanvasElements(prev => [...prev, ...pastedElements]);
  
  // Select pasted elements
  setSelectedElements(pastedElements.map(el => el.id));
  
  setIsDirty(true);
  toast.success(`Pasted ${pastedElements.length} element(s)`);
}, []);

/**
 * DELETE
 */
const deleteSelected = useCallback(() => {
  if (selectedElements.length === 0) {
    toast.warning('No elements selected to delete');
    return;
  }
  
  setCanvasElements(prev => 
    prev.filter(el => !selectedElements.includes(el.id))
  );
  
  toast.success(`Deleted ${selectedElements.length} element(s)`);
  setSelectedElements([]);
  setIsDirty(true);
}, [selectedElements]);

/**
 * DUPLICATE
 */
const duplicateSelected = useCallback(() => {
  const selected = getSelectedElements();
  
  if (selected.length === 0) {
    toast.warning('No elements selected to duplicate');
    return;
  }
  
  const duplicated = selected.map(element => ({
    ...element,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position: element.position ? {
      x: element.position.x + 30,
      y: element.position.y + 30
    } : undefined
  }));
  
  setCanvasElements(prev => [...prev, ...duplicated]);
  
  // Select duplicated elements
  setSelectedElements(duplicated.map(el => el.id));
  
  setIsDirty(true);
  toast.success(`Duplicated ${duplicated.length} element(s)`);
}, [selectedElements, getSelectedElements]);

/**
 * CLEAR ALL
 */
const clearAllElements = useCallback(() => {
  if (canvasElements.length === 0) {
    toast.info('Canvas is already empty');
    return;
  }
  
  // Confirm before clearing
  if (window.confirm(`Delete all ${canvasElements.length} elements?`)) {
    setCanvasElements([]);
    setSelectedElements([]);
    setIsDirty(true);
    toast.success('Canvas cleared');
  }
}, [canvasElements]);

/**
 * ARRANGE (Z-ORDER)
 */
const bringToFront = useCallback(() => {
  if (selectedElements.length === 0) {
    toast.warning('No elements selected');
    return;
  }
  
  const selected = selectedElements[0];
  setCanvasElements(prev => {
    const element = prev.find(el => el.id === selected);
    if (!element) return prev;
    
    const others = prev.filter(el => el.id !== selected);
    return [...others, element]; // Move to end (front)
  });
  
  setIsDirty(true);
  toast.success('Brought to front');
}, [selectedElements]);

const sendToBack = useCallback(() => {
  if (selectedElements.length === 0) {
    toast.warning('No elements selected');
    return;
  }
  
  const selected = selectedElements[0];
  setCanvasElements(prev => {
    const element = prev.find(el => el.id === selected);
    if (!element) return prev;
    
    const others = prev.filter(el => el.id !== selected);
    return [element, ...others]; // Move to start (back)
  });
  
  setIsDirty(true);
  toast.success('Sent to back');
}, [selectedElements]);




  // Track initial state for comparison
  const initialStateRef = useRef('');

  /**
   * Update canvas elements and mark as dirty
   */
  const updateCanvasElements = useCallback((elements) => {
    setCanvasElements(elements);
    
    if (currentProject) {
      // Mark as dirty
      setIsDirty(true);
    }
  }, [currentProject]);

  /**
   * Add element to canvas
   */
  const addCanvasElement = useCallback((element) => {
    setCanvasElements(prev => [...prev, element]);
    setIsDirty(true);
  }, []);

  /**
   * Remove element from canvas
   */
  const removeCanvasElement = useCallback((elementId) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
    setIsDirty(true);
  }, []);

  /**
   * Clear canvas
   */
  const clearCanvas = useCallback(() => {
    setCanvasElements([]);
    setIsDirty(false);
  }, []);

  /**
   * Create new project
   */
  const createNewProject = useCallback((name) => {
    const newProject = fileService.createNewProject(name);
    setCurrentProject(newProject);
    setCanvasElements([]);
    setIsDirty(false);
    initialStateRef.current = JSON.stringify(newProject);
    
    toast.success('New project created');
    return newProject;
  }, []);

  /**
   * Load project from storage
   */
  const loadProject = useCallback(async (projectId) => {
    setIsLoading(true);
    
    try {
      const project = await storageService.loadProject(projectId);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      setCurrentProject(project);
      setCanvasElements(project.canvas.elements || []);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(project);
      
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
  const loadFromFile = useCallback(async (file) => {
    setIsLoading(true);
    
    try {
      const project = await fileService.parseFile(file);
      
      setCurrentProject(project);
      setCanvasElements(project.canvas.elements || []);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(project);
      
      toast.success(`Loaded: ${project.metadata.name}`);
      return project;
    } catch (error) {
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
      // Update project with current canvas state
      const updatedProject = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          updatedAt: new Date().toISOString()
        },
        canvas: {
          elements: canvasElements,
          viewport: { x: 0, y: 0, zoom: 1 }
        }
      };
      
      await storageService.saveProject(updatedProject);
      
      setCurrentProject(updatedProject);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(updatedProject);
      
      toast.success('Project saved successfully');
      return updatedProject;
    } catch (error) {
      console.error('Save project error:', error);
      toast.error(error.message || 'Failed to save project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, canvasElements]);

  /**
   * Save project with new name (Save As)
   */
  const saveProjectAs = useCallback(async (newName) => {
    if (!currentProject) {
      toast.error('No project to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const clonedProject = fileService.cloneProject(currentProject, newName);
      
      // Update with current canvas state
      clonedProject.canvas = {
        elements: canvasElements,
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      
      await storageService.saveProject(clonedProject);
      
      setCurrentProject(clonedProject);
      setIsDirty(false);
      initialStateRef.current = JSON.stringify(clonedProject);
      
      toast.success(`Project saved as: ${newName}`);
      return clonedProject;
    } catch (error) {
      console.error('Save As error:', error);
      toast.error(error.message || 'Failed to save project');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, canvasElements]);

  /**
   * Download project file
   */
  const downloadProject = useCallback((filename) => {
    if (!currentProject) {
      toast.error('No project to download');
      return;
    }
    
    // Update project with current canvas state before download
    const projectToDownload = {
      ...currentProject,
      canvas: {
        elements: canvasElements,
        viewport: { x: 0, y: 0, zoom: 1 }
      }
    };
    
    fileService.downloadFile(projectToDownload, filename);
    toast.success('Project downloaded');
  }, [currentProject, canvasElements]);

  /**
   * Check for unsaved changes
   */
  const checkUnsaved = useCallback(() => {
    return isDirty;
  }, [isDirty]);

  // Auto-save to localStorage every 30 seconds if dirty
  useEffect(() => {
    if (!currentProject || !isDirty) return;
    
    const autoSaveInterval = setInterval(() => {
      const autoSaveKey = 'simulytics_autosave';
      const projectToSave = {
        ...currentProject,
        canvas: {
          elements: canvasElements,
          viewport: { x: 0, y: 0, zoom: 1 }
        }
      };
      localStorage.setItem(autoSaveKey, JSON.stringify(projectToSave));
      console.log('Auto-saved to localStorage');
    }, 30000); // 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [currentProject, canvasElements, isDirty]);

  const value = {
    // State
    currentProject,
    canvasElements,
    isDirty,
    isLoading,
    
    // Canvas actions
    updateCanvasElements,
    addCanvasElement,
    removeCanvasElement,
    clearCanvas,
    
    // Project actions
    createNewProject,
    loadProject,
    loadFromFile,
    saveProject,
    saveProjectAs,
    downloadProject,
    checkUnsaved,
  selectedElements,
  selectElement,
  deselectElement,
  selectMultiple,
  selectAll,
  clearSelection,
  getSelectedElements,
  
  // Edit operations
  undo,
  redo,
  canUndo,
  canRedo,
  cutSelected,
  copySelected,
  paste,
  deleteSelected,
  duplicateSelected,
  clearAllElements,
  bringToFront,
  sendToBack

  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};