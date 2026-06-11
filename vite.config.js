import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'prettier-core': ['prettier/standalone'],
          'prettier-plugins': [
            'prettier/plugins/babel',
            'prettier/plugins/estree', 
            'prettier/plugins/graphql'
          ],
          'utils': ['xml-formatter', 'diff', 'react-copy-to-clipboard'],
        },
      },
    },
  },
});