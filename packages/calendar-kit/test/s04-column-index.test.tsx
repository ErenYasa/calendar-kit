/**
 * S04 (docs/verification-findings.md): the empty cells before day 1 are
 * aria-hidden, so they are not in the accessibility tree; without explicit
 * positions Chrome exposed "Tuesday, December 1" as the first cell of its row,
 * under the "Sunday" column header. Cells and headers now carry aria-colindex.
 *
 * Real VoiceOver in Safari 26 ignores aria-colindex: with VO+↑ from "December 3"
 * (Thursday) it reached the "Tuesday" header and from "December 1" the "Sunday"
 * header. The empty cells are therefore no longer aria-hidden: each day's position
 * among the exposed cells of its row must equal its weekday column.
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
  it('keeps the empty cells before day 1 in the accessibility tree, so the order in the row matches the column', () => {
    for (const firstDayOfWeek of [0, 1] as const) {
      const { container, unmount } = render(<Calendar mode="single" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} firstDayOfWeek={firstDayOfWeek} />);
      const rows = [...container.querySelectorAll('[role="grid"] [role="row"]')].filter((r) => r.querySelector('[role="gridcell"]'));
      for (const row of rows) {
        // Cells an assistive technology sees, in order (nothing aria-hidden on the way).
        const exposed = [...row.querySelectorAll('[role="gridcell"]')].filter((c) => !c.closest('[aria-hidden="true"]'));
        exposed.forEach((cell, i) => expect(cell.getAttribute('aria-colindex')).toBe(String(i + 1)));
      }
      const first = rows[0]!;
      const exposed = [...first.querySelectorAll('[role="gridcell"]')].filter((c) => !c.closest('[aria-hidden="true"]'));
      expect(exposed).toHaveLength(7);
      // 1 Dec 2026 is a Tuesday: third column with Sunday first, second with Monday first.
      expect(exposed.findIndex((c) => c.getAttribute('data-date') === '2026-12-01')).toBe(firstDayOfWeek === 0 ? 2 : 1);
      unmount();
    }
  });
  it('follows firstDayOfWeek', () => {
    const { container } = render(<Calendar mode="single" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} firstDayOfWeek={1} />);
    expect(container.querySelector('[role="columnheader"][aria-colindex="1"]')!.getAttribute('aria-label')).toBe('Monday');
    expect(container.querySelector('[role="gridcell"][data-date="2026-12-01"]')!.getAttribute('aria-colindex')).toBe('2'); // Tuesday
  });
});
