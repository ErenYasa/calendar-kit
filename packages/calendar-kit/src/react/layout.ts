import { type CalendarMonth, addMonthsToMonth, diffMonths, eachMonth } from '../date/calendarDate';
import type { CalendarLayout, NavigationMode, Orientation, OverflowStrategy } from './types';

/** Inline padding of a month (px). Mirrored to CSS through `--cal-month-padding`. */
export const MONTH_PADDING_INLINE = 8;
export const DEFAULT_MIN_DAY_SIZE = 40;
export const DEFAULT_MAX_DAY_SIZE = 56;
export const DEFAULT_MONTH_GAP = 32;

export interface LayoutInput {
  orientation: Orientation;
  navigation: NavigationMode;
  requestedMonths: number;
  monthPosition: number;
  overflow: OverflowStrategy;
  minDayWidth: number;
  monthGap: number;
  containerWidth: number | null;
  direction: 'ltr' | 'rtl';
}

export function sanitizeCount(n: number | undefined, fallback: number): number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

/** Minimum month width: 7 day columns (no column gap) + inline padding on both sides. */
export function getMinMonthWidth(minDayWidth: number): number {
  return 7 * minDayWidth + 2 * MONTH_PADDING_INLINE;
}

/**
 * Pure layout decision. With an unknown width (SSR, first paint, hidden
 * containers) the requested layout is used unchanged; CSS keeps it usable
 * until the first measurement arrives.
 */
export function computeLayout(i: LayoutInput): CalendarLayout {
  const requested = i.requestedMonths;
  const pos = Math.min(Math.max(1, Math.floor(i.monthPosition) || 1), requested);
  const minMonthWidth = getMinMonthWidth(i.minDayWidth);
  const width = i.containerWidth && i.containerWidth > 0 ? i.containerWidth : null;
  let columns = i.orientation === 'vertical' ? 1 : requested;
  let effective = requested;
  let active: CalendarLayout['activeOverflow'] = 'none';
  let atMin = false;

  if (width != null) {
    const fits = Math.max(0, Math.floor((width + i.monthGap) / (minMonthWidth + i.monthGap)));
    if (i.orientation === 'vertical') {
      if (fits < 1) active = 'scroll';
      atMin = width <= minMonthWidth;
    } else if (fits >= requested) {
      atMin = width - (requested - 1) * i.monthGap <= requested * minMonthWidth;
    } else {
      atMin = true;
      if (i.overflow === 'scroll') active = 'scroll';
      else if (i.overflow === 'wrap') {
        columns = Math.max(1, fits);
        active = fits >= 1 ? 'wrap' : 'scroll';
      } else {
        effective = Math.max(1, fits);
        columns = effective;
        active = fits >= 1 ? 'reduce-months' : 'scroll';
      }
    }
  }

  return {
    orientation: i.orientation,
    navigation: i.navigation,
    requestedMonths: requested,
    effectiveMonths: effective,
    columns,
    requestedMonthPosition: Math.floor(i.monthPosition) || 1,
    effectiveMonthPosition: Math.min(pos, effective),
    overflow: i.overflow,
    activeOverflow: active,
    atMinDaySize: atMin,
    containerWidth: width,
    minMonthWidth,
    direction: i.direction,
  };
}

/** Structural key: widths that produce the same key render identically. */
export function layoutKey(l: CalendarLayout): string {
  return [l.orientation, l.navigation, l.requestedMonths, l.effectiveMonths, l.columns, l.effectiveMonthPosition, l.activeOverflow, l.atMinDaySize, l.direction, l.minMonthWidth].join('|');
}

export interface MonthWindow {
  start: CalendarMonth;
  months: CalendarMonth[];
}

/**
 * Places `reference` at the 1-based `position` of a `count`-month window and
 * then shifts the window (never the order) to respect min/max months:
 * past the max it is shifted back, before the min it is shifted forward.
 * If the allowed span is shorter than the window the window starts at min.
 */
export function computeMonthWindow(
  reference: CalendarMonth,
  count: number,
  position: number,
  minMonth: CalendarMonth | null,
  maxMonth: CalendarMonth | null,
): MonthWindow {
  let start = addMonthsToMonth(reference, -(Math.min(Math.max(position, 1), count) - 1));
  if (maxMonth && diffMonths(start, maxMonth) < count - 1) start = addMonthsToMonth(maxMonth, -(count - 1));
  if (minMonth && start < minMonth) start = minMonth;
  return { start, months: eachMonth(start, count) };
}
