// App.jsx
// Top-level component. Holds all shared state: nodes + selection.

import { useState } from 'react';
import Canvas from './components/Canvas';
import EditPanel from './components/EditPanel';
import { nodes as initialNodes, meta } from './data/flowData';

export default function App() {

  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  function handleSelectNode(id) {
    setSelectedNodeId(id);
  }

  function handleUpdateNodeText(id, newText) {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, text: newText } : node
      )
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col">

      <header className="h-16 flex items-center px-6 border-b border-connector-label-bg bg-panel shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-border-selected to-border-question" />
          <span className="font-bold text-sm">SupportFlow Builder</span>
        </div>

        <div className="ml-auto text-xs text-text-muted">Editor View</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <Canvas
            nodes={nodes}
            canvasSize={meta.canvas_size}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />
        </main>

        <aside className="w-80 bg-card border-l border-connector-label-bg p-5 overflow-auto shrink-0">
          <EditPanel
            node={selectedNode}
            onChangeText={handleUpdateNodeText}
          />
        </aside>
      </div>
    </div>
  );
}