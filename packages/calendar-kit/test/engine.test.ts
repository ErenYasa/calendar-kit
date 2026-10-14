import { describe, expect, it } from 'vitest';
import {
  type CalendarDate,
  type DateRange,
  type Selection,
  type SelectionRules,
  closedDates,
  combineRules,
  countDays,
  countNights,
  createSelectionEngine,
  dayRangeRules,
  getIncludedDays,
  relaxRules,
  stayRules,
  toCalendarDate as d,
} from '../src';

const TODAY = d('2026-10-12');
const range = (start: string | null, end: string | null): Selection => ({
  mode: 'range',
  value: { start: start as CalendarDate | null, end: end as CalendarDate | null },
});
function engine(rules: SelectionRules, selection: Selection = range(null, null), activeEndpoint: 'start' | 'end' = 'start') {
  return createSelectionEngine({ rules, state: { selection, activeEndpoint }, today: TODAY });
}

describe('range semantics', () => {
  const r: DateRange = { start: d('2026-11-13'), end: d('2026-11-20') };
  it('nights vs included days vs single date', () => {
    expect(countNights(r)).toBe(7);
    expect(countDays(r)).toBe(8);
    expect(getIncludedDays(r, 'exclusive')).toHaveLength(7);
    expect(getIncludedDays(r, 'exclusive').at(-1)).toBe('2026-11-19');
    expect(getIncludedDays(r, 'inclusive')).toHaveLength(8);
    expect(getIncludedDays({ start: r.start, end: r.start }, 'exclusive')).toEqual(['2026-11-13']);
  });
});

describe('single / multiple / readonly', () => {
  it('single selects and rejects closed days', () => {
    const e = createSelectionEngine({
      rules: closedDates([d('2026-11-14')]),
      state: { selection: { mode: 'single', value: null }, activeEndpoint: 'start' },
      today: TODAY,
    });
    expect(e.plan(d('2026-11-13')).kind).toBe('select');
    const p = e.plan(d('2026-11-14'));
    expect(p.kind).toBe('rejected');
    expect(p.issue?.code).toBe('closed');
  });

  it('multiple toggles and caps the count', () => {
    const sel: Selection = { mode: 'multiple', value: [d('2026-11-01'), d('2026-11-02')] };
    const e = createSelectionEngine({ rules: { maxSelections: 2 }, state: { selection: sel, activeEndpoint: 'start' }, today: TODAY });
    expect(e.plan(d('2026-11-01')).kind).toBe('toggle-off');
    const p = e.plan(d('2026-11-03'));
    expect(p.kind).toBe('rejected');
    expect(p.issue?.code).toBe('max-selections');
  });

  it('readonly never changes', () => {
    const e = createSelectionEngine({ rules: {}, state: { selection: { mode: 'readonly', value: null }, activeEndpoint: 'start' }, today: TODAY });
    expect(e.plan(d('2026-11-01')).kind).toBe('none');
  });
});

describe('range transitions', () => {
  it('start → end → restart', () => {
    let e = engine({});
    let p = e.plan(d('2026-11-13'));
    expect(p.kind).toBe('start');
    expect(p.next.activeEndpoint).toBe('end');
    e = engine({}, p.next.selection, p.next.activeEndpoint);
    p = e.plan(d('2026-11-20'));
    expect(p.kind).toBe('complete');
    expect(p.next.selection.value).toEqual({ start: '2026-11-13', end: '2026-11-20' });
    expect(p.next.activeEndpoint).toBe('start');
    e = engine({}, p.next.selection, 'start');
    expect(e.plan(d('2026-11-15')).next.selection.value).toEqual({ start: '2026-11-15', end: null });
  });

  it('clicking before the start restarts the range', () => {
    const p = engine({}, range('2026-11-13', null), 'end').plan(d('2026-11-10'));
    expect(p.kind).toBe('start');
    expect(p.next.selection.value).toEqual({ start: '2026-11-10', end: null });
  });

  it('same day: inclusive completes, exclusive clears unless allowed', () => {
    expect(engine({ rangeSemantics: 'inclusive' }, range('2026-11-13', null), 'end').plan(d('2026-11-13')).kind).toBe('complete');
    expect(engine(stayRules(), range('2026-11-13', null), 'end').plan(d('2026-11-13')).kind).toBe('clear');
    const sameDay = engine(stayRules({ allowSameDay: true }), range('2026-11-13', null), 'end').plan(d('2026-11-13'));
    expect(sameDay.kind).toBe('complete');
    expect(sameDay.next.selection.value).toEqual({ start: '2026-11-13', end: '2026-11-13' });
  });

  it('activeEndpoint=end edits the end of a complete range', () => {
    const p = engine({}, range('2026-11-13', '2026-11-20'), 'end').plan(d('2026-11-25'));
    expect(p.next.selection.value).toEqual({ start: '2026-11-13', end: '2026-11-25' });
  });
});

describe('lengths', () => {
  it('minimum nights is measured in nights for stays', () => {
    const e = engine(stayRules({ minNights: 2 }), range('2026-11-13', null), 'end');
    expect(e.plan(d('2026-11-14')).issue).toMatchObject({ code: 'min-length', params: { min: 2, actual: 1, unit: 'nights' } });
    expect(e.plan(d('2026-11-15')).kind).toBe('complete');
  });

  it('minimum days is measured inclusively', () => {
    const e = engine(dayRangeRules({ minDays: 2 }), range('2026-11-13', null), 'end');
    expect(e.plan(d('2026-11-13')).issue?.code).toBe('min-length');
    expect(e.plan(d('2026-11-14')).kind).toBe('complete');
  });

  it('maximum and fixed length', () => {
    expect(engine(stayRules({ maxNights: 3 }), range('2026-11-13', null), 'end').plan(d('2026-11-17')).issue?.code).toBe('max-length');
    const p = engine(stayRules({ fixedNights: 7 })).plan(d('2026-11-14'));
    expect(p.kind).toBe('complete');
    expect(p.next.selection.value).toEqual({ start: '2026-11-14', end: '2026-11-21' });
    const days = engine(dayRangeRules({ fixedDays: 3 })).plan(d('2026-11-14'));
    expect(days.next.selection.value).toEqual({ start: '2026-11-14', end: '2026-11-16' });
  });
});

describe('day rules', () => {
  // Nights of 15 and 16 are booked.
  const booked = new Set(['2026-11-15', '2026-11-16']);
  const stay = stayRules({ getDayStatus: (x) => (booked.has(x) ? 'booked' : 'available') });

  it('first booked night is check-out only, fully booked days are closed', () => {
    const e = engine(stay);
    expect(e.plan(d('2026-11-15')).issue).toMatchObject({ code: 'start-not-allowed', dayReason: 'check-out-only' });
    expect(e.plan(d('2026-11-16')).issue).toMatchObject({ code: 'closed', dayReason: 'booked' });
  });

  it('a stay may end on the check-out-only day but cannot pass through it', () => {
    const e = engine(stay, range('2026-11-13', null), 'end');
    expect(e.plan(d('2026-11-15')).kind).toBe('complete');
    expect(e.plan(d('2026-11-18')).issue).toMatchObject({ code: 'blocked-in-range', date: '2026-11-15' });
  });

  it('validates every included day, not only endpoints', () => {
    const e = engine(combineRules(dayRangeRules(), closedDates([d('2026-11-16')])));
    expect(e.validateRange(d('2026-11-13'), d('2026-11-20')).issue).toMatchObject({ code: 'blocked-in-range', date: '2026-11-16' });
  });

  it('check-in-only and check-out-only', () => {
    const r = stayRules({ getDayStatus: (x) => (x === '2026-11-20' ? 'check-in-only' : x === '2026-11-13' ? 'check-out-only' : 'available') });
    expect(engine(r).plan(d('2026-11-13')).issue?.code).toBe('start-not-allowed');
    expect(engine(r, range('2026-11-14', null), 'end').plan(d('2026-11-20')).issue?.code).toBe('end-not-allowed');
  });

  it('rejects a start without reachable end under a minimum', () => {
    const r = stayRules({ minNights: 2, getDayStatus: (x) => (x === '2026-11-14' ? 'booked' : 'available') });
    expect(engine(r).plan(d('2026-11-13')).issue?.code).toBe('min-length');
    // 12 → 14 is two nights with check-out on the booked night's morning.
    expect(engine(r).plan(d('2026-11-12')).kind).toBe('start');
  });

  it('weekday, bounds, past/future', () => {
    const e = engine({ startWeekdays: [6], minDate: d('2026-10-01'), maxDate: d('2027-01-31'), disablePast: true });
    expect(e.plan(d('2026-11-14')).kind).toBe('start'); // Saturday
    expect(e.plan(d('2026-11-13')).issue?.code).toBe('weekday-start');
    expect(e.plan(d('2026-10-10')).issue?.code).toBe('past');
    expect(e.plan(d('2027-02-06')).issue?.code).toBe('after-max');
    expect(engine({ disableFuture: true }).plan(d('2026-10-13')).issue?.code).toBe('future');
  });

  it('unknown data is not available by default and the policy is configurable', () => {
    const status = (m: string) => (m === '2026-11' ? 'loaded' : m === '2026-12' ? 'loading' : 'unknown') as never;
    expect(engine({ getDataStatus: status }).plan(d('2026-12-01')).issue?.code).toBe('data-loading');
    expect(engine({ getDataStatus: status }).plan(d('2027-01-01')).issue?.code).toBe('data-unknown');
    expect(engine({ getDataStatus: status, unknownDataPolicy: 'allow' }).plan(d('2027-01-01')).kind).toBe('start');
  });

  it('custom validateSelection with external context', () => {
    const e = createSelectionEngine({
      rules: {
        validateSelection: (sel, ctx) =>
          sel.mode === 'range' && sel.value.end && (ctx.context as { guests: number }).guests > 4 ? { code: 'custom', message: 'Too many guests' } : null,
      },
      state: { selection: range('2026-11-13', null), activeEndpoint: 'end' },
      today: TODAY,
      context: { guests: 6 },
    });
    expect(e.plan(d('2026-11-15')).issue).toMatchObject({ code: 'custom', message: 'Too many guests' });
  });
});

