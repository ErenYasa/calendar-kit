import { type Ref, type RefCallback, useEffect, useLayoutEffect, useRef } from 'react';

/** Class name prefix. Single source of truth (mirrors `$prefix` in the SCSS). */
export const PREFIX = 'cal';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Ref holding the latest value; read it in effects/handlers so identity changes never re-trigger work. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  let out = '';
  for (const p of parts) if (p) out = out ? `${out} ${p}` : p;
  return out;
}

export function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref && typeof ref === 'object') (ref as { current: T | null }).current = value;
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    for (const r of refs) setRef(r, value);
  };
}

/** Runs the user handler first; the internal handler is skipped when the user called `preventDefault()`. */
export function composeHandlers<E extends { defaultPrevented: boolean }>(
  user: ((e: E) => void) | undefined,
  internal: (e: E) => void,
): (e: E) => void {
  return (e) => {
    user?.(e);
    if (!e.defaultPrevented) internal(e);
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function shallowEqualArray<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** Visually hidden but available to assistive technology (works unstyled too). */
export const srOnlyStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;
