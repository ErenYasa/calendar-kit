import { Calendar } from 'calendar-kit';
import './ClassNames.css';

// `classNames` adds your classes next to the default ones. The day parts also
// accept a function of the day's state: here Saturday and Sunday (weekday 6
// and 0) get a class. (`day.weekStart`/`day.weekEnd` mean the first/last
// column of the row, which depends on the locale's first day of the week.)
export default function ClassNames() {
  return (
    <Calendar
      mode="single"
      classNames={{
        monthTitle: 'brand-title',
        weekday: 'brand-weekday',
        dayButton: (day) => (day.weekday === 0 || day.weekday === 6 ? 'brand-weekend' : undefined),
      }}
    />
  );
}
