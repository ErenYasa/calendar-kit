// Public API. Everything not exported here is private.
// `calendar-kit` = `calendar-kit/core` + `calendar-kit/client`, without the
// 'use client' directive (so its pure helpers also work on the server).
export * from './core.js';
export { Calendar } from './react/Calendar.js';
export type * from './react/types.js';
