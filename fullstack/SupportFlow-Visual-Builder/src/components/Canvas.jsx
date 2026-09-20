import { useEffect, useRef, useState } from 'react';
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
  pendingNodeType = null,
  onPlaceNode,
  onMoveNode,
}) {

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragOriginRef = useRef({
    mouseX: 0,
    mouseY: 0,
    nodeX: 0,
    nodeY: 0,
  });

  const connections = [];
  for (const parent of nodes) {
    if (!parent.options) continue;
    for (const option of parent.options) {
      if (!option.nextId) continue;
      const child = nodes.find((n) => n.id === option.nextId);
      if (child) {
        connections.push({ from: parent, to: child, option });
      }
    }
  }

  function handleNodeMouseDown(e, node) {
    if (e.button !== 0) return;
    if (pendingNodeType) return;

    e.stopPropagation();

    dragOriginRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.position.x,
      nodeY: node.position.y,
    };

    setDraggingId(node.id);
    setDragOffset({ x: 0, y: 0 });
  }

  function handleWindowMouseMove(e) {
    if (!draggingId) return;

    const origin = dragOriginRef.current;
    const dx = e.clientX - origin.mouseX;
    const dy = e.clientY - origin.mouseY;

    setDragOffset({ x: dx, y: dy });
  }

  function handleWindowMouseUp() {
    if (!draggingId) return;

    const origin = dragOriginRef.current;
    const offset = dragOffset;
    const movedEnough = Math.abs(offset.x) > 3 || Math.abs(offset.y) > 3;

    if (movedEnough && onMoveNode) {
      onMoveNode(
        draggingId,
        origin.nodeX + offset.x,
        origin.nodeY + offset.y
      );
    }

    setDraggingId(null);
    setDragOffset({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (!draggingId) return;

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };

  }, [draggingId, dragOffset]);

  function handleCanvasClick(e) {
    if (!pendingNodeType || !onPlaceNode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onPlaceNode(x, y);
  }

  return (
    <div
      onClick={handleCanvasClick}
      className={`relative bg-canvas overflow-hidden ${pendingNodeType ? 'cursor-crosshair' : ''
        } ${draggingId ? 'select-none' : ''}`}
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
        const duplicates = connections.filter(
          (c) => c.from.id === conn.from.id && c.to.id === conn.to.id
        );
        const isDuplicate = duplicates.length > 1;
        const duplicateIndex = duplicates.findIndex(
          (c) => c.option.label === conn.option.label
        );
        const offsetY = isDuplicate
          ? duplicateIndex === 0
            ? -14
            : 14
          : 0;

        return (
          <ConnectorLabel
            key={`label-${i}`}
            from={conn.from}
            to={conn.to}
            label={conn.option.label}
            nodeWidth={NODE_WIDTH}
            nodeHeight={NODE_HEIGHT}
            offsetY={offsetY}
          />
        );
      })}

      {pendingNodeType && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-border-selected text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg pointer-events-none z-50">
          Click anywhere to place the new {pendingNodeType} node · Esc to cancel
        </div>
      )}

      {nodes.map((node) => {
        const isDragging = draggingId === node.id;
        return (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onClick={onSelectNode}
            searchQuery={searchQuery}
            onMouseDown={handleNodeMouseDown}
            isDragging={isDragging}
            dragOffset={isDragging ? dragOffset : { x: 0, y: 0 }}
          />
        );
      })}

      
    </div>
  );
}