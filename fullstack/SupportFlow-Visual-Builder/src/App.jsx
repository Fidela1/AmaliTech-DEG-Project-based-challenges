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
            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
              canUndo
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
            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
              canRedo
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
            />
          </main>

          <aside className="w-96 bg-card border-l border-connector-label-bg p-5 overflow-auto shrink-0">
            <EditPanel node={selectedNode} onChangeText={handleUpdateNodeText} />
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