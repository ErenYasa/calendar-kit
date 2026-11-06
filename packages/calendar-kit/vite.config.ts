import { defineConfig } from 'vitest/config';

// Tests run in a DST-observing zone so date math is exercised across DST shifts.
process.env.TZ = 'America/New_York';

// Library build: ESM only, React/ReactDOM stay external (peer dependencies).
// Styles are compiled separately by `sass` so that JS never imports CSS.
export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: false,
    emptyOutDir: false,
    lib: {
      entry: { index: 'src/index.ts', core: 'src/core.ts', client: 'src/client.ts' },
      formats: ['es'],
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'react-dom/server'],
      // 'use client' is the first statement of the client entry and is kept
      // there (checked by test/build-output.test.ts); the generic warning is noise.
      onLog(level, log, handler) {
        if (log.code === 'MODULE_LEVEL_DIRECTIVE' && log.id?.endsWith('src/client.ts')) return;
        handler(level, log);
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['test/setup.ts'],
  },
});
