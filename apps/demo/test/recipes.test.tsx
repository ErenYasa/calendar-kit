/**
 * F22 regression (moved with the docs site): the home rental recipe's
 * "Custom dates" switch must drive relaxSchedule, and the progressive months
 * example must use loadMoreLabels.
 */
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.setSystemTime(new Date('2026-10-12T09:00:00Z'));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});


const flushData = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(2000);
  });

describe('F22 docs examples', () => {
  it('"Custom dates" relaxes the 2-night minimum in the home rental recipe', async () => {
    const { default: HomeRental } = await import('../src/examples/recipes/HomeRental');
    const { container } = render(<HomeRental />);
    await flushData();
    const btn = (date: string) => container.querySelector<HTMLElement>(`button[data-date="${date}"]`);
    const next = (date: string) => {
      const d = new Date(`${date}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + 1);
      return d.toISOString().slice(0, 10);
    };
    // Find a start whose next day is blocked only by the minimum stay.
    let start: string | null = null;
    for (const b of [...container.querySelectorAll<HTMLElement>('button[data-date]:not([aria-disabled])')]) {
      fireEvent.click(b, { detail: 1 });
      const n = btn(next(b.dataset.date!));
      if (n && n.getAttribute('aria-label')?.includes('Minimum 2 nights')) {
        start = b.dataset.date!;
        break;
      }
      fireEvent.click(screen.getByText('Clear'));
    }
    expect(start, 'a start with a min-stay-blocked next day').not.toBeNull();
    expect(btn(next(start!))!.getAttribute('aria-disabled')).toBe('true');
    const toggle = within(container).getByRole('switch');
    fireEvent.click(toggle);
    expect((toggle as HTMLInputElement).checked).toBe(true);
    expect(btn(next(start!))!.getAttribute('aria-disabled')).toBeNull();
  });

  it('the progressive months example labels both load-more buttons', async () => {
    const { default: LoadMore } = await import('../src/examples/features/LoadMore');
    render(<LoadMore />);
    await flushData();
    const buttons = screen.getAllByRole('button').filter((b) => b.classList.contains('cal-load-more'));
    expect(buttons.map((b) => b.textContent).sort()).toEqual(['Show more dates ↓', '↑ Show earlier dates']);
  });
});
