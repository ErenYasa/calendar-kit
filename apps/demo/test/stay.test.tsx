/**
 * F22 regression: the stay demo's "Özel tarih" switch must drive relaxSchedule
 * and the mobile example must use loadMoreLabels (both were lost once when the
 * file was overwritten outside the editor session).
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

async function loadStay() {
  const mod = await import('../src/examples/Stay');
  return mod;
}

const flushData = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(2000);
  });

describe('F22 stay demo', () => {
  it('"Özel tarih" relaxes the 2-night minimum', async () => {
    const { StayReference } = await loadStay();
    const { container } = render(<StayReference />);
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
      if (n && n.getAttribute('aria-label')?.includes('Minimum 2 gece')) {
        start = b.dataset.date!;
        break;
      }
      fireEvent.click(screen.getByText('Temizle'));
    }
    expect(start, 'a start with a min-stay-blocked next day').not.toBeNull();
    expect(btn(next(start!))!.getAttribute('aria-disabled')).toBe('true');
    const toggle = within(container).getByRole('switch');
    fireEvent.click(toggle);
    expect((toggle as HTMLInputElement).checked).toBe(true);
    expect(btn(next(start!))!.getAttribute('aria-disabled')).toBeNull();
  });

  it('mobile example labels both load-more buttons "Daha fazla tarih göster"', async () => {
    const { StayMobile } = await loadStay();
    render(<StayMobile />);
    await flushData();
    const buttons = screen.getAllByRole('button').filter((b) => b.classList.contains('cal-load-more'));
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) expect(b.textContent).toBe('Daha fazla tarih göster');
  });
});
