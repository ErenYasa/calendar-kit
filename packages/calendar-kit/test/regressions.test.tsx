/**
 * Regression tests for docs/verification-findings.md. Each block names the
 * finding id; every test failed before its fix.
 */
import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Calendar,
  type CalendarController,
  type CalendarDate,
  type DayRenderContext,
  type Selection,
  type SelectionRules,
  closedDates,
  combineRules,
  createSelectionEngine,
  relaxRules,
  stayRules,
  toCalendarDate as d,
} from '../src';

const TODAY = d('2026-10-12');
const range = (start: string | null, end: string | null): Selection => ({
  mode: 'range',
  value: { start: start as CalendarDate | null, end: end as CalendarDate | null },
});
const engine = (rules: SelectionRules, selection: Selection = range(null, null), activeEndpoint: 'start' | 'end' = 'start') =>
  createSelectionEngine({ rules, state: { selection, activeEndpoint }, today: TODAY });

describe('F02 combineRules ignores explicit undefined values', () => {
  it('keeps an earlier validator when a later set has validateSelection: undefined', () => {
    const check: SelectionRules['validateSelection'] = () => ({ code: 'custom', message: 'blocked' });
    const rules = combineRules({ validateSelection: check }, stayRules({ minNights: 2, validateSelection: undefined }));
    expect(rules.validateSelection).toBe(check);
    expect(engine(rules).validate(range('2026-11-13', '2026-11-16')).issue?.message).toBe('blocked');
  });

  it('keeps an earlier closed day when a later set has getDayAvailability: undefined', () => {
    const rules = combineRules(closedDates([d('2026-11-14')]), { getDayAvailability: undefined });
    expect(engine(rules).plan(d('2026-11-14')).issue?.code).toBe('closed');
  });

  it('keeps earlier scalar semantics when a later set leaves them undefined', () => {
    const rules = combineRules({ rangeSemantics: 'exclusive', unknownDataPolicy: 'allow' }, { rangeSemantics: undefined, unknownDataPolicy: undefined });
    expect(rules.rangeSemantics).toBe('exclusive');
    expect(rules.unknownDataPolicy).toBe('allow');
  });
});

describe('F03 relaxing combined rules keeps real partial restrictions only', () => {
  const X = d('2026-10-20');
  const schedule: SelectionRules = { getDayAvailability: (x) => (x === X ? { closed: true, schedule: true, reason: 'out-of-season' } : undefined) };
  const real: SelectionRules = { getDayAvailability: (x) => (x === X ? { canEnd: false, reason: 'check-in-only' } : undefined) };

  it('relaxRules(combineRules(A, B)) equals combining the relaxed sets', () => {
    const e = engine(relaxRules(combineRules(schedule, real)));
    const a = e.availability(X);
    expect(a).toMatchObject({ closed: false, canStart: true, canEnd: false, reason: 'check-in-only' });
  });

  it('Calendar relaxSchedule lets the day start a range but not end one', () => {
    render(<Calendar mode="range" today={TODAY} rules={[schedule, real]} relaxSchedule />);
    const day = document.querySelector<HTMLElement>(`button[data-date="${X}"]`)!;
    expect(day.getAttribute('aria-disabled')).toBeNull();
    fireEvent.click(document.querySelector<HTMLElement>('button[data-date="2026-10-16"]')!, { detail: 1 });
    expect(document.querySelector<HTMLElement>(`button[data-date="${X}"]`)!.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('F04 maxRenderedMonths keeps bounding the DOM after interaction', () => {
  const months = () => [...document.querySelectorAll<HTMLElement>('section[data-month]')].map((s) => s.dataset.month);
  const setup = () => {
    const ref = createRef<CalendarController>();
    render(
      <>
        <input aria-label="outside" />
        <Calendar ref={ref} mode="single" today={TODAY} navigation="continuous" orientation="vertical" numberOfMonths={1} monthsPerLoad={1} maxRenderedMonths={3} />
      </>,
    );
    return ref;
  };

  it('applies the bound once focus has left the calendar', () => {
    const ref = setup();
    const day = document.querySelector<HTMLElement>('button[data-date="2026-10-15"]')!;
    act(() => day.focus());
    fireEvent.click(day, { detail: 1 });
    act(() => document.querySelector<HTMLElement>('input')!.focus());
    for (let i = 0; i < 6; i++) act(() => ref.current!.loadMore('next'));
    expect(months()).toEqual(['2027-02', '2027-03', '2027-04']);
  });

  it('never drops the month holding DOM focus, but still trims up to it', () => {
    const ref = setup();
    act(() => ref.current!.loadMore('next'));
    act(() => ref.current!.loadMore('next')); // Oct..Dec
    const day = document.querySelector<HTMLElement>('button[data-date="2026-11-10"]')!;
    act(() => day.focus());
    for (let i = 0; i < 3; i++) act(() => ref.current!.loadMore('next'));
    expect(months()[0]).toBe('2026-11'); // October trimmed, November kept
    expect(document.activeElement).toBe(document.querySelector('button[data-date="2026-11-10"]'));
    act(() => document.querySelector<HTMLElement>('input')!.focus());
    act(() => ref.current!.loadMore('next'));
    expect(months()).toHaveLength(3);
  });
});

describe('F05 day cells re-render when any rendered day state changes', () => {
  const cell = (date: string) => document.querySelector<HTMLElement>(`button[data-date="${date}"]`)!.closest('.cal-day')!;

  it('firstDayOfWeek change updates week start/end markers on every cell', () => {
    const { rerender } = render(<Calendar mode="single" today={TODAY} firstDayOfWeek={1} />);
    expect(cell('2026-10-12').hasAttribute('data-week-start')).toBe(true); // Monday
    rerender(<Calendar mode="single" today={TODAY} firstDayOfWeek={0} />);
    expect(cell('2026-10-12').hasAttribute('data-week-start')).toBe(false);
    expect(cell('2026-10-11').hasAttribute('data-week-start')).toBe(true); // Sunday
    expect(cell('2026-10-17').hasAttribute('data-week-end')).toBe(true); // Saturday
  });

  it('canStart change reaches stable renderDayContent while the click outcome is unchanged', () => {
    const content = ({ day }: DayRenderContext) => `${day.dayOfMonth}:${day.canStart ? 'S' : '-'}`;
    const value = { start: d('2026-10-14'), end: null };
    const { rerender } = render(<Calendar mode="range" today={TODAY} value={value} renderDayContent={content} rules={{}} />);
    expect(document.querySelector('button[data-date="2026-10-20"]')!.textContent).toBe('20:S');
    const rules: SelectionRules = { getDayAvailability: (x) => (x === '2026-10-20' ? { canStart: false } : undefined) };
    rerender(<Calendar mode="range" today={TODAY} value={value} renderDayContent={content} rules={rules} />);
    expect(document.querySelector('button[data-date="2026-10-20"]')!.textContent).toBe('20:-');
  });
});
