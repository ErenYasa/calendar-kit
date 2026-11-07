// Import the default theme first, then your overrides. Your rules then win
// whenever the specificity is equal (for example one class on the root).
import 'calendar-kit/styles.css';
import './theme.css';
import { Calendar, type DayState } from 'calendar-kit';

const isWeekend = (day: DayState) => day.weekday === 0 || day.weekday === 6;

export function ThemedCalendar() {
  return (
    <Calendar
      mode="range"
      className="booking"
      modifiers={{ weekend: isWeekend }}
      classNames={{
        dayCell: 'booking-cell',
        dayButton: 'booking-day',
        // Functions receive the day's DayState and return a class (or undefined).
        dayContent: (day) => (day.reason?.code === 'closed' ? 'booking-closed' : undefined),
      }}
    />
  );
}
