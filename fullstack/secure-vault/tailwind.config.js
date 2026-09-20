/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your SecureVault design system colors
        'bg-base': '#0A0E14',
        'bg-surface': '#11161F',
        'bg-elevated': '#1A212E',
        'border-subtle': '#1E2630',
        'border-default': '#2A3441',
        'accent-primary': '#22D3EE',
        'accent-muted': '#0E7490',
        'text-primary': '#E5E7EB',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
        'text-mono': '#A5F3FC',
        'danger': '#F87171',
        'success': '#4ADE80',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}