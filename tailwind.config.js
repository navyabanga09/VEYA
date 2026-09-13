/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        veya: {
          bg: '#0a0a0f',
          surface: '#15151f',
          'surface-2': '#1c1c28',
          border: '#2a2a3a',
          text: '#f5f5f7',
          'text-dim': '#9ca3af',
          lavender: '#c4b5fd',
          'lavender-bright': '#a78bfa',
          chrome: '#e2e8f0',
          safe: '#34d399',
          caution: '#fbbf24',
          risk: '#f87171',
          sos: '#ef4444',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'countdown': 'countdownPulse 1s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'sheet-up': 'sheetUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
