import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type CalendarSnapshot, type DateRange, addDays, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import './Controller.css';

// Buttons outside the calendar drive it through a ref. Each button shows what
// the method returned; "Read snapshot" shows getSnapshot().
export default function ControllerButtons() {
  const [today] = useState(() => getToday());
  const [limits] = useState(() => ({ min: today, max: addDays(today, 180) }));
  const [initial] = useState<DateRange>(() => ({ start: addDays(today, 3), end: addDays(today, 6) }));
  const calendar = useRef<CalendarController>(null);
  const [result, setResult] = useState('Press a button.');
  const [snapshot, setSnapshot] = useState<CalendarSnapshot | null>(null);

  const call = (label: string, run: (c: CalendarController) => unknown) => {
    const c = calendar.current;
    if (!c) return;
    const value = run(c);
    setResult(`${label} → ${value === undefined ? 'undefined' : JSON.stringify(value)}`);
    setSnapshot(null);
  };

  const thisMonth = getMonth(today);
  return (
    <div>
      <div className="controller-panel">
        <div className="controller-row">
          <strong>Navigate</strong>
          <button type="button" onClick={() => call('previous()', (c) => c.previous())}>
            previous()
          </button>
          <button type="button" onClick={() => call('next()', (c) => c.next())}>
            next()
          </button>
          <button type="button" onClick={() => call(`goToMonth('${thisMonth}')`, (c) => c.goToMonth(thisMonth))}>
            This month
          </button>
          <button
            type="button"
            onClick={() => call(`goToMonth('${addMonthsToMonth(thisMonth, 3)}', { focus: true })`, (c) => c.goToMonth(addMonthsToMonth(thisMonth, 3), { focus: true }))}
          >
            In 3 months, with focus
          </button>
          <button type="button" onClick={() => call(`goToMonth('${addMonthsToMonth(thisMonth, 24)}')`, (c) => c.goToMonth(addMonthsToMonth(thisMonth, 24)))}>
            In 2 years (clamped)
          </button>
          <button type="button" onClick={() => call(`goToMonth('next spring')`, (c) => c.goToMonth('next spring'))}>
            Invalid month
          </button>
        </div>
        <div className="controller-row">
          <strong>Select</strong>
          <button
            type="button"
            onClick={() => {
              const value = { start: addDays(today, 1), end: addDays(today, 4) };
              call(`select(${JSON.stringify(value)})`, (c) => c.select(value));
            }}
          >
            Tomorrow + 3 days
          </button>
          <button
            type="button"
            onClick={() => {
              const value = { start: addDays(today, -2), end: addDays(today, 1) };
              call(`select(${JSON.stringify(value)})`, (c) => c.select(value));
            }}
          >
            Starting 2 days ago (rejected)
          </button>
          <button type="button" onClick={() => call('clear()', (c) => c.clear())}>
            clear()
          </button>
          <button type="button" onClick={() => call('reset()', (c) => c.reset())}>
            reset()
          </button>
        </div>
        <div className="controller-row">
          <strong>Endpoint, focus</strong>
          <button type="button" onClick={() => call("setActiveEndpoint('start')", (c) => c.setActiveEndpoint('start'))}>
            Next click sets start
          </button>
          <button type="button" onClick={() => call("setActiveEndpoint('end')", (c) => c.setActiveEndpoint('end'))}>
            Next click sets end
          </button>
          <button type="button" onClick={() => call(`focusDate('${addDays(today, 10)}')`, (c) => c.focusDate(addDays(today, 10)))}>
            Focus today + 10
          </button>
        </div>
        <div className="controller-row">
          <strong>Read</strong>
          <button
            type="button"
            onClick={() => {
              setSnapshot(calendar.current?.getSnapshot() ?? null);
              setResult('getSnapshot()');
            }}
          >
            Read snapshot
          </button>
        </div>
        <p className="controller-result" role="status">
          {result}
        </p>
      </div>
      <Calendar ref={calendar} mode="range" numberOfMonths={2} minDate={limits.min} maxDate={limits.max} defaultValue={initial} />
      {snapshot && (
        <dl className="controller-snapshot" aria-label="Snapshot">
          <dt>selection</dt>
          <dd>{JSON.stringify(snapshot.selection.value)}</dd>
          <dt>phase</dt>
          <dd>{snapshot.phase}</dd>
          <dt>activeEndpoint</dt>
          <dd>{snapshot.activeEndpoint}</dd>
          <dt>validation</dt>
          <dd>{JSON.stringify(snapshot.validation)}</dd>
          <dt>referenceMonth</dt>
          <dd>{snapshot.referenceMonth}</dd>
          <dt>visibleMonths</dt>
          <dd>{snapshot.visibleMonths.join(', ')}</dd>
          <dt>renderedMonths</dt>
          <dd>{snapshot.renderedMonths.join(', ')}</dd>
          <dt>layout</dt>
          <dd>
            {snapshot.layout.columns} column(s), {snapshot.layout.effectiveMonths} month(s), overflow {snapshot.layout.activeOverflow}
          </dd>
          <dt>focusedDate</dt>
          <dd>{snapshot.focusedDate ?? 'null'}</dd>
          <dt>today</dt>
          <dd>{snapshot.today}</dd>
        </dl>
      )}
    </div>
  );
}
