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
    exclude: ['userData/*', 'userData-sandbox/*'],
  },
});
