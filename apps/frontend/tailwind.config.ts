import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        card: '#171717',
        accent: '#ff5a1f',
        text: '#ffffff'
      }
    }
  },
  plugins: []
} satisfies Config;
