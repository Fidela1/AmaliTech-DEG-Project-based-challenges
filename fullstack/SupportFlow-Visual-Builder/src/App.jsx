// App.jsx
// Top-level component. Loads data and renders the editor layout.

import { useState } from 'react';
import Canvas from './components/Canvas';
import { nodes as initialNodes, meta } from './data/flowData';

export default function App() {

  const [nodes, setNodes] = useState(initialNodes);

  return (

    <div className="min-h-screen bg-canvas text-text-primary flex flex-col">

      <header className="h-16 flex items-center px-6 border-b border-connector-label-bg bg-panel">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-border-selected to-border-question" />
          <span className="font-bold text-sm">SupportFlow Builder</span>
        </div>

        <div className="ml-auto text-xs text-text-muted">Editor View</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <Canvas nodes={nodes} canvasSize={meta.canvas_size} />
        </main>

        <aside className="w-72 bg-card border-l border-connector-label-bg p-4">
          <h2 className="text-sm font-bold mb-3">Edit Node</h2>
          <p className="text-xs text-text-muted">
            Click a node to edit (coming in Phase 3)
          </p>
        </aside>
      </div>
    </div>
  );
}