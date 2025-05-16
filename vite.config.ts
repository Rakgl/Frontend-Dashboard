import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3000 // Match Dokploy’s expected port
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
})
