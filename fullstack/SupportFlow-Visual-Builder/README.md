# SupportFlow Visual Builder

A visual editor for building chatbot conversation flows. Instead of editing a spreadsheet, support managers can see their bot's logic as a flowchart and test it instantly.

Built for the **AmaliTech DEG Project-Based Challenge**.

---

## Links

- **Live Demo:** 
- **Figma Design:** [View design file](https://www.figma.com/design/F4G40RE1RAQVjCtNQzSO2T/SupportFlow-Visual-Builder?node-id=1-2&p=f&t=a2K3RlZB3G0M9Xyx-0)
- **Original Challenge:** [AmaliTech repo](https://github.com/AmaliTech-Training-Academy/AmaliTech-DEG-Project-based-challenges/tree/main/fullstack/SupportFlow-Visual-Builder)

---

## What It Does

**Editor View**
- Shows the conversation as a flowchart — each question is a card, each answer is a line to the next card
- Click a card to edit its text — changes appear instantly
- Search for nodes by text — matches glow yellow, others fade

**Preview Mode**
- Click "Play" to test the bot as a customer would
- Answer questions in a chat interface
- The bot walks through the flow based on your choices
- Restart when you reach the end

**Undo / Redo**
- `Ctrl+Z` undoes your last edit
- `Ctrl+Y` redoes it

---

## The Wildcard Feature — Why I Added It

I added **Undo/Redo** and **Node Search** because they solve real problems for support managers:

- **Undo/Redo** — If a manager accidentally changes a question's wording, one keystroke brings it back. No need to remember the original text.
- **Node Search** — A large flow can have dozens of nodes. Search lets managers jump straight to the one they need instead of scrolling.

Both features cut down editing time and make the tool easier to use for non-technical staff.

---

## 🛠 Built With

- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling (custom components only)
- **Custom SVG** — Drawing the connector lines between nodes
- **React Hooks** — State management (`useState`, `useEffect`, `useRef`)

**No banned libraries:**
- No flowchart tools like `react-flow`, `jsPlumb`, or `mermaid.js`
- No UI kits like Material UI, Bootstrap, or Chakra UI

Everything is built from scratch.

---

## Run It Locally

```bash
# 1. Clone the repo
git clone https://github.com/Fidela1/AmaliTech-DEG-Project-based-challenges.git
cd AmaliTech-DEG-Project-based-challenges/fullstack/SupportFlow-Visual-Builder

# 2. Install packages
npm install

# 3. Start the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To make a production build:
```bash
npm run build
```

---

## Files & Folders

```
SupportFlow-Visual-Builder/
├── flow_data.json              ← data source (from the challenge)
├── tailwind.config.js          ← custom colors
├── vite.config.js
├── index.html
└── src/
    ├── App.jsx                 ← holds all the main state
    ├── index.css
    ├── main.jsx
    ├── data/
    │   └── flow_data.json      ← copy the app imports
    └── components/
        ├── Canvas.jsx          ← draws the flowchart area
        ├── NodeCard.jsx        ← one question card
        ├── Connector.jsx       ← the line between two cards
        ├── ConnectorLabel.jsx  ← the pill on a line
        ├── EditPanel.jsx       ← the edit sidebar
        └── PreviewView.jsx     ← the chat interface
```

---

## Design System

The colors come from a Figma design and are used everywhere in the app.

| Name | Hex | Where it's used |
|------|-----|-----------------|
| `canvas` | `#0F172A` | Page background |
| `card` | `#1E293B` | Node card background |
| `panel` | `#111827` | Top bar background |
| `border-start` | `#10B981` | Green — start nodes |
| `border-question` | `#3B82F6` | Blue — question nodes |
| `border-end` | `#EF4444` | Red — end nodes |
| `border-selected` | `#8B5CF6` | Purple — selected/hovered items |
| `text-primary` | `#F1F5F9` | Main text |
| `text-muted` | `#94A3B8` | Secondary text |
| `connector-line` | `#475569` | Lines between nodes |
| `connector-label-bg` | `#334155` | Divider and pill backgrounds |

Font: **Inter**.

---

## How It Works 

### Nodes
Each node has an `x` and `y` position in `flow_data.json`. The app places each card at those exact coordinates on a canvas.

### Connector Lines
The app draws an SVG curve from the bottom of a parent card to the top of its child card. A small arrow points to the child. This is done with a **bezier curve** — a smooth line that bends naturally.

### Undo / Redo
Every time you edit a node, the app saves a snapshot of all the nodes. Undo moves back one snapshot. Redo moves forward. Simple and reliable.

### Preview Mode
Preview walks through the flow. When you click an answer, the app finds the next node by its ID and shows the next question. When there are no more options, the conversation has ended.

### Search
The search box checks each node's text. Matching nodes glow yellow; non-matches dim so they don't distract.

---

## Screenshots

_(Add screenshots after deployment)_

**Editor View:**

![Editor View]()

**Preview Mode:**

![Preview Mode]()

**Search in Action:**

![Search]()

---

## What's Been Tested

- [x] All nodes appear at their correct positions
- [x] Connector lines are drawn between every parent and child
- [x] Clicking a node opens its edit panel
- [x] Editing text updates the canvas immediately
- [x] Preview mode walks through the flow correctly
- [x] Restart button appears at the end
- [x] Undo/redo works with buttons and keyboard
- [x] Search highlights matches and dims others
- [x] No console errors
- [x] Tested in an incognito window

---

## License

CC0 1.0 Universal — see `LICENSE` for details.

---

## Credits

- Challenge by [AmaliTech Training Academy](https://github.com/AmaliTech-Training-Academy)
- Design system built in Figma
- Built with React, Vite, and Tailwind CSS