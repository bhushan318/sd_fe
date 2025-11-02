import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Save, FolderOpen, Plus, Settings, Trash2 } from 'lucide-react';

// Custom Canvas-based Model Editor
function ModelCanvas({ nodes, edges, onNodesChange, onEdgesChange, selectedNode, onNodeSelect }) {
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const handleMouseDown = (e, nodeId) => {
    if (e.button !== 0) return;
    
    const node = nodes.find(n => n.id === nodeId);
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (e.shiftKey) {
      setConnectingFrom(nodeId);
    } else {
      setDraggedNode(nodeId);
      setDragOffset({
        x: mouseX - node.x,
        y: mouseY - node.y
      });
    }
    
    onNodeSelect(node);
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setMousePos({ x: mouseX, y: mouseY });
    
    if (draggedNode) {
      const newNodes = nodes.map(node => {
        if (node.id === draggedNode) {
          return {
            ...node,
            x: mouseX - dragOffset.x,
            y: mouseY - dragOffset.y
          };
        }
        return node;
      });
      onNodesChange(newNodes);
    }
  };

  const handleMouseUp = (e, targetNodeId = null) => {
    if (connectingFrom && targetNodeId && connectingFrom !== targetNodeId) {
      const newEdge = {
        id: `edge_${Date.now()}`,
        source: connectingFrom,
        target: targetNodeId
      };
      onEdgesChange([...edges, newEdge]);
    }
    
    setDraggedNode(null);
    setConnectingFrom(null);
  };

  const handleCanvasClick = (e) => {
    if (e.target === svgRef.current) {
      onNodeSelect(null);
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'stock': return { bg: '#3B82F6', border: '#1E40AF' };
      case 'flow': return { bg: '#10B981', border: '#047857' };
      case 'parameter': return { bg: '#8B5CF6', border: '#6D28D9' };
      case 'variable': return { bg: '#F59E0B', border: '#D97706' };
      default: return { bg: '#6B7280', border: '#374151' };
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'stock': return '📦';
      case 'flow': return '➡️';
      case 'parameter': return '⚙️';
      case 'variable': return '📊';
      default: return '⬜';
    }
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      style={{ cursor: draggedNode ? 'grabbing' : 'default', background: '#f9fafb' }}
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
        </pattern>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#6B7280" />
        </marker>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#grid)" />

      {edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const angle = Math.atan2(dy, dx);
        const sourceOffset = 60;
        const targetOffset = 60;

        const x1 = sourceNode.x + Math.cos(angle) * sourceOffset;
        const y1 = sourceNode.y + Math.sin(angle) * sourceOffset;
        const x2 = targetNode.x - Math.cos(angle) * targetOffset;
        const y2 = targetNode.y - Math.sin(angle) * targetOffset;

        return (
          <line
            key={edge.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6B7280"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        );
      })}

      {connectingFrom && (
        <line
          x1={nodes.find(n => n.id === connectingFrom)?.x || 0}
          y1={nodes.find(n => n.id === connectingFrom)?.y || 0}
          x2={mousePos.x}
          y2={mousePos.y}
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}

      {nodes.map(node => {
        const colors = getNodeColor(node.type);
        const isSelected = selectedNode?.id === node.id;

        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onMouseUp={(e) => handleMouseUp(e, node.id)}
            style={{ cursor: 'grab' }}
          >
            <rect
              x="-60"
              y="-35"
              width="120"
              height="70"
              rx="8"
              fill={colors.bg}
              stroke={isSelected ? '#FCD34D' : colors.border}
              strokeWidth={isSelected ? 3 : 2}
            />
            <text
              x="0"
              y="-15"
              textAnchor="middle"
              fill="white"
              fontSize="20"
            >
              {getNodeIcon(node.type)}
            </text>
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
            >
              {node.type.toUpperCase()}
            </text>
            <text
              x="0"
              y="20"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              {node.data.label.substring(0, 15)}
            </text>
          </g>
        );
      })}

      <text x="10" y="20" fill="#6B7280" fontSize="12">
        Click to select • Drag to move • Shift+Click to connect
      </text>
    </svg>
  );
}

