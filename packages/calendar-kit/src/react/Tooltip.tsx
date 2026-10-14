import { type ReactNode, type Ref, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipBoundary, TooltipPlacement } from './types.js';
import { mergeRefs, useIsomorphicLayoutEffect } from './utils.js';

const PAD = 8;
const THEME_VARS = ['--cal-tooltip-bg', '--cal-tooltip-color', '--cal-tooltip-shadow', '--cal-tooltip-max-width'];

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface TooltipPosition {
  x: number;
  y: number;
  placement: TooltipPlacement;
  /** Arrow offset along the tooltip edge facing the anchor. */
  arrow: number;
  hidden: boolean;
}

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Pure placement. Tries the preferred side, its opposite, then the remaining
 * sides, and takes the first where the tooltip fits completely inside
 * `bounds`; along the other axis it is shifted (never cut) to stay inside.
 * If no side fits, the side with the most room is used. Exported for tests.
 */
export function computeTooltipPosition(
  anchor: { left: number; top: number; width: number; height: number },
  tip: { width: number; height: number },
  bounds: Rect,
  preferred: TooltipPlacement,
  offset: number,
  clip?: Rect | null,
): TooltipPosition {
  const cx = anchor.left + anchor.width / 2;
  const cy = anchor.top + anchor.height / 2;
  const area = clip ?? bounds;
  const hidden = cx < area.left || cx > area.right || cy < area.top || cy > area.bottom;
  const clampX = (x: number) => Math.min(Math.max(x, bounds.left + PAD), Math.max(bounds.left + PAD, bounds.right - PAD - tip.width));
  const clampY = (y: number) => Math.min(Math.max(y, bounds.top + PAD), Math.max(bounds.top + PAD, bounds.bottom - PAD - tip.height));
  const place = (p: TooltipPlacement) => {
    switch (p) {
      case 'top':
        return { x: clampX(cx - tip.width / 2), y: anchor.top - offset - tip.height };
      case 'bottom':
        return { x: clampX(cx - tip.width / 2), y: anchor.top + anchor.height + offset };
      case 'left':
        return { x: anchor.left - offset - tip.width, y: clampY(cy - tip.height / 2) };
      default:
        return { x: anchor.left + anchor.width + offset, y: clampY(cy - tip.height / 2) };
    }
  };
  const fits = ({ x, y }: { x: number; y: number }) =>
    x >= bounds.left + PAD - 0.5 && y >= bounds.top + PAD - 0.5 && x + tip.width <= bounds.right - PAD + 0.5 && y + tip.height <= bounds.bottom - PAD + 0.5;

  const side: TooltipPlacement[] = preferred === 'left' || preferred === 'right' ? ['top', 'bottom'] : ['right', 'left'];
  const order = [preferred, OPPOSITE[preferred], ...side];
  let placement = order.find((p) => fits(place(p)));
  let { x, y } = placement ? place(placement) : { x: 0, y: 0 };
  if (!placement) {
    const room: Record<TooltipPlacement, number> = {
      top: anchor.top - bounds.top,
      bottom: bounds.bottom - anchor.top - anchor.height,
      left: anchor.left - bounds.left,
      right: bounds.right - anchor.left - anchor.width,
    };
    placement = (['top', 'bottom'] as const).reduce((a, b) => (room[b] > room[a] ? b : a), preferred === 'bottom' ? 'bottom' : 'top');
    // Nothing fits: keep the whole tooltip inside the bounds (it may then
    // overlap the anchor, but its text is never cut off).
    ({ x, y } = place(placement));
    y = clampY(y);
  }
  const vertical = placement === 'top' || placement === 'bottom';
  const arrow = vertical ? Math.min(Math.max(cx - x, 10), Math.max(10, tip.width - 10)) : Math.min(Math.max(cy - y, 10), Math.max(10, tip.height - 10));
  return { x, y, placement, arrow, hidden };
}

export interface TooltipProps {
  id: string;
  anchor: HTMLElement | null;
  /** Element that clips the anchor (the months viewport); also the `calendar` boundary. */
  clipElement?: HTMLElement | null;
  /** Element whose theme (tooltip CSS variables, font) the portalled tooltip copies. */
  themeSource?: HTMLElement | null;
  /** Vertical limits (viewport px) of the area the tooltip may use in `calendar` mode. */
  getArea?: () => { top?: number; bottom?: number };
  boundary: TooltipBoundary;
  placement: TooltipPlacement;
  offset: number;
  className: string;
  arrowClassName: string;
  container: HTMLElement | null | undefined;
  children: (placement: TooltipPlacement) => ReactNode;
  tooltipRef?: Ref<HTMLDivElement>;
}

