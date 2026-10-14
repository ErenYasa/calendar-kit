/**
 * Regression tests for docs/verification-findings.md. Each block names the
 * finding id; every test failed before its fix.
 */
import { describe, expect, it } from 'vitest';
import {
  type CalendarDate,
  type Selection,
  type SelectionRules,
  closedDates,
  combineRules,
  createSelectionEngine,
  stayRules,
  toCalendarDate as d,
} from '../src';

const TODAY = d('2026-10-12');
const range = (start: string | null, end: string | null): Selection => ({
  mode: 'range',
  value: { start: start as CalendarDate | null, end: end as CalendarDate | null },
});
const engine = (rules: SelectionRules, selection: Selection = range(null, null), activeEndpoint: 'start' | 'end' = 'start') =>
  createSelectionEngine({ rules, state: { selection, activeEndpoint }, today: TODAY });

describe('F02 combineRules ignores explicit undefined values', () => {
  it('keeps an earlier validator when a later set has validateSelection: undefined', () => {
    const check: SelectionRules['validateSelection'] = () => ({ code: 'custom', message: 'blocked' });
    const rules = combineRules({ validateSelection: check }, stayRules({ minNights: 2, validateSelection: undefined }));
    expect(rules.validateSelection).toBe(check);
    expect(engine(rules).validate(range('2026-11-13', '2026-11-16')).issue?.message).toBe('blocked');
  });

  it('keeps an earlier closed day when a later set has getDayAvailability: undefined', () => {
    const rules = combineRules(closedDates([d('2026-11-14')]), { getDayAvailability: undefined });
    expect(engine(rules).plan(d('2026-11-14')).issue?.code).toBe('closed');
  });

  it('keeps earlier scalar semantics when a later set leaves them undefined', () => {
    const rules = combineRules({ rangeSemantics: 'exclusive', unknownDataPolicy: 'allow' }, { rangeSemantics: undefined, unknownDataPolicy: undefined });
    expect(rules.rangeSemantics).toBe('exclusive');
    expect(rules.unknownDataPolicy).toBe('allow');
  });
});
