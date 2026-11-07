/**
 * Live examples keep working whenever they are opened: dates are derived from
 * the day the example mounts, never hard-coded.
 */
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { type ComponentType, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const examples = import.meta.glob<{ default: ComponentType }>('../src/examples/**/*.tsx');
// Examples whose visible days are all unselectable on purpose.
const ALL_DISABLED_BY_DESIGN = new Set(['features/GoToMonth', 'features/ModeReadonly']);
// Examples that show a button and open the calendar on demand.
const ON_DEMAND = new Set(['features/Modal', 'features/Popover']);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const at = (iso: string) => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.setSystemTime(new Date(iso));
};
const months = (root: ParentNode = document) => [...root.querySelectorAll('.cal-month')].map((m) => m.getAttribute('data-month'));

describe.each(['2026-01-15T10:00:00', '2026-11-20T10:00:00', '2026-12-31T23:30:00', '2027-02-28T12:00:00'])('opened on %s', (now) => {
  it('every example renders and offers selectable days', async () => {
    at(now);
    for (const [path, load] of Object.entries(examples)) {
      const name = path.replace('../src/examples/', '').replace('.tsx', '');
      const { default: Example } = await load();
      const { container, unmount } = render(<Example />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4000); // simulated data requests, initial load
      });
      if (ON_DEMAND.has(name)) expect(container.querySelector('button'), name).not.toBeNull();
      else {
        expect(container.querySelector('[role=grid]'), `${name} renders a calendar`).not.toBeNull();
        // Day elements are <button>s, or role="button" elements from getDayProps({ type: null }).
        const enabled = container.querySelectorAll('button[data-date]:not([aria-disabled]), [role=button][data-date]:not([aria-disabled])').length;
        if (!ALL_DISABLED_BY_DESIGN.has(name)) expect(enabled, `${name} has selectable days`).toBeGreaterThan(0);
      }
      unmount();
    }
  }, 60_000);
});

describe('relative start month', () => {
  it.each([
    ['2026-01-15T10:00:00', '2026-03'],
    ['2026-11-20T10:00:00', '2027-01'],
    ['2026-12-31T23:30:00', '2027-02'],
  ])('progressive months example opened on %s starts at %s', async (now, first) => {
    at(now);
    const { default: LoadMore } = await import('../src/examples/features/LoadMore');
    render(<LoadMore />);
    expect(months()[0]).toBe(first);
  });

  it('the navigated month survives re-renders and midnight', async () => {
    at('2026-11-30T23:59:00');
    const { default: Uncontrolled } = await import('../src/examples/concepts/Uncontrolled');
    function Host() {
      const [n, setN] = useState(0);
      return (
        <div>
          <button type="button" onClick={() => setN(n + 1)}>
            rerender {n}
          </button>
          <Uncontrolled />
        </div>
      );
    }
    const { getByText } = render(<Host />);
    const before = months();
    fireEvent.click(document.querySelector<HTMLElement>('.cal-nav-button[data-direction="next"]')!);
    const navigated = months();
    expect(navigated).not.toEqual(before);
    await act(async () => {
      vi.setSystemTime(new Date('2026-12-01T00:00:30'));
      await vi.advanceTimersByTimeAsync(60_000);
    });
    fireEvent.click(getByText(/rerender/));
    expect(months()).toEqual(navigated);
  });
});
