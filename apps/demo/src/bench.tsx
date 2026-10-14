// Measurement page used by scripts/perf-interactions.mjs: only the calendar
// inside a React Profiler, no other app state that could re-render it.
import { Profiler } from 'react';
import { createRoot } from 'react-dom/client';
import 'calendar-kit/styles.css';
import { Calendar, toCalendarDate, toCalendarMonth } from 'calendar-kit';

const months = Number(new URLSearchParams(location.search).get('months') ?? 2);
const w = window as unknown as { __commits: { phase: string; actual: number; base: number; start: number; commit: number }[] };
w.__commits = [];

createRoot(document.getElementById('root')!).render(
  <div style={{ maxWidth: 1240, margin: '0 auto', padding: 16 }}>
    <Profiler id="calendar" onRender={(_id, phase, actual, base, start, commit) => w.__commits.push({ phase, actual, base, start, commit })}>
      <Calendar mode="range" today={toCalendarDate('2026-10-12')} defaultVisibleMonth={toCalendarMonth('2026-10')} numberOfMonths={months} overflow="wrap" />
    </Profiler>
  </div>,
);
