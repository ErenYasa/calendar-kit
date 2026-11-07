import { Calendar } from 'calendar-kit';
import './unstyled.tr.css';

// unstyled: cal-* sınıfı yok. Tek sınıflar sizin classNames değerlerinizdir;
// hafta satırlarını yerleştirmek ve günleri boyutlandırmak sizin CSS’inize kalır.
export function PlainCalendar() {
  return (
    <Calendar
      mode="single"
      unstyled
      classNames={{ weekdays: 'u-weekdays', week: 'u-week', dayCell: 'u-cell', dayButton: 'u-day' }}
    />
  );
}
