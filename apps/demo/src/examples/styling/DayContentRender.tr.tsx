import { Calendar } from 'calendar-kit';
import './DayContentRender.css';

// renderDayContent: takvim etkileşimli düğmesini (odak, klavye, ARIA) korur;
// siz yalnızca içini değiştirirsiniz. Buraya düğme veya bağlantı koymayın.
// Gelecekteki her günün altında bir nokta: yeşil = boş, turuncu = dolu (burada
// basitçe her cumartesi). Nokta yalnızca görseldir (aria-hidden); önemli bir
// bilgiyi günün etiketine ya da tooltip’ine de koyun.
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
