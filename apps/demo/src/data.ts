/**
 * Fake availability backend + a tiny consumer-side loader.
 * The calendar never fetches: this is what an app would own.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { type CalendarDate, type CalendarMonth, type DataStatus, type StayDayStatus, addDays, eachDay, firstDayOfMonth, lastDayOfMonth } from 'calendar-kit';

export interface DayInfo {
  status: StayDayStatus;
  price: number;
}
export type MonthData = Record<string, DayInfo>;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

/** Deterministic pseudo data: a few multi-night bookings, weekend prices. */
export function availabilityFor(month: CalendarMonth, firstFreeMonth?: CalendarMonth): MonthData {
  const out: MonthData = {};
  for (const date of eachDay(firstDayOfMonth(month), lastDayOfMonth(month))) {
    const r = hash(date);
    const weekend = [5, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
    out[date] = { status: 'available', price: Math.round((weekend ? 5200 : 4100) + r * 1500) };
  }
  // Booked stays of 2–4 nights starting on "random" days.
  for (const date of Object.keys(out)) {
    if (hash(`${date}b`) > 0.86) {
      const nights = 2 + Math.floor(hash(`${date}n`) * 3);
      for (let i = 0; i < nights; i++) {
        const k = addDays(date as CalendarDate, i);
        if (out[k]) out[k].status = 'booked';
      }
    }
  }
  if (firstFreeMonth && month < firstFreeMonth) for (const k of Object.keys(out)) out[k]!.status = 'booked';
  return out;
}

const failOnce = new Set<string>();
export function fetchAvailability(month: CalendarMonth, signal: AbortSignal, opts: { failMonth?: CalendarMonth; firstFreeMonth?: CalendarMonth } = {}) {
  return new Promise<MonthData>((resolve, reject) => {
    const delay = 300 + hash(month + Date.now()) * 700;
    const t = setTimeout(() => {
      if (opts.failMonth === month && !failOnce.has(month)) {
        failOnce.add(month);
        reject(new Error('Network error'));
      } else resolve(availabilityFor(month, opts.firstFreeMonth));
    }, delay);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/**
 * Per-month cache with stale-response protection:
 * - each month has its own AbortController; leaving a month aborts it
 * - a response only writes the month it was requested for, and only if the
 *   request is still the current one for that month (sequence check)
 */
export function useAvailability(opts: { failMonth?: CalendarMonth; firstFreeMonth?: CalendarMonth } = {}) {
  const [months, setMonths] = useState<Record<string, { status: DataStatus; data?: MonthData }>>({});
  const inflight = useRef(new Map<string, { ctrl: AbortController; seq: number }>());
  const seq = useRef(0);
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const statusRef = useRef<Record<string, DataStatus>>({});
  const put = (month: string, entry: { status: DataStatus; data?: MonthData }) => {
    statusRef.current[month] = entry.status;
    setMonths((s) => ({ ...s, [month]: { ...entry, data: entry.data ?? s[month]?.data } }));
  };

  const load = useCallback((month: CalendarMonth) => {
    const id = ++seq.current;
    const ctrl = new AbortController();
    inflight.current.get(month)?.ctrl.abort();
    inflight.current.set(month, { ctrl, seq: id });
    put(month, { status: 'loading' });
    fetchAvailability(month, ctrl.signal, optsRef.current).then(
      (data) => {
        if (inflight.current.get(month)?.seq !== id) return; // stale
        inflight.current.delete(month);
        put(month, { status: 'loaded', data });
      },
      (err: Error) => {
        if (err.name === 'AbortError' || inflight.current.get(month)?.seq !== id) return;
        inflight.current.delete(month);
        put(month, { status: 'error' });
      },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Call with the months the calendar currently renders. */
  const ensure = useCallback(
    (wanted: readonly CalendarMonth[]) => {
      for (const [m, f] of inflight.current)
        if (!wanted.includes(m as CalendarMonth)) {
          f.ctrl.abort();
          inflight.current.delete(m);
          if (statusRef.current[m] === 'loading') put(m, { status: 'unknown' });
        }
      for (const m of wanted) if (!statusRef.current[m] || statusRef.current[m] === 'unknown') load(m);
    },
    [load],
  );

  // Abort on unmount; requests cut by a StrictMode/dev remount are re-issued.
  useEffect(() => {
    for (const [m, st] of Object.entries(statusRef.current)) if (st === 'loading' && !inflight.current.has(m)) load(m as CalendarMonth);
    const map = inflight.current;
    return () => {
      map.forEach((f) => f.ctrl.abort());
      map.clear();
    };
  }, [load]);

  const getDataStatus = useCallback((m: CalendarMonth): DataStatus => months[m]?.status ?? 'unknown', [months]);
  const dayInfo = useCallback((date: CalendarDate) => months[date.slice(0, 7)]?.data?.[date], [months]);
  return { getDataStatus, dayInfo, ensure, retry: (ms: readonly CalendarMonth[]) => ms.forEach(load) };
}

export const formatTRY = (n: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n);
