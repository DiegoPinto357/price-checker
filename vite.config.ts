/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: '../static',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
    onConsoleLog(log) {
      if (
        log.includes(
          'stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.'
        )
      )
        return false;
    },
  },
});
