import { useMemo, useRef, useState } from 'react';
import { Calendar, type CalendarController, type SelectionRules, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

// Dates are relative to the day the example is opened (computed once on mount).
// The app knows where availability starts (e.g. from its API); the calendar
// does not search for it. Here: everything before "this month + 3" is booked.
export default function GoToMonth() {
  const calendar = useRef<CalendarController>(null);
  const [thisMonth] = useState(() => getMonth(getToday()));
  const firstAvailableMonth = addMonthsToMonth(thisMonth, 3);
  const rules = useMemo<SelectionRules>(
    () => ({
      disablePast: true,
      getDayAvailability: (date) => (date.slice(0, 7) < firstAvailableMonth ? { closed: true, reason: 'booked', message: 'Fully booked' } : undefined),
    }),
    [firstAvailableMonth],
  );
  return (
    <div>
      <p>
        <button type="button" onClick={() => calendar.current?.goToMonth(firstAvailableMonth, { focus: true })}>
          Go to first available date
        </button>{' '}
        <button type="button" onClick={() => calendar.current?.goToMonth(thisMonth)}>
          Back to this month
        </button>
      </p>
      <Calendar ref={calendar} mode="range" numberOfMonths={2} rules={rules} />
    </div>
  );
}
