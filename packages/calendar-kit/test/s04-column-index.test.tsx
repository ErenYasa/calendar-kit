/**
 * S04 (docs/verification-findings.md): the empty cells before day 1 are
 * aria-hidden, so they are not in the accessibility tree; without explicit
 * positions Chrome exposed "Tuesday, December 1" as the first cell of its row,
 * under the "Sunday" column header. Cells and headers now carry aria-colindex.
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar, toCalendarDate as d, toCalendarMonth as m } from '../src';

describe('S04 column positions for assistive technology', () => {
  it('day cells and column headers carry aria-colindex matching their weekday column', () => {
    const { container } = render(<Calendar mode="single" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} />);
    const grid = container.querySelector('[role="grid"]')!;
    expect(grid.getAttribute('aria-colcount')).toBe('7');
    const headers = [...grid.querySelectorAll('[role="columnheader"]')].map((h) => [h.getAttribute('aria-label'), h.getAttribute('aria-colindex')]);
    expect(headers[0]).toEqual(['Sunday', '1']);
    expect(headers[2]).toEqual(['Tuesday', '3']);
    const cell = (date: string) => container.querySelector(`[role="gridcell"][data-date="${date}"]`)!;
    expect(cell('2026-12-01').getAttribute('aria-colindex')).toBe('3'); // Tuesday
    expect(cell('2026-12-05').getAttribute('aria-colindex')).toBe('7'); // Saturday
    expect(cell('2026-12-06').getAttribute('aria-colindex')).toBe('1'); // Sunday, next row
  });
  it('follows firstDayOfWeek', () => {
    const { container } = render(<Calendar mode="single" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} firstDayOfWeek={1} />);
    expect(container.querySelector('[role="columnheader"][aria-colindex="1"]')!.getAttribute('aria-label')).toBe('Monday');
    expect(container.querySelector('[role="gridcell"][data-date="2026-12-01"]')!.getAttribute('aria-colindex')).toBe('2'); // Tuesday
  });
});
