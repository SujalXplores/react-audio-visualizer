import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [react(), terser()],
  root: 'playground',
  base: '/',
  build: {
    outDir: '../playground-dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
}); 