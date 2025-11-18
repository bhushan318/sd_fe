import Header from './Header';
import RibbonMenu from './RibbonMenu';
import Toolbar from './Toolbar';
import { useProject } from '../../context/ProjectContext';


const AppLayout = ({ modelName, children }) => {
  // Placeholder callback handlers
  const handleRun = () => console.log('Run simulation');
  const handleStop = () => console.log('Stop simulation');
  const handleZoomIn = () => console.log('Zoom in');
  const handleZoomOut = () => console.log('Zoom out');
  const handleFitToScreen = () => console.log('Fit to screen');
  const handleToggleGrid = () => console.log('Toggle grid');

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Top Header */}
      <Header modelName={modelName} />
      {/* Ribbon Menu */}
      <RibbonMenu />

      {/* Quick Actions Toolbar */}
      <Toolbar
        onRun={handleRun}
        onStop={handleStop}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onToggleGrid={handleToggleGrid}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
