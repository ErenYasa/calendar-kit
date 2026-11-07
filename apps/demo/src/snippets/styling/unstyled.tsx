import { Calendar } from 'calendar-kit';
import './unstyled.css';

// unstyled: no cal-* classes. Your classNames are the only classes, and your
// CSS has to lay out the week rows and size the days.
export function PlainCalendar() {
  return (
    <Calendar
      mode="single"
      unstyled
      classNames={{ weekdays: 'u-weekdays', week: 'u-week', dayCell: 'u-cell', dayButton: 'u-day' }}
    />
  );
}
