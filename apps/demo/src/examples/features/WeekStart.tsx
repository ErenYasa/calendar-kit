import { Calendar } from 'calendar-kit';

// en-US starts weeks on Sunday; `firstDayOfWeek` (0 = Sunday … 6 = Saturday)
// overrides the locale default. `weekdayFormat` picks narrow/short/long names.
export default function WeekStart() {
  return <Calendar mode="single" locale="en-US" firstDayOfWeek={1} weekdayFormat="narrow" />;
}
