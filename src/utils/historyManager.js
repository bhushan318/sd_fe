/**
 * History Manager - Undo/Redo functionality
 * 
 * Manages history stack for canvas operations
 * Supports unlimited undo/redo with memory optimization
 */

class HistoryManager {
  constructor(maxHistorySize = 50) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Push new state to history
   */
  push(state) {
    // Remove any states after current index (when user made changes after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new state
    this.history.push(this._cloneState(state));
    
    // Maintain max history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Undo - go back one step
   */
  undo() {
    if (!this.canUndo()) return null;
    
    this.currentIndex--;
    return this._cloneState(this.history[this.currentIndex]);
  }

  /**
   * Redo - go forward one step
   */
  redo() {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    return this._cloneState(this.history[this.currentIndex]);
  }

  /**
   * Check if can undo
   */
  canUndo() {
    return this.currentIndex > 0;
  }

  /**
   * Check if can redo
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Get current state
   */
  getCurrentState() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this._cloneState(this.history[this.currentIndex]);
    }
    return null;
  }

  /**
   * Clear history
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get history stats
   */
  getStats() {
    return {
      totalStates: this.history.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }

  /**
   * Clone state to prevent mutations
   */
  _cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }
}

export const historyManager = new HistoryManager();