import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8's default bundler) only accepts manualChunks as
        // a function - the object form Rollup supported is no longer valid.
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/prettier/standalone')) {
            return 'prettier-core';
          }
          if (
            id.includes('node_modules/prettier/plugins/babel') ||
            id.includes('node_modules/prettier/plugins/estree') ||
            id.includes('node_modules/prettier/plugins/graphql')
          ) {
            return 'prettier-plugins';
          }
          if (
            id.includes('node_modules/xml-formatter') ||
            id.includes('node_modules/diff') ||
            id.includes('node_modules/react-copy-to-clipboard')
          ) {
            return 'utils';
          }
        },
      },
    },
  },
});