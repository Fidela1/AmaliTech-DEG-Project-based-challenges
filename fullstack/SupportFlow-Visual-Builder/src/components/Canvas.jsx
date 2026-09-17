
import NodeCard from './NodeCard';

export default function Canvas({ nodes, canvasSize }) {
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
      {nodes.map((node) => (
        <NodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}