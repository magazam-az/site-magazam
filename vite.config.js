import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  base: '/',

  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },

  publicDir: 'public',

  server: {
    port: 3001,
    open: true,

    // 🔥 Buraya sənin göndərdiyin PROXY-ni əlavə etdim
    proxy: {
      '/api': {
        target: 'https://api-magazam.onrender.com/',
        changeOrigin: true
      },
      '/crud': {
        target: 'https://api-magazam.onrender.com/',
        changeOrigin: true
      }
    }
  }
})
