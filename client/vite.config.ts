import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
//   base: process.env.NODE_ENV === 'production' ? '/message-board/' : undefined,
  plugins: [react()],
  server: {
    proxy: {
      '/posts': 'http://localhost:3000',
      '/logout': 'http://localhost:3000'
    },
  },
});
