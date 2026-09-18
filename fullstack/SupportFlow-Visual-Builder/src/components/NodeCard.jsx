export default function NodeCard({
  node,
  isSelected,
  onClick,
  searchQuery = '',
  onMouseDown,
  isDragging = false,
  dragOffset = { x: 0, y: 0 },
}) {
  const borderColor = {
    start: 'border-border-start',
    question: 'border-border-question',
    end: 'border-border-end',
  }[node.type];

  const dotColor = {
    start: 'bg-border-start',
    question: 'bg-border-question',
    end: 'bg-border-end',
  }[node.type];

  const typeLabel = {
    start: 'START',
    question: 'QUESTION',
    end: 'END',
  }[node.type];

  const query = searchQuery.trim().toLowerCase();
  const isMatch = query.length > 0 && node.text.toLowerCase().includes(query);

  const selectedClass = isSelected
    ? 'ring-2 ring-border-selected ring-offset-2 ring-offset-canvas shadow-[0_0_20px_rgba(139,92,246,0.4)]'
    : '';

  const matchClass = isMatch
    ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-canvas'
    : '';

  const dimClass = query.length > 0 && !isMatch ? 'opacity-30' : '';

  const dragClass = isDragging
    ? 'cursor-grabbing z-50 !shadow-2xl'
    : 'cursor-grab';

  const left = node.position.x + dragOffset.x;
  const top = node.position.y + dragOffset.y;

  return (
    <div
      onMouseDown={(e) => {
        onClick(node.id);
        if (onMouseDown) onMouseDown(e, node);
      }}
      style={{ left, top }}
      className={`absolute w-[220px] bg-card border-2 ${borderColor} rounded-xl shadow-lg p-4 flex flex-col gap-3 select-none hover:border-border-selected ${selectedClass} ${matchClass} ${dimClass} ${dragClass}`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-[11px] font-semibold tracking-widest text-text-muted">
          {typeLabel}
        </span>
      </div>

      <p className="text-sm text-text-primary leading-snug">{node.text}</p>

      {node.options && node.options.length > 0 && (
        <>
          <div className="h-px bg-connector-label-bg" />
          <div className="flex flex-col gap-2">
            {node.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-canvas rounded-md px-3 py-2 text-xs text-text-primary"
              >
                <span className="truncate">{option.label}</span>
                <span className="text-text-muted">→</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}