import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());

// Deterministic container width for layout tests (jsdom has no layout engine).
const g = globalThis as unknown as { __width: number };
g.__width = 800;
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() {
    return g.__width;
  },
});

// Synchronous rAF keeps coalesced notifications deterministic.
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
  cb(0);
  // 0 = "no pending frame", matching the state after a real frame has run.
  return 0;
};
globalThis.cancelAnimationFrame = () => {};

type ROCallback = (entries: unknown[], ro: unknown) => void;
const observers = new Set<{ cb: ROCallback; targets: Set<Element> }>();
class MockResizeObserver {
  private entry: { cb: ROCallback; targets: Set<Element> };
  constructor(cb: ROCallback) {
    this.entry = { cb, targets: new Set() };
    observers.add(this.entry);
  }
  observe(el: Element) {
    this.entry.targets.add(el);
  }
  unobserve(el: Element) {
    this.entry.targets.delete(el);
  }
  disconnect() {
    observers.delete(this.entry);
  }
}
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = MockResizeObserver;

/** Sets the simulated container width and notifies every ResizeObserver. */
export function resizeTo(width: number) {
  g.__width = width;
  for (const o of [...observers]) o.cb([], o);
}

HTMLElement.prototype.scrollIntoView = function () {};
