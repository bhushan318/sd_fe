/**
 * Canvas Service - Handle canvas serialization/deserialization
 * 
 * Purpose: Convert canvas state to/from storable format
 * Integrates with React Flow or custom canvas implementation
 */

import { CanvasElement } from '../types/project';

class CanvasService {
  /**
   * Serialize canvas elements to storable format
   * 
   * INTEGRATION: Replace with your actual canvas state structure
   * For React Flow: nodes, edges, viewport
   * For custom canvas: SVG elements, layers, etc.
   */
  serialize(canvasElements: any): CanvasElement[] {
    try {
      // Example for React Flow
      if (Array.isArray(canvasElements)) {
        return canvasElements.map(element => ({
          id: element.id,
          type: element.type || 'node',
          position: element.position,
          data: element.data,
          properties: element.properties || {}
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Canvas serialization error:', error);
      return [];
    }
  }

  /**
   * Deserialize canvas elements from storage
   */
  deserialize(elements: CanvasElement[]): any {
    try {
      // Return in format expected by your canvas library
      return elements.map(element => ({
        id: element.id,
        type: element.type,
        position: element.position || { x: 0, y: 0 },
        data: element.data || {},
        ...element.properties
      }));
    } catch (error) {
      console.error('Canvas deserialization error:', error);
      return [];
    }
  }

  /**
   * Clear canvas (reset to initial state)
   */
  clear(): void {
    // Implement canvas clearing logic
    // This will be called from the "New" action
        console.log('Canvas cleared');

  }

  /**
   * Get current viewport state
   */
  getViewport(): { x: number; y: number; zoom: number } {
    // Return current viewport position and zoom
    // Default implementation
    return { x: 0, y: 0, zoom: 1 };
  }

  /**
   * Set viewport state
   */
  setViewport(viewport: { x: number; y: number; zoom: number }): void {
    // Apply viewport transformation
    // Implement based on your canvas library
  }

  /**
   * Validate canvas data
   */
  validate(elements: CanvasElement[]): boolean {
    if (!Array.isArray(elements)) return false;
    
    return elements.every(element => 
      element.id && 
      element.type &&
      ['node', 'edge', 'group'].includes(element.type)
    );
  }
}

export const canvasService = new CanvasService();