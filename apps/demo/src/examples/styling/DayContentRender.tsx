import { Calendar } from 'calendar-kit';
import './DayContentRender.css';

// renderDayContent: the calendar keeps its interactive button (focus, keyboard,
// ARIA); you only replace what is inside it. Do not put buttons or links here.
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
