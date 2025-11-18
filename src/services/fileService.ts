/**
 * File Service - Handle file I/O operations
 * 
 * Purpose: Parse, validate, and export project files
 * Handles JSON, file uploads, and downloads
 */

import { ProjectData } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class FileService {
  /**
   * Parse uploaded file
   */
  async parseFile(file: File): Promise<ProjectData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ProjectData;
          
          // Validate structure
          if (!this.validateProjectData(data)) {
            reject(new Error('Invalid project file format'));
            return;
          }
          
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse file. Ensure it\'s a valid JSON file.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Validate project data structure
   */
  validateProjectData(data: any): data is ProjectData {
    if (!data || typeof data !== 'object') return false;
    
    const hasMetadata = data.metadata && 
                       data.metadata.id && 
                       data.metadata.name &&
                       data.metadata.version;
    
    const hasCanvas = data.canvas && Array.isArray(data.canvas.elements);
    
    return hasMetadata && hasCanvas;
  }

  /**
   * Download file to user's computer
   */
  downloadFile(data: ProjectData, filename?: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${data.metadata.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Create new empty project
   */
  createNewProject(name: string = 'Untitled Project'): ProjectData {
    const now = new Date().toISOString();
    
    return {
      metadata: {
        id: uuidv4(),
        name,
        description: '',
        createdAt: now,
        updatedAt: now,
        version: '1.0.0',
        tags: []
      },
      canvas: {
        elements: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      },
      settings: {}
    };
  }

  /**
   * Clone project with new ID (for "Save As")
   */
  cloneProject(original: ProjectData, newName: string): ProjectData {
    return {
      ...original,
      metadata: {
        ...original.metadata,
        id: uuidv4(),
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Export project data as formatted JSON string
   */
  exportAsJSON(data: ProjectData, pretty: boolean = true): string {
    return JSON.stringify(data, null, pretty ? 2 : 0);
  }
}

export const fileService = new FileService();