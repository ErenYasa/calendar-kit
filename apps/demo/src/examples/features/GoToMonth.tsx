import { useRef } from 'react';
import { Calendar, type CalendarController, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

const thisMonth = getMonth(getToday());
// The app knows where availability starts (e.g. from its API); the calendar
// does not search for it.
const firstAvailableMonth = addMonthsToMonth(thisMonth, 3);
const isBooked = (date: string) => date.slice(0, 7) < firstAvailableMonth;

export default function GoToMonth() {
  const calendar = useRef<CalendarController>(null);
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
      <Calendar
        ref={calendar}
        mode="range"
        numberOfMonths={2}
        rules={{ disablePast: true, getDayAvailability: (date) => (isBooked(date) ? { closed: true, reason: 'booked', message: 'Fully booked' } : undefined) }}
      />
    </div>
  );
}
