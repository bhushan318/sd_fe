/**
 * Storage Service - Abstract storage layer
 * 
 * Purpose: Provides a unified interface for storing/retrieving projects
 * Supports: localStorage (demo), AWS S3, Firebase, Custom API
 * 
 * Migration Path: Replace localStorage methods with API calls
 * without changing component code
 */

import { ProjectData, StorageConfig, StorageProvider } from '../types/project';

const STORAGE_PREFIX = 'simulytics_';
const PROJECT_LIST_KEY = `${STORAGE_PREFIX}projects_list`;

class StorageService {
  private config: StorageConfig;

  constructor() {
    // Default to localStorage for demo mode
    this.config = {
      provider: StorageProvider.LOCAL_STORAGE
    };
  }

  /**
   * Configure storage provider
   * Call this to switch from localStorage to cloud storage
   */
  configure(config: StorageConfig) {
    this.config = config;
  }

  /**
   * Save project to storage
   * 
   * MIGRATION: Replace localStorage logic with:
   * - await fetch(`${this.config.apiEndpoint}/projects/${projectId}`, {...})
   * - await s3.putObject({...})
   * - await firestore.collection('projects').doc(projectId).set({...})
   */
  async saveProject(projectData: ProjectData): Promise<void> {
    try {
      switch (this.config.provider) {
        case StorageProvider.LOCAL_STORAGE:
          return this._saveToLocalStorage(projectData);
        
        case StorageProvider.CUSTOM_API:
          return this._saveToAPI(projectData);
        
        case StorageProvider.AWS_S3:
          return this._saveToS3(projectData);
        
        case StorageProvider.FIREBASE:
          return this._saveToFirebase(projectData);
        
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Storage save error:', error);
      throw new Error(`Failed to save project: ${error}`);
    }
  }

  /**
   * Load project from storage
   */
  async loadProject(projectId: string): Promise<ProjectData | null> {
    try {
      switch (this.config.provider) {
        case StorageProvider.LOCAL_STORAGE:
          return this._loadFromLocalStorage(projectId);
        
        case StorageProvider.CUSTOM_API:
          return this._loadFromAPI(projectId);
        
        case StorageProvider.AWS_S3:
          return this._loadFromS3(projectId);
        
        case StorageProvider.FIREBASE:
          return this._loadFromFirebase(projectId);
        
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Storage load error:', error);
      throw new Error(`Failed to load project: ${error}`);
    }
  }

  /**
   * List all available projects
   */
  async listProjects(): Promise<ProjectData[]> {
    try {
      switch (this.config.provider) {
        case StorageProvider.LOCAL_STORAGE:
          return this._listFromLocalStorage();
        
        case StorageProvider.CUSTOM_API:
          return this._listFromAPI();
        
        default:
          return [];
      }
    } catch (error) {
      console.error('Storage list error:', error);
      return [];
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    switch (this.config.provider) {
      case StorageProvider.LOCAL_STORAGE:
        return this._deleteFromLocalStorage(projectId);
      
      case StorageProvider.CUSTOM_API:
        return this._deleteFromAPI(projectId);
      
      default:
        throw new Error('Delete not supported');
    }
  }

  // ============================================
  // LOCALSTORAGE IMPLEMENTATION (DEMO MODE)
  // ============================================

  private _saveToLocalStorage(projectData: ProjectData): void {
    const key = `${STORAGE_PREFIX}project_${projectData.metadata.id}`;
    localStorage.setItem(key, JSON.stringify(projectData));
    
    // Update project list
    this._updateProjectList(projectData.metadata);
  }

  private _loadFromLocalStorage(projectId: string): ProjectData | null {
    const key = `${STORAGE_PREFIX}project_${projectId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return null;
    
    try {
      return JSON.parse(data) as ProjectData;
    } catch (error) {
      console.error('Failed to parse project data:', error);
      return null;
    }
  }

  private _listFromLocalStorage(): ProjectData[] {
    const listData = localStorage.getItem(PROJECT_LIST_KEY);
    
    if (!listData) return [];
    
    try {
      const projectIds = JSON.parse(listData) as string[];
      const projects: ProjectData[] = [];
      
      for (const id of projectIds) {
        const project = this._loadFromLocalStorage(id);
        if (project) projects.push(project);
      }
      
      return projects.sort((a, b) => 
        new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Failed to list projects:', error);
      return [];
    }
  }

  private _deleteFromLocalStorage(projectId: string): void {
    const key = `${STORAGE_PREFIX}project_${projectId}`;
    localStorage.removeItem(key);
    
    // Update project list
    const listData = localStorage.getItem(PROJECT_LIST_KEY);
    if (listData) {
      try {
        const projectIds = JSON.parse(listData) as string[];
        const filtered = projectIds.filter(id => id !== projectId);
        localStorage.setItem(PROJECT_LIST_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Failed to update project list:', error);
      }
    }
  }

  private _updateProjectList(metadata: ProjectData['metadata']): void {
    const listData = localStorage.getItem(PROJECT_LIST_KEY);
    let projectIds: string[] = [];
    
    if (listData) {
      try {
        projectIds = JSON.parse(listData);
      } catch (error) {
        console.error('Failed to parse project list:', error);
      }
    }
    
    if (!projectIds.includes(metadata.id)) {
      projectIds.push(metadata.id);
      localStorage.setItem(PROJECT_LIST_KEY, JSON.stringify(projectIds));
    }
  }

  // ============================================
  // CLOUD IMPLEMENTATIONS (PLACEHOLDERS)
  // ============================================

  /**
   * Save to custom API endpoint
   * 
   * IMPLEMENTATION EXAMPLE:
   * const response = await fetch(`${this.config.apiEndpoint}/projects/${projectData.metadata.id}`, {
   *   method: 'PUT',
   *   headers: {
   *     'Content-Type': 'application/json',
   *     'Authorization': `Bearer ${this.config.credentials?.token}`
   *   },
   *   body: JSON.stringify(projectData)
   * });
   * 
   * if (!response.ok) throw new Error('API save failed');
   */
  private async _saveToAPI(projectData: ProjectData): Promise<void> {
    throw new Error('API storage not configured. Set up API endpoint in config.');
  }

  private async _loadFromAPI(projectId: string): Promise<ProjectData | null> {
    throw new Error('API storage not configured. Set up API endpoint in config.');
  }

  private async _listFromAPI(): Promise<ProjectData[]> {
    throw new Error('API storage not configured. Set up API endpoint in config.');
  }

  private async _deleteFromAPI(projectId: string): Promise<void> {
    throw new Error('API storage not configured. Set up API endpoint in config.');
  }

  /**
   * AWS S3 implementation placeholder
   * 
   * IMPLEMENTATION EXAMPLE:
   * import AWS from 'aws-sdk';
   * const s3 = new AWS.S3(this.config.credentials);
   * await s3.putObject({
   *   Bucket: 'simulytics-projects',
   *   Key: `projects/${projectData.metadata.id}.json`,
   *   Body: JSON.stringify(projectData),
   *   ContentType: 'application/json'
   * }).promise();
   */
  private async _saveToS3(projectData: ProjectData): Promise<void> {
    throw new Error('S3 storage not configured. Install aws-sdk and configure credentials.');
  }

  private async _loadFromS3(projectId: string): Promise<ProjectData | null> {
    throw new Error('S3 storage not configured. Install aws-sdk and configure credentials.');
  }

  /**
   * Firebase implementation placeholder
   * 
   * IMPLEMENTATION EXAMPLE:
   * import { getFirestore, doc, setDoc } from 'firebase/firestore';
   * const db = getFirestore();
   * await setDoc(doc(db, 'projects', projectData.metadata.id), projectData);
   */
  private async _saveToFirebase(projectData: ProjectData): Promise<void> {
    throw new Error('Firebase storage not configured. Install firebase and configure.');
  }

  private async _loadFromFirebase(projectId: string): Promise<ProjectData | null> {
    throw new Error('Firebase storage not configured. Install firebase and configure.');
  }
}

// Export singleton instance
export const storageService = new StorageService();