import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
    testTimeout: 10000,
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
