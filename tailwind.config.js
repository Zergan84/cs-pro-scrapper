/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        csBg: "#0c0f14",
        csSurface: "#11141b",
        csCard: "#151a24",
        csBorder: "#222a38",
        csBorderLight: "#2d3748",
        csAmber: "#f59e0b",
        csAmberDark: "#d97706",
        csEmerald: "#10b981",
        csCyan: "#38bdf8",
        csRed: "#ef4444"
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