function intersect(a: Rect, b: Rect): Rect {
  return { left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) };
}

/**
 * Fixed-position tooltip in a portal: never clipped by the calendar's scroll
 * area. With `boundary="calendar"` it stays inside the calendar's months area
 * (it never covers the header/weekday row above the scroll area and never
 * leaves the calendar); its max width follows the boundary so text wraps
 * instead of being cut. The anchor is passed as an element ref — no DOM
 * queries. Repositions on scroll (capture) and resize, coalesced with rAF.
 */
export function Tooltip(props: TooltipProps) {
  const { anchor, placement, offset, clipElement, boundary } = props;
  const elRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<(TooltipPosition & { tx: number; ty: number; maxWidth: number }) | null>(null);
  const [theme, setTheme] = useState<Record<string, string>>({});
  // Translation currently applied to the element. Comparing it with the
  // element's on-screen rect gives the origin of its containing block: not
  // the viewport when the portal container (or an ancestor) has a transform,
  // filter or contain, where position: fixed becomes relative to that box.
  const appliedRef = useRef({ x: 0, y: 0 });

  useEffect(() => setMounted(true), []);

  // The portal leaves the calendar's subtree, so CSS variables set on the
  // calendar root would not reach the tooltip: copy the few it uses.
  const themeSource = props.themeSource;
  useIsomorphicLayoutEffect(() => {
    if (!mounted || !themeSource) return;
    const cs = getComputedStyle(themeSource);
    const next: Record<string, string> = {};
    for (const name of THEME_VARS) {
      const v = cs.getPropertyValue(name).trim();
      if (v) next[name] = v;
    }
    if (cs.fontFamily) next.fontFamily = cs.fontFamily;
    setTheme((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [mounted, themeSource, anchor]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !anchor) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = elRef.current;
      if (!el || !anchor.isConnected) return;
      const viewport: Rect = { left: 0, top: 0, right: document.documentElement.clientWidth || window.innerWidth, bottom: window.innerHeight };
      const clip = clipElement?.getBoundingClientRect();
      let bounds = boundary === 'calendar' && clip ? intersect(viewport, clip) : viewport;
      if (boundary === 'calendar') {
        const area = props.getArea?.();
        if (area) bounds = { ...bounds, top: Math.max(bounds.top, area.top ?? -Infinity), bottom: Math.min(bounds.bottom, area.bottom ?? Infinity) };
      }
      const maxWidth = Math.max(80, Math.floor(bounds.right - bounds.left - 2 * PAD));
      const next = computeTooltipPosition(
        anchor.getBoundingClientRect(),
        { width: Math.min(el.offsetWidth, maxWidth), height: el.offsetHeight },
        bounds,
        placement,
        offset,
        clip ? intersect(viewport, clip) : viewport,
      );
      const own = el.getBoundingClientRect();
      const origin = { x: own.left - appliedRef.current.x, y: own.top - appliedRef.current.y };
      const tx = Math.round(next.x - origin.x);
      const ty = Math.round(next.y - origin.y);
      setPos((p) =>
        p && p.tx === tx && p.ty === ty && p.placement === next.placement && p.hidden === next.hidden && p.arrow === next.arrow && p.maxWidth === maxWidth
          ? p
          : { ...next, tx, ty, maxWidth },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(anchor);
    if (elRef.current) ro?.observe(elRef.current);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      ro?.disconnect();
    };
  }, [mounted, anchor, placement, offset, clipElement, boundary]);

  if (!mounted || !anchor) return null;
  const container = props.container ?? document.body;
  const p = pos ?? { tx: 0, ty: 0, placement, arrow: 0, hidden: true, maxWidth: undefined };
  appliedRef.current = { x: p.tx, y: p.ty };
  return createPortal(
    <div
      ref={mergeRefs(elRef, props.tooltipRef)}
      id={props.id}
      role="tooltip"
      className={props.className}
      data-placement={p.placement}
      style={{
        ...theme,
        position: 'fixed',
        top: 0,
        left: 0,
        // Width must not depend on the portal container's width (fixed elements
        // inside a transformed box size against that box).
        width: 'max-content',
        maxWidth: p.maxWidth ? `min(var(--cal-tooltip-max-width, 280px), ${p.maxWidth}px)` : undefined,
        transform: `translate3d(${p.tx}px, ${p.ty}px, 0)`,
        visibility: p.hidden || !pos ? 'hidden' : 'visible',
        pointerEvents: 'none',
        ['--cal-tooltip-arrow' as string]: `${Math.round(p.arrow)}px`,
      }}
    >
      {props.children(p.placement)}
      <span className={props.arrowClassName} aria-hidden="true" />
    </div>,
    container,
  );
}
