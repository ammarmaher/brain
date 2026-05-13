/*** Tailwind config - dark default, grid-first, Brain custom palette ***/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'falcon-blue': {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        'falcon-green': {
          DEFAULT: '#10b981',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        'falcon-red': {
          DEFAULT: '#ef4444',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        'brain-bg': {
          DEFAULT: '#0b0f17',
          surface: '#111827',
          panel: '#1f2937',
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      gridTemplateColumns: {
        'shell': '240px 1fr',
        'shell-collapsed': '64px 1fr',
      },
      gridTemplateRows: {
        'shell': '56px 1fr',
      },
    },
  },
  plugins: [],
};
