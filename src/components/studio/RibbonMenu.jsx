import { useState } from 'react';
import {
  ChevronDown,
  FilePlus,
  FolderOpen,
  Save,
  Scissors,
  Copy,
  Play,
  Pause,
  Square,
  Eye,
  ZoomIn,
  ZoomOut,
  PlusCircle,
  Settings,
  FileDown,
  FileUp,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import hooks and modals
import { useProjectState } from '../../hooks/useProjectState';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { SaveConfirmationModal } from '../modals/SaveConfirmationModal';
import { OpenFileModal } from '../modals/OpenFileModal';
import { SaveAsModal } from '../modals/SaveAsModal';
import { ExportModal } from '../modals/ExportModal';
import { CanvasExporter } from '../../utils/exportCanvas';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useProject } from '../../context/ProjectContext';


const RibbonMenu = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [activeTab, setActiveTab] = useState('file');
  const [openDropdown, setOpenDropdown] = useState(null);

  const { selectedElements, setSelectedElements } = useProject();

  // Project state from our custom hook
  const {
    currentProject,
    isDirty,
    isLoading,
    createNewProject,
    loadProject,
    loadFromFile,
    saveProject,
    saveProjectAs,
    downloadProject, 
    checkUnsaved,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  cutSelected,
  copySelected,
  paste,
  deleteSelected,
  duplicateSelected,
  selectAll,
  clearAllElements,
  bringToFront,
  sendToBack
} = useProject();

  // Modal states
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Track pending action after save confirmation
  const pendingActionRef =  useRef(null);

  // ============================================
  // FILE MENU HANDLERS
  // ============================================

  /**
   * NEW - Create new project
   */
  const handleNew = () => {
    if (checkUnsaved()) {
      pendingActionRef.current = () => {
        createNewProject();
      };
      setShowSaveConfirmation(true);
    } else {
      createNewProject();
    }
    setOpenDropdown(null);
  };

  /**
   * OPEN - Show open file dialog
   */
  const handleOpen = () => {
    if (checkUnsaved()) {
      pendingActionRef.current = () => {
        setShowOpenModal(true);
      };
      setShowSaveConfirmation(true);
    } else {
      setShowOpenModal(true);
    }
    setOpenDropdown(null);
  };

  /**
   * SAVE - Save current project
   */
  const handleSave = async () => {
    if (!currentProject) {
      toast.error('No project to save');
      return;
    }
    
    try {
      await saveProject();
    } catch (error) {
      console.error('Save failed:', error);
    }
    setOpenDropdown(null);
  };

  /**
   * SAVE AS - Save with new name
   */
  const handleSaveAs = () => {
    if (!currentProject) {
      toast.error('No project to save');
      return;
    }
    
    setShowSaveAsModal(true);
    setOpenDropdown(null);
  };

  /**
   * EXPORT - Export canvas
   */
  const handleExport = () => {
    setShowExportModal(true);
    setOpenDropdown(null);
  };

  /**
   * Save confirmation callbacks
   */
  const handleSaveAndContinue = async () => {
    try {
      await saveProject();
      setShowSaveConfirmation(false);
      
      // Execute pending action
      if (pendingActionRef.current) {
        pendingActionRef.current();
        pendingActionRef.current = null;
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDontSave = () => {
    setShowSaveConfirmation(false);
    
    // Execute pending action
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmation(false);
    pendingActionRef.current = null;
  };

  /**
   * Load project from ID
   */
  const handleLoadProject = async (projectId) => {
    try {
      await loadProject(projectId);
    } catch (error) {
      console.error('Load failed:', error);
    }
  };

  /**
   * Load project from file upload
   */
  const handleLoadFile = async (file) => {
    try {
      await loadFromFile(file);
    } catch (error) {
      console.error('Load from file failed:', error);
    }
  };

  /**
   * Save As with new name
   */
  const handleSaveAsSubmit = async (newName) => {
    try {
      await saveProjectAs(newName);
    } catch (error) {
      console.error('Save As failed:', error);
    }
  };

  /**
   * Export in selected format
   */
  const handleExportSubmit = async (format) => {
    if (!currentProject) return;
    
    try {
      const projectName = currentProject.metadata.name.replace(/[^a-z0-9]/gi, '_');
      
      switch (format.type) {
        case 'json':
          downloadProject(`${projectName}.json`);
          break;
        
        case 'png':
          const canvasElement = document.querySelector('.canvas-container');
          const pngData = await CanvasExporter.exportAsPNG(canvasElement, format.options);
          CanvasExporter.downloadImage(pngData, `${projectName}.png`);
          toast.success('Exported as PNG');
          break;
        
        case 'svg':
          const canvasEl = document.querySelector('.canvas-container');
          const svgData = await CanvasExporter.exportAsSVG(canvasEl);
          CanvasExporter.downloadSVG(svgData, `${projectName}.svg`);
          toast.success('Exported as SVG');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(error.message || 'Export failed');
    }
  };

  // ============================================
  // EDIT MENU HANDLERS (Placeholder)
  // ============================================


  const handleUndo = () => {
  undo();
  setOpenDropdown(null);
};

const handleRedo = () => {
  redo();
  setOpenDropdown(null);
};

const handleCut = () => {
  cutSelected();
  setOpenDropdown(null);
};

const handleCopy = () => {
  copySelected();
  setOpenDropdown(null);
};

const handlePaste = () => {
  paste();
  setOpenDropdown(null);
};

const handleDelete = () => {
  deleteSelected();
  setOpenDropdown(null);
};

const handleDuplicate = () => {
  duplicateSelected();
  setOpenDropdown(null);
};

const handleSelectAll = () => {
  selectAll();
  setOpenDropdown(null);
};

const handleClearAll = () => {
  clearAllElements();
  setOpenDropdown(null);
};

const handleBringToFront = () => {
  bringToFront();
  setOpenDropdown(null);
};

const handleSendToBack = () => {
  sendToBack();
  setOpenDropdown(null);
};



  

  // ============================================
  // VIEW MENU HANDLERS (Placeholder)
  // ============================================
  const handleZoomIn = () => {
    console.log('Zoom In action');
    toast.info('Zoom In functionality coming soon');
    setOpenDropdown(null);
  };

  const handleZoomOut = () => {
    console.log('Zoom Out action');
    toast.info('Zoom Out functionality coming soon');
    setOpenDropdown(null);
  };

  const handleFitToScreen = () => {
    console.log('Fit to Screen action');
    toast.info('Fit to Screen functionality coming soon');
    setOpenDropdown(null);
  };

  const handleToggleGrid = () => {
    console.log('Toggle Grid action');
    toast.info('Grid toggle functionality coming soon');
    setOpenDropdown(null);
  };

  // ============================================
  // MODEL MENU HANDLERS (Placeholder)
  // ============================================
  const handleAddStock = () => {
    console.log('Add Stock action');
    toast.info('Add Stock functionality coming soon');
    setOpenDropdown(null);
  };

  const handleAddFlow = () => {
    console.log('Add Flow action');
    toast.info('Add Flow functionality coming soon');
    setOpenDropdown(null);
  };

  const handleAddVariable = () => {
    console.log('Add Variable action');
    toast.info('Add Variable functionality coming soon');
    setOpenDropdown(null);
  };

  const handleAddLink = () => {
    console.log('Add Link action');
    toast.info('Add Link functionality coming soon');
    setOpenDropdown(null);
  };

  // ============================================
  // SIMULATE MENU HANDLERS (Placeholder)
  // ============================================
  const handleRun = () => {
    console.log('Run simulation');
    toast.info('Run simulation functionality coming soon');
    setOpenDropdown(null);
  };

  const handlePauseSimulation = () => {
    console.log('Pause simulation');
    toast.info('Pause simulation functionality coming soon');
    setOpenDropdown(null);
  };

  const handleStop = () => {
    console.log('Stop simulation');
    toast.info('Stop simulation functionality coming soon');
    setOpenDropdown(null);
  };

  const handleSimulationSettings = () => {
    console.log('Simulation settings');
    toast.info('Simulation settings coming soon');
    setOpenDropdown(null);
  };

  // ============================================
  // MENU CONFIGURATION
  // ============================================
  const tabs = [
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New', icon: FilePlus, handler: handleNew, shortcut: 'Ctrl+N' },
        { label: 'Open', icon: FolderOpen, handler: handleOpen, shortcut: 'Ctrl+O' },
        { label: 'Save', icon: Save, handler: handleSave, shortcut: 'Ctrl+S', disabled: !currentProject || !isDirty },
        { label: 'Save As', icon: FileText, handler: handleSaveAs, shortcut: 'Ctrl+Shift+S', disabled: !currentProject },
        { type: 'divider' },
        { label: 'Export', icon: FileDown, handler: handleExport, disabled: !currentProject }
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo', icon: null, handler: handleUndo, shortcut: 'Ctrl+Z', disabled: !canUndo() },
        { label: 'Redo', icon: null, handler: handleRedo, shortcut: 'Ctrl+Y', disabled: !canRedo() },
        { type: 'divider' },
        { label: 'Cut', icon: Scissors, handler: handleCut, shortcut: 'Ctrl+X', disabled: selectedElements.length === 0 },
        { label: 'Copy', icon: Copy, handler: handleCopy, shortcut: 'Ctrl+C', disabled: selectedElements.length === 0 },
        { label: 'Paste', icon: null, handler: handlePaste, shortcut: 'Ctrl+V' }, 
        {label: 'Delete', icon: null,  handler: handleDelete, shortcut: 'Del', disabled: selectedElements.length === 0},
        { type: 'divider' }, 
        { label: 'Duplicate', icon: Copy,  handler: handleDuplicate, shortcut: 'Ctrl+D', disabled: selectedElements.length === 0},
        {label: 'Select All', icon: null, handler: handleSelectAll, shortcut: 'Ctrl+A'},
        { label: 'Clear All', icon: null, handler: handleClearAll, shortcut: 'Ctrl+Shift+A'},
        { type: 'divider' },
        { label: 'Bring to Front', icon: null,  handler: handleBringToFront, shortcut: 'Ctrl+]', disabled: selectedElements.length === 0},
        { label: 'Send to Back', icon: null, handler: handleSendToBack,  shortcut: 'Ctrl+[', disabled: selectedElements.length === 0}]
      },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Zoom In', icon: ZoomIn, handler: handleZoomIn, shortcut: 'Ctrl++' },
        { label: 'Zoom Out', icon: ZoomOut, handler: handleZoomOut, shortcut: 'Ctrl+-' },
        { label: 'Fit to Screen', icon: Eye, handler: handleFitToScreen, shortcut: 'Ctrl+0' },
        { type: 'divider' },
        { label: 'Grid', icon: null, handler: handleToggleGrid, shortcut: 'Ctrl+G' }
      ]
    },
    {
      id: 'model',
      label: 'Model',
      items: [
        { label: 'Add Stock', icon: PlusCircle, handler: handleAddStock },
        { label: 'Add Flow', icon: PlusCircle, handler: handleAddFlow },
        { label: 'Add Variable', icon: PlusCircle, handler: handleAddVariable },
        { label: 'Add Link', icon: PlusCircle, handler: handleAddLink }
      ]
    },
    {
      id: 'simulate',
      label: 'Simulate',
      items: [
        { label: 'Run', icon: Play, handler: handleRun, shortcut: 'F5' },
        { label: 'Pause', icon: Pause, handler: handlePauseSimulation },
        { label: 'Stop', icon: Square, handler: handleStop, shortcut: 'Shift+F5' },
        { type: 'divider' },
        { label: 'Settings', icon: Settings, handler: handleSimulationSettings }
      ]
    }
  ];

  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================
  useKeyboardShortcuts({
    onSave: handleSave,
    onNew: handleNew,
    onOpen: handleOpen,
    onSaveAs: handleSaveAs
  });

  // ============================================
  // UI EVENT HANDLERS
  // ============================================
  const handleTabClick = (tabId) => {
    if (openDropdown === tabId) {
      setOpenDropdown(null);
    } else {
      setActiveTab(tabId);
      setOpenDropdown(tabId); 
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <div className="relative bg-white border-b border-zinc-200">
        {/* Tab Bar */}
        <div className="flex items-center px-4 h-11">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              <button
                onClick={() => handleTabClick(tab.id)}
                disabled={isLoading}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors relative
                  ${activeTab === tab.id 
                    ? 'text-zinc-900' 
                    : 'text-zinc-600 hover:text-zinc-900'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="flex items-center gap-1">
                  {tab.label}
                  {tab.id === 'file' && isDirty && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1" title="Unsaved changes" />
                  )}
                  <ChevronDown className="w-3 h-3" />
                </span>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
                )}
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {openDropdown === tab.id && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdown(null)}
                    />
                    
                    {/* Menu Panel */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-20"
                    >
                      {tab.items.map((item, idx) => {
                        // Render divider
                        if (item.type === 'divider') {
                          return (
                            <div 
                              key={`divider-${idx}`}
                              className="h-px bg-zinc-200 my-1 mx-2"
                            />
                          );
                        }

                        const Icon = item.icon;
                        const isDisabled = item.disabled || isLoading;

                        return (
                          <button
                            key={idx}
                            onClick={item.handler}
                            disabled={isDisabled}
                            className={`
                              w-full px-4 py-2 text-left text-sm transition-colors
                              flex items-center justify-between group
                              ${isDisabled 
                                ? 'text-zinc-400 cursor-not-allowed' 
                                : 'text-zinc-700 hover:bg-zinc-100'
                              }
                            `}
                          >
                            <span className="flex items-center gap-3">
                              {Icon && <Icon className="w-4 h-4" />}
                              {item.label}
                            </span>
                            
                            {item.shortcut && (
                              <span className="text-xs text-zinc-400 group-hover:text-zinc-500">
                                {item.shortcut}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Project Info */}
          {currentProject && (
            <div className="ml-auto flex items-center gap-2 text-sm text-zinc-600">
              <span className="font-medium">{currentProject.metadata.name}</span>
              {isDirty && (
                <span className="text-xs text-yellow-600 font-medium">
                  • Unsaved changes
                </span>
              )}
              {isLoading && (
                <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}
      
      <SaveConfirmationModal
        isOpen={showSaveConfirmation}
        onSave={handleSaveAndContinue}
        onDontSave={handleDontSave}
        onCancel={handleCancelSave}
        projectName={currentProject?.metadata.name}
      />

      <OpenFileModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        onLoadProject={handleLoadProject}
        onLoadFile={handleLoadFile}
      />

      <SaveAsModal
        isOpen={showSaveAsModal}
        onClose={() => setShowSaveAsModal(false)}
        onSave={handleSaveAsSubmit}
        currentName={currentProject?.metadata.name}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportSubmit}
      />
    </>
  );
};

export default RibbonMenu;