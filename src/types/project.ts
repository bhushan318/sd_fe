/**
 * Core project type definitions for Simulytics Canvas
 * Defines the structure of project data, canvas elements, and metadata
 */

export interface CanvasElement {
  id: string;
  type: 'node' | 'edge' | 'group';
  position?: { x: number; y: number };
  data?: Record<string, any>;
  properties?: Record<string, any>;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  author?: string;
  tags?: string[];
}

export interface ProjectData {
  metadata: ProjectMetadata;
  canvas: {
    elements: CanvasElement[];
    viewport?: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  settings?: Record<string, any>;
}

export interface SaveOptions {
  showNotification?: boolean;
  updateTimestamp?: boolean;
}

export interface ExportFormat {
  type: 'json' | 'png' | 'svg';
  options?: {
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  };
}

export enum StorageProvider {
  LOCAL_STORAGE = 'localStorage',
  AWS_S3 = 's3',
  FIREBASE = 'firebase',
  CUSTOM_API = 'api'
}

export interface StorageConfig {
  provider: StorageProvider;
  apiEndpoint?: string;
  credentials?: Record<string, any>;
}

import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  label?: string;
  icon?: LucideIcon | null;
  handler?: () => void;
  shortcut?: string;
  disabled?: boolean;
  type?: 'divider';
}

export interface MenuTab {
  id: string;
  label: string;
  items: MenuItem[];
}