import { useState } from 'react';
import { useEffect } from 'react';
import Tree from './components/Tree';
import PropertiesPanel from './components/PropertiesPanel';
import vaultData from './data/vaultData';
import { findNodeWithPath, flattenVisibleTree } from './utils/treeUtils';

export default function App() {

  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);

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
  const flatList = flattenVisibleTree(vaultData, expandedIds);
  const focusedIndex = flatList.findIndex((item) => item.node.id === focusedId);

useEffect(() => {
  function onKeyDown(e) {
   
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
    if (!arrows.includes(e.key)) return;

    e.preventDefault();

    if (!focusedId && flatList.length > 0) {
      setFocusedId(flatList[0].node.id);
      return;
    }

    const current = flatList[focusedIndex];
    if (!current) return;

    const node = current.node;

    switch (e.key) {
      case 'ArrowDown': {
        const next = flatList[focusedIndex + 1];
        if (next) setFocusedId(next.node.id);
        break;
      }

      case 'ArrowUp': {
        const prev = flatList[focusedIndex - 1];
        if (prev) setFocusedId(prev.node.id);
        break;
      }

      case 'ArrowRight': {

        if (node.type === 'folder' && !current.isExpanded) {
          handleToggle(node.id);
        }
        else if (node.type === 'folder' && current.isExpanded && node.children?.length) {
          setFocusedId(node.children[0].id);
        }
        break;
      }

      case 'ArrowLeft': {
        if (node.type === 'folder' && current.isExpanded) {
          handleToggle(node.id);
        }
        else if (current.parentId) {
          setFocusedId(current.parentId);
        }
        break;
      }

      case 'Enter': {
        handleSelect(node.id);
        break;
      }
    }
  }

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [focusedId, focusedIndex, flatList, expandedIds]);
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
  focusedId={focusedId}
  onToggle={handleToggle}
  onSelect={handleSelect}
  onFocus={setFocusedId}
          />
        </main>

        <aside className="w-80 bg-bg-surface border-l border-border-subtle p-4 overflow-auto">
          <PropertiesPanel selectedNode={selectedNode} path={path} />
        </aside>
      </div>
    </div>
  );
}