import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // базовый путь для сборки
  base: '/', // локально и на GitHub Pages, если хочешь другой - замени на '/Amaribot-clone/'

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: 'dist', // куда собирается проект
  }
})



