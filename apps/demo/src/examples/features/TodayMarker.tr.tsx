import { Calendar } from 'calendar-kit';
import './TodayMarker.css';

// highlightToday={false} ince çemberi ve "Today" araç ipucunu kaldırır.
// Bugün bilgisi günün erişilebilir etiketinde ("today") ve day.today’de kalır.
// `today` prop’u verilmediğinde hangi tarihin bugün olduğuna timeZone karar verir.
export default function TodayMarker() {
  return (
    <div className="today-pair">
      <Calendar mode="single" timeZone="Pacific/Auckland" aria-label="Bugün işaretli (Auckland)" />
      <Calendar mode="single" highlightToday={false} aria-label="Bugün işaretsiz" />
    </div>
  );
}
