// Uygulamaya ait sahte bir müsaitlik API'si (takvim hiçbir zaman veri çekmez).
// Her tarih için deterministik: birkaç dolu konaklama ve gecelik fiyatlar.
import { useCallback, useEffect, useRef, useState } from 'react';
import { type CalendarDate, type CalendarMonth, type DataStatus, addDays, eachDay, firstDayOfMonth, lastDayOfMonth } from 'calendar-kit';

export interface DayInfo {
  status: 'available' | 'booked';
  price: number;
}
type MonthData = Record<string, DayInfo>;

function noise(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

export function availabilityFor(month: CalendarMonth): MonthData {
  const out: MonthData = {};
  for (const date of eachDay(firstDayOfMonth(month), lastDayOfMonth(month))) {
    const weekend = [5, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
    out[date] = { status: 'available', price: Math.round((weekend ? 180 : 140) + noise(date) * 40) };
  }
  // 2–4 gecelik dolu konaklamalar.
  for (const date of Object.keys(out) as CalendarDate[])
    if (noise(`${date}b`) > 0.86) for (let i = 0; i < 2 + Math.floor(noise(`${date}n`) * 3); i++) if (out[addDays(date, i)]) out[addDays(date, i)]!.status = 'booked';
  return out;
}

/** Simüle edilmiş istek: 600–1200 ms; `failMonth` ilk isteğinde hata verir. */
function request(month: CalendarMonth, signal: AbortSignal, failMonth?: CalendarMonth) {
  return new Promise<MonthData>((resolve, reject) => {
    const t = setTimeout(() => (month === failMonth && !failed.has(month) ? (failed.add(month), reject(new Error('Ağ hatası'))) : resolve(availabilityFor(month))), 600 + noise(month + Date.now()) * 600);
    signal.addEventListener('abort', () => (clearTimeout(t), reject(new DOMException('Aborted', 'AbortError'))));
  });
}
const failed = new Set<string>();

/**
 * Eski yanıtlara karşı korumalı, ay ay yükleme: her ayın kendi AbortController'ı
 * vardır ve bir ayı yalnızca o ay için yapılan en son istek yazabilir.
 */
export function useAvailability(options: { failMonth?: CalendarMonth } = {}) {
  const [months, setMonths] = useState<Record<string, { status: DataStatus; data?: MonthData }>>({});
  const inflight = useRef(new Map<string, AbortController>());
  const status = useRef<Record<string, DataStatus>>({});
  const put = (month: string, status_: DataStatus, data?: MonthData) => {
    status.current[month] = status_;
    setMonths((s) => ({ ...s, [month]: { status: status_, data: data ?? s[month]?.data } }));
  };

  const load = useCallback(
    (month: CalendarMonth) => {
      const ctrl = new AbortController();
      inflight.current.get(month)?.abort();
      inflight.current.set(month, ctrl);
      put(month, 'loading');
      request(month, ctrl.signal, options.failMonth).then(
        (data) => inflight.current.get(month) === ctrl && (inflight.current.delete(month), put(month, 'loaded', data)),
        (err: Error) => err.name !== 'AbortError' && inflight.current.get(month) === ctrl && (inflight.current.delete(month), put(month, 'error')),
      );
    },
    [options.failMonth],
  );

  /** Takvimin render ettiği aylarla çağırın (`onRenderedMonthsChange`). */
  const ensure = useCallback(
    (wanted: readonly CalendarMonth[]) => {
      for (const [m, ctrl] of inflight.current)
        if (!wanted.includes(m as CalendarMonth)) {
          ctrl.abort();
          inflight.current.delete(m);
          put(m, 'unknown');
        }
      for (const m of wanted) if (!status.current[m] || status.current[m] === 'unknown') load(m);
    },
    [load],
  );

  useEffect(() => {
    const map = inflight.current;
    // StrictMode'un yeniden mount etmesiyle yarıda kalan istekler tekrar gönderilir.
    for (const [m, st] of Object.entries(status.current)) if (st === 'loading' && !map.has(m)) load(m as CalendarMonth);
    return () => {
      map.forEach((c) => c.abort());
      map.clear();
    };
  }, [load]);

  const getDataStatus = useCallback((m: CalendarMonth): DataStatus => months[m]?.status ?? 'unknown', [months]);
  const dayInfo = useCallback((date: CalendarDate): DayInfo | undefined => months[date.slice(0, 7)]?.data?.[date], [months]);
  const retry = useCallback((ms: readonly CalendarMonth[]) => ms.forEach(load), [load]);
  return { getDataStatus, dayInfo, ensure, retry };
}
