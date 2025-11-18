import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: false,
  dts: true,
  shims: true,
  splitting: false,
  bundle: true,
  // Add shebang to output
  banner: {
    js: '#!/usr/bin/env node',
  },
  // External packages that should not be bundled
  external: [],
  // Copy templates directory to dist
  onSuccess: 'node scripts/copy-templates.cjs',
});
