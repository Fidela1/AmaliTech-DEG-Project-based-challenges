import { useState, useEffect, useCallback } from 'react';
import Canvas from './components/Canvas';
import EditPanel from './components/EditPanel';
import PreviewView from './components/PreviewView';
import { nodes as initialNodes, meta } from './data/flowData';

export default function App() {

  const [history, setHistory] = useState([initialNodes]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const nodes = history[historyIndex];
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('editor');
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingNodeType, setPendingNodeType] = useState(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const currentNode = nodes.find((n) => n.id === currentNodeId) || null;
  const startNode = nodes.find((n) => n.type === 'start');

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = useCallback(
    (newNodes) => {
      const trimmed = history.slice(0, historyIndex + 1);
      const next = [...trimmed, newNodes];
      setHistory(next);
      setHistoryIndex(next.length - 1);
    },
    [history, historyIndex]
  );

  function handleUndo() {
    if (!canUndo) return;
    setHistoryIndex((i) => i - 1);
  }

  function handleRedo() {
    if (!canRedo) return;
    setHistoryIndex((i) => i + 1);
  }

  useEffect(() => {
    function onKeyDown(e) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (mod && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        (mod && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [historyIndex, history]);
  function handleSelectNode(id) {
    setSelectedNodeId(id);
  }

  function handleUpdateNodeText(id, newText) {
    const newNodes = nodes.map((n) =>
      n.id === id ? { ...n, text: newText } : n
    );
    pushHistory(newNodes);
  }
  function handleMoveNode(id, x, y) {
    const newNodes = nodes.map((n) =>
      n.id === id ? { ...n, position: { x, y } } : n
    );
    pushHistory(newNodes);
  }

  function handleUpdateOption(nodeId, optionIndex, field, value) {
    const newNodes = nodes.map((n) => {
      if (n.id !== nodeId) return n;
      const newOptions = [...n.options];
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        [field]: value,
      };
      return { ...n, options: newOptions };
    });
    pushHistory(newNodes);
  }

  function handleDeleteNode(id) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    if (node.type === 'start') {
      alert('Cannot delete the Start node.');
      return;
    }

    const newNodes = nodes
      .filter((n) => n.id !== id)
      .map((n) => ({
        ...n,
        options: n.options ? n.options.filter((o) => o.nextId !== id) : [],
      }));

    pushHistory(newNodes);
    setSelectedNodeId(null);
  }

  function findEmptySlot(existingNodes) {
    const COL_WIDTH = 300;
    const ROW_HEIGHT = 320;
    const START_X = 60;
    const START_Y = 60;
    const MAX_COLS = 4;
    const MAX_ROWS = 4;
    const isOccupied = (x, y) =>
      existingNodes.some(
        (n) =>
          Math.abs(n.position.x - x) < 100 &&
          Math.abs(n.position.y - y) < 100
      );

    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const x = START_X + col * COL_WIDTH;
        const y = START_Y + row * ROW_HEIGHT;
        if (!isOccupied(x, y)) {
          return { x, y };
        }
      }
    }
    return { x: 60, y: START_Y + MAX_ROWS * ROW_HEIGHT };
  }

  function handleAddNode(type = 'question') {
    setPendingNodeType(type);
  }

  function handlePlaceNode(x, y) {
    if (!pendingNodeType) return;

    const maxId = nodes.reduce((max, n) => Math.max(max, parseInt(n.id) || 0), 0);
    const newId = String(maxId + 1);

    const defaults = {
      question: {
        type: 'question',
        text: 'New question — click to edit',
        options: [
          { label: 'Option 1', nextId: '' },
          { label: 'Option 2', nextId: '' },
        ],
      },
      end: {
        type: 'end',
        text: 'New end message — click to edit',
        options: [],
      },
    };

    const newNode = {
      id: newId,
      ...defaults[pendingNodeType],
      position: { x, y },
    };

    const newNodes = [...nodes, newNode];
    pushHistory(newNodes);
    setSelectedNodeId(newId);
    setPendingNodeType(null);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setPendingNodeType(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  function handleStartPreview() {
    setView('preview');
    setCurrentNodeId(startNode.id);
    setChatHistory([{ role: 'bot', text: startNode.text }]);
  }

  function handleExitPreview() {
    setView('editor');
    setCurrentNodeId(null);
    setChatHistory([]);
  }

  function handleAnswer(nextId, chosenLabel) {
    const nextNode = nodes.find((n) => n.id === nextId);
    if (!nextNode) return;
    setChatHistory((prev) => [
      ...prev,
      { role: 'user', text: chosenLabel },
      { role: 'bot', text: nextNode.text },
    ]);
    setCurrentNodeId(nextId);
  }

  function handleRestart() {
    setCurrentNodeId(startNode.id);
    setChatHistory([{ role: 'bot', text: startNode.text }]);
  }



  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col">

      <header className="relative h-16 flex items-center px-6 border-b border-connector-label-bg bg-panel shrink-0">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-border-selected to-border-question" />
          <span className="font-bold text-sm">SupportFlow Builder</span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-xs text-text-muted tracking-wide">
          {view === 'editor' ? 'Editor View' : 'Preview Mode'}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {view === 'editor' && (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search nodes..."
                className="bg-canvas border border-connector-label-bg focus:border-border-selected outline-none rounded-lg px-3 py-2 text-xs text-text-primary w-56 transition-colors"
              />

              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${canUndo
                      ? 'bg-card hover:bg-connector-label-bg border-connector-label-bg text-text-primary'
                      : 'bg-card border-connector-label-bg text-text-muted opacity-40 cursor-not-allowed'
                    }`}
                >
                  ↶
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y)"
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${canRedo
                      ? 'bg-card hover:bg-connector-label-bg border-connector-label-bg text-text-primary'
                      : 'bg-card border-connector-label-bg text-text-muted opacity-40 cursor-not-allowed'
                    }`}
                >
                  ↷
                </button>
              </div>

              <button
                onClick={handleStartPreview}
                className="flex items-center gap-2 bg-border-selected hover:bg-border-selected/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                ▶ Play
              </button>
            </>
          )}

          {view === 'preview' && (
            <button
              onClick={handleExitPreview}
              className="flex items-center gap-2 bg-card hover:bg-connector-label-bg border border-connector-label-bg text-text-primary text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Editor
            </button>
          )}
        </div>
      </header>


      {view === 'editor' ? (
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-8">
            <Canvas
              nodes={nodes}
              canvasSize={meta.canvas_size}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
              searchQuery={searchQuery}
              pendingNodeType={pendingNodeType}
              onPlaceNode={handlePlaceNode}
              onMoveNode={handleMoveNode}
            />
          </main>

          <aside className="w-96 bg-card border-l border-connector-label-bg p-5 overflow-auto shrink-0 flex flex-col">
            <EditPanel
              node={selectedNode}
              allNodes={nodes}
              onChangeText={handleUpdateNodeText}
              onChangeOption={handleUpdateOption}
              onDeleteNode={handleDeleteNode}
              onAddNode={handleAddNode}
              pendingNodeType={pendingNodeType}
            />
          </aside>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <PreviewView
            currentNode={currentNode}
            chatHistory={chatHistory}
            onAnswer={handleAnswer}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}