/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aeris: {
          bg: '#0b0f17',
          surface: '#111726',
          'surface-raised': '#182032',
          'surface-overlay': '#1f2a40',
          border: '#243048',
          'border-subtle': '#1a2436',
          muted: '#8b9bb4',
          subtle: '#5c6c84',
          body: '#cbd5e1',
          heading: '#f1f5f9',
          accent: '#38bdf8', // crisp atmospheric cyan
          'accent-dim': '#0284c7',
        },
        aqi: {
          good: '#22c55e',
          moderate: '#eab308',
          sensitive: '#f97316',
          unhealthy: '#ef4444',
          veryUnhealthy: '#a855f7',
          hazardous: '#be123c',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
