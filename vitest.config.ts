import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTest.ts',
    testTimeout: 10000,
    // Exclude Playwright E2E tests from Vitest
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/tests/e2e/**', // Exclude Playwright E2E tests
    ],
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
