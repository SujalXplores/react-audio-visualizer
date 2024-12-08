import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// @ts-ignore - Temporary fix for Vite 6 type issues
export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react'
  })],
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