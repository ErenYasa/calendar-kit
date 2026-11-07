import { Profiler, type ProfilerOnRenderCallback, useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  Calendar,
  type CalendarEvent,
  type DateRange,
  getToday,
  messagesAr,
  type NavigationMode,
  type Orientation,
  type OverflowStrategy,
} from 'calendar-kit';
import './LayoutLab.css';

// Layout lab: drag the dashed box's corner to change the calendar's container
// width, change the props above it, and watch which events fire and how long
// React spends rendering the calendar. Only the <Calendar> is inside the
// Profiler; the panels below it read a small store, so logging never re-renders
// the calendar and the panels' own renders are never measured.

const MAX_COMMITS = 20;
const MAX_EVENTS = 30;
// Frequent events: consecutive ones are merged into one row with a counter.
const COALESCED = new Set<CalendarEvent['type']>(['scroll', 'resize', 'dayFocusChange', 'tooltipOpenChange']);

interface Commit {
  n: number;
  phase: 'mount' | 'update' | 'nested-update';
  actual: number;
  base: number;
}
interface LogRow {
  id: number;
  type: CalendarEvent['type'];
  text: string;
  count: number;
}
interface Snapshot {
  commits: readonly Commit[];
  events: readonly LogRow[];
  /** `off`: the mount commit was not reported, so this React build does not profile. */
  profiling: 'pending' | 'on' | 'off';
}

function createLabStore() {
  let state: Snapshot = { commits: [], events: [], profiling: 'pending' };
  let commitCount = 0;
  let eventId = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  // Notify once per task: Profiler callbacks run during React's commit, and a
  // burst of events (a resize drag) should repaint the panel once.
  const update = (next: Partial<Snapshot>) => {
    state = { ...state, ...next };
    timer ??= setTimeout(() => {
      timer = undefined;
      listeners.forEach((l) => l());
    }, 0);
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
        }
      };
    },
    get: () => state,
    commit(phase: Commit['phase'], actual: number, base: number) {
      commitCount += 1;
      update({ profiling: 'on', commits: [{ n: commitCount, phase, actual, base }, ...state.commits].slice(0, MAX_COMMITS) });
    },
    event(e: CalendarEvent) {
      const text = summarize(e);
      const [last, ...rest] = state.events;
      if (last && last.type === e.type && COALESCED.has(e.type)) update({ events: [{ ...last, text, count: last.count + 1 }, ...rest] });
      else update({ events: [{ id: ++eventId, type: e.type, text, count: 1 }, ...state.events].slice(0, MAX_EVENTS) });
    },
    /** Called after the first commit: in a production build nothing was recorded. */
    checkProfiling() {
      if (state.profiling === 'pending') update({ profiling: state.commits.length > 0 ? 'on' : 'off' });
    },
    clear() {
      update({ commits: [], events: [] });
    },
  };
}
type LabStore = ReturnType<typeof createLabStore>;

const range = (v: DateRange) => `${v.start ?? '…'} – ${v.end ?? '…'}`;

function summarize(e: CalendarEvent): string {
  switch (e.type) {
    case 'ready':
      return `${e.layout.columns} col · ${e.layout.effectiveMonths} months`;
    case 'dateClick':
      return `${e.date} ${e.accepted ? 'accepted' : `rejected: ${e.issue?.code}`}`;
    case 'change':
      return `${range(e.value as DateRange)} (${e.reason}, ${e.source})`;
    case 'selectionComplete':
      return range(e.value as DateRange);
    case 'invalidSelection':
      return `${e.date} ${e.issue.code}`;
    case 'validationChange':
      return `${e.cause}: ${e.current.valid ? 'valid' : e.current.issue?.code}`;
    case 'activeEndpointChange':
      return `${e.previous} → ${e.current}`;
    case 'visibleMonthChange':
      return `${e.month} (${e.reason})`;
    case 'visibleMonthsChange':
    case 'renderedMonthsChange':
      return e.months.join(', ');
    case 'loadMore':
      return `${e.direction}: ${e.months.join(', ')}`;
    case 'resize':
      return `${Math.round(e.current.width)} × ${Math.round(e.current.height)} px`;
    case 'layoutChange': {
      const l = e.current;
      return `${l.columns} col · ${l.effectiveMonths}/${l.requestedMonths} months · overflow ${l.activeOverflow}${l.atMinDaySize ? ' · at minDaySize' : ''}`;
    }
    case 'dayFocusChange':
      return `${e.date ?? 'none'} (${e.source})`;
    case 'tooltipOpenChange':
      return `${e.open ? 'open' : 'closed'} ${e.date ?? ''}`;
    case 'scroll':
      return `left ${Math.round(e.scrollLeft)} · top ${Math.round(e.scrollTop)}`;
    default:
      return '';
  }
}

