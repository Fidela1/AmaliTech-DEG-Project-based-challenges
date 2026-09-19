// App.jsx
// Top-level component for SecureVault Explorer.

import { useState } from 'react';
import Tree from './components/Tree';
import vaultData from './data/vaultData';

export default function App() {
  // Which folder IDs are currently expanded?
  // A Set is fast for lookups: expandedIds.has(id)
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Which file/folder ID is currently selected?
  const [selectedId, setSelectedId] = useState(null);

  // Toggle a folder open/closed
  function handleToggle(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Select a file
  function handleSelect(id) {
    setSelectedId(id);
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      {/* HEADER */}
      <header className="h-14 flex items-center px-5 border-b border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span className="font-semibold text-sm">SecureVault</span>
        </div>
        <div className="ml-auto text-xs text-text-tertiary">
          Encrypted File Explorer
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Tree */}
        <main className="flex-1 overflow-auto p-4">
          <Tree
            data={vaultData}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
        </main>

        {/* RIGHT: Properties panel placeholder */}
        <aside className="w-80 bg-bg-surface border-l border-border-subtle p-4">
          <h2 className="text-sm font-semibold mb-2">Properties</h2>
          <p className="text-xs text-text-tertiary">
            Select a file to view details.
          </p>
        </aside>
      </div>
    </div>
  );
}