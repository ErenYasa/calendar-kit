import { Profiler, useEffect, useRef, useState } from 'react';
import { Calendar, type CalendarEvent, type NavigationMode, type Orientation, type OverflowStrategy, getToday } from 'calendar-kit';

const TODAY = getToday();

/**
 * Layout + events playground. The container is resizable (drag the corner);
 * the calendar reacts to its container, not the viewport. The Profiler shows
 * React commit durations of the calendar subtree for each interaction.
 */
export function Playground() {
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [navigation, setNavigation] = useState<NavigationMode>('paged');
  const [overflow, setOverflow] = useState<OverflowStrategy>('wrap');
  const [months, setMonths] = useState(2);
  const [position, setPosition] = useState(1);
  const [minDay, setMinDay] = useState(40);
  const [disableFuture, setDisableFuture] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  // Commit timings live in a ref; writing state from Profiler.onRender would loop.
  const commits = useRef<{ phase: string; ms: number }[]>([]);

  const onEvent = (e: CalendarEvent) => {
    if (e.type === 'scroll') return;
    const extra =
      e.type === 'change' ? ` ${JSON.stringify(e.value)} (${e.reason}/${e.source})` :
      e.type === 'resize' ? ` ${e.current.width}×${e.current.height}` :
      e.type === 'layoutChange' ? ` cols=${e.current.columns} eff=${e.current.effectiveMonths} ${e.current.activeOverflow}${e.current.atMinDaySize ? ' min' : ''}` :
      e.type === 'visibleMonthsChange' ? ` ${e.months.join(',')}` :
      e.type === 'dateClick' ? ` ${e.date} ${e.accepted ? 'ok' : e.issue?.code}` :
      e.type === 'validationChange' ? ` ${e.cause} ${e.current.valid ? 'valid' : e.current.issue?.code}` : '';
    setEvents((l) => [`${e.type}${extra}`, ...l].slice(0, 40));
  };

  return (
    <div className="playground">
      <div className="controls">
        <label>orientation <select value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)}><option>horizontal</option><option>vertical</option></select></label>
        <label>navigation <select value={navigation} onChange={(e) => setNavigation(e.target.value as NavigationMode)}><option>paged</option><option>continuous</option></select></label>
        <label>overflow <select value={overflow} onChange={(e) => setOverflow(e.target.value as OverflowStrategy)}><option>wrap</option><option>scroll</option><option>reduce-months</option></select></label>
        <label>numberOfMonths <input type="number" min={1} max={6} value={months} onChange={(e) => setMonths(+e.target.value)} /></label>
        <label>monthPosition <input type="number" min={1} max={6} value={position} onChange={(e) => setPosition(+e.target.value)} /></label>
        <label>minDaySize <input type="number" min={24} max={64} value={minDay} onChange={(e) => setMinDay(+e.target.value)} /></label>
        <label><input type="checkbox" checked={disableFuture} onChange={(e) => setDisableFuture(e.target.checked)} /> disableFuture</label>
        <label><input type="checkbox" checked={rtl} onChange={(e) => setRtl(e.target.checked)} /> RTL (he-IL)</label>
      </div>
      <div className="split">
        <div className="resizable">
          <Profiler
            id="calendar"
            onRender={(_id, phase, actualDuration) => {
              commits.current = [{ phase, ms: actualDuration }, ...commits.current].slice(0, 12);
              // Exposed for scripted measurements (see README "Performance").
              ((window as unknown as { __calCommits?: number[] }).__calCommits ??= []).push(actualDuration);
            }}
          >
            <Calendar
              mode="range"
              locale={rtl ? 'he-IL' : 'tr-TR'}
              orientation={orientation}
              navigation={navigation}
              overflow={overflow}
              numberOfMonths={months}
              monthPosition={position}
              minDaySize={minDay}
              disableFuture={disableFuture}
              maxBlockSize={navigation === 'continuous' ? 480 : undefined}
              loadDirections="both"
              onEvent={onEvent}
            />
          </Profiler>
        </div>
        <div className="side">
          <h4>React commits (ms)</h4>
          <CommitLog source={commits} />
          <h4>Events (onEvent)</h4>
          <pre className="log">{events.join('\n')}</pre>
        </div>
      </div>
      <p className="muted">Today: {TODAY}</p>
    </div>
  );
}

function CommitLog({ source }: { source: { current: { phase: string; ms: number }[] } }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, []);
  return <pre className="log small">{source.current.map((c) => `${c.phase.padEnd(7)} ${c.ms.toFixed(2)}`).join('\n')}</pre>;
}
