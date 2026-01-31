import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: '../static',
  server: {
    port: 5174,
    strictPort: false,
    watch: {
      ignored: ['**/android/**', '**/src/server/**', '**/node_modules/**'],
    },
  },
  optimizeDeps: {
    include: [
      // Pre-bundle heavy dependencies for faster initial load
      '@ionic/react',
      '@ionic/react-router',
      '@nextui-org/react',
      'framer-motion',
      'react-query',
    ],
    exclude: ['userData/*', 'userData-sandbox/*'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ionic': ['@ionic/react', '@ionic/react-router'],
          'vendor': ['react', 'react-dom', 'react-dom/client'],
          'nextui': ['@nextui-org/react', 'framer-motion'],
        },
      },
    },
  },
});
