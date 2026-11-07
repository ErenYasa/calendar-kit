import { Calendar } from 'calendar-kit';
import './Unstyled.css';

// unstyled: hiçbir varsayılan sınıf adı yok. Aşağıdaki her şey sizin
// sınıflarınızdan gelir; takvim yalnızca ay ızgarasını ve boyutlandırmayı satır içi ayarlar.
export default function Unstyled() {
  return (
    <Calendar
      mode="single"
      unstyled
      classNames={{
        root: 'u-root',
        monthHeader: 'u-header',
        navButton: 'u-nav',
        weekdays: 'u-week',
        week: 'u-week',
        weekday: 'u-weekday',
        dayButton: (day) => (day.selected ? 'u-day u-selected' : day.disabled ? 'u-day u-disabled' : 'u-day'),
      }}
    />
  );
}
