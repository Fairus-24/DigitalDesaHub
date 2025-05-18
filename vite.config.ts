import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client',  // arahkan ke folder client
  resolve: {
    alias: {
      // Alias @ mengarah ke client/src
      '@': path.resolve(__dirname, 'client/src')
    }
  },
  build: {
   // outDir: '../dist', 
    outDir: path.resolve(__dirname, '../server/client'),    // hasil build di root/dist
    emptyOutDir: true
  },
  plugins: [react(),]
  
});
