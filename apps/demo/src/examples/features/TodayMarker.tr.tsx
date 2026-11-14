import { Calendar } from 'calendar-kit';
import './TodayMarker.css';

// Solda: `today` prop’u verilmediğinde hangi tarihin bugün olduğuna timeZone
// karar verir. Auckland’da çoğu zaman tarih bir gün ileridedir; bu yüzden
// çember içindeki gün sizin bugününüzden bir gün sonra olabilir.
// Sağda: highlightToday={false} ince çemberi ve "Today" tooltip’ini kaldırır.
// Bugün bilgisi günün erişilebilir etiketinde ("today") ve day.today’de kalır.
export default function TodayMarker() {
  return (
    <div className="today-pair">
      <div>
        <p className="today-pair-label">timeZone="Pacific/Auckland"</p>
        <Calendar mode="single" timeZone="Pacific/Auckland" aria-label="Bugün işaretli (Auckland)" />
      </div>
      <div>
        <p className="today-pair-label">highlightToday=&#123;false&#125;</p>
        <Calendar mode="single" highlightToday={false} aria-label="Bugün işaretsiz" />
      </div>
    </div>
  );
}
