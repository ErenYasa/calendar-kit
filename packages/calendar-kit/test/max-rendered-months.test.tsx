/**
 * maxRenderedMonths is a hard bound (docs/verification-findings.md, F54):
 * with maxRenderedMonths={3} and focus on a day the list used to grow to 5.
 */
import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Calendar, type CalendarController, toCalendarDate as d } from '../src';

const TODAY = d('2026-11-02');
const setup = () => {
  const ref = createRef<CalendarController>();
  const utils = render(
    <>
      <input aria-label="outside" />
      <Calendar ref={ref} mode="single" today={TODAY} navigation="continuous" loadDirections="both" numberOfMonths={1} monthsPerLoad={1} maxRenderedMonths={3} />
    </>,
  );
  const months = () => [...utils.container.querySelectorAll<HTMLElement>('section[data-month]')].map((s) => s.dataset.month);
  const focus = (date: string) => act(() => utils.container.querySelector<HTMLElement>(`button[data-date="${date}"]`)!.focus());
  return { ref, months, focus, ...utils };
};

describe('maxRenderedMonths with focus in the list', () => {
  it('reproduction: focus on November, four loads forward → still 3 months, focus on a kept day', () => {
    const { ref, months, focus } = setup();
    focus('2026-11-10');
    for (let i = 0; i < 4; i++) act(() => ref.current!.loadMore('next'));
    expect(months()).toEqual(['2027-01', '2027-02', '2027-03']);
    expect(document.activeElement?.getAttribute('data-date')).toBe('2027-01-10');
  });
  it('backwards: the bound holds and focus moves to the nearest kept month', () => {
    const { ref, months, focus } = setup();
    focus('2026-11-30');
    for (let i = 0; i < 4; i++) act(() => ref.current!.loadMore('previous'));
    expect(months()).toEqual(['2026-07', '2026-08', '2026-09']);
    // 30 September: the same day of the month exists.
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-09-30');
  });
  it('the day is clamped to the kept month (31st → 28 February)', () => {
    const { ref, months, focus } = setup();
    act(() => ref.current!.loadMore('next'));
    act(() => ref.current!.loadMore('next')); // Nov..Jan
    focus('2027-01-31');
    for (let i = 0; i < 3; i++) act(() => ref.current!.loadMore('next')); // ..Apr: Jan dropped
    expect(months()).toEqual(['2027-02', '2027-03', '2027-04']);
    expect(document.activeElement?.getAttribute('data-date')).toBe('2027-02-28');
  });
  it('a focused month that is kept keeps its focus', () => {
    const { ref, months, focus } = setup();
    act(() => ref.current!.loadMore('next'));
    focus('2026-12-05'); // Nov, Dec
    act(() => ref.current!.loadMore('next')); // Nov..Jan (3, no trim)
    act(() => ref.current!.loadMore('next')); // Dec..Feb
    expect(months()).toEqual(['2026-12', '2027-01', '2027-02']);
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-12-05');
  });
  it('keyboard navigation past the end extends and trims within the bound', () => {
    const { months, focus, container } = setup();
    focus('2026-11-30');
    for (let i = 0; i < 6; i++) {
      const el = document.activeElement as HTMLElement;
      fireEvent.keyDown(el, { key: 'PageDown' });
      expect(months().length).toBeLessThanOrEqual(3);
    }
    expect(document.activeElement && container.contains(document.activeElement)).toBe(true);
  });
  it('after focus leaves, the list is within the bound without another load', () => {
    const { ref, months, focus } = setup();
    focus('2026-11-10');
    for (let i = 0; i < 4; i++) act(() => ref.current!.loadMore('next'));
    act(() => document.querySelector<HTMLElement>('input')!.focus());
    expect(months().length).toBeLessThanOrEqual(3);
  });
});
