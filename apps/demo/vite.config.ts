/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The demo imports only the public specifiers `calendar-kit` and
// `calendar-kit/styles.css`. For development (HMR, no package build step)
// those two public entry points are mapped to the workspace sources here;
// the published package itself only exposes `dist`.
const pkg = (path: string) => fileURLToPath(new URL(`../../packages/calendar-kit/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^calendar-kit$/, replacement: pkg('src/index.ts') },
      { find: /^calendar-kit\/styles\.css$/, replacement: pkg('src/styles/index.scss') },
      // `PROFILE=1 npm run build -w demo` keeps React's Profiler timings in production.
      ...(process.env.PROFILE ? [{ find: /^react-dom\/client$/, replacement: 'react-dom/profiling' }] : []),
    ],
  },
  server: { port: 5173, host: '127.0.0.1' },
  test: { environment: 'jsdom', include: ['test/**/*.test.tsx'] },
});
