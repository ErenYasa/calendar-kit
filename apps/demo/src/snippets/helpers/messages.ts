import { formatDate, formatIssue, mergeMessages, messagesDe, messagesEn, parseDate, type CalendarMessagesInput, type MessageFormatHelpers } from 'calendar-kit/core';

// A partial override: everything not listed keeps the base text.
const overrides: CalendarMessagesInput = {
  readOnlyNotice: '',
  announceRange: (start, end) => `Stay from ${start} to ${end}.`,
  reasons: { 'min-length': (p) => `Book at least ${p.min} nights` },
  dayReasons: { booked: 'Sold out' },
};
const messages = mergeMessages(messagesEn, overrides);

export const notice = messages.readOnlyNotice; // → ""
export const kept = messages.nextMonth; // → "Next month"
// A key set to undefined counts as not listed: the base text stays.
export const keptUndefined = mergeMessages(messagesEn, { nextMonth: undefined }).nextMonth; // → "Next month"
export const announced = messages.announceRange('13 November 2026', '16 November 2026'); // → "Stay from 13 November 2026 to 16 November 2026."
export const keptReason = messages.reasons['max-length']({ max: 7, unit: 'nights' }, { locale: 'en-US', date: String }); // → "Maximum 7 nights"

// formatIssue outside the Calendar: you supply the helpers.
const helpers: MessageFormatHelpers = {
  locale: 'en-US',
  date: (v) => {
    const d = parseDate(v);
    return d ? formatDate(d, 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : String(v ?? '');
  },
};
export const tooShort = formatIssue({ code: 'min-length', params: { min: 2, unit: 'nights' } }, messages, helpers); // → "Book at least 2 nights"
export const tooEarly = formatIssue({ code: 'before-min', params: { min: '2026-12-01' } }, messages, helpers); // → "Available from December 1, 2026"
export const byTag = formatIssue({ code: 'closed', dayReason: 'booked' }, messages, helpers); // → "Sold out"
export const ownText = formatIssue({ code: 'custom', message: 'Members only' }, messages, helpers); // → "Members only"

// Every bundle translates every reason and day reason.
export const germanClosed = formatIssue({ code: 'closed' }, messagesDe, helpers); // → "Nicht verfügbar"
export const germanSameDay = formatIssue({ code: 'same-day' }, messagesDe, helpers); // → "Beginn und Ende dürfen nicht auf denselben Tag fallen"
export const germanSchedule = formatIssue({ code: 'closed', dayReason: 'out-of-schedule' }, messagesDe, helpers); // → "An diesem Tag kein Betrieb"
