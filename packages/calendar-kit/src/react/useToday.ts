import { useCallback, useSyncExternalStore } from 'react';
import { type CalendarDate, getToday, parseDate } from '../date/calendarDate';

/**
 * Resolves "today".
 * - An explicit `today` prop always wins (deterministic, SSR-safe).
 * - Otherwise today is computed on the client only: the server snapshot is
 *   `null`, so server HTML and the hydration pass match; the client then
 *   re-renders with the real date. The value refreshes after midnight and when
 *   the tab becomes visible again.
 */
export function useToday(todayProp: CalendarDate | undefined, timeZone: string | undefined): CalendarDate | null {
  const explicit = todayProp ? parseDate(todayProp) : null;
  const subscribe = useCallback(
    (notify: () => void) => {
      if (explicit) return () => {};
      let timer: ReturnType<typeof setTimeout>;
      const arm = () => {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
        // Hourly fallback keeps non-local time zones correct as well.
        timer = setTimeout(
          () => {
            notify();
            arm();
          },
          Math.min(next.getTime() - now.getTime(), 3_600_000),
        );
      };
      arm();
      const onVisible = () => document.visibilityState === 'visible' && notify();
      document.addEventListener('visibilitychange', onVisible);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', onVisible);
      };
    },
    [explicit],
  );
  const getSnapshot = useCallback(() => explicit ?? getToday(timeZone ? { timeZone } : {}), [explicit, timeZone]);
  const getServerSnapshot = useCallback(() => explicit, [explicit]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
