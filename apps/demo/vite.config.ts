import { defaultClientConditions, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The demo consumes the package only through its public `exports` map.
// The `source` condition resolves those same public entry points to the
// package sources during development, so no build step is needed for HMR.
export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['source', ...defaultClientConditions],
    // `PROFILE=1 npm run build -w demo` keeps React's Profiler timings in production.
    alias: process.env.PROFILE ? { 'react-dom/client': 'react-dom/profiling' } : {},
  },
  server: { port: 5173, host: '127.0.0.1' },
});
