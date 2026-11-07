import { Calendar } from 'calendar-kit';
import './TodayMarker.css';

// highlightToday={false} removes the thin circle and the "Today" tooltip.
// Today stays in the day's accessible label ("today") and in day.today.
// timeZone decides which date is today when the `today` prop is not given.
export default function TodayMarker() {
  return (
    <div className="today-pair">
      <Calendar mode="single" timeZone="Pacific/Auckland" aria-label="Today marked (Auckland)" />
      <Calendar mode="single" highlightToday={false} aria-label="Today not marked" />
    </div>
  );
}
