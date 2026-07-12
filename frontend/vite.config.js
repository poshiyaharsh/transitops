import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, './src/lib/lucide-react.tsx'),
      recharts: path.resolve(__dirname, './src/lib/recharts.tsx'),
    },
  },
})
