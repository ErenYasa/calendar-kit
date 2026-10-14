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
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'react-dom/server'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['test/setup.ts'],
  },
});
