/**
 * Contract decisions for F46–F51 (docs/verification-findings.md).
 * Each test failed before its change.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());
import { Calendar, type LoadMoreRenderProps, toCalendarDate as d } from '../src';

const TODAY = d('2026-11-02');

describe('F46 renderLoadMore at the boundary', () => {
  it('is called with canLoad: false at maxDate so it can show a message or a disabled control', () => {
    const calls: LoadMoreRenderProps[] = [];
    render(
      <Calendar
        mode="single"
        today={TODAY}
        navigation="continuous"
        numberOfMonths={1}
        maxDate={d('2026-12-20')}
        renderLoadMore={(props) => {
          calls.push(props);
          return (
            <button type="button" disabled={!props.canLoad} onClick={props.loadMore}>
              {props.canLoad ? 'More' : 'No more dates'}
            </button>
          );
        }}
      />,
    );
    expect(calls.at(-1)?.canLoad).toBe(true);
    fireEvent.click(screen.getByText('More'));
    expect(calls.at(-1)?.canLoad).toBe(false);
    const btn = screen.getByText('No more dates') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    // loadMore() is inert at the boundary.
    act(() => calls.at(-1)!.loadMore());
    expect(document.querySelectorAll('[data-month]').length).toBe(2);
  });
  it('the default control is still removed at the boundary', () => {
    const { container } = render(<Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} maxDate={d('2026-12-20')} />);
    fireEvent.click(container.querySelector('.cal-load-more')!);
    expect(container.querySelector('.cal-load-more')).toBeNull();
  });
});

describe('F48 continuous + controlled visibleMonth takes the goToMonth path', () => {
  const scrolled: string[] = [];
  const setup = () => {
    scrolled.length = 0;
    vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(function (this: HTMLElement) {
      scrolled.push(this.dataset.month ?? '?');
    });
  };
  const months = () => [...document.querySelectorAll<HTMLElement>('[data-month]')].map((m) => m.dataset.month);

  it('scrolls to an already rendered month and keeps the loaded list', () => {
    setup();
    const { rerender, container } = render(<Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2026-11' as never} />);
    fireEvent.click(container.querySelector('.cal-load-more')!);
    fireEvent.click(container.querySelector('.cal-load-more')!);
    expect(months()).toEqual(['2026-11', '2026-12', '2027-01']);
    scrolled.length = 0;
    rerender(<Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2027-01' as never} />);
    expect(months()).toEqual(['2026-11', '2026-12', '2027-01']);
    expect(scrolled).toEqual(['2027-01']);
  });
  it('an unrendered month rebuilds the bounded list around it and scrolls to it; no visibleMonthChange for a prop change', () => {
    setup();
    const events: string[] = [];
    const { rerender } = render(
      <Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2026-11' as never} onEvent={(e) => events.push(e.type)} />,
    );
    events.length = 0;
    rerender(<Calendar mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2027-06' as never} onEvent={(e) => events.push(e.type)} />);
    expect(months()).toEqual(['2027-06']);
    expect(scrolled).toEqual(['2027-06']);
    expect(events).not.toContain('visibleMonthChange');
  });
  it('the parent echoing goToMonth does not scroll a second time', () => {
    setup();
    const ref = { current: null as null | import('../src').CalendarController };
    const { rerender, container } = render(<Calendar ref={ref} mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2026-11' as never} />);
    fireEvent.click(container.querySelector('.cal-load-more')!);
    scrolled.length = 0;
    act(() => void ref.current!.goToMonth('2026-12'));
    rerender(<Calendar ref={ref} mode="single" today={TODAY} navigation="continuous" numberOfMonths={1} visibleMonth={'2026-12' as never} />);
    expect(scrolled).toEqual(['2026-12']);
  });
});

describe('F49 getDayProps({ type: null }) for a non-button day element', () => {
  const renderDivDays = (onChange: (v: unknown) => void, role?: string) =>
    render(
      <Calendar
        mode="single"
        today={TODAY}
        onChange={onChange}
        renderDay={({ getDayProps, defaultContent }) => <div {...getDayProps({ type: null, role })}>{defaultContent}</div>}
      />,
    );
  it('writes no type attribute, adds role="button" and keeps roving focus', () => {
    const { container } = renderDivDays(() => {});
    const el = container.querySelector<HTMLElement>('div[data-date="2026-11-10"][id]')!;
    expect(el.tagName).toBe('DIV');
    expect(el.hasAttribute('type')).toBe(false);
    expect(el.getAttribute('role')).toBe('button');
    expect(container.querySelectorAll('[id][data-date][tabindex="0"]').length).toBe(1);
    act(() => el.focus());
    fireEvent.keyDown(el, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-11');
  });
  it('Enter and Space select the day', () => {
    const values: unknown[] = [];
    const { container } = renderDivDays((v) => values.push(v));
    const el = (date: string) => container.querySelector<HTMLElement>(`div[data-date="${date}"][id]`)!;
    act(() => el('2026-11-10').focus());
    fireEvent.keyDown(el('2026-11-10'), { key: 'Enter' });
    fireEvent.keyDown(el('2026-11-10'), { key: 'ArrowRight' });
    fireEvent.keyDown(el('2026-11-11'), { key: ' ' });
    expect(values).toEqual(['2026-11-10', '2026-11-11']);
  });
  it('a role you pass wins; the default getDayProps() still writes type="button"', () => {
    const { container } = renderDivDays(() => {}, 'option');
    expect(container.querySelector('div[data-date="2026-11-10"][id]')!.getAttribute('role')).toBe('option');
    const { container: c2 } = render(<Calendar mode="single" today={TODAY} renderDay={({ getDayProps, defaultContent }) => <button {...getDayProps()}>{defaultContent}</button>} />);
    expect(c2.querySelector('button[data-date="2026-11-10"]')!.getAttribute('type')).toBe('button');
  });
});

describe('F50 invalidSelection.date for a rejected select()', () => {
  it('is null (not an empty string) when the issue has no day, and the issue day otherwise', async () => {
    const { createRef } = await import('react');
    const ref = createRef<import('../src').CalendarController>();
    const dates: unknown[] = [];
    render(<Calendar ref={ref} mode="multiple" today={TODAY} rules={{ maxSelections: 1 }} minDate={d('2026-11-05')} onInvalidSelection={(e) => dates.push(e.date)} />);
    act(() => void ref.current!.select([d('2026-11-10'), d('2026-11-11')]));
    act(() => void ref.current!.select([d('2026-11-01')]));
    expect(dates).toEqual([null, '2026-11-01']);
  });
});
