import { Calendar, addDays, getMonth, getToday } from 'calendar-kit';

const today = getToday();

// Uncontrolled: the calendar keeps the selection. `defaultValue` and
// `defaultVisibleMonth` are read once, on mount.
export default function Uncontrolled() {
  return (
    <Calendar
      mode="single"
      defaultValue={addDays(today, 3)}
      defaultVisibleMonth={getMonth(today)}
      onChange={(date) => console.log('selected', date)}
    />
  );
}