export default function SystemDynamicsSimulator() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  
  const [simConfig, setSimConfig] = useState({
    startTime: 0,
    endTime: 100,
    timeStep: 1,
  });
  
  const nodeIdCounter = useRef(1);
  const fileInputRef = useRef(null);

  const addNode = (type) => {
    const id = `${type}_${nodeIdCounter.current++}`;
    const newNode = {
      id,
      type,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter.current - 1}`,
        initial: type === 'stock' ? 100 : undefined,
        value: type === 'parameter' ? 0.1 : undefined,
        equation: '',
      },
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodeData = (field, value) => {
    if (!selectedNode) return;
    
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: { ...node.data, [field]: value },
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, [field]: value },
    });
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    
    setNodes(nodes.filter(n => n.id !== selectedNode.id));
    setEdges(edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  const runSimulation = async () => {
    if (nodes.length === 0) {
      setError('Please add at least one stock to the model');
      return;
    }

    setIsSimulating(true);
    setShowResults(false);
    setError(null);

    try {
      const elements = nodes.map((node) => ({
        id: node.id,
        type: node.type,
        name: node.data.label,
        initial: parseFloat(node.data.initial) || 0,
        value: parseFloat(node.data.value) || null,
        equation: node.data.equation || '',
      }));

      const links = edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }));

      const payload = {
        elements,
        links,
        config: {
          start_time: parseFloat(simConfig.startTime),
          end_time: parseFloat(simConfig.endTime),
          time_step: parseFloat(simConfig.timeStep),
          method: 'euler',
        },
      };

      const response = await fetch('https://sd-backend-of5z.onrender.com/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSimulationResults(result);
        setShowResults(true);
        setError(null);
      } else {
        setError(result.error || 'Simulation failed');
      }
    } catch (error) {
      setError(`Failed to connect to backend: ${error.message}. Make sure the backend is running on https://sd-backend-of5z.onrender.com`);
    } finally {
      setIsSimulating(false);
    }
  };

  const saveModel = () => {
    const model = { nodes, edges, simConfig };
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-dynamics-model.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadModel = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const model = JSON.parse(e.target.result);
        setNodes(model.nodes || []);
        setEdges(model.edges || []);
        setSimConfig(model.simConfig || simConfig);
        
        const maxId = Math.max(
          ...model.nodes.map(n => {
            const match = n.id.match(/_(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          }),
          0
        );
        nodeIdCounter.current = maxId + 1;
        setError(null);
      } catch (error) {
        setError('Failed to load model: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const prepareChartData = () => {
    if (!simulationResults) return [];
    
    const { time, results } = simulationResults;
    return time.map((t, i) => {
      const point = { time: t };
      Object.keys(results).forEach((key) => {
        const node = nodes.find(n => n.id === key);
        if (node && node.type === 'stock') {
          point[node.data.label] = results[key][i];
        }
      });
      return point;
    });
  };

  const loadExample = () => {
    const exampleNodes = [
      {
        id: 'stock_1',
        type: 'stock',
        x: 400,
        y: 250,
        data: { label: 'Population', initial: 1000, equation: 'births - deaths' },
      },
      {
        id: 'flow_1',
        type: 'flow',
        x: 250,
        y: 150,
        data: { label: 'births', equation: 'birth_rate * Population' },
      },
      {
        id: 'flow_2',
        type: 'flow',
        x: 250,
        y: 350,
        data: { label: 'deaths', equation: 'death_rate * Population' },
      },
      {
        id: 'parameter_1',
        type: 'parameter',
        x: 100,
        y: 100,
        data: { label: 'birth_rate', value: 0.03 },
      },
      {
        id: 'parameter_2',
        type: 'parameter',
        x: 100,
        y: 400,
        data: { label: 'death_rate', value: 0.01 },
      },
    ];

    const exampleEdges = [
      { id: 'e1', source: 'parameter_1', target: 'flow_1' },
      { id: 'e2', source: 'stock_1', target: 'flow_1' },
      { id: 'e3', source: 'parameter_2', target: 'flow_2' },
      { id: 'e4', source: 'stock_1', target: 'flow_2' },
    ];

    setNodes(exampleNodes);
    setEdges(exampleEdges);
    nodeIdCounter.current = 3;
    setError(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">System Dynamics</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Add Elements</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNode('stock')}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Stock
            </button>
            <button
              onClick={() => addNode('flow')}
              className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Flow
            </button>
            <button
              onClick={() => addNode('parameter')}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Parameter
            </button>
            <button
              onClick={() => addNode('variable')}
              className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Variable
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
            <Settings size={16} /> Simulation Config
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600">Start Time</label>
              <input
                type="number"
                value={simConfig.startTime}
                onChange={(e) => setSimConfig({ ...simConfig, startTime: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">End Time</label>
              <input
                type="number"
                value={simConfig.endTime}
                onChange={(e) => setSimConfig({ ...simConfig, endTime: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Time Step</label>
              <input
                type="number"
                step="0.1"
                value={simConfig.timeStep}
                onChange={(e) => setSimConfig({ ...simConfig, timeStep: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Play size={16} /> {isSimulating ? 'Running...' : 'Run Simulation'}
          </button>
          <button
            onClick={saveModel}
            className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save Model
          </button>
          <label className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center justify-center gap-2 cursor-pointer">
            <FolderOpen size={16} /> Load Model
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={loadModel}
              className="hidden"
            />
          </label>
          <button
            onClick={loadExample}
            className="w-full px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
          >
            Load Example
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
            {error}
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <ModelCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        </div>

        {showResults && simulationResults && (
          <div className="h-80 bg-white border-t-2 border-gray-300 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Simulation Results</h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {nodes.filter(n => n.type === 'stock').map((node, i) => (
                  <Line
                    key={node.id}
                    type="monotone"
                    dataKey={node.data.label}
                    stroke={`hsl(${i * 60}, 70%, 50%)`}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {selectedNode && (
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Properties</h3>
            <button
              onClick={deleteSelected}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
              title="Delete element"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => updateNodeData('label', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {selectedNode.type === 'stock' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Value</label>
                  <input
                    type="number"
                    value={selectedNode.data.initial}
                    onChange={(e) => updateNodeData('initial', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equation (rate of change)
                  </label>
                  <textarea
                    value={selectedNode.data.equation}
                    onChange={(e) => updateNodeData('equation', e.target.value)}
                    className="w-full px-3 py-2 border rounded h-24 font-mono text-sm"
                    placeholder="e.g., inflow - outflow"
                  />
                </div>
              </>
            )}

            {selectedNode.type === 'parameter' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="number"
                  step="any"
                  value={selectedNode.data.value}
                  onChange={(e) => updateNodeData('value', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}

            {(selectedNode.type === 'flow' || selectedNode.type === 'variable') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equation</label>
                <textarea
                  value={selectedNode.data.equation}
                  onChange={(e) => updateNodeData('equation', e.target.value)}
                  className="w-full px-3 py-2 border rounded h-24 font-mono text-sm"
                  placeholder="e.g., rate * stock"
                />
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-600">
                <strong>Type:</strong> {selectedNode.type}
                <br />
                <strong>ID:</strong> {selectedNode.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}