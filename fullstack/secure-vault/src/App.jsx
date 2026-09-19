import { useState } from 'react';
import Tree from './components/Tree';
import PropertiesPanel from './components/PropertiesPanel';
import vaultData from './data/vaultData';
import { findNodeWithPath } from './utils/treeUtils';

export default function App() {

  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  function handleToggle(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelect(id) {
    setSelectedId(id);
  }

  const found = selectedId
    ? findNodeWithPath(vaultData, selectedId)
    : null;
  const selectedNode = found?.node || null;
  const path = found?.path || [];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">

      <header className="h-14 flex items-center px-5 border-b border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span className="font-semibold text-sm">SecureVault</span>
        </div>
        <div className="ml-auto text-xs text-text-tertiary">
          Encrypted File Explorer
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4">
          <Tree
            data={vaultData}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
        </main>

        <aside className="w-80 bg-bg-surface border-l border-border-subtle p-4 overflow-auto">
          <PropertiesPanel selectedNode={selectedNode} path={path} />
        </aside>
      </div>
    </div>
  );
}