import { useMemo, useState } from 'react';
import { Calendar, type DateRange, addMonthsToMonth, getMonth, getToday, messagesTr, stayRules } from 'calendar-kit';
import { useAvailability } from '../data';

const TODAY = getToday();
const THIS_MONTH = getMonth(TODAY);
/** In this demo everything before this month is booked. The app knows it from its own data. */
const FIRST_FREE = addMonthsToMonth(THIS_MONTH, 2);
const FAIL = addMonthsToMonth(THIS_MONTH, 1);

/**
 * Async availability owned by the app:
 * - months are requested from `onRenderedMonthsChange`
 * - per-month AbortController + sequence check prevents stale responses
 *   from overwriting newer data during fast navigation
 * - one month fails once to show error/retry
 * - "first available" target month comes from the app, the calendar does not scan
 */
export function LoadingExample() {
  const { getDataStatus, dayInfo, ensure, retry } = useAvailability({ failMonth: FAIL, firstFreeMonth: FIRST_FREE });
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  const [log, setLog] = useState<string[]>([]);
  const rules = useMemo(() => stayRules({ disablePast: true, getDayStatus: (d) => dayInfo(d)?.status }), [dayInfo]);
  return (
    <div className="split">
      <Calendar
        mode="range"
        locale="tr-TR"
        messages={messagesTr}
        numberOfMonths={2}
        value={value}
        onChange={setValue}
        rules={rules}
        getDataStatus={getDataStatus}
        onRenderedMonthsChange={(e) => ensure(e.months)}
        onRetry={retry}
        onLoadingChange={(e) =>
          setLog((l) => [`loading: [${e.current.loadingMonths.join(', ')}] error: [${e.current.errorMonths.join(', ')}]`, ...l].slice(0, 8))
        }
        renderHeader={(ctx) => (
          <div className="row">
            <button type="button" onClick={() => ctx.actions.goToMonth(FIRST_FREE, { focus: true })}>
              İlk müsait tarihe git
            </button>
            <button type="button" onClick={() => ctx.actions.goToMonth(addMonthsToMonth(THIS_MONTH, 18))}>
              18 ay ileri atla
            </button>
            <span className="muted">{ctx.visibleMonths.join(' · ')}</span>
          </div>
        )}
      />
      <pre className="log">{log.join('\n') || 'onLoadingChange…'}</pre>
    </div>
  );
}
