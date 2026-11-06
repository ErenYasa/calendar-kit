import { useState } from 'react';
import { Calendar, type CalendarDate, addDays, getToday } from 'calendar-kit';

const today = getToday();

// Controlled: the app owns `value`; every change goes through `onChange`.
export default function Controlled() {
  const [date, setDate] = useState<CalendarDate | null>(addDays(today, 3));

  return (
    <div>
      <Calendar mode="single" value={date} onChange={setDate} />
      <p>
        Selected: {date ?? 'none'}{' '}
        <button type="button" onClick={() => setDate(addDays(today, 7))}>
          Select today + 7
        </button>{' '}
        <button type="button" onClick={() => setDate(null)}>
          Clear
        </button>
      </p>
    </div>
  );
}
