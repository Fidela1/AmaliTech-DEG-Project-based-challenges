import TreeNode from './TreeNode';

export default function Tree({
  data,
  expandedIds,
  selectedId,
  focusedId,
  onToggle,
  onSelect,
  onFocus,
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
          focusedId={focusedId}
          onToggle={onToggle}
          onSelect={onSelect}
          onFocus={onFocus}
        />
      ))}
    </div>
  );
}