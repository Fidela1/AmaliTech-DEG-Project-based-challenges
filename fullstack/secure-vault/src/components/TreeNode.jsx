export default function TreeNode({
  node,
  depth = 0,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}) {

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const paddingLeft = 12 + depth * 20;

  function handleClick() {
    if (isFolder) {
      onToggle(node.id);
    } else {
      onSelect(node.id);
    }
  }

  return (
    <div>

      <div
        onClick={handleClick}
        style={{ paddingLeft }}
        className={`flex items-center gap-2 py-1.5 pr-3 rounded-md cursor-pointer select-none text-sm transition-colors ${
          isSelected
            ? 'bg-accent-muted/20 text-accent-primary'
            : 'text-text-primary hover:bg-bg-elevated'
        }`}
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
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}