export function findNodeWithPath(tree, targetId, ancestors = []) {
  for (const node of tree) {
    const currentPath = [...ancestors, node];

    if (node.id === targetId) {
      return { node, path: currentPath };
    }

    if (node.children && node.children.length > 0) {
      const found = findNodeWithPath(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}

export function getFileType(name) {
  const ext = name.split('.').pop()?.toLowerCase();

  const types = {
    pdf: 'PDF Document',
    doc: 'Word Document',
    docx: 'Word Document',
    xls: 'Spreadsheet',
    xlsx: 'Spreadsheet',
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    svg: 'Vector Image',
    txt: 'Text File',
    ttf: 'Font File',
    yaml: 'Config File',
    yml: 'Config File',
    gitignore: 'Config File',
  };

  return types[ext] || 'File';
}

export function flattenVisibleTree(tree, expandedIds, depth = 0, parentId = null) {
  const result = [];

  for (const node of tree) {
    result.push({
      node,
      depth,
      parentId,
      isExpanded: expandedIds.has(node.id),
    });

    if (
      node.type === 'folder' &&
      expandedIds.has(node.id) &&
      node.children &&
      node.children.length > 0
    ) {
      result.push(
        ...flattenVisibleTree(node.children, expandedIds, depth + 1, node.id)
      );
    }
  }

  return result;
}