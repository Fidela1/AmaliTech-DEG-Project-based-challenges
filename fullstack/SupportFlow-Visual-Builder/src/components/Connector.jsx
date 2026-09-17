
export default function Connector({ from, to, nodeWidth, nodeHeight }) {

  const x1 = from.position.x + nodeWidth / 2;
  const y1 = from.position.y + nodeHeight;
  const x2 = to.position.x + nodeWidth / 2;
  const y2 = to.position.y;
  const midY = (y1 + y2) / 2;

  const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <path
      d={path}
      stroke="#475569"
      strokeWidth={2}
      fill="none"
      markerEnd="url(#arrowhead)"
    />
  );
}