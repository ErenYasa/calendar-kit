import { StrictMode, createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import {
  Calendar,
  type CalendarController,
  type CalendarEvent,
  type DataStatus,
  type DateRange,
  dayRangeRules,
  messagesTr,
  stayRules,
  toCalendarDate as d,
  toCalendarMonth as m,
} from '../src';
import { computeTooltipPosition } from '../src/react/Tooltip';
import { resizeTo } from './setup';

const TODAY = d('2026-10-12');
const day = (date: string) => document.querySelector<HTMLElement>(`button[data-date="${date}"]`)!;
const titles = () => [...document.querySelectorAll('h2')].map((h) => h.textContent);
const months = () => [...document.querySelectorAll<HTMLElement>('section[data-month]')].map((s) => s.dataset.month);

describe('rendering', () => {
  it('renders the requested months with weekday headers and ARIA grid', () => {
    render(<Calendar mode="range" today={TODAY} locale="tr-TR" numberOfMonths={2} />);
    expect(titles()).toEqual(['Ekim 2026', 'Kasım 2026']);
    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(screen.getAllByRole('columnheader')[0]!.textContent).toBe('Pzt');
    expect(day('2026-10-12').getAttribute('aria-current')).toBe('date');
    // Only one tabbable day (roving tabindex).
    expect(document.querySelectorAll('button[data-date][tabindex="0"]')).toHaveLength(1);
  });

  it('places the reference month by monthPosition and applies disableFuture', () => {
    render(<Calendar mode="single" today={TODAY} numberOfMonths={2} monthPosition={2} disableFuture locale="en-US" />);
    expect(months()).toEqual(['2026-09', '2026-10']);
    expect(day('2026-10-13').getAttribute('aria-disabled')).toBe('true');
    expect(day('2026-10-12').getAttribute('aria-disabled')).toBeNull();
  });

  it('monthPosition 2 of 3 centres the reference; invalid positions are clamped', () => {
    const { rerender } = render(<Calendar mode="single" today={TODAY} numberOfMonths={3} monthPosition={2} />);
    expect(months()).toEqual(['2026-09', '2026-10', '2026-11']);
    rerender(<Calendar mode="single" today={TODAY} numberOfMonths={3} monthPosition={9} />);
    expect(months()).toEqual(['2026-08', '2026-09', '2026-10']);
    rerender(<Calendar mode="single" today={TODAY} numberOfMonths={3} monthPosition={2} minDate={d('2026-10-01')} />);
    expect(months()).toEqual(['2026-10', '2026-11', '2026-12']);
  });

  it('vertical orientation with 4 months', () => {
    render(<Calendar mode="single" today={TODAY} orientation="vertical" numberOfMonths={4} />);
    expect(months()).toHaveLength(4);
    expect(document.querySelector('.cal-root')!.getAttribute('data-orientation')).toBe('vertical');
  });
});

describe('range selection and events', () => {
  it('emits events in a documented order', () => {
    const events: string[] = [];
    const onChange = vi.fn();
    render(<Calendar mode="range" today={TODAY} defaultVisibleMonth={m('2026-11')} onChange={onChange} onEvent={(e) => events.push(e.type)} />);
    events.length = 0;
    fireEvent.click(day('2026-11-13'), { detail: 1 });
    expect(events).toEqual(['dateClick', 'dayFocusChange', 'change', 'activeEndpointChange']);
    events.length = 0;
    fireEvent.click(day('2026-11-20'), { detail: 1 });
    expect(events.slice(0, 5)).toEqual(['dateClick', 'dayFocusChange', 'change', 'activeEndpointChange', 'selectionComplete']);
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-11-13', end: '2026-11-20' }, expect.objectContaining({ reason: 'complete', source: 'pointer', phase: 'complete' }));
    expect(day('2026-11-13').getAttribute('data-range-start')).toBe('');
    expect(day('2026-11-16').getAttribute('data-in-range')).toBe('');
    expect(day('2026-11-20').getAttribute('data-range-end')).toBe('');
    // Exclusive semantics: end drawn but not included.
    expect(day('2026-11-20').getAttribute('data-included')).toBe('');
  });

  it('check-out day is drawn as end but not included for stays', () => {
    render(<Calendar mode="range" today={TODAY} rules={stayRules()} defaultValue={{ start: d('2026-11-13'), end: d('2026-11-20') }} />);
    expect(day('2026-11-20').hasAttribute('data-range-end')).toBe(true);
    expect(day('2026-11-20').hasAttribute('data-included')).toBe(false);
    expect(day('2026-11-19').hasAttribute('data-included')).toBe(true);
  });

  it('rejected activation reports a typed reason and does not change the value', () => {
    const onChange = vi.fn();
    const onInvalid = vi.fn();
    const rules = stayRules({ minNights: 2 });
    render(<Calendar mode="range" today={TODAY} rules={rules} defaultValue={{ start: d('2026-11-13'), end: null }} onChange={onChange} onInvalidSelection={onInvalid} />);
    fireEvent.click(day('2026-11-14'), { detail: 1 });
    expect(onChange).not.toHaveBeenCalled();
    expect(onInvalid.mock.calls[0]![0]).toMatchObject({ issue: { code: 'min-length' }, message: 'Minimum 2 nights' });
    expect(day('2026-11-14').getAttribute('aria-label')).toContain('Minimum 2 nights');
  });

  it('hover shows a preview range', () => {
    render(<Calendar mode="range" today={TODAY} defaultValue={{ start: d('2026-11-13'), end: null }} />);
    fireEvent.pointerEnter(day('2026-11-17'), { pointerType: 'mouse' });
    expect(day('2026-11-15').hasAttribute('data-preview')).toBe(true);
    expect(day('2026-11-17').hasAttribute('data-preview-end')).toBe(true);
  });
});

describe('controlled / uncontrolled', () => {
  it('controlled value updates the view without echoing onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Calendar mode="single" today={TODAY} value={d('2026-10-20')} onChange={onChange} />);
    expect(day('2026-10-20').hasAttribute('data-selected')).toBe(true);
    rerender(<Calendar mode="single" today={TODAY} value={d('2026-10-22')} onChange={onChange} />);
    expect(day('2026-10-22').hasAttribute('data-selected')).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('defaultValue is initial only', () => {
    const { rerender } = render(<Calendar mode="single" today={TODAY} defaultValue={d('2026-10-20')} />);
    rerender(<Calendar mode="single" today={TODAY} defaultValue={d('2026-10-25')} />);
    expect(day('2026-10-20').hasAttribute('data-selected')).toBe(true);
    expect(day('2026-10-25').hasAttribute('data-selected')).toBe(false);
  });

  it('reports an invalid initial value and revalidates when rules change, without modifying the value', () => {
    const onValidation = vi.fn();
    const value: DateRange = { start: d('2026-11-13'), end: d('2026-11-20') };
    const { rerender } = render(<Calendar mode="range" today={TODAY} value={value} onValidationChange={onValidation} />);
    expect(onValidation).toHaveBeenLastCalledWith(expect.objectContaining({ cause: 'initial', current: { valid: true, issue: null } }));
    const booked = stayRules({ getDayStatus: (x) => (x === '2026-11-16' ? 'booked' : 'available') });
    rerender(<Calendar mode="range" today={TODAY} value={value} rules={booked} onValidationChange={onValidation} />);
    expect(onValidation).toHaveBeenLastCalledWith(expect.objectContaining({ cause: 'rules', current: expect.objectContaining({ valid: false }) }));
    expect(onValidation.mock.lastCall![0].current.issue.code).toBe('blocked-in-range');
    expect(day('2026-11-20').hasAttribute('data-range-end')).toBe(true);
    // Same rules again (new identity) → no duplicate event.
    const count = onValidation.mock.calls.length;
    rerender(<Calendar mode="range" today={TODAY} value={value} rules={stayRules({ getDayStatus: (x) => (x === '2026-11-16' ? 'booked' : 'available') })} onValidationChange={onValidation} />);
    expect(onValidation.mock.calls.length).toBe(count);
  });

  it('controller clear/reset/select', () => {
    const ref = createRef<CalendarController>();
    const onClear = vi.fn();
    render(<Calendar ref={ref} mode="range" today={TODAY} defaultValue={{ start: d('2026-10-20'), end: d('2026-10-22') }} onSelectionClear={onClear} />);
    act(() => ref.current!.clear());
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(day('2026-10-20').hasAttribute('data-selected')).toBe(false);
    act(() => ref.current!.reset());
    expect(day('2026-10-20').hasAttribute('data-range-start')).toBe(true);
    let result;
    act(() => {
      result = ref.current!.select({ start: d('2026-10-25'), end: d('2026-10-24') });
    });
    expect(result).toMatchObject({ valid: false, issue: { code: 'end-before-start' } });
  });
});

describe('synchronised calendars', () => {
  function Sync({ show = [true, true, true] }: { show?: boolean[] }) {
    const [value, setValue] = useState<DateRange>({ start: null, end: null });
    return (
      <>
        {show.map((s, i) =>
          s ? (
            <div key={i} data-testid={`c${i}`}>
              <Calendar id={`c${i}`} mode="range" today={TODAY} value={value} onChange={setValue} locale={['tr-TR', 'en-US', 'de-DE'][i]} />
            </div>
          ) : null,
        )}
      </>
    );
  }
  const dayIn = (i: number, date: string) => screen.getByTestId(`c${i}`).querySelector<HTMLElement>(`button[data-date="${date}"]`)!;

  it('share value, phase and survive unmount / late mount', () => {
    const { rerender } = render(<Sync />);
    fireEvent.click(dayIn(0, '2026-10-20'), { detail: 1 });
    // Calendar 2 continues the same range (shared phase derived from value).
    fireEvent.click(dayIn(2, '2026-10-24'), { detail: 1 });
    for (const i of [0, 1, 2]) {
      expect(dayIn(i, '2026-10-20').hasAttribute('data-range-start')).toBe(true);
      expect(dayIn(i, '2026-10-24').hasAttribute('data-range-end')).toBe(true);
    }
    rerender(<Sync show={[true, false, true]} />);
    expect(dayIn(0, '2026-10-20').hasAttribute('data-range-start')).toBe(true);
    rerender(<Sync show={[true, true, true]} />);
    expect(dayIn(1, '2026-10-22').hasAttribute('data-in-range')).toBe(true);
    // Unique ids per instance
    expect(dayIn(0, '2026-10-20').id).not.toBe(dayIn(1, '2026-10-20').id);
  });
});

describe('keyboard', () => {
  it('arrows move focus, crossing into the next month navigates', () => {
    render(<Calendar mode="single" today={TODAY} />);
    const start = day('2026-10-31');
    act(() => start.focus());
    fireEvent.keyDown(start, { key: 'ArrowRight' });
    expect(months()).toEqual(['2026-11']);
    expect(document.activeElement).toBe(day('2026-11-01'));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(day('2026-11-08'));
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(document.activeElement).toBe(day('2026-12-08'));
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement).toBe(day('2026-12-06')); // en-US week starts Sunday
  });

  it('RTL flips horizontal arrows', () => {
    render(<Calendar mode="single" today={TODAY} locale="ar-EG" />);
    expect(document.querySelector('.cal-root')!.getAttribute('dir')).toBe('rtl');
    act(() => day('2026-10-12').focus());
    fireEvent.keyDown(day('2026-10-12'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(day('2026-10-11'));
  });

  it('Enter on a focused day selects it', () => {
    const onChange = vi.fn();
    render(<Calendar mode="single" today={TODAY} onChange={onChange} />);
    fireEvent.click(day('2026-10-15'), { detail: 0 });
    expect(onChange.mock.calls[0]![1]).toMatchObject({ source: 'keyboard' });
  });
});

describe('navigation', () => {
  it('goToMonth jumps without changing the selection; out of range is clamped', () => {
    const ref = createRef<CalendarController>();
    const onVisible = vi.fn();
    render(<Calendar ref={ref} mode="single" today={TODAY} numberOfMonths={2} defaultValue={d('2026-10-20')} maxDate={d('2027-06-30')} onVisibleMonthChange={onVisible} />);
    act(() => void ref.current!.goToMonth('2026-12'));
    expect(months()).toEqual(['2026-12', '2027-01']);
    expect(onVisible).toHaveBeenLastCalledWith('2026-12', expect.objectContaining({ source: 'programmatic', reason: 'jump', clamped: false }));
    expect(ref.current!.getSnapshot().selection.value).toBe('2026-10-20');
    let r;
    act(() => {
      r = ref.current!.goToMonth('2030-01');
    });
    expect(r).toEqual({ month: '2027-06', clamped: true });
    expect(months()).toEqual(['2027-05', '2027-06']);
  });

  it('continuous mode jumps to a far month without rendering the months in between', () => {
    const ref = createRef<CalendarController>();
    const onRendered = vi.fn();
    render(<Calendar ref={ref} mode="single" today={TODAY} navigation="continuous" orientation="vertical" numberOfMonths={2} onRenderedMonthsChange={onRendered} />);
    expect(months()).toEqual(['2026-10', '2026-11']);
    act(() => void ref.current!.goToMonth('2028-03'));
    expect(months()).toEqual(['2028-03', '2028-04']);
    expect(onRendered).toHaveBeenLastCalledWith(expect.objectContaining({ added: ['2028-03', '2028-04'], removed: ['2026-10', '2026-11'] }));
  });

  it('load more adds months, stops at maxDate and bounds the DOM', () => {
    const onLoadMore = vi.fn();
    render(
      <Calendar
        mode="single"
        today={TODAY}
        navigation="continuous"
        orientation="vertical"
        numberOfMonths={2}
        monthsPerLoad={2}
        maxRenderedMonths={4}
        maxDate={d('2027-03-31')}
        onLoadMore={onLoadMore}
        locale="tr-TR"
        messages={{ loadNext: 'Daha fazla tarih göster' }}
      />,
    );
    fireEvent.click(screen.getByText('Daha fazla tarih göster'));
    expect(months()).toEqual(['2026-10', '2026-11', '2026-12', '2027-01']);
    expect(onLoadMore.mock.calls[0]![0]).toMatchObject({ direction: 'next', months: ['2026-12', '2027-01'], trigger: 'button' });
    fireEvent.click(screen.getByText('Daha fazla tarih göster'));
    expect(months()).toEqual(['2026-12', '2027-01', '2027-02', '2027-03']);
    expect(screen.queryByText('Daha fazla tarih göster')).toBeNull();
  });
});

describe('focus during month loading', () => {
  it('moves focus into the grid when the load-more control disappears at the boundary', () => {
    render(
      <Calendar mode="single" today={TODAY} navigation="continuous" orientation="vertical" loadDirections="previous" defaultVisibleMonth={m('2026-12')} minDate={d('2026-10-01')} monthsPerLoad={2} />,
    );
    const btn = screen.getByText('Show earlier dates');
    act(() => btn.focus());
    fireEvent.click(btn);
    expect(months()).toEqual(['2026-10', '2026-11', '2026-12']);
    expect(screen.queryByText('Show earlier dates')).toBeNull();
    expect(document.activeElement).toBe(day('2026-10-01'));
  });
});

describe('loading, error and retry', () => {
  it('shows month loading, error with retry and reports transitions', () => {
    const onRetry = vi.fn();
    const onLoadingChange = vi.fn();
    const Wrapper = ({ status }: { status: Record<string, DataStatus> }) => (
      <Calendar
        mode="range"
        today={TODAY}
        numberOfMonths={2}
        getDataStatus={(mm) => status[mm] ?? 'unknown'}
        onRetry={onRetry}
        onLoadingChange={onLoadingChange}
      />
    );
    const { rerender } = render(<Wrapper status={{ '2026-10': 'loaded', '2026-11': 'unknown' }} />);
    expect(day('2026-11-05').getAttribute('aria-disabled')).toBe('true');
    rerender(<Wrapper status={{ '2026-10': 'loaded', '2026-11': 'loading' }} />);
    expect(document.querySelector('.cal-root')!.getAttribute('aria-busy')).toBe('true');
    expect(onLoadingChange.mock.lastCall![0].current).toMatchObject({ loadingMonths: ['2026-11'], busy: true });
    rerender(<Wrapper status={{ '2026-10': 'loaded', '2026-11': 'error' }} />);
    fireEvent.click(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledWith(['2026-11']);
    rerender(<Wrapper status={{ '2026-10': 'loaded', '2026-11': 'loaded' }} />);
    expect(day('2026-11-05').getAttribute('aria-disabled')).toBeNull();
    expect(onLoadingChange).toHaveBeenCalledTimes(3);
  });

  it('renderLoading receives scope and months', () => {
    const renderLoading = vi.fn(() => <div>custom loading</div>);
    render(<Calendar mode="single" today={TODAY} loading renderLoading={renderLoading} />);
    expect(screen.getByText('custom loading')).toBeTruthy();
    expect(renderLoading).toHaveBeenCalledWith(expect.objectContaining({ scope: 'initial', months: ['2026-10'] }), expect.anything());
  });
});

describe('responsive layout', () => {
  it('reduce-months / wrap / scroll strategies against container width', () => {
    const onLayout = vi.fn();
    const onResize = vi.fn();
    resizeTo(1000);
    const { rerender } = render(<Calendar mode="range" today={TODAY} numberOfMonths={3} overflow="reduce-months" onLayoutChange={onLayout} onResize={onResize} />);
    expect(months()).toHaveLength(3);
    // Two months need 2 × (7 × 40 + 2 × 8) + 32 = 624px.
    act(() => resizeTo(640));
    expect(months()).toHaveLength(2);
    expect(onLayout.mock.lastCall![0].current).toMatchObject({ requestedMonths: 3, effectiveMonths: 2, activeOverflow: 'reduce-months' });
    act(() => resizeTo(200));
    expect(months()).toHaveLength(1);
    expect(onLayout.mock.lastCall![0].current.activeOverflow).toBe('scroll');
    rerender(<Calendar mode="range" today={TODAY} numberOfMonths={3} overflow="wrap" onLayoutChange={onLayout} />);
    act(() => resizeTo(640));
    expect(months()).toHaveLength(3);
    expect(onLayout.mock.lastCall![0].current).toMatchObject({ columns: 2, activeOverflow: 'wrap' });
    rerender(<Calendar mode="range" today={TODAY} numberOfMonths={3} overflow="scroll" onLayoutChange={onLayout} />);
    expect(onLayout.mock.lastCall![0].current).toMatchObject({ columns: 3, activeOverflow: 'scroll', atMinDaySize: true });
    resizeTo(800);
  });

  it('keeps selection and focus across resizes', () => {
    resizeTo(1000);
    render(<Calendar mode="single" today={TODAY} numberOfMonths={2} overflow="reduce-months" defaultValue={d('2026-10-20')} />);
    act(() => day('2026-10-20').focus());
    act(() => resizeTo(300));
    expect(day('2026-10-20').hasAttribute('data-selected')).toBe(true);
    expect(document.activeElement).toBe(day('2026-10-20'));
    resizeTo(800);
  });
});

describe('tooltip', () => {
  it('shows the reason on hover for unavailable days, also on disabled ones', () => {
    const rules = stayRules({ getDayStatus: (x) => (x === '2026-10-16' ? 'booked' : 'available') });
    render(<Calendar mode="range" today={TODAY} rules={rules} messages={{ dayReasons: { 'check-out-only': 'Sadece çıkış' } }} />);
    fireEvent.pointerEnter(day('2026-10-16'), { pointerType: 'mouse' });
    expect(screen.getByRole('tooltip').textContent).toBe('Sadece çıkış');
    expect(day('2026-10-16').getAttribute('aria-describedby')).toContain('tooltip');
  });

  it('persistent guidance tooltip on the start date', () => {
    render(
      <Calendar
        mode="range"
        today={TODAY}
        defaultValue={{ start: d('2026-10-20'), end: null }}
        getDayTooltip={({ day: dd }) => (dd.selectedStart ? { content: 'Pick check-out', persistent: true } : null)}
      />,
    );
    expect(screen.getByRole('tooltip').textContent).toBe('Pick check-out');
  });

  it('placement: flips, moves to a side and never leaves the bounds', () => {
    const bounds = { left: 0, top: 0, right: 400, bottom: 800 };
    const tip = { width: 120, height: 30 };
    // No room above → below.
    const top = computeTooltipPosition({ left: 0, top: 4, width: 40, height: 40 }, tip, bounds, 'top', 8);
    expect(top.placement).toBe('bottom');
    expect(top.x).toBe(8);
    // Near the right edge → shifted left, never cut.
    const right = computeTooltipPosition({ left: 360, top: 400, width: 40, height: 40 }, tip, bounds, 'top', 8);
    expect(right.x + tip.width).toBeLessThanOrEqual(392);
    // A short calendar area: neither above nor below fits → side placement.
    const short = { left: 0, top: 100, right: 400, bottom: 160 };
    const side = computeTooltipPosition({ left: 300, top: 110, width: 40, height: 40 }, tip, short, 'top', 8);
    expect(side.placement).toBe('left');
    expect(side.x).toBeGreaterThanOrEqual(8);
    expect(side.y).toBeGreaterThanOrEqual(108);
    const side2 = computeTooltipPosition({ left: 20, top: 110, width: 40, height: 40 }, tip, short, 'top', 8);
    expect(side2.placement).toBe('right');
    // Anchor scrolled out of the clipping area → hidden.
    const clipped = computeTooltipPosition({ left: 100, top: 400, width: 40, height: 40 }, tip, bounds, 'top', 8, { left: 0, top: 0, right: 90, bottom: 800 });
    expect(clipped.hidden).toBe(true);
  });

  it('today has an explanatory tooltip', () => {
    render(<Calendar mode="single" today={TODAY} messages={messagesTr} />);
    fireEvent.pointerEnter(day('2026-10-12'), { pointerType: 'mouse' });
    expect(screen.getByRole('tooltip').textContent).toBe('Bugün');
  });
});

describe('schedule rules and custom dates', () => {
  it('Saturday → Saturday only; relaxSchedule allows any free range but keeps closed days', () => {
    const rules = dayRangeRules({ startWeekdays: [6], endWeekdays: [6], minDays: 8, getDayStatus: (x) => (x === '2026-10-28' ? 'closed' : undefined) });
    const { rerender } = render(<Calendar mode="range" today={TODAY} rules={rules} />);
    expect(day('2026-10-19').getAttribute('aria-disabled')).toBe('true'); // Monday
    expect(day('2026-10-17').getAttribute('aria-disabled')).toBeNull(); // Saturday
    rerender(<Calendar mode="range" today={TODAY} rules={rules} relaxSchedule />);
    expect(day('2026-10-19').getAttribute('aria-disabled')).toBeNull();
    expect(day('2026-10-28').getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(day('2026-10-19'), { detail: 1 });
    fireEvent.click(day('2026-10-23'), { detail: 1 });
    expect(day('2026-10-23').hasAttribute('data-range-end')).toBe(true);
  });

  it('weekends only, single day or range in the same calendar', () => {
    const onChange = vi.fn();
    render(<Calendar mode="range" today={TODAY} rules={dayRangeRules({ availableWeekdays: [6, 0], singleDayFirst: true })} onChange={onChange} />);
    expect(day('2026-10-21').getAttribute('aria-disabled')).toBe('true'); // Wednesday
    fireEvent.click(day('2026-10-17'), { detail: 1 });
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-10-17', end: '2026-10-17' }, expect.objectContaining({ phase: 'complete' }));
    fireEvent.click(day('2026-10-18'), { detail: 1 });
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-10-17', end: '2026-10-18' }, expect.anything());
    // Crossing weekdays is blocked.
    fireEvent.click(day('2026-10-24'), { detail: 1 }); // new single day (range complete → restart)
    fireEvent.click(day('2026-10-31'), { detail: 1 });
    expect(onChange.mock.lastCall![0]).toEqual({ start: '2026-10-24', end: '2026-10-24' });
    // Clicking the lone single day again clears it.
    fireEvent.click(day('2026-10-24'), { detail: 1 });
    expect(onChange.mock.lastCall![0]).toEqual({ start: null, end: null });
  });
});

describe('default UI details', () => {
  const cell = (date: string) => day(date).closest('.cal-day')!;

  it('singleDayFirst: hovering after a single day previews a continuous band (screenshot 1)', () => {
    render(<Calendar mode="range" today={TODAY} rules={dayRangeRules({ singleDayFirst: true })} />);
    fireEvent.click(day('2026-10-17'), { detail: 1 });
    fireEvent.pointerEnter(day('2026-10-18'), { pointerType: 'mouse' });
    expect(cell('2026-10-17').getAttribute('data-band')).toBe('start');
    expect(cell('2026-10-18').getAttribute('data-band')).toBe('end');
    expect(cell('2026-10-18').hasAttribute('data-band-preview')).toBe(true);
  });

  it('singleDayFirst: after completing, the hovered end keeps its band (screenshot 2)', () => {
    render(<Calendar mode="range" today={TODAY} rules={dayRangeRules({ singleDayFirst: true })} />);
    fireEvent.click(day('2026-10-17'), { detail: 1 });
    fireEvent.pointerEnter(day('2026-10-18'), { pointerType: 'mouse' });
    fireEvent.click(day('2026-10-18'), { detail: 1 });
    expect(cell('2026-10-17').getAttribute('data-band')).toBe('start');
    expect(cell('2026-10-18').getAttribute('data-band')).toBe('end');
    expect(cell('2026-10-18').hasAttribute('data-band-preview')).toBe(false);
    // A lone single day draws no band and no half-ring.
    fireEvent.click(day('2026-10-24'), { detail: 1 });
    expect(cell('2026-10-24').hasAttribute('data-band')).toBe(false);
  });

  it('no tooltips while days are loading', () => {
    const { rerender } = render(<Calendar mode="single" today={TODAY} getDataStatus={() => 'loading'} getDayTooltip={() => ({ content: 'x', persistent: true })} />);
    fireEvent.pointerEnter(day('2026-10-12'), { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    rerender(<Calendar mode="single" today={TODAY} loading />);
    fireEvent.pointerEnter(day('2026-10-12'), { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    rerender(<Calendar mode="single" today={TODAY} getDataStatus={() => 'loaded'} />);
    fireEvent.pointerEnter(day('2026-10-12'), { pointerType: 'mouse' });
    expect(screen.getByRole('tooltip').textContent).toBe('Today');
  });

  it('highlightToday={false} hides the today marker and tooltip', () => {
    render(<Calendar mode="single" today={TODAY} highlightToday={false} />);
    expect(document.querySelector('.cal-root')!.hasAttribute('data-highlight-today')).toBe(false);
    fireEvent.pointerEnter(day('2026-10-12'), { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('load-more label prop keeps the default button', () => {
    render(
      <Calendar mode="single" today={TODAY} navigation="continuous" orientation="vertical" loadMoreLabels={{ next: <strong>Daha fazla tarih göster</strong> }} />,
    );
    const btn = screen.getByText('Daha fazla tarih göster').closest('button')!;
    expect(btn.className).toContain('cal-load-more');
  });

  it('read-only calendars say so', () => {
    render(<Calendar mode="readonly" today={TODAY} messages={messagesTr} />);
    expect(screen.getByText('Yalnızca görüntüleme — tarih seçilemez')).toBeTruthy();
  });

  it('month loading shows only the skeleton (status text is screen-reader only)', () => {
    render(<Calendar mode="single" today={TODAY} getDataStatus={() => 'loading'} />);
    const status = screen.getByRole('status');
    expect(status.getAttribute('style')).toContain('clip');
    expect(document.querySelector('.cal-loading')).toBeNull();
  });

  it('range endpoints mark the band side', () => {
    render(<Calendar mode="range" today={TODAY} defaultValue={{ start: d('2026-10-14'), end: d('2026-10-17') }} />);
    expect(day('2026-10-14').closest('.cal-day')!.getAttribute('data-band')).toBe('start');
    expect(day('2026-10-17').closest('.cal-day')!.getAttribute('data-band')).toBe('end');
  });
});

describe('custom rendering', () => {
  it('renderDay + getDayProps merges handlers; preventDefault cancels selection', () => {
    const onChange = vi.fn();
    const userClick = vi.fn((e: { preventDefault(): void }, date: string) => {
      if (date === '2026-10-21') e.preventDefault();
    });
    render(
      <Calendar
        mode="single"
        today={TODAY}
        onChange={onChange}
        renderDay={({ day: dd, getDayProps }) => (
          <button {...getDayProps({ className: 'custom-day', onClick: (e) => userClick(e, dd.date) })}>{dd.dayOfMonth}</button>
        )}
      />,
    );
    expect(day('2026-10-20').className).toContain('custom-day');
    fireEvent.click(day('2026-10-21'), { detail: 1 });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(day('2026-10-20'), { detail: 1 });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(userClick).toHaveBeenCalledTimes(2);
  });

  it('day data, modifiers and class name callbacks', () => {
    render(
      <Calendar
        mode="single"
        today={TODAY}
        getDayData={(x) => (x === '2026-10-20' ? { label: '₺1.200', markers: [{ color: 'red' }, { color: 'blue' }], description: 'Discount' } : undefined)}
        modifiers={{ weekend: (dd) => dd.weekday === 0 || dd.weekday === 6 }}
        classNames={{ dayCell: (dd) => (dd.modifiers.weekend ? 'is-weekend' : undefined) }}
      />,
    );
    expect(day('2026-10-20').textContent).toContain('₺1.200');
    expect(day('2026-10-20').querySelectorAll('.cal-day-marker')).toHaveLength(2);
    expect(document.getElementById(day('2026-10-20').getAttribute('aria-describedby')!.split(' ')[0]!)!.textContent).toBe('Discount');
    expect(day('2026-10-17').closest('.cal-day')!.className).toContain('is-weekend');
    expect(day('2026-10-17').hasAttribute('data-mod-weekend')).toBe(true);
  });

  it('unstyled drops default class names', () => {
    render(<Calendar mode="single" today={TODAY} unstyled classNames={{ root: 'mine' }} />);
    expect(document.querySelector('.cal-root')).toBeNull();
    expect(document.querySelector('.mine')).not.toBeNull();
  });
});

describe('lifecycle', () => {
  it('onChange fires once per click under StrictMode', () => {
    const onChange = vi.fn();
    const onReady = vi.fn();
    render(
      <StrictMode>
        <Calendar mode="single" today={TODAY} onChange={onChange} onReady={onReady} />
      </StrictMode>,
    );
    fireEvent.click(day('2026-10-20'), { detail: 1 });
    expect(onChange).toHaveBeenCalledTimes(1);
    // StrictMode simulates unmount/remount of effects: ready may fire per (simulated) mount.
    expect(onReady.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it('callback identity changes do not re-emit events', () => {
    const events: CalendarEvent['type'][] = [];
    const { rerender } = render(<Calendar mode="single" today={TODAY} onEvent={(e) => events.push(e.type)} />);
    const n = events.length;
    rerender(<Calendar mode="single" today={TODAY} onEvent={(e) => events.push(e.type)} />);
    rerender(<Calendar mode="single" today={TODAY} onEvent={(e) => events.push(e.type)} />);
    expect(events.length).toBe(n);
  });

  it('outside click ignores the portal tooltip', () => {
    const onOutside = vi.fn();
    render(
      <div>
        <button>outside</button>
        <Calendar mode="single" today={TODAY} onOutsideClick={onOutside} getDayTooltip={() => ({ content: 'tip', persistent: true })} />
      </div>,
    );
    fireEvent.pointerDown(screen.getByRole('tooltip'));
    fireEvent.pointerDown(day('2026-10-20'));
    expect(onOutside).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});

describe('SSR', () => {
  it('renders on the server without window and hydrates without mismatch', async () => {
    const el = <Calendar mode="range" locale="tr-TR" numberOfMonths={2} defaultVisibleMonth={m('2026-11')} today={TODAY} />;
    const html = renderToString(el);
    expect(html).toContain('Kasım 2026');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...a) => errors.push(a));
    await act(async () => {
      hydrateRoot(container, el, { onRecoverableError: (e) => errors.push(e) });
    });
    spy.mockRestore();
    expect(errors).toEqual([]);
    container.remove();
  });

  it('without today, server output is deterministic (no month guessing)', () => {
    const html = renderToString(<Calendar mode="single" />);
    expect(html).not.toContain('data-month=');
    expect(html).toContain('role="status"');
  });
});
