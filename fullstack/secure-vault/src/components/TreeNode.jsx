// TreeNode.jsx
// Renders a single node and recursively renders children when expanded.

export default function TreeNode({
  node,
  depth = 0,
  expandedIds,
  selectedId,
  focusedId,
  onToggle,
  onSelect,
  onFocus,
}) {
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;

  const paddingLeft = 12 + depth * 20;

  function handleClick() {
    onFocus(node.id);
    if (isFolder) {
      onToggle(node.id);
    } else {
      onSelect(node.id);
    }
  }

  // Build the row's class string
  // Priority: Focused > Selected > Default
  let rowClass =
    'flex items-center gap-2 py-1.5 pr-3 rounded-md cursor-pointer select-none text-sm transition-colors ';

  if (isFocused) {
    rowClass +=
      'bg-bg-elevated ring-1 ring-accent-primary shadow-[0_0_12px_rgba(34,211,238,0.35)] ';
  } else if (isSelected) {
    rowClass += 'bg-accent-muted/20 text-accent-primary ';
  } else {
    rowClass += 'text-text-primary hover:bg-bg-elevated ';
  }

  return (
    <div>
      <div
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

        <span className={isFolder ? '' : 'font-mono text-text-mono text-[13px]'}>
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