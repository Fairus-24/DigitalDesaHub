import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
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
