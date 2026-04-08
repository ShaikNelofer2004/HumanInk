/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#05050A',
          800: '#0D0E15',
          primary: '#8E2DE2',
          secondary: '#4A00E0',
        }
      },
      animation: {
        'scan': 'scanList 2.5s infinite ease-in-out',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
      },
      keyframes: {
        scanList: {
          '0%': { top: '5%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '95%', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(142, 45, 226, 0.2))' },
          '50%': { filter: 'drop-shadow(0 0 35px rgba(142, 45, 226, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
