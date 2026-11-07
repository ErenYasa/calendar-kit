/**
 * Regression tests for the package issues found while documenting
 * (docs/verification-findings.md, F39–F51). Each failed before its fix.
 */
import { act, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Calendar,
  type SelectionRules,
  addDays,
  addMonths,
  addMonthsToMonth,
  createSelectionEngine,
  fromJSDate,
  getToday,
  mergeMessages,
  messagesEn,
  stayRules,
  toCalendarDate as d,
  toCalendarMonth,
} from '../src';

const TODAY = d('2026-11-02'); // a Monday
const engine = (rules: SelectionRules, start: string | null = null) =>
  createSelectionEngine({
    rules,
    today: TODAY,
    state: { selection: { mode: 'range', value: { start: start as never, end: null } }, activeEndpoint: start ? 'end' : 'start' },
  });
const range = (start: string, end: string) => ({ mode: 'range' as const, value: { start: d(start), end: d(end) } });

describe('F50 months added by keyboard navigation are reported as a load', () => {
  it('ArrowRight past the last rendered month emits loadMore with trigger "keyboard"', () => {
    const events: string[] = [];
    const { container } = render(
      <Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} onEvent={(e) => e.type === 'loadMore' && events.push(`${e.trigger}:${e.direction}:${e.months.join()}`)} />,
    );
    const last = container.querySelector<HTMLElement>('button[data-date="2026-11-30"]')!;
    act(() => last.focus());
    fireEvent.keyDown(last, { key: 'ArrowRight' });
    expect(events).toEqual(['keyboard:next:2026-12']);
  });
});
