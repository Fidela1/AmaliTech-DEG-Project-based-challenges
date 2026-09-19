// Tree.jsx
// Renders the top-level items of the tree.
// It delegates each item to TreeNode, which handles the recursion.

import TreeNode from './TreeNode';

export default function Tree({
  data,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}) {
  return (
    <div className="py-2">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}