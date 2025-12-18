import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Proxy target URL-i - buradan API URL-ləri alınır
const API_TARGET = 'https://api-magazam.onrender.com/';

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

  // API Base URL-ləri proxy target-dan alınır
  // Development-da proxy istifadə olunur (relative path)
  // Production-da doğrudan target URL istifadə olunur
  define: {
    __API_TARGET__: JSON.stringify(API_TARGET),
    __API_BASE_URL__: JSON.stringify('/api/v1'), // Development: proxy üçün
    __CRUD_BASE_URL__: JSON.stringify('/crud/v1'), // Development: proxy üçün
    __API_BASE_URL_PROD__: JSON.stringify(`${API_TARGET}/api/v1`), // Production
    __CRUD_BASE_URL_PROD__: JSON.stringify(`${API_TARGET}/crud/v1`), // Production
  },

  server: {
    port: 3001,
    open: true,

    // 🔥 Proxy konfigurasiyası - target buradan alınır
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true
      },
      '/crud': {
        target: API_TARGET,
        changeOrigin: true
      }
    }
  }
})
