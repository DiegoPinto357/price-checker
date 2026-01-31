import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'es2020',
  platform: 'node',
  sourcemap: true,
  clean: true,
  minify: false,
  splitting: false,
  bundle: true,
  outExtension: () => ({ js: '.mjs' }),
  banner: {
    js: `import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);`,
  },
  onSuccess: 'echo "Build completed successfully!"',
});
