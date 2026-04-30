import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/harald/',
  server: {
    proxy: {
      '/harald/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
