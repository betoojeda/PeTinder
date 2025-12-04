import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige las peticiones que empiezan con /api a tu backend
      '/api': {
        target: 'http://localhost:8080', // La URL de tu backend
        changeOrigin: true, // Necesario para vhosts
        secure: false,      // No verifica el certificado SSL
      },
    },
  },
})
