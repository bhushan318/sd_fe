import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;
      
      // FILE OPERATIONS
      if (ctrl && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey && handlers.onSaveAs) {
          handlers.onSaveAs();
        } else if (handlers.onSave) {
          handlers.onSave();
        }
      }
      
      if (ctrl && e.key === 'n') {
        e.preventDefault();
        handlers.onNew?.();
      }
      
      if (ctrl && e.key === 'o') {
        e.preventDefault();
        handlers.onOpen?.();
      }

      // EDIT OPERATIONS
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
      }

      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handlers.onRedo?.();
      }

      if (ctrl && e.key === 'x') {
        e.preventDefault();
        handlers.onCut?.();
      }

      if (ctrl && e.key === 'c') {
        e.preventDefault();
        handlers.onCopy?.();
      }

      if (ctrl && e.key === 'v') {
        e.preventDefault();
        handlers.onPaste?.();
      }

      if (ctrl && e.key === 'd') {
        e.preventDefault();
        handlers.onDuplicate?.();
      }

      if (ctrl && e.key === 'a') {
        e.preventDefault();
        handlers.onSelectAll?.();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only if not in input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handlers.onDelete?.();
        }
      }

      if (ctrl && e.key === ']') {
        e.preventDefault();
        handlers.onBringToFront?.();
      }

      if (ctrl && e.key === '[') {
        e.preventDefault();
        handlers.onSendToBack?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}