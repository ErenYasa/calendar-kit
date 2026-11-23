/**
 * S04b (docs/verification-findings.md): real VoiceOver in Safari 26 read a selected
 * day as "Tuesday, December 8, 2026, selected seçildi aç veya kapat düğmesi": the
 * word from the label plus the aria-pressed state. The state is now exposed once,
 * by aria-pressed (messages.selected is deprecated and no longer read).
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calendar, toCalendarDate as d, toCalendarMonth as m } from '../src';

const btn = (c: HTMLElement, date: string) => c.querySelector<HTMLElement>(`[role="gridcell"][data-date="${date}"] button`)!;

describe('S04b selected state is exposed once', () => {
  it('single mode: aria-pressed, no "selected" in the label', () => {
    const { container } = render(<Calendar mode="single" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} defaultValue={d('2026-12-08')} />);
    const b = btn(container, '2026-12-08');
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(b.getAttribute('aria-label')).toBe('Tuesday, December 8, 2026');
  });
  it('multiple mode: each selected day the same way', () => {
    const { container } = render(<Calendar mode="multiple" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} defaultValue={[d('2026-12-08'), d('2026-12-10')]} />);
    for (const date of ['2026-12-08', '2026-12-10']) {
      expect(btn(container, date).getAttribute('aria-pressed')).toBe('true');
      expect(btn(container, date).getAttribute('aria-label')).not.toMatch(/selected/i);
    }
  });
  it('range mode keeps start/end/in-range wording (it says more than the pressed state)', () => {
    const { container } = render(<Calendar mode="range" today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} defaultValue={{ start: d('2026-12-08'), end: d('2026-12-12') }} />);
    expect(btn(container, '2026-12-08').getAttribute('aria-label')).toMatch(/start date$/);
    expect(btn(container, '2026-12-12').getAttribute('aria-label')).toMatch(/end date$/);
    expect(btn(container, '2026-12-10').getAttribute('aria-label')).toMatch(/in selected range$/);
  });
  it('a custom messages.selected is not added to the label', () => {
    const { container } = render(<Calendar mode="single" messages={{ selected: 'SEL' }} today={d('2026-11-02')} defaultVisibleMonth={m('2026-12')} defaultValue={d('2026-12-08')} />);
    expect(btn(container, '2026-12-08').getAttribute('aria-label')).not.toContain('SEL');
  });
});
