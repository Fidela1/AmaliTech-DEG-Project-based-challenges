import TreeNode from './TreeNode';

export default function Tree({
  data,
  expandedIds,
  selectedId,
  focusedId,
  matchedIds,
  isSearching,
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
          matchedIds={matchedIds}
          isSearching={isSearching}
          onToggle={onToggle}
          onSelect={onSelect}
          onFocus={onFocus}
        />
      ))}
    </div>
  );
}