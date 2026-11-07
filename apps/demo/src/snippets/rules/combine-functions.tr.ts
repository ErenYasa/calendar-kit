import { type SelectionRules, combineRules, createSelectionEngine, toCalendarDate, toCalendarMonth } from 'calendar-kit/core';

const calls: string[] = [];
const schedule: SelectionRules = {
  // 14’ünde yalnızca giriş, takvim (schedule) kısıtlaması olarak.
  getDayAvailability: (date) => (date === '2026-11-14' ? { canEnd: false, reason: 'check-in-only', schedule: true } : undefined),
  getDataStatus: () => 'loading',
  validateSelection: () => {
    calls.push('schedule');
    return null;
  },
};
const maintenance: SelectionRules = {
  getDayAvailability: (date) => (date === '2026-11-14' ? { canStart: false, reason: 'maintenance' } : undefined),
  getDataStatus: (month) => (month === '2026-12' ? 'error' : 'loaded'),
  validateSelection: () => {
    calls.push('maintenance');
    return { code: 'custom', message: 'Fully booked' };
  },
};
const last: SelectionRules = {
  validateSelection: () => {
    calls.push('last');
    return { code: 'custom', message: 'Buraya hiç ulaşılmaz' };
  },
};
const rules = combineRules(schedule, maintenance, last);
const engine = createSelectionEngine({
  rules: { ...rules, unknownDataPolicy: 'allow' },
  state: { selection: { mode: 'single', value: null }, activeEndpoint: 'start' },
  today: null,
});

// Müsaitlik: bayraklar VE ile birleşir, sebebi günü kısıtlayan ilk sonuç verir
// ve gün yalnızca kısıtlayan her taraf öyle diyorsa "schedule" sayılır.
export const merged = engine.availability(toCalendarDate('2026-11-14')); // → {"closed": false, "canStart": false, "canEnd": false, "canPassThrough": true, "schedule": false, "reason": "check-in-only"}
// Veri durumu: en kötü durum kazanır (error > loading > unknown > loaded).
export const november = rules.getDataStatus!(toCalendarMonth('2026-11')); // → "loading"
export const december = rules.getDataStatus!(toCalendarMonth('2026-12')); // → "error"
// Doğrulayıcılar sırayla çalışır; ilk sorun kazanır, sonraki doğrulayıcılar çağrılmaz.
export const issue = engine.validate({ mode: 'single', value: toCalendarDate('2026-11-20') }).issue; // → {"code": "custom", "message": "Fully booked"}
export const called = calls; // → ["schedule", "maintenance"]
