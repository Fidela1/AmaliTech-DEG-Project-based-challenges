import NodeCard from './NodeCard';
import Connector from './Connector';

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

      {nodes.map((node) => (
        <NodeCard
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          onClick={onSelectNode}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}