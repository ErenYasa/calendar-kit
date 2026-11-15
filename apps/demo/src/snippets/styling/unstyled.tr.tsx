import { Calendar } from 'calendar-kit';
import './unstyled.tr.css';

// unstyled: cal-* sınıfı eklenmez; öğelerde yalnızca sizin classNames değerleriniz olur.
// Hafta satırlarını yerleştirmek ve günleri boyutlandırmak sizin CSS’inizin işidir.
export function PlainCalendar() {
  return (
    <Calendar
      mode="single"
      unstyled
      classNames={{ weekdays: 'u-weekdays', week: 'u-week', dayCell: 'u-cell', dayButton: 'u-day' }}
    />
  );
}
