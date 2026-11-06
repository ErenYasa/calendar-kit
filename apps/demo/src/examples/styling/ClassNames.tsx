import { Calendar } from 'calendar-kit';
import './ClassNames.css';

// `classNames` adds your classes to calendar parts; the day parts also accept
// a function of the day's state.
export default function ClassNames() {
  return (
    <Calendar
      mode="single"
      classNames={{
        monthTitle: 'brand-title',
        weekday: 'brand-weekday',
        dayButton: (day) => (day.weekEnd || day.weekStart ? 'brand-weekend' : undefined),
      }}
    />
  );
}
