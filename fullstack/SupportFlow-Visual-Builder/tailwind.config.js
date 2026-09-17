/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your Figma design system colors
        canvas: '#0F172A',
        card: '#1E293B',
        panel: '#111827',
        'border-start': '#10B981',
        'border-question': '#3B82F6',
        'border-end': '#EF4444',
        'border-selected': '#8B5CF6',
        'text-primary': '#F1F5F9',
        'text-muted': '#94A3B8',
        'text-accent': '#8B5CF6',
        'connector-line': '#475569',
        'connector-label-bg': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}