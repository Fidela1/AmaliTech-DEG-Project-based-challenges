# SecureVault Dashboard

A high-performance file explorer for deeply nested folder structures — built for SecureVault Inc. as part of the **AmaliTech DEG Project-Based Challenge**.

Instead of scrolling through a flat list, users navigate a proper tree: expand folders, select files, and see metadata instantly. All keyboard-navigable. Dark mode by design.

---

## Links

- **Live Demo:** https://amali-tech-deg-project-based-challe-kohl-chi.vercel.app/
- **Figma Design:** https://www.figma.com/design/87YCe2cCkmqVdNCGY7REWQ/SecureVault-Dashboard?node-id=0-1&p=f&t=0Gnr4uGw9F7wDJtq-0

---

## Features

### Core

- **Recursive Tree** — Renders the folder structure from `data.json`. Handles 2 levels or 20 with the same code. Every folder expands and collapses on click.
- **File Selection + Properties Panel:** Click any file to view its Name, Type, Size, and full Path in the right pane. The path is computed by walking the tree.
- **Keyboard Navigation:**  Navigate entirely without a mouse:
  - `↑` / `↓` : move focus between visible items
  - `→` : expand a folder, or move into it if already expanded
  - `←` : collapse a folder, or move to parent if already collapsed
  - `Enter` : select the focused item
  - The focused item shows a cyan glow ring — matches the design system's `glow/focus` token

### Wildcard Feature — Fuzzy Search with Auto-Expand

Type in the search bar to filter the tree by filename. Matching files highlight in cyan, and their **parent folders auto-expand** so matches are visible immediately. Non-matching items dim so the eye goes straight to results.

**Why I chose this:** The target user is a lawyer managing thousands of case files. Scrolling through folders to find one document is slow and frustrating. Search with auto-expand cuts finding time from minutes to seconds. It's the feature the brief didn't ask for but the user would immediately want.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS (custom components only) |
| State | React hooks (`useState`, `useEffect`, `useRef`) |
| Data | Static JSON (`data.json`) |
| Deployment | Vercel |

**No component libraries used:**  Bootstrap, Material UI, Chakra UI, and Ant Design were all avoided per the constraints.

---

## 🚀 Run Locally

```bash
git clone https://github.com/YOUR-USERNAME/AmaliTech-DEG-Project-based-challenges.git
cd AmaliTech-DEG-Project-based-challenges/fullstack/secure-vault
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To make a production build:
```bash
npm run build
npm run preview
```
---

## Recursive Strategy

The file structure is a **tree**: every folder has a `children` array, and each child is either another folder or a file.

The core of the UI is a **self-referential component**:

```jsx
function TreeNode({ node, depth }) {
  return (
    <div>
      {node.name}
      {node.children?.map(child => (
        <TreeNode node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
```

The `TreeNode` component renders itself for every child. `depth` increases by 1 at each level, which drives indentation (20px per level). The same code handles 2 levels or 200 — no special cases.

### Performance notes

- **Expanded folders** are stored in a `Set` (not an array) — `Set.has()` is O(1).
- **Keyboard navigation** uses a **flattened visible tree** (computed on every render). Moving down is just `index + 1`. The tree is linearized in one traversal.
- **Search** collects matches and their ancestor paths in one depth-first pass, then merges ancestors into the expanded set for auto-expansion.

---

## Design System

Colors and typography were defined in Figma first, then translated to Tailwind tokens:

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#0A0E14` | Page background |
| `bg-surface` | `#11161F` | Panels |
| `bg-elevated` | `#1A212E` | Hover states |
| `border-subtle` | `#1E2630` | Dividers |
| `border-default` | `#2A3441` | Card borders |
| `accent-primary` | `#22D3EE` | Selection, focus, search matches |
| `accent-muted` | `#0E7490` | Tinted backgrounds |
| `text-primary` | `#E5E7EB` | Main text |
| `text-secondary` | `#94A3B8` | Secondary text |
| `text-mono` | `#A5F3FC` | Filenames (monospace) |
| `text-mono` | `#A5F3FC` | Filenames |
| `danger` | `#F87171` | Warnings |
| `success` | `#4ADE80` | Success states |

**Typography:** Inter (UI) and JetBrains Mono (filenames, paths).

**Effects:** `shadow/card` (subtle depth) and `glow/focus` (cyan glow for keyboard focus).

Full design file: [Figma design](https://www.figma.com/design/87YCe2cCkmqVdNCGY7REWQ/SecureVault-Dashboard?node-id=0-1&p=f&t=0Gnr4uGw9F7wDJtq-0)

---

## ✅ Testing Checklist

- [x] Tree renders from `data.json`
- [x] Folders expand/collapse on click
- [x] Files select on click; properties panel updates
- [x] Keyboard: `↑` `↓` `←` `→` `Enter` all work
- [x] Focused item has cyan glow ring
- [x] Search highlights matches and auto-expands ancestors
- [x] Search shows match count
- [x] No console errors
- [x] Tested in incognito window
- [x] Deployed live on Vercel

---

## License

CC0 1.0 Universal — see `LICENSE` for details.

---

## 🙏 Credits

- Challenge by [AmaliTech Training Academy](https://github.com/AmaliTech-Training-Academy)
- Design system built in Figma
- Built with React, Vite, and Tailwind CSS