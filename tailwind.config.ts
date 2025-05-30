import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#1A1A2E',
          text: '#E0E0EB',
          electric: '#00FFFF',
          magenta: '#FF1A75',
          darker: '#0F0F1A',
          lighter: '#2A2A3E',
          muted: '#B0B0BB',
        }
      },
      boxShadow: {
        'cyber-electric': '0 4px 6px -1px rgba(0, 255, 255, 0.1), 0 2px 4px -1px rgba(0, 255, 255, 0.06)',
        'cyber-magenta': '0 4px 6px -1px rgba(255, 26, 117, 0.1), 0 2px 4px -1px rgba(255, 26, 117, 0.06)',
      }
    },
  },
  plugins: [],
}

export default config 