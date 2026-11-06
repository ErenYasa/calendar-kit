import { Calendar } from 'calendar-kit';
import './RenderDay.css';

// renderDay: you render the element; getDayProps merges the calendar's ref,
// tabIndex, ARIA, data-* state and handlers into your props. Your handlers run
// first; call event.preventDefault() to skip the calendar's own handling.
export default function RenderDay() {
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      renderDay={({ day, getDayProps }) => (
        <button {...getDayProps({ className: 'square-day' })}>
          {day.dayText}
        </button>
      )}
    />
  );
}
