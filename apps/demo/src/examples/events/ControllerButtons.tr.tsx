import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type CalendarSnapshot, type DateRange, addDays, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';
import './Controller.css';

// Takvimin dışındaki düğmeler onu bir ref üzerinden yönetir. Her düğme metodun
// döndürdüğü değeri gösterir; "Anlık durumu oku" getSnapshot() sonucunu gösterir.
export default function ControllerButtons() {
  const [today] = useState(() => getToday());
  const [limits] = useState(() => ({ min: today, max: addDays(today, 180) }));
  const [initial] = useState<DateRange>(() => ({ start: addDays(today, 3), end: addDays(today, 6) }));
  const calendar = useRef<CalendarController>(null);
  const [result, setResult] = useState('Bir düğmeye basın.');
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
          <strong>Gezinme</strong>
          <button type="button" onClick={() => call('previous()', (c) => c.previous())}>
            previous()
          </button>
          <button type="button" onClick={() => call('next()', (c) => c.next())}>
            next()
          </button>
          <button type="button" onClick={() => call(`goToMonth('${thisMonth}')`, (c) => c.goToMonth(thisMonth))}>
            Bu ay
          </button>
          <button
            type="button"
            onClick={() => call(`goToMonth('${addMonthsToMonth(thisMonth, 3)}', { focus: true })`, (c) => c.goToMonth(addMonthsToMonth(thisMonth, 3), { focus: true }))}
          >
            3 ay sonrası, odakla
          </button>
          <button type="button" onClick={() => call(`goToMonth('${addMonthsToMonth(thisMonth, 24)}')`, (c) => c.goToMonth(addMonthsToMonth(thisMonth, 24)))}>
            2 yıl sonrası (sınıra çekilir)
          </button>
          <button type="button" onClick={() => call(`goToMonth('next spring')`, (c) => c.goToMonth('next spring'))}>
            Geçersiz ay
          </button>
        </div>
        <div className="controller-row">
          <strong>Seçim</strong>
          <button
            type="button"
            onClick={() => {
              const value = { start: addDays(today, 1), end: addDays(today, 4) };
              call(`select(${JSON.stringify(value)})`, (c) => c.select(value));
            }}
          >
            Yarından itibaren 3 gün
          </button>
          <button
            type="button"
            onClick={() => {
              const value = { start: addDays(today, -2), end: addDays(today, 1) };
              call(`select(${JSON.stringify(value)})`, (c) => c.select(value));
            }}
          >
            2 gün önce başlayan (reddedilir)
          </button>
          <button type="button" onClick={() => call('clear()', (c) => c.clear())}>
            clear()
          </button>
          <button type="button" onClick={() => call('reset()', (c) => c.reset())}>
            reset()
          </button>
        </div>
        <div className="controller-row">
          <strong>Uç nokta, odak</strong>
          <button type="button" onClick={() => call("setActiveEndpoint('start')", (c) => c.setActiveEndpoint('start'))}>
            Sonraki tıklama başlangıcı seçer
          </button>
          <button type="button" onClick={() => call("setActiveEndpoint('end')", (c) => c.setActiveEndpoint('end'))}>
            Sonraki tıklama bitişi seçer
          </button>
          <button type="button" onClick={() => call(`focusDate('${addDays(today, 10)}')`, (c) => c.focusDate(addDays(today, 10)))}>
            Bugün + 10’a odaklan
          </button>
        </div>
        <div className="controller-row">
          <strong>Okuma</strong>
          <button
            type="button"
            onClick={() => {
              setSnapshot(calendar.current?.getSnapshot() ?? null);
              setResult('getSnapshot()');
            }}
          >
            Anlık durumu oku
          </button>
        </div>
        <p className="controller-result" role="status">
          {result}
        </p>
      </div>
      <Calendar ref={calendar} mode="range" numberOfMonths={2} minDate={limits.min} maxDate={limits.max} defaultValue={initial} />
      {snapshot && (
        <dl className="controller-snapshot" aria-label="Anlık durum">
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
            {snapshot.layout.columns} sütun, {snapshot.layout.effectiveMonths} ay, taşma: {snapshot.layout.activeOverflow}
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
