// TreeNode.jsx
// Renders a single node (folder or file) and, if expanded,
// recursively renders its children.

export default function TreeNode({
  node,
  depth = 0,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}) {
  // Is this node a folder or a file?
  const isFolder = node.type === 'folder';

  // Does this folder have children to render?
  const hasChildren = isFolder && node.children && node.children.length > 0;

  // Is it currently expanded?
  const isExpanded = expandedIds.has(node.id);

  // Is it currently selected?
  const isSelected = selectedId === node.id;

  // Indentation: 20px per depth level
  const paddingLeft = 12 + depth * 20;

  // ---- Click behavior ----
  // Folder → toggle expand/collapse
  // File   → select it
  function handleClick() {
    if (isFolder) {
      onToggle(node.id);
    } else {
      onSelect(node.id);
    }
  }

  return (
    <div>
      {/* -------- THE ROW -------- */}
      <div
        onClick={handleClick}
        style={{ paddingLeft }}
        className={`flex items-center gap-2 py-1.5 pr-3 rounded-md cursor-pointer select-none text-sm transition-colors ${
          isSelected
            ? 'bg-accent-muted/20 text-accent-primary'
            : 'text-text-primary hover:bg-bg-elevated'
        }`}
      >
        {/* Chevron for folders — rotates when expanded */}
        {isFolder ? (
          <span
            className={`text-text-tertiary text-[10px] transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        ) : (
          // Invisible spacer so files align with folders
          <span className="w-[10px]" />
        )}

        {/* Icon */}
        <span className="text-sm">
          {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>

        {/* Name */}
        <span className={isFolder ? '' : 'font-mono text-text-mono text-[13px]'}>
          {node.name}
        </span>

        {/* Size for files */}
        {!isFolder && node.size && (
          <span className="ml-auto text-text-tertiary text-xs font-mono">
            {node.size}
          </span>
        )}
      </div>

      {/* -------- RECURSION -------- */}
      {/* If it's an expanded folder with children, render them. */}
      {/* We call TreeNode for each child — same component, one level deeper. */}
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