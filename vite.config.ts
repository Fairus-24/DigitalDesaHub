import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    hmr: { host: '0.0.0.0' },
    allowedHosts: ['all', '66879da9-613f-46a6-a059-3d54160abda8-00-1kwxv2k1h4nwn.sisko.replit.dev']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),  // Map @ ke folder src
    },
  },
  build: {
    outDir: "dist",          // sesuai netlify.toml publish
    emptyOutDir: true,
  },
});