describe('validate (initial / revalidation)', () => {
  it('reports invalid values without changing them', () => {
    const e = engine(stayRules({ minNights: 3 }));
    expect(e.validate(range('2026-11-13', '2026-11-14')).issue?.code).toBe('min-length');
    expect(e.validate(range('2026-02-30', null)).issue?.code).toBe('invalid-date');
    expect(e.validate(range('2026-11-20', '2026-11-13')).issue?.code).toBe('end-before-start');
    expect(e.validate(range(null, null)).valid).toBe(true);
  });
});

describe('combineRules', () => {
  it('intersects bounds and lengths without mutating inputs', () => {
    const a: SelectionRules = { minDate: d('2026-01-01'), maxLength: 10, startWeekdays: [1, 2, 3] };
    const b: SelectionRules = { minDate: d('2026-02-01'), maxLength: 5, startWeekdays: [2, 3, 4] };
    const frozenA = JSON.stringify(a);
    const c = combineRules(a, b);
    expect(c.minDate).toBe('2026-02-01');
    expect(c.maxLength).toBe(5);
    expect(c.startWeekdays).toEqual([2, 3]);
    expect(JSON.stringify(a)).toBe(frozenA);
  });
});

describe('schedule rules', () => {
  it('availableWeekdays closes other weekdays and blocks ranges through them', () => {
    const e = engine({ availableWeekdays: [6, 0] });
    expect(e.plan(d('2026-10-21')).issue).toMatchObject({ code: 'closed', dayReason: 'out-of-schedule' });
    expect(e.validateRange(d('2026-10-17'), d('2026-10-25')).issue?.code).toBe('blocked-in-range');
  });

  it('relaxRules drops schedule rules and schedule-tagged availability only', () => {
    const rules: SelectionRules = {
      startWeekdays: [6],
      minLength: 7,
      getDayAvailability: (x) => (x === '2026-11-02' ? { closed: true, schedule: true } : x === '2026-11-03' ? { closed: true } : undefined),
    };
    const relaxed = relaxRules(rules);
    expect(relaxed.startWeekdays).toBeUndefined();
    expect(relaxed.minLength).toBeUndefined();
    expect(engine(relaxed).plan(d('2026-11-02')).kind).toBe('start');
    expect(engine(relaxed).plan(d('2026-11-03')).kind).toBe('rejected');
    expect(rules.startWeekdays).toEqual([6]); // not mutated
    expect(relaxRules(rules, { length: false }).minLength).toBe(7);
  });

  it('singleDayFirst completes on first click and extends on the second', () => {
    const r = dayRangeRules({ singleDayFirst: true });
    const first = engine(r).plan(d('2026-11-14'));
    expect(first).toMatchObject({ kind: 'complete', next: { selection: { value: { start: '2026-11-14', end: '2026-11-14' } }, activeEndpoint: 'end' } });
    const second = engine(r, first.next.selection, 'end').plan(d('2026-11-16'));
    expect(second.next.selection.value).toEqual({ start: '2026-11-14', end: '2026-11-16' });
    expect(engine(r, first.next.selection, 'end').plan(d('2026-11-14')).kind).toBe('clear');
    // Falls back to a normal start when a single day is not valid.
    expect(engine(dayRangeRules({ singleDayFirst: true, minDays: 2 })).plan(d('2026-11-14')).kind).toBe('start');
  });
});
