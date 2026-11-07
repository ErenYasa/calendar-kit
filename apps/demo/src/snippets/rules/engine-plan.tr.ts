import { type SelectionState, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// En az 2 gece; 14’ünün gecesi dolu.
const rules = stayRules({ minNights: 2, getDayStatus: (date) => (date === '2026-11-14' ? 'booked' : undefined) });
const empty: SelectionState = { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' };
const engine = createSelectionEngine({ rules, state: empty, today: null });

export const semantics = [engine.semantics, engine.allowSameDay]; // → ["exclusive", false]
export const dataStatus = engine.dataStatus(toCalendarDate('2026-11-13')); // → "loaded"

// checkStart ulaşılabilir bitiş aramasını da içerir: 13’ünden başlayan 2+ gecelik
// her konaklama dolu geceyi kapsar, bu yüzden başlangıç reddedilir.
export const start13 = engine.checkStart(toCalendarDate('2026-11-13')); // → {"code": "min-length", "date": "2026-11-13", "params": {"min": 2, "unit": "nights"}, "dayReason": "check-out-only"}
// checkDay yalnızca sınırlara, geçmiş/geleceğe ve veri durumuna bakar.
export const day13 = engine.checkDay(toCalendarDate('2026-11-13')); // → null

// plan() bir tıklamanın ne yapacağını ve sonrasındaki durumu söyler.
export const click13 = engine.plan(toCalendarDate('2026-11-13')).kind; // → "rejected"
export const click12 = engine.plan(toCalendarDate('2026-11-12')); // → {"kind": "start", "date": "2026-11-12", "issue": null, "next": {"selection": {"mode": "range", "value": {"start": "2026-11-12", "end": null}}, "activeEndpoint": "end"}}

// Sonraki durum için yeni bir motor (motorlar anlık durumdur).
const choosingEnd = createSelectionEngine({ rules, state: engine.plan(toCalendarDate('2026-11-12')).next, today: null });
export const end13 = choosingEnd.plan(toCalendarDate('2026-11-13')).issue?.code; // → "min-length"
export const end14 = choosingEnd.plan(toCalendarDate('2026-11-14')).kind; // → "complete"
export const before = choosingEnd.plan(toCalendarDate('2026-11-10')).kind; // → "start"
