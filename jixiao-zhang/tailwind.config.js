import { resolve } from 'path'
import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主色板
        'sakura': {
          DEFAULT: '#FFB7C5',
          deep: '#FF8FAB',
          light: '#FFE4E9',
        },
        'cream': '#FFF9F9',
        'warm-white': '#FFFFFF',
        // 辅色板
        'mint': {
          DEFAULT: '#A8E6CF',
          deep: '#7BC8A4',
        },
        'lavender': '#C7CEEA',
        'lemon': '#FFEAA7',
        'coral': '#FF8B94',
        'rose': '#E8567F',
        // 文字色
        'text-main': '#4A4A4A',
        'text-sub': '#A0A0A0',
        // 分割线
        'divider': '#F5E6E8',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'pink': '0 4px 12px rgba(255, 183, 197, 0.2)',
        'pink-lg': '0 8px 24px rgba(255, 183, 197, 0.25)',
      },
    },
  },
  plugins: [],
})
