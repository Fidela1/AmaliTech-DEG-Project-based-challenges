import NodeCard from './NodeCard';
import Connector from './Connector';
import ConnectorLabel from './ConnectorLabel';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 200;

export default function Canvas({
  nodes,
  canvasSize,
  selectedNodeId,
  onSelectNode,
  searchQuery = '',
}) {

  const connections = [];
  for (const parent of nodes) {
    if (!parent.options) continue;
    for (const option of parent.options) {
      const child = nodes.find((n) => n.id === option.nextId);
      if (child) {
        connections.push({ from: parent, to: child });
      }
    }
  }

  return (
    <div
      className="relative bg-canvas overflow-hidden"
      style={{
        width: canvasSize.w,
        height: canvasSize.h,
        backgroundImage:
          'radial-gradient(circle, #1e293b 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={canvasSize.w}
        height={canvasSize.h}
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
        </defs>

        {connections.map((conn, i) => (
          <Connector
            key={i}
            from={conn.from}
            to={conn.to}
            nodeWidth={NODE_WIDTH}
            nodeHeight={NODE_HEIGHT}
          />
        ))}
      </svg>

{connections.map((conn, i) => {
  const option = conn.from.options?.find((o) => o.nextId === conn.to.id);
  return (
    <ConnectorLabel
      key={i}
      from={conn.from}
      to={conn.to}
      label={option?.label || ''}
      nodeWidth={NODE_WIDTH}
      nodeHeight={NODE_HEIGHT}
    />
  );
})}
      {nodes.map((node) => (
        <NodeCard
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          onClick={onSelectNode}
          searchQuery={searchQuery}
        />
      ))}
      {/* Empty state hint */}
{!selectedNodeId && (
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-text-muted bg-panel/80 px-3 py-1.5 rounded-full border border-connector-label-bg pointer-events-none">
    Click any node to edit · Ctrl+Z to undo
  </div>
)}
    </div>
  );
}