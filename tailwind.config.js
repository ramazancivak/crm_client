/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bgPrimary':'#7991D8',
        'primary': '#6C798A', 
        'primaryDark': '#475F7B', 
        'secondary': '#4A90E2',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1660px',
    },
  },
  plugins: [],
}