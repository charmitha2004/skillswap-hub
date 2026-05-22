/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        'primary-light': '#2DD4BF',
        'primary-dark': '#0F766E',
        secondary: '#8B5CF6',
        'secondary-light': '#A855F7',
        'secondary-dark': '#6D28D9',
        accent: '#FF6B6B',
        background: '#0B131F',
        'background-light': '#111827',
        muted: '#94A3B8',
        surface: 'rgba(15, 23, 42, 0.72)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
