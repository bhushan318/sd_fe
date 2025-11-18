/**
 * Export Canvas Utilities
 * 
 * Purpose: Export canvas as PNG, SVG, or JSON
 * High-resolution export for production use
 */

import { ProjectData } from '../types/project';

export class CanvasExporter {
  /**
   * Export canvas as PNG
   * 
   * INTEGRATION: Connect to your canvas element
   * For React Flow: use getRectOfNodes, getTransformForBounds
   * For HTML5 Canvas: use canvas.toDataURL
   * For SVG: use XMLSerializer
   */
  static async exportAsPNG(
    canvasElement: HTMLElement | null,
    options: {
      scale?: number;
      quality?: number;
      backgroundColor?: string;
    } = {}
  ): Promise<string> {
    const {
      scale = 2, // 2x for high-res
      quality = 0.95,
      backgroundColor = '#ffffff'
    } = options;

    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }

    try {
      // Use html2canvas or similar library for DOM elements
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(canvasElement, {
        scale,
        backgroundColor,
        logging: false,
        useCORS: true
      });
      
      return canvas.toDataURL('image/png', quality);
    } catch (error) {
      console.error('PNG export error:', error);
      throw new Error('Failed to export as PNG. Ensure html2canvas is installed.');
    }
  }

  /**
   * Export canvas as SVG
   */
  static async exportAsSVG(
    canvasElement: HTMLElement | null
  ): Promise<string> {
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }

    try {
      // Find SVG element within canvas
      const svgElement = canvasElement.querySelector('svg');
      
      if (!svgElement) {
        throw new Error('No SVG element found in canvas');
      }

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      
      return svgString;
    } catch (error) {
      console.error('SVG export error:', error);
      throw new Error('Failed to export as SVG');
    }
  }

  /**
   * Download exported image
   */
  static downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Download SVG
   */
  static downloadSVG(svgString: string, filename: string): void {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}