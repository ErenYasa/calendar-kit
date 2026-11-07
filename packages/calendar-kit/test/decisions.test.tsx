/**
 * Contract decisions for F46–F51 (docs/verification-findings.md).
 * Each test failed before its change.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
