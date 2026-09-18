export default function ConnectorLabel({ from, to, label, nodeWidth, nodeHeight }) {
  if (!label) return null;

  const x1 = from.position.x + nodeWidth / 2;
  const y1 = from.position.y + nodeHeight;
  const x2 = to.position.x + nodeWidth / 2;
  const y2 = to.position.y;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 bg-connector-label-bg text-text-primary text-[10px] font-medium px-2.5 py-1 rounded-full border border-connector-line whitespace-nowrap pointer-events-none"
      style={{ left: midX, top: midY }}
    >
      {label}
    </div>
  );
}