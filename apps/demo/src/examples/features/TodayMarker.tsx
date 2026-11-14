import { Calendar } from 'calendar-kit';
import './TodayMarker.css';

// Left: timeZone decides which date is today when the `today` prop is not
// given. In Auckland it is often already tomorrow, so the circled day can be
// one day ahead of your own today.
// Right: highlightToday={false} removes the thin circle and the "Today" tooltip.
// Today stays in the day's accessible label ("today") and in day.today.
export default function TodayMarker() {
  return (
    <div className="today-pair">
      <div>
        <p className="today-pair-label">timeZone="Pacific/Auckland"</p>
        <Calendar mode="single" timeZone="Pacific/Auckland" aria-label="Today marked (Auckland)" />
      </div>
      <div>
        <p className="today-pair-label">highlightToday=&#123;false&#125;</p>
        <Calendar mode="single" highlightToday={false} aria-label="Today not marked" />
      </div>
    </div>
  );
}
