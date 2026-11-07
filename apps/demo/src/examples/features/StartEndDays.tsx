import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, stayRules } from 'calendar-kit';

// Check-in on Fridays or Saturdays, check-out on Sundays or Mondays.
// One specific day only allows departures (`check-out-only`).
const rules = stayRules({
  disablePast: true,
  checkInWeekdays: [5, 6],
  checkOutWeekdays: [0, 1],
  getDayStatus: (date: CalendarDate) => (date.endsWith('-15') ? 'check-out-only' : undefined),
});

export default function StartEndDays() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />;
}
