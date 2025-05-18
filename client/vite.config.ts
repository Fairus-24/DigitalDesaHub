import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: './',  // arahkan ke folder client
  resolve: {
    alias: {
      // Alias @ mengarah ke client/src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: './dist',    // hasil build di root/dist
    emptyOutDir: true
  },
  plugins: [react()]
});
