import { type SelectionRules, createSelectionEngine, stayRules, toCalendarDate } from 'calendar-kit/core';

// Şubattan önce çıkış mümkün değil (her gün check-in-only).
const getDayStatus = (date: string) => (date < '2027-02-01' ? 'check-in-only' : undefined);

const checkStart = (rules: SelectionRules) =>
  createSelectionEngine({ rules, state: { selection: { mode: 'range', value: { start: null, end: null } }, activeEndpoint: 'start' }, today: null })
    .checkStart(toCalendarDate('2026-11-13'));

// Maksimum olmadan 63 aday (15 Kasım … 16 Ocak), geçerli bir bitiş bulunmadan
// tükenir. "Bulunamadı", "yok" demek değildir: başlangıç seçilebilir kalır.
export const unbounded = checkStart(stayRules({ getDayStatus })); // → null
// maxNights: 30 ile olası her bitiş denendi: başlangıç reddedilir.
export const bounded = checkStart(stayRules({ getDayStatus, maxNights: 30 })); // → {"code": "end-not-allowed", "date": "2026-12-13", "dayReason": "check-in-only"}
// Minimum yalnızca engelleyen şey oysa bildirilir: burada daha kısa bir konaklama
// da geçerli olmazdı, bu yüzden asıl sebep korunur.
export const withMinimum = checkStart(stayRules({ getDayStatus, maxNights: 30, minNights: 2 })); // → {"code": "end-not-allowed", "date": "2026-12-13", "dayReason": "check-in-only"}
// Çıkış yalnızca 14 Kasım’da mümkün: 1 gecelik konaklama geçerli olurdu, yani sebep minimumdur.
const onlyThe14th = (date: string) => (date === '2026-11-14' ? undefined : 'check-in-only');
export const minimumBlocks = checkStart(stayRules({ getDayStatus: onlyThe14th, maxNights: 30, minNights: 2 })); // → {"code": "min-length", "date": "2026-11-13", "params": {"min": 2, "unit": "nights"}, "dayReason": "check-in-only"}
