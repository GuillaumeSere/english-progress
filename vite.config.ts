import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '../data/core': path.resolve(__dirname, 'data/core.ts'),
      './services/progressStore': path.resolve(__dirname, 'src/services/progressStore.ts'),
      './services/audioService': path.resolve(__dirname, 'src/services/audioService.ts'),
    },
  },
})
