/**
 * Clipboard Manager - Cut/Copy/Paste functionality
 * 
 * Manages clipboard operations for canvas elements
 */

class ClipboardManager {
  constructor() {
    this.clipboard = null;
    this.isCut = false;
  }

  /**
   * Copy elements to clipboard
   */
  copy(elements) {
    if (!elements || elements.length === 0) {
      return false;
    }
    
    this.clipboard = this._cloneElements(elements);
    this.isCut = false;
    
    console.log('Copied to clipboard:', elements.length, 'items');
    return true;
  }

  /**
   * Cut elements to clipboard
   */
  cut(elements) {
    if (!elements || elements.length === 0) {
      return false;
    }
    
    this.clipboard = this._cloneElements(elements);
    this.isCut = true;
    
    console.log('Cut to clipboard:', elements.length, 'items');
    return true;
  }

  /**
   * Paste elements from clipboard
   */
  paste(offsetX = 20, offsetY = 20) {
    if (!this.clipboard || this.clipboard.length === 0) {
      return null;
    }
    
    // Clone elements and offset position
    const pastedElements = this._cloneElements(this.clipboard).map(element => ({
      ...element,
      id: this._generateId(), // Generate new IDs
      position: element.position ? {
        x: element.position.x + offsetX,
        y: element.position.y + offsetY
      } : undefined
    }));
    
    // Clear clipboard if it was a cut operation
    if (this.isCut) {
      this.clipboard = null;
      this.isCut = false;
    }
    
    return pastedElements;
  }

  /**
   * Check if clipboard has data
   */
  hasData() {
    return this.clipboard !== null && this.clipboard.length > 0;
  }

  /**
   * Check if last operation was cut
   */
  wasCut() {
    return this.isCut;
  }

  /**
   * Clear clipboard
   */
  clear() {
    this.clipboard = null;
    this.isCut = false;
  }

  /**
   * Get clipboard contents
   */
  getClipboard() {
    return this.clipboard ? this._cloneElements(this.clipboard) : null;
  }

  /**
   * Clone elements
   */
  _cloneElements(elements) {
    return JSON.parse(JSON.stringify(elements));
  }

  /**
   * Generate unique ID
   */
  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const clipboardManager = new ClipboardManager();