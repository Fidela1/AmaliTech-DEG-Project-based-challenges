export default function EditPanel({
  node,
  allNodes = [],
  onChangeText,
  onChangeOption,
  onDeleteNode,
  onAddNode,
  pendingNodeType,
}) {
  const isStart = node?.type === 'start';

  const typeLabels = {
    start: 'Start Node',
    question: 'Question Node',
    end: 'End Node',
  };

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 h-full">

      <div className="flex gap-2">
        <button
          onClick={() => onAddNode('question')}
          className={`flex-1 border border-dashed text-xs font-medium py-2.5 rounded-lg transition-colors cursor-pointer ${pendingNodeType === 'question'
              ? 'bg-border-question/20 border-border-question text-border-question'
              : 'border-border-question text-border-question hover:bg-border-question/10'
            }`}
        >
          {pendingNodeType === 'question' ? '● Placing…' : '+ Question'}
        </button>

        <button
          onClick={() => onAddNode('end')}
          className={`flex-1 border border-dashed text-xs font-medium py-2.5 rounded-lg transition-colors cursor-pointer ${pendingNodeType === 'end'
              ? 'bg-border-end/20 border-border-end text-border-end'
              : 'border-border-end text-border-end hover:bg-border-end/10'
            }`}
        >
          {pendingNodeType === 'end' ? '● Placing…' : '+ End'}
        </button>
      </div>

      <div className="h-px bg-connector-label-bg" />
      {!node && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-sm text-text-muted">
            Click a node on the canvas to edit it
          </p>
          <p className="text-xs text-text-muted">
            or use the buttons above to add a new one
          </p>
        </div>
      )}

      {/* ============ NORMAL EDIT STATE ============ */}
      {node && (
        <>
          {/* HEADER */}
          <div>
            <h2 className="font-bold text-text-primary text-base mb-1">
              Edit Node
            </h2>
            <p className="text-xs text-text-muted">ID: {node.id}</p>
          </div>

          {/* TYPE */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Type
            </label>
            <div className="bg-canvas border border-connector-label-bg rounded-lg px-3 py-2.5 text-sm text-text-primary">
              {typeLabels[node.type]}
            </div>
          </div>

          {/* QUESTION TEXT */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              {node.type === 'end' ? 'Message Text' : 'Question Text'}
            </label>
            <textarea
              value={node.text}
              onChange={(e) => onChangeText(node.id, e.target.value)}
              rows={4}
              className="w-full bg-canvas border border-connector-label-bg focus:border-border-selected outline-none rounded-lg px-3 py-2 text-sm text-text-primary resize-none transition-colors"
            />
          </div>

          {node.options && node.options.length > 0 && (
            <div className="flex flex-col gap-3">
              <label className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                Options ({node.options.length})
              </label>

              {node.options.map((option, index) => (
                <div
                  key={index}
                  className="bg-canvas border border-connector-label-bg rounded-lg p-3 flex flex-col gap-2"
                >

                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onChangeOption(node.id, index, 'label', e.target.value)
                    }
                    placeholder="Option label"
                    className="w-full bg-transparent border-b border-connector-label-bg focus:border-border-selected outline-none text-sm text-text-primary pb-1 transition-colors"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">
                      → next
                    </span>
                    <select
                      value={option.nextId || ''}
                      onChange={(e) =>
                        onChangeOption(node.id, index, 'nextId', e.target.value)
                      }
                      className="flex-1 bg-panel border border-connector-label-bg focus:border-border-selected outline-none rounded-md px-2 py-1.5 text-xs text-text-primary cursor-pointer transition-colors"
                    >
                      <option value="">— none —</option>
                      {allNodes
                        .filter((n) => n.id !== node.id)
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            #{n.id} — {n.text.slice(0, 30)}
                            {n.text.length > 30 ? '…' : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex-1" />
          {!isStart && (
            <button
              onClick={() => {
                if (
                  confirm(
                    `Delete node ${node.id}? This will also remove any options pointing to it.`
                  )
                ) {
                  onDeleteNode(node.id);
                }
              }}
              className="w-full bg-border-end/10 hover:bg-border-end/20 border border-border-end text-border-end text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer"
            >
              🗑 Delete Node
            </button>
          )}

          {isStart && (
            <p className="text-[10px] text-text-muted text-center py-3 border border-dashed border-connector-label-bg rounded-lg">
              Start node cannot be deleted
            </p>
          )}
        </>
      )}
    </div>
  );
}