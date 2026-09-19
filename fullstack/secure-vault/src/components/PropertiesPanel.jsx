import { getFileType } from '../utils/treeUtils';

export default function PropertiesPanel({ selectedNode, path }) {

  if (!selectedNode) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-text-primary">Properties</h2>
        <p className="text-xs text-text-tertiary">
          Select a file to view details.
        </p>
      </div>
    );
  }

  const isFolder = selectedNode.type === 'folder';
  const fileType = isFolder ? 'Folder' : getFileType(selectedNode.name);

  const pathString = path
    .slice(0, -1)
    .map((n) => n.name)
    .join(' / ') || '/';

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-text-primary">Properties</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base">{isFolder ? '📁' : '📄'}</span>
          <span className="text-text-mono font-mono text-[13px] break-all">
            {selectedNode.name}
          </span>
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex flex-col gap-4">
        <Field label="NAME" value={selectedNode.name} mono />
        <Field label="TYPE" value={fileType} />
        {!isFolder && selectedNode.size && (
          <Field label="SIZE" value={selectedNode.size} mono />
        )}
        <Field label="PATH" value={pathString} mono small />
      </div>
    </div>
  );
}

function Field({ label, value, mono, small }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-text-secondary font-medium">
        {label}
      </span>
      <span
        className={`text-text-primary break-all ${
          mono ? 'font-mono' : ''
        } ${small ? 'text-xs' : 'text-sm'}`}
      >
        {value}
      </span>
    </div>
  );
}