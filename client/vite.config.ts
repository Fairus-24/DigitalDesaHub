import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: './',
  root: '.',
  plugins: [react()],
  resolve: {
    alias: {
      // pastikan ini:
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx'], // agar .tsx ter‑resolve
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
