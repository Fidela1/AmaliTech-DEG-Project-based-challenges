export default function EditPanel({ node, onChangeText }) {

  if (!node) {
    return (
      <div className="text-sm text-text-muted">
        <h2 className="font-bold text-text-primary mb-2 text-base">
          Edit Node
        </h2>
        <p>Click a node on the canvas to edit it.</p>
      </div>
    );
  }

  const typeLabels = {
    start: 'Start Node',
    question: 'Question Node',
    end: 'End Node',
  };

  return (
    <div className="flex flex-col gap-5">

      <div>
        <h2 className="font-bold text-text-primary text-base mb-1">Edit Node</h2>
        <p className="text-xs text-text-muted">ID: {node.id}</p>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold block mb-2">
          Type
        </label>
        <div className="bg-canvas border border-connector-label-bg rounded-lg px-3 py-2 text-sm text-text-primary">
          {typeLabels[node.type]}
        </div>
      </div>

      {/* QUESTION TEXT (editable) */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold block mb-2">
          Question Text
        </label>
        <textarea
          value={node.text}
          onChange={(e) => onChangeText(node.id, e.target.value)}
          rows={4}
          className="w-full bg-canvas border border-connector-label-bg focus:border-border-selected outline-none rounded-lg px-3 py-2 text-sm text-text-primary resize-none transition-colors"
        />
      </div>

      {node.options && node.options.length > 0 && (
        <div>
          <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold block mb-2">
            Options ({node.options.length})
          </label>
          <ul className="flex flex-col gap-2">
            {node.options.map((option, index) => (
              <li
                key={index}
                className="bg-canvas border border-connector-label-bg rounded-lg px-3 py-2 text-xs text-text-primary flex items-center justify-between"
              >
                <span>{option.label}</span>
                <span className="text-text-muted">→ {option.nextId}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}