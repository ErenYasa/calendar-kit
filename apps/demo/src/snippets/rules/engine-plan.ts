import { type SelectionState, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// 2-night minimum; the night of the 14th is booked.
const rules = stayRules({ minNights: 2, getDayStatus: (date) => (date === '2026-11-14' ? 'booked' : undefined) });
const empty: SelectionState = { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' };
const engine = createSelectionEngine({ rules, state: empty, today: null });

export const semantics = [engine.semantics, engine.allowSameDay]; // → ["exclusive", false]
export const dataStatus = engine.dataStatus(toCalendarDate('2026-11-13')); // → "loaded"

// checkStart includes the reachable-end search: from the 13th, every stay of
// 2+ nights crosses the booked night, so the start is rejected.
export const start13 = engine.checkStart(toCalendarDate('2026-11-13')); // → {"code": "min-length", "date": "2026-11-13", "params": {"min": 2, "unit": "nights"}, "dayReason": "check-out-only"}
// checkDay only looks at bounds, past/future and data status.
export const day13 = engine.checkDay(toCalendarDate('2026-11-13')); // → null

// plan() says what a click would do, and the state after it.
export const click13 = engine.plan(toCalendarDate('2026-11-13')).kind; // → "rejected"
export const click12 = engine.plan(toCalendarDate('2026-11-12')); // → {"kind": "start", "date": "2026-11-12", "issue": null, "next": {"selection": {"mode": "range", "value": {"start": "2026-11-12", "end": null}}, "activeEndpoint": "end"}}

// A new engine for the next state (engines are snapshots).
const choosingEnd = createSelectionEngine({ rules, state: engine.plan(toCalendarDate('2026-11-12')).next, today: null });
export const end13 = choosingEnd.plan(toCalendarDate('2026-11-13')).issue?.code; // → "min-length"
export const end14 = choosingEnd.plan(toCalendarDate('2026-11-14')).kind; // → "complete"
export const before = choosingEnd.plan(toCalendarDate('2026-11-10')).kind; // → "start"
