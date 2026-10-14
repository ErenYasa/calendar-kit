/**
 * Interaction cost measurements (jsdom; absolute times are indicative only —
 * see README for browser numbers). Render counts are exact and asserted.
 */
import { useCallback } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar, type DayRenderContext, stayRules, toCalendarDate as d, toCalendarMonth as m } from '../src';

const TODAY = d('2026-10-12');
const day = (date: string) => document.querySelector<HTMLElement>(`button[data-date="${date}"]`)!;
const results: Record<string, string | number>[] = [];

function setup(numberOfMonths: number, navigation: 'paged' | 'continuous') {
  let renders = 0;
  function Host() {
    const content = useCallback((ctx: DayRenderContext) => {
      renders++;
      return ctx.day.dayOfMonth;
    }, []);
    return (
      <Calendar
        mode="range"
        today={TODAY}
        defaultVisibleMonth={m('2026-11')}
        numberOfMonths={numberOfMonths}
        navigation={navigation}
        orientation={navigation === 'continuous' ? 'vertical' : 'horizontal'}
        rules={RULES}
        renderDayContent={content}
      />
    );
  }
  const t0 = performance.now();
  render(<Host />);
  const mount = performance.now() - t0;
  return { mount, renders: () => renders, reset: () => (renders = 0) };
}
const booked = new Set(['2026-11-25', '2026-11-26', '2027-01-10']);
const RULES = stayRules({ minNights: 2, getDayStatus: (x) => (booked.has(x) ? 'booked' : 'available') });

function measure(label: string, numberOfMonths: number, navigation: 'paged' | 'continuous') {
  const s = setup(numberOfMonths, navigation);
  const cells = document.querySelectorAll('button[data-date]').length;
  s.reset();
  let t = performance.now();
  act(() => fireEvent.click(day('2026-11-13'), { detail: 1 }));
  const clickStart = performance.now() - t;
  const clickRenders = s.renders();
  s.reset();
  t = performance.now();
  for (const x of ['2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20']) act(() => fireEvent.pointerEnter(day(x), { pointerType: 'mouse' }));
  const hover = (performance.now() - t) / 4;
  const hoverRenders = s.renders() / 4;
  results.push({ case: label, cells, 'mount ms': s.mount.toFixed(1), 'click ms': clickStart.toFixed(1), 'click cell renders': clickRenders, 'hover ms': hover.toFixed(1), 'hover cell renders': hoverRenders });
  return { cells, clickRenders, hoverRenders };
}

describe('interaction cost', () => {
  it('re-renders only the cells whose state changed', () => {
    const two = measure('2 months paged', 2, 'paged');
    // Hovering the next day changes ~2 cells (old/new preview end + one band cell).
    expect(two.hoverRenders).toBeLessThanOrEqual(4);
    // Selecting a start changes eligibility of every day (phase switch) — a full pass is expected.
    expect(two.clickRenders).toBeLessThanOrEqual(two.cells);
  });

  it('12 continuous months stay bounded', () => {
    const twelve = measure('12 months continuous', 12, 'continuous');
    expect(twelve.hoverRenders).toBeLessThanOrEqual(4);
    // eslint-disable-next-line no-console
    console.table(results);
  });
});
