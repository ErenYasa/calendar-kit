import { Calendar, addDays, getToday } from 'calendar-kit';

const today = getToday();

// Only the next 30 days. Navigation stops at the months that contain the limits.
export default function DateLimits() {
  return <Calendar mode="single" numberOfMonths={2} minDate={today} maxDate={addDays(today, 30)} />;
}
