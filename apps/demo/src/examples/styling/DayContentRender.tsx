import { Calendar } from 'calendar-kit';
import './DayContentRender.css';

// renderDayContent: the calendar keeps its interactive button (focus, keyboard,
// ARIA); you only replace what is inside it. Do not put buttons or links here.
// A dot under every upcoming day: green = free, orange = busy (here simply
// every Saturday). The dot is decorative (aria-hidden): put information that
// matters into the day's label or tooltip as well.
export default function DayContentRender() {
  return (
    <Calendar
      mode="single"
      renderDayContent={({ day }) => (
        <span className="stacked-day">
          <span>{day.dayText}</span>
          {!day.past && <span className="stacked-day-dot" data-busy={day.weekday === 6 || undefined} aria-hidden="true" />}
        </span>
      )}
    />
  );
}
