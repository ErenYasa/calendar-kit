// react-dates DayPickerRangeController → calendar-kit Calendar.
// Moment objects become "YYYY-MM-DD" strings at the boundary of your app.
import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, fromJSDate, stayRules, toCalendarDate } from 'calendar-kit';

// moment → CalendarDate: format with the date's own calendar day.
//   moment('2026-11-13')   → toCalendarDate(m.format('YYYY-MM-DD'))
//   new Date(2026, 10, 13) → fromJSDate(date) (local calendar day)
export const fromMoment = (m: { format(pattern: string): string }): CalendarDate => toCalendarDate(m.format('YYYY-MM-DD'));
export const fromDate = (d: Date): CalendarDate => fromJSDate(d);

const rules = stayRules({
  minNights: 2, // minimumNights
  disablePast: true, // isOutsideRange={(day) => day.isBefore(today)}
  getDayStatus: (d) => (d.endsWith('-24') ? 'booked' : undefined), // isDayBlocked
});

export function Migrated() {
  // startDate / endDate / onDatesChange
  const [dates, setDates] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2} // numberOfMonths
      rules={rules}
      value={dates}
      onChange={setDates}
      // focusedInput / onFocusChange → activeEndpoint / onActiveEndpointChange (optional)
      renderDayContent={({ day }) => day.dayText} // renderDayContents
    />
  );
}
