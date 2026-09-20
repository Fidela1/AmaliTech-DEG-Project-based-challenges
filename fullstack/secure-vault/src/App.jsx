import { useState, useEffect } from 'react';
import Tree from './components/Tree';
import PropertiesPanel from './components/PropertiesPanel';
import vaultData from './data/vaultData';
import {
  findNodeWithPath,
  flattenVisibleTree,
  findAllMatches,
} from './utils/treeUtils';

export default function App() {

  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const found = selectedId ? findNodeWithPath(vaultData, selectedId) : null;
  const selectedNode = found?.node || null;
  const path = found?.path || [];

  const matches = findAllMatches(vaultData, searchQuery);
  const matchedIds = new Set(matches.map((m) => m.node.id));

  const autoExpandIds = new Set();
  for (const { path: matchPath } of matches) {
    for (let i = 0; i < matchPath.length - 1; i++) {
      autoExpandIds.add(matchPath[i].id);
    }
  }

  const effectiveExpandedIds = new Set([
    ...expandedIds,
    ...autoExpandIds,
  ]);

  const flatList = flattenVisibleTree(vaultData, effectiveExpandedIds);
  const focusedIndex = flatList.findIndex((item) => item.node.id === focusedId);

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

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    setMobilePanelOpen(true);
  }
}

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
          } else if (
            node.type === 'folder' &&
            current.isExpanded &&
            node.children?.length
          ) {
            setFocusedId(node.children[0].id);
          }
          break;
        }
        case 'ArrowLeft': {
          if (node.type === 'folder' && current.isExpanded) {
            handleToggle(node.id);
          } else if (current.parentId) {
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
  }, [focusedId, focusedIndex, flatList, effectiveExpandedIds]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">

      <header className="h-14 flex items-center px-3 md:px-5 border-b border-border-subtle bg-bg-surface gap-2 md:gap-4">
  <div className="flex items-center gap-2 shrink-0">
    <span>🔒</span>
    <span className="font-semibold text-sm hidden sm:inline">SecureVault</span>
  </div>

  <div className="flex-1 flex justify-center min-w-0">
    <div className="relative w-full max-w-md">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">
        🔍
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="w-full bg-bg-elevated border border-border-default focus:border-accent-primary outline-none rounded-md pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs px-1.5"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  </div>

  <div className="text-xs text-text-tertiary hidden md:block shrink-0">
    {searchQuery
      ? `${matches.length} match${matches.length === 1 ? '' : 'es'}`
      : 'Encrypted File Explorer'}
  </div>
</header>

     <div className="flex flex-1 overflow-hidden">

  <main className="flex-1 overflow-auto p-2 md:p-4">
    <Tree
      data={vaultData}
      expandedIds={effectiveExpandedIds}
      selectedId={selectedId}
      focusedId={focusedId}
      matchedIds={matchedIds}
      isSearching={searchQuery.trim().length > 0}
      onToggle={handleToggle}
      onSelect={handleSelect}
      onFocus={setFocusedId}
    />
  </main>

  <aside className="hidden md:block w-80 bg-bg-surface border-l border-border-subtle p-4 overflow-auto shrink-0">
    <PropertiesPanel selectedNode={selectedNode} path={path} />
  </aside>
</div>

{mobilePanelOpen && (
  <div
    className="fixed inset-0 z-50 md:hidden bg-black/60 flex items-end"
    onClick={() => setMobilePanelOpen(false)}
  >
    <div
      className="w-full max-h-[80vh] bg-bg-surface border-t border-border-default rounded-t-2xl p-5 overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-text-primary">Properties</h2>
        <button
          onClick={() => setMobilePanelOpen(false)}
          className="text-text-tertiary hover:text-text-primary text-lg leading-none"
          title="Close"
        >
          ✕
        </button>
      </div>
      <PropertiesPanel selectedNode={selectedNode} path={path} />
    </div>
  </div>
)}
    </div>
  );
}