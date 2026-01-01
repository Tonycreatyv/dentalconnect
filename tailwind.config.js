/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f14',
          900: '#101822',
          850: '#131e2a',
          800: '#162230',
          700: '#1b2a3a',
          600: '#2b3b4d',
          500: '#3c5168',
          400: '#506a86',
          300: '#6b88a8',
        },
        teal: {
          500: '#20c3b0',
          400: '#35d0bf',
          300: '#64e1d3',
        },
        cyan: {
          500: '#2dd4ff',
          400: '#47dbff',
        },
      },
      boxShadow: {
        card: '0 20px 40px rgba(4, 8, 12, 0.45)',
        subtle: '0 8px 24px rgba(4, 8, 12, 0.35)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
