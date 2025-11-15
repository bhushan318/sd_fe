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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RibbonMenu = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [openDropdown, setOpenDropdown] = useState(null);

  const tabs = [
    {
      id: 'file',
      label: 'File',
      items: ['New', 'Open', 'Save', 'Save As', 'Export']
      // items: [
      //   { name: "New", icon: <FilePlus className="w-4 h-4" /> },
      //   { name: "Open", icon: <FolderOpen className="w-4 h-4" /> },
      //   { name: "Save", icon: <Save className="w-4 h-4" /> },
      //   { name: "Export", icon: <Square className="w-4 h-4" /> },
      // ],

    },
    {
      id: 'edit',
      label: 'Edit',
      items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste']
    },
    {
      id: 'view',
      label: 'View',
      // items: ['Zoom In', 'Zoom Out', 'Fit to Screen', 'Grid']
      items: [
        { name: "Zoom In", icon: <ZoomIn className="w-4 h-4" /> },
        { name: "Zoom Out", icon: <ZoomOut className="w-4 h-4" /> },
        { name: "Fit to Screen", icon: <Eye className="w-4 h-4" /> },
      ],

    },
    {
      id: 'model',
      label: 'Model',
      items: ['Add Stock', 'Add Flow', 'Add Variable', 'Add Link']
    },
    {
      id: 'simulate',
      label: 'Simulate',
      items: ['Run', 'Pause', 'Stop', 'Settings']
    }
  ];

  const handleTabClick = (tabId) => {
    if (openDropdown === tabId) {
      setOpenDropdown(null);
    } else {
      setActiveTab(tabId);
      setOpenDropdown(tabId);
    }
  };

  const handleItemClick = (item) => {
    console.log('Menu action:', item);
    setOpenDropdown(null);
  };

  return (
    <div className="relative bg-white border-b border-zinc-200">
      {/* Tab Bar */}
      <div className="flex items-center px-4 h-11">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={() => handleTabClick(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium transition-colors relative
                ${activeTab === tab.id 
                  ? 'text-zinc-900' 
                  : 'text-zinc-600 hover:text-zinc-900'
                }
              `}
            >
              <span className="flex items-center gap-1">
                {tab.label}
                <ChevronDown className="w-3 h-3" />
              </span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
              )}
            </button>

            {/* Dropdown Menu */}
            {openDropdown === tab.id && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenDropdown(null)}
                />
                
                {/* Menu Panel */}
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-20">
                  {tab.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(item)}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RibbonMenu;

