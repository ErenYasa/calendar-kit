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
import './LayoutLab.tr.css';

// Yerleşim laboratuvarı: takvimin kapsayıcı genişliğini değiştirmek için kesik
// çizgili kutunun köşesini sürükleyin, üstteki prop'ları değiştirin ve hangi
// olayların tetiklendiğini, React'in takvimi render etmeye ne kadar süre
// harcadığını izleyin. Profiler'ın içinde yalnızca <Calendar> var; alttaki
// paneller küçük bir store'dan okur, bu yüzden kayıt tutmak takvimi asla yeniden
// render etmez ve panellerin kendi render'ları hiç ölçülmez.

const MAX_COMMITS = 20;
const MAX_EVENTS = 30;
// Sık gelen olaylar: art arda gelenler sayaçlı tek bir satırda birleştirilir.
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
  /** `off`: mount commit'i bildirilmedi, yani bu React derlemesi profil çıkarmıyor. */
  profiling: 'pending' | 'on' | 'off';
}

function createLabStore() {
  let state: Snapshot = { commits: [], events: [], profiling: 'pending' };
  let commitCount = 0;
  let eventId = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  // Görev başına bir kez bildir: Profiler callback'leri React'in commit'i
  // sırasında çalışır ve bir olay patlaması (boyut sürükleme) paneli tek bir
  // kez yeniden çizmelidir.
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
    /** İlk commit'ten sonra çağrılır: production derlemesinde hiçbir şey kaydedilmemiştir. */
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
      return `${e.layout.columns} sütun · ${e.layout.effectiveMonths} ay`;
    case 'dateClick':
      return `${e.date} ${e.accepted ? 'kabul edildi' : `reddedildi: ${e.issue?.code}`}`;
    case 'change':
      return `${range(e.value as DateRange)} (${e.reason}, ${e.source})`;
    case 'selectionComplete':
      return range(e.value as DateRange);
    case 'invalidSelection':
      return `${e.date} ${e.issue.code}`;
    case 'validationChange':
      return `${e.cause}: ${e.current.valid ? 'geçerli' : e.current.issue?.code}`;
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
      return `${l.columns} sütun · ${l.effectiveMonths}/${l.requestedMonths} ay · overflow ${l.activeOverflow}${l.atMinDaySize ? ' · minDaySize sınırında' : ''}`;
    }
    case 'dayFocusChange':
      return `${e.date ?? 'yok'} (${e.source})`;
    case 'tooltipOpenChange':
      return `${e.open ? 'açık' : 'kapalı'} ${e.date ?? ''}`;
    case 'scroll':
      return `sol ${Math.round(e.scrollLeft)} · üst ${Math.round(e.scrollTop)}`;
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

  // Sabit referanslar: kayıt tutmak ve ölçmek takvimin prop'larını asla değiştirmez.
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
          RTL (sağdan sola, ar-EG)
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
          Boyutu değiştirmek için kesik çizgili kutunun alt köşesini sürükleyin. Bugün: {today}
          {disableFuture ? ' (sonraki günler devre dışı)' : ''}.
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
      <section className="lab-panel" aria-label="Render süresi">
        <div className="lab-panel-head">
          <h3>Render süresi (React Profiler)</h3>
          <button type="button" onClick={store.clear}>
            Temizle
          </button>
        </div>
        {profiling === 'off' ? (
          <p className="lab-empty">
            Ölçüm yok: bu bir production React derlemesi ve Profiler burada ölçüm bildirmez. Render sürelerini görmek için dokümantasyonu yerel olarak
            çalıştırın (<code>npm run dev</code>).
          </p>
        ) : commits.length === 0 ? (
          <p className="lab-empty">Bir commit kaydetmek için takvimle etkileşime geçin.</p>
        ) : (
          <>
            <p className="lab-stats">
              son {ms(actual[0]!)} ms · en fazla {ms(Math.max(...actual))} ms · {commits.length} commit
            </p>
            <div className="lab-scroll lab-commits">
              <table>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">aşama</th>
                    <th scope="col">gerçek ms</th>
                    <th scope="col">taban ms</th>
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

      <section className="lab-panel" aria-label="Olaylar">
        <h3>Olaylar (onEvent)</h3>
        {events.length === 0 ? (
          <p className="lab-empty">Henüz olay yok.</p>
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