export default function LayoutLab() {
  const [today] = useState(() => getToday());
  const [store] = useState(createLabStore);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [navigation, setNavigation] = useState<NavigationMode>('paged');
  const [overflow, setOverflow] = useState<OverflowStrategy>('wrap');
  const [months, setMonths] = useState(2);
  const [position, setPosition] = useState(1);
  const [minDaySize, setMinDaySize] = useState(40);
  const [disableFuture, setDisableFuture] = useState(false);
  const [rtl, setRtl] = useState(false);

  // Stable identities: logging and measuring never change the calendar's props.
  const onEvent = useCallback((e: CalendarEvent) => store.event(e), [store]);
  const onRender = useCallback<ProfilerOnRenderCallback>((_id, phase, actualDuration, baseDuration) => store.commit(phase, actualDuration, baseDuration), [store]);
  useEffect(() => store.checkProfiling(), [store]);

  return (
    <div className="lab">
      <div className="lab-controls">
        <label>
          orientation
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)}>
            <option>horizontal</option>
            <option>vertical</option>
          </select>
        </label>
        <label>
          navigation
          <select value={navigation} onChange={(e) => setNavigation(e.target.value as NavigationMode)}>
            <option>paged</option>
            <option>continuous</option>
          </select>
        </label>
        <label>
          overflow
          <select value={overflow} onChange={(e) => setOverflow(e.target.value as OverflowStrategy)}>
            <option>wrap</option>
            <option>scroll</option>
            <option>reduce-months</option>
          </select>
        </label>
        <label>
          numberOfMonths
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          monthPosition
          <select value={Math.min(position, months)} onChange={(e) => setPosition(Number(e.target.value))}>
            {Array.from({ length: months }, (_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
        </label>
        <label>
          minDaySize {minDaySize}px
          <input type="range" min={24} max={64} step={2} value={minDaySize} onChange={(e) => setMinDaySize(Number(e.target.value))} />
        </label>
        <label className="lab-check">
          <input type="checkbox" checked={disableFuture} onChange={(e) => setDisableFuture(e.target.checked)} />
          disableFuture
        </label>
        <label className="lab-check">
          <input type="checkbox" checked={rtl} onChange={(e) => setRtl(e.target.checked)} />
          RTL (ar-EG)
        </label>
      </div>

      <div className="lab-stage">
        <div className="lab-resizable">
          <Profiler id="calendar" onRender={onRender}>
            <Calendar
              mode="range"
              locale={rtl ? 'ar-EG' : undefined}
              messages={rtl ? messagesAr : undefined}
              orientation={orientation}
              navigation={navigation}
              overflow={overflow}
              numberOfMonths={months}
              monthPosition={Math.min(position, months)}
              minDaySize={minDaySize}
              disableFuture={disableFuture}
              maxBlockSize={navigation === 'continuous' ? 480 : undefined}
              loadDirections="both"
              onEvent={onEvent}
            />
          </Profiler>
        </div>
        <p className="lab-hint">
          Drag the bottom corner of the dashed box to resize. Today: {today}
          {disableFuture ? ' (later days are disabled)' : ''}.
        </p>
      </div>
      <LabPanels store={store} />
    </div>
  );
}

const ms = (n: number) => n.toFixed(2);

function LabPanels({ store }: { store: LabStore }) {
  const { commits, events, profiling } = useSyncExternalStore(store.subscribe, store.get, store.get);
  const actual = commits.map((c) => c.actual);
  return (
    <div className="lab-panels">
      <section className="lab-panel" aria-label="Render time">
        <div className="lab-panel-head">
          <h3>Render time (React Profiler)</h3>
          <button type="button" onClick={store.clear}>
            Clear
          </button>
        </div>
        {profiling === 'off' ? (
          <p className="lab-empty">
            No measurements: this is a production React build, where the Profiler does not report. Run the docs locally (<code>npm run dev</code>) to see
            render times.
          </p>
        ) : commits.length === 0 ? (
          <p className="lab-empty">Interact with the calendar to record a commit.</p>
        ) : (
          <>
            <p className="lab-stats">
              last {ms(actual[0]!)} ms · max {ms(Math.max(...actual))} ms · {commits.length} commits
            </p>
            <div className="lab-scroll lab-commits">
              <table>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">phase</th>
                    <th scope="col">actual ms</th>
                    <th scope="col">base ms</th>
                  </tr>
                </thead>
                <tbody>
                  {commits.map((c) => (
                    <tr key={c.n}>
                      <td>{c.n}</td>
                      <td>{c.phase}</td>
                      <td>{ms(c.actual)}</td>
                      <td>{ms(c.base)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="lab-panel" aria-label="Events">
        <h3>Events (onEvent)</h3>
        {events.length === 0 ? (
          <p className="lab-empty">No events yet.</p>
        ) : (
          <ol className="lab-scroll lab-events">
            {events.map((row) => (
              <li key={row.id}>
                <strong>{row.type}</strong>
                {row.count > 1 && <span className="lab-count"> ×{row.count}</span>} {row.text}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
