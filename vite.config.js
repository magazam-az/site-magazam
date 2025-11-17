import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

<<<<<<< HEAD
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],

=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    react()
  ],
>>>>>>> a0ff0f0880f16d1edb13bead9f63d14e48577c5a
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
<<<<<<< HEAD

  base: '/',

=======
  base: '/',
>>>>>>> a0ff0f0880f16d1edb13bead9f63d14e48577c5a
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
<<<<<<< HEAD

  publicDir: 'public',

  server: {
    port: 3001,
    open: true,

    // 🔥 Buraya sənin göndərdiyin PROXY-ni əlavə etdim
    proxy: {
      '/api': {
        target: 'http://localhost:3010/',
        changeOrigin: true
      },
      '/crud': {
        target: 'http://localhost:3010/',
        changeOrigin: true
      }
    }
  }
})
=======
  publicDir: 'public',
  server: {
    port: 3000,
    open: true
  }
})
>>>>>>> a0ff0f0880f16d1edb13bead9f63d14e48577c5a
