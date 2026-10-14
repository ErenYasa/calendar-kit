import type { IssueParams, ReasonCode, ValidationIssue } from '../core/types';

/** Helpers handed to message functions so they can format dates/numbers in the active locale. */
export interface MessageFormatHelpers {
  locale: string;
  /** Formats a `YYYY-MM-DD` param as a readable date. */
  date: (value: unknown) => string;
}

export type ReasonMessage = (params: IssueParams, f: MessageFormatHelpers) => string;

export interface CalendarMessages {
  calendar: string;
  previousMonth: string;
  nextMonth: string;
  loadNext: string;
  loadPrevious: string;
  loading: string;
  error: string;
  retry: string;
  today: string;
  /** Default tooltip on today's date. */
  todayLabel: string;
  /** Caption shown above read-only calendars ('' hides it). */
  readOnlyNotice: string;
  selected: string;
  rangeStart: string;
  rangeEnd: string;
  inRange: string;
  unavailable: string;
  /** Live-region announcements. */
  announceStart: (date: string) => string;
  announceRange: (start: string, end: string) => string;
  announceSingle: (date: string) => string;
  announceAdded: (date: string, count: number) => string;
  announceRemoved: (date: string, count: number) => string;
  announceCleared: string;
  announceRejected: (date: string, reason: string) => string;
  /** One function per built-in reason code. */
  reasons: Record<ReasonCode, ReasonMessage>;
  /** Texts for consumer/adaptor reason tags (`DayAvailability.reason`). */
  dayReasons: Record<string, string>;
}

const unitEn = (n: unknown, unit: unknown) => `${n} ${unit === 'nights' ? (n === 1 ? 'night' : 'nights') : n === 1 ? 'day' : 'days'}`;

export const messagesEn: CalendarMessages = {
  calendar: 'Calendar',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  loadNext: 'Show more dates',
  loadPrevious: 'Show earlier dates',
  loading: 'Loading…',
  error: 'Could not load availability.',
  retry: 'Retry',
  today: 'today',
  todayLabel: 'Today',
  readOnlyNotice: 'View only — dates cannot be selected',
  selected: 'selected',
  rangeStart: 'start date',
  rangeEnd: 'end date',
  inRange: 'in selected range',
  unavailable: 'unavailable',
  announceStart: (d) => `Start date ${d}. Choose an end date.`,
  announceRange: (s, e) => `Selected ${s} to ${e}.`,
  announceSingle: (d) => `Selected ${d}.`,
  announceAdded: (d, c) => `Added ${d}. ${c} selected.`,
  announceRemoved: (d, c) => `Removed ${d}. ${c} selected.`,
  announceCleared: 'Selection cleared.',
  announceRejected: (d, r) => `${d} cannot be selected: ${r}`,
  reasons: {
    'invalid-date': () => 'Invalid date',
    'before-min': (p, f) => `Available from ${f.date(p.min)}`,
    'after-max': (p, f) => `Available until ${f.date(p.max)}`,
    past: () => 'Past date',
    future: () => 'Future date',
    closed: () => 'Not available',
    'start-not-allowed': () => 'Not available as a start date',
    'end-not-allowed': () => 'Not available as an end date',
    'blocked-in-range': () => 'The range contains unavailable dates',
    'weekday-start': () => 'Cannot start on this weekday',
    'weekday-end': () => 'Cannot end on this weekday',
    'min-length': (p) => `Minimum ${unitEn(p.min, p.unit)}`,
    'max-length': (p) => `Maximum ${unitEn(p.max, p.unit)}`,
    'fixed-length': (p) => `Exactly ${unitEn(p.length, p.unit)}`,
    'same-day': () => 'Start and end cannot be the same day',
    'end-before-start': () => 'End is before start',
    'max-selections': (p) => `You can select up to ${p.max} dates`,
    'data-unknown': () => 'Availability not loaded yet',
    'data-loading': () => 'Loading availability…',
    'data-error': () => 'Availability could not be loaded',
    custom: () => 'Not available',
  },
  dayReasons: {
    'check-in-only': 'Check-in only',
    'check-out-only': 'Check-out only',
    booked: 'Booked',
    closed: 'Closed',
    'start-only': 'Start only',
    'end-only': 'End only',
    'out-of-schedule': 'No service on this day',
  },
};

const unitTr = (n: unknown, unit: unknown) => `${n} ${unit === 'nights' ? 'gece' : 'gün'}`;

export const messagesTr: CalendarMessages = {
  calendar: 'Takvim',
  previousMonth: 'Önceki ay',
  nextMonth: 'Sonraki ay',
  loadNext: 'Daha fazla tarih göster',
  loadPrevious: 'Önceki tarihleri göster',
  loading: 'Yükleniyor…',
  error: 'Müsaitlik bilgisi yüklenemedi.',
  retry: 'Tekrar dene',
  today: 'bugün',
  todayLabel: 'Bugün',
  readOnlyNotice: 'Yalnızca görüntüleme — tarih seçilemez',
  selected: 'seçili',
  rangeStart: 'başlangıç tarihi',
  rangeEnd: 'bitiş tarihi',
  inRange: 'seçili aralıkta',
  unavailable: 'müsait değil',
  announceStart: (d) => `Başlangıç ${d}. Bitiş tarihini seçin.`,
  announceRange: (s, e) => `${s} – ${e} seçildi.`,
  announceSingle: (d) => `${d} seçildi.`,
  announceAdded: (d, c) => `${d} eklendi. ${c} tarih seçili.`,
  announceRemoved: (d, c) => `${d} çıkarıldı. ${c} tarih seçili.`,
  announceCleared: 'Seçim temizlendi.',
  announceRejected: (d, r) => `${d} seçilemez: ${r}`,
  reasons: {
    'invalid-date': () => 'Geçersiz tarih',
    'before-min': (p, f) => `${f.date(p.min)} tarihinden itibaren`,
    'after-max': (p, f) => `${f.date(p.max)} tarihine kadar`,
    past: () => 'Geçmiş tarih',
    future: () => 'İleri tarih',
    closed: () => 'Müsait değil',
    'start-not-allowed': () => 'Başlangıç olarak seçilemez',
    'end-not-allowed': () => 'Bitiş olarak seçilemez',
    'blocked-in-range': () => 'Aralıkta müsait olmayan tarihler var',
    'weekday-start': () => 'Bu gün başlangıç yapılamaz',
    'weekday-end': () => 'Bu gün bitiş yapılamaz',
    'min-length': (p) => `Minimum ${unitTr(p.min, p.unit)}`,
    'max-length': (p) => `Maksimum ${unitTr(p.max, p.unit)}`,
    'fixed-length': (p) => `Tam olarak ${unitTr(p.length, p.unit)}`,
    'same-day': () => 'Başlangıç ve bitiş aynı gün olamaz',
    'end-before-start': () => 'Bitiş başlangıçtan önce',
    'max-selections': (p) => `En fazla ${p.max} tarih seçebilirsiniz`,
    'data-unknown': () => 'Müsaitlik henüz yüklenmedi',
    'data-loading': () => 'Müsaitlik yükleniyor…',
    'data-error': () => 'Müsaitlik yüklenemedi',
    custom: () => 'Müsait değil',
  },
  dayReasons: {
    'check-in-only': 'Sadece giriş',
    'check-out-only': 'Sadece çıkış',
    booked: 'Dolu',
    closed: 'Kapalı',
    'start-only': 'Sadece başlangıç',
    'end-only': 'Sadece bitiş',
    'out-of-schedule': 'Bu gün hizmet verilmiyor',
  },
};

/** Partial overrides; nested `reasons`/`dayReasons` are merged key by key. */
export type CalendarMessagesInput = Partial<Omit<CalendarMessages, 'reasons' | 'dayReasons'>> & {
  reasons?: Partial<Record<ReasonCode, ReasonMessage>>;
  dayReasons?: Record<string, string>;
};

export function mergeMessages(base: CalendarMessages, override?: CalendarMessagesInput): CalendarMessages {
  if (!override) return base;
  return {
    ...base,
    ...override,
    reasons: { ...base.reasons, ...override.reasons },
    dayReasons: { ...base.dayReasons, ...override.dayReasons },
  } as CalendarMessages;
}

const DAY_SCOPED: ReadonlySet<ReasonCode> = new Set(['closed', 'start-not-allowed', 'end-not-allowed']);

/** Human message for an issue. Custom messages win, then day-reason texts, then reason templates. */
export function formatIssue(issue: ValidationIssue, messages: CalendarMessages, helpers: MessageFormatHelpers): string {
  if (issue.message) return issue.message;
  if (issue.dayReason && DAY_SCOPED.has(issue.code)) {
    const t = messages.dayReasons[issue.dayReason];
    if (t) return t;
  }
  const fn = messages.reasons[issue.code] ?? messages.reasons.custom;
  return fn(issue.params ?? {}, helpers);
}
