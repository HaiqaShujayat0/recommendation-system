/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand primary – Deep Teal-Blue (professional, clinical trust)
        primary: {
          50: '#edf4f8',
          100: '#d8e8f0',
          200: '#b0d1e1',
          300: '#84b5ce',
          400: '#5e9ab8',
          500: '#437d9d',
          600: '#356480',
          700: '#284B63',
          800: '#1e3d52',
          900: '#153243',
          950: '#0d1b26',
        },
        // Accent – Sage Green (natural, calm complement)
        accent: {
          50: '#f5f6f3',
          100: '#eef0eb',
          200: '#dcddd6',
          300: '#c8cbc0',
          400: '#b4b8ab',
          500: '#9ca18f',
          600: '#818778',
          700: '#6b7061',
          800: '#575b4e',
          900: '#3d403a',
          950: '#21231e',
        },
        // Secondary – Teal (calm, clinical context — for medical color coding)
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Surface tokens — creamy off-whites from palette
        surface: {
          50: '#F4F9E9',
          100: '#EEF0EB',
          200: '#e4e7df',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'card-lg': '0 10px 25px -5px rgba(0,0,0,0.06), 0 4px 10px -6px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'sidebar': '2px 0 8px rgba(0,0,0,0.04)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'check-bounce': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'check-bounce': 'check-bounce 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'bounce-dot': 'bounce-dot 1.2s infinite ease-in-out',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
