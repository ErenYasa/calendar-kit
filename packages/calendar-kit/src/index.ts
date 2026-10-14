// Public API. Everything not exported here is private.

// Date model
export {
  type CalendarDate,
  type CalendarMonth,
  type DateParts,
  type Weekday,
  addDays,
  addMonths,
  addMonthsToMonth,
  clampDate,
  compareDates,
  createDate,
  createMonth,
  daysInMonth,
  diffDays,
  diffMonths,
  eachDay,
  eachMonth,
  firstDayOfMonth,
  fromJSDate,
  getDateParts,
  getMonth,
  getMonthParts,
  getToday,
  getWeekday,
  isAfter,
  isBefore,
  isCalendarDate,
  isLeapYear,
  isSameDate,
  isWithin,
  lastDayOfMonth,
  parseDate,
  parseMonth,
  toCalendarDate,
  toCalendarMonth,
  toUTCDate,
} from './date/calendarDate';
export { formatDate, formatMonth, getDefaultFirstDayOfWeek, getLocaleDirection, getWeekdayNames } from './date/locale';

// Selection core
export type {
  ActivationKind,
  ActivationPlan,
  DataStatus,
  DateRange,
  DayAvailability,
  IssueParams,
  RangeEndpoint,
  RangeSemantics,
  ReasonCode,
  RuleContext,
  Selection,
  SelectionMode,
  SelectionPhase,
  SelectionRules,
  SelectionState,
  ValidationIssue,
  ValidationResult,
} from './core/types';
export {
  type SelectionEngine,
  type SelectionEngineInput,
  countDays,
  countNights,
  createSelectionEngine,
  getIncludedDays,
  getRangeLength,
  getSelectionPhase,
} from './core/engine';
export { type RelaxScheduleOptions, combineRules, relaxRules } from './core/rules';

// Adapters
export {
  type DayRangeRulesOptions,
  type DayRangeStatus,
  type StayDayStatus,
  type StayReason,
  type StayRulesOptions,
  closedDates,
  dayRangeRules,
  stayRules,
} from './adapters';

// i18n
export {
  type CalendarMessages,
  type CalendarMessagesInput,
  type MessageFormatHelpers,
  type ReasonMessage,
  formatIssue,
  mergeMessages,
  messagesEn,
  messagesTr,
} from './i18n/messages';
export { messagesAr, messagesDe, messagesEs, messagesFr, messagesIt, messagesNl } from './i18n/locales';

// React
export { Calendar } from './react/Calendar';
export type * from './react/types';
