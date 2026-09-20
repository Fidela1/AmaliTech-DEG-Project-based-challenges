import { useEffect, useRef } from 'react';

export default function TreeNode({
  node,
  depth = 0,
  expandedIds,
  selectedId,
  focusedId,
  matchedIds = new Set(),
  isSearching = false,
  onToggle,
  onSelect,
  onFocus,
}) {
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;

  const isMatch = isSearching && matchedIds.has(node.id);

  function hasMatchDescendant() {
    if (!isFolder || !hasChildren) return false;
    function walk(children) {
      for (const child of children) {
        if (matchedIds.has(child.id)) return true;
        if (child.children && walk(child.children)) return true;
      }
      return false;
    }
    return walk(node.children);
  }

  const isAncestorOfMatch = isSearching && hasMatchDescendant();
  const isDimmed = isSearching && !isMatch && !isAncestorOfMatch;

  const paddingLeft = 12 + depth * 20;

  function handleClick() {
    onFocus(node.id);
    if (isFolder) {
      onToggle(node.id);
    } else {
      onSelect(node.id);
    }
  }

  const rowRef = useRef(null);

  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isFocused]);

  let rowClass =
    'flex items-center gap-2 py-1.5 pr-3 rounded-md cursor-pointer select-none text-sm transition-all ';

  if (isFocused) {
    rowClass +=
      'bg-bg-elevated ring-1 ring-accent-primary shadow-[0_0_12px_rgba(34,211,238,0.35)] ';
  } else if (isSelected) {
    rowClass += 'bg-accent-muted/20 text-accent-primary ';
  } else if (isMatch) {
    rowClass += 'bg-accent-primary/10 text-accent-primary ';
  } else {
    rowClass += 'text-text-primary hover:bg-bg-elevated ';
  }

  if (isDimmed) {
    rowClass += 'opacity-30 ';
  }

  return (
    <div>
 
      <div
        ref={rowRef}
        onClick={handleClick}
        style={{ paddingLeft }}
        className={rowClass}
      >

        {isFolder ? (
          <span
            className={`text-text-tertiary text-[10px] transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        ) : (
          <span className="w-[10px]" />
        )}

        <span className="text-sm">
          {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>

        <span
          className={
            isFolder ? '' : 'font-mono text-text-mono text-[13px]'
          }
        >
          {node.name}
        </span>

        {!isFolder && node.size && (
          <span className="ml-auto text-text-tertiary text-xs font-mono">
            {node.size}
          </span>
        )}
      </div>

      {isFolder && isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              matchedIds={matchedIds}
              isSearching={isSearching}
              onToggle={onToggle}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  );
}