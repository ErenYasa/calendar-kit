import { type SelectionRules, createSelectionEngine, relaxRules, stayRules, toCalendarDate } from 'calendar-kit/core';

const check = (rules: SelectionRules, start: string, end: string) =>
  createSelectionEngine({ rules, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .validateRange(toCalendarDate(start), toCalendarDate(end)).issue ?? 'valid';

// Yalnızca cuma ve cumartesi geceleri. 13 Kasım 2026 bir cumadır.
const weekendNights = stayRules({ availableWeekdays: [5, 6] });
export const oneNight = check(weekendNights, '2026-11-13', '2026-11-14'); // → "valid"
// Yalnızca geceler kısıtlanır: pazar sabahı geçerli bir çıkıştır.
export const twoNights = check(weekendNights, '2026-11-13', '2026-11-15'); // → "valid"
// Pazar gecesi hâlâ kapalıdır; ne konaklamanın içinde ne de giriş olarak kullanılabilir.
export const sundayNight = check(weekendNights, '2026-11-13', '2026-11-16'); // → {"code": "blocked-in-range", "date": "2026-11-15", "dayReason": "out-of-schedule"}
export const noSundayArrival = check(weekendNights, '2026-11-15', '2026-11-16'); // → {"code": "start-not-allowed", "date": "2026-11-15", "dayReason": "out-of-schedule"}
// Bu bir takvim kuralıdır: relaxRules (relaxSchedule prop’u) onu kaldırır.
export const relaxed = check(relaxRules(weekendNights), '2026-11-15', '2026-11-16'); // → "valid"
