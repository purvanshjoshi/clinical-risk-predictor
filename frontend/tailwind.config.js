/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0284c7', // Sky 600 - Trust, Professionalism
        secondary: '#10b981', // Emerald 500 - Healing, Growth
        accent: '#f43f5e', // Rose 500 - Urgent/Important
        background: '#f8fafc', // Slate 50 - Clinical Cleanliness
      },
    },
  },
  plugins: [],
}
