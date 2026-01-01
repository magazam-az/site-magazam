import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Proxy target URL-i - buradan API URL-ləri alınır
const API_TARGET = 'https://api.magazam.az';

export default defineConfig(({ mode }) => ({
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

  // Keep dev logs, but strip console/debugger from production bundles
  esbuild: mode === 'production'
    ? { drop: ['console', 'debugger'] }
    : undefined,

  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Split big deps into cached vendor chunks (helps Lighthouse/Insights)
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          charts: ['chart.js', 'react-chartjs-2'],
          swiper: ['swiper'],
          ui: [
            'flowbite',
            'flowbite-react',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            'lucide-react',
            'react-icons',
            'react-toastify',
            'sweetalert2'
          ]
        }
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

    allowedHosts: ["magazam.az", "localhost"],

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
}))
