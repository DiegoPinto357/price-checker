import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: '../static',
  server: {
    port: 5174,
    watch: {
      ignored: ['/android/**'],
    },
  },
  optimizeDeps: {
    exclude: ['userData/*', 'userData-sandbox/*'],
  },
});
