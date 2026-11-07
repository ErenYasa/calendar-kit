// Data and layout events: fetch each month when it is rendered, cancel
// requests for months that are gone, react to loading transitions and adapt
// the surrounding UI to the calendar's real layout.
import { useRef, useState } from 'react';
import { Calendar, type CalendarDate, type CalendarMonth, type DataStatus, type DefaultDayData, type RenderedMonthsChangeEvent } from 'calendar-kit';

// Your app's own functions.
declare function fetchPrices(month: CalendarMonth, signal: AbortSignal): Promise<Record<CalendarDate, number>>;
declare function track(name: string, data?: Record<string, unknown>): void;
declare function toast(message: string): void;

export function PricedCalendar() {
  const [status, setStatus] = useState<Partial<Record<CalendarMonth, DataStatus>>>({});
  const [prices, setPrices] = useState<Partial<Record<CalendarDate, number>>>({});
  const requests = useRef(new Map<CalendarMonth, AbortController>());

  const load = (month: CalendarMonth) => {
    requests.current.get(month)?.abort();
    const request = new AbortController();
    requests.current.set(month, request);
    setStatus((s) => ({ ...s, [month]: 'loading' }));
    fetchPrices(month, request.signal).then(
      (result) => {
        setPrices((p) => ({ ...p, ...result }));
        setStatus((s) => ({ ...s, [month]: 'loaded' }));
      },
      () => {
        if (!request.signal.aborted) setStatus((s) => ({ ...s, [month]: 'error' }));
      },
    );
  };

  // Fires on mount too (added = every rendered month), so it is the only
  // place that starts requests: paging, jumps and load-more all end up here.
  const onRenderedMonthsChange = (e: RenderedMonthsChangeEvent) => {
    for (const month of e.removed) {
      requests.current.get(month)?.abort();
      requests.current.delete(month);
    }
    for (const month of e.added) if (status[month] !== 'loaded') load(month);
  };

  return (
    <Calendar<DefaultDayData>
      mode="range"
      navigation="continuous"
      numberOfMonths={2}
      onRenderedMonthsChange={onRenderedMonthsChange}
      getDataStatus={(month) => status[month] ?? 'unknown'}
      getDayData={(date) => (prices[date] != null ? { label: `€${prices[date]}` } : undefined)}
      onRetry={(months) => months.forEach(load)}
      onLoadingChange={(e) => {
        if (e.current.errorMonths.length > e.previous.errorMonths.length) toast('Some prices could not be loaded.');
      }}
      onLoadMore={(e) => track('months_loaded', { direction: e.direction, trigger: e.trigger, count: e.months.length })}
    />
  );
}

// Layout events: a compact footer when the months stack in one column, and
// the width reported to the page at most once per 24px of change.
export function AdaptiveFooter({ onWidth }: { onWidth: (width: number) => void }) {
  const [oneColumn, setOneColumn] = useState(false);

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      overflow="wrap"
      onReady={(e) => {
        setOneColumn(e.layout.columns === 1);
        track('calendar_ready', { columns: e.layout.columns, months: e.layout.effectiveMonths });
      }}
      onLayoutChange={(e) => setOneColumn(e.current.columns === 1)}
      resizeThreshold={24}
      onResize={(e) => onWidth(e.current.width)}
      renderFooter={(ctx) => (
        <div style={{ display: 'flex', flexDirection: oneColumn ? 'column' : 'row', gap: 8 }}>
          <button type="button" onClick={() => ctx.actions.clear()} disabled={ctx.phase === 'empty'}>
            Clear dates
          </button>
          <button type="button" disabled={ctx.phase !== 'complete' || !ctx.validation.valid}>
            Apply
          </button>
        </div>
      )}
    />
  );
}
