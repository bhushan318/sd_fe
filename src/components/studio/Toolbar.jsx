import { useState } from 'react';
import { 
  Play, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3x3, 
  Pointer,
  Hand,
  Type
} from 'lucide-react';

const ToolButton = ({ icon: Icon, label, onClick, active = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-9 h-9 rounded-md flex items-center justify-center transition-colors
          ${active 
            ? 'bg-zinc-200 text-zinc-900' 
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          }
        `}
        aria-label={label}
      >
        <Icon className="w-4 h-4" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {label}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-900" />
        </div>
      )}
    </div>
  );
};

const Toolbar = ({ onRun, onStop, onZoomIn, onZoomOut, onFitToScreen, onToggleGrid }) => {
  const [activeTool, setActiveTool] = useState('pointer');

  return (
    <div className="bg-white border-b border-zinc-200 px-4 py-2 flex items-center gap-1">
      {/* Selection Tools */}
      <div className="flex items-center gap-1 pr-3 border-r border-zinc-200">
        <ToolButton
          icon={Pointer}
          label="Select"
          onClick={() => setActiveTool('pointer')}
          active={activeTool === 'pointer'}
        />
        <ToolButton
          icon={Hand}
          label="Pan"
          onClick={() => setActiveTool('hand')}
          active={activeTool === 'hand'}
        />
        <ToolButton
          icon={Type}
          label="Text"
          onClick={() => setActiveTool('text')}
          active={activeTool === 'text'}
        />
      </div>

      {/* Simulation Controls */}
      <div className="flex items-center gap-1 px-3 border-r border-zinc-200">
        <ToolButton
          icon={Play}
          label="Run Simulation"
          onClick={onRun}
        />
        <ToolButton
          icon={Square}
          label="Stop"
          onClick={onStop}
        />
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-1 px-3 border-r border-zinc-200">
        <ToolButton
          icon={ZoomIn}
          label="Zoom In"
          onClick={onZoomIn}
        />
        <ToolButton
          icon={ZoomOut}
          label="Zoom Out"
          onClick={onZoomOut}
        />
        <ToolButton
          icon={Maximize2}
          label="Fit to Screen"
          onClick={onFitToScreen}
        />
      </div>

      {/* Display Options */}
      <div className="flex items-center gap-1 px-3">
        <ToolButton
          icon={Grid3x3}
          label="Toggle Grid"
          onClick={onToggleGrid}
        />
      </div>
    </div>
  );
};

export default Toolbar;
