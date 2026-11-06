import { Calendar } from 'calendar-kit';
import './Unstyled.css';

// unstyled: no default class names at all. Everything below comes from your
// classes; the calendar still sets the months grid and sizing inline.
export default function Unstyled() {
  return (
    <Calendar
      mode="single"
      unstyled
      classNames={{
        root: 'u-root',
        monthHeader: 'u-header',
        navButton: 'u-nav',
        weekdays: 'u-week',
        week: 'u-week',
        weekday: 'u-weekday',
        dayButton: (day) => (day.selected ? 'u-day u-selected' : day.disabled ? 'u-day u-disabled' : 'u-day'),
      }}
    />
  );
}
