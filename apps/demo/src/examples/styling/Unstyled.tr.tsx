import { Calendar } from 'calendar-kit';
import './Unstyled.css';

// unstyled: hiçbir varsayılan sınıf adı eklenmez. Aşağıdaki görünümün tamamı sizin
// sınıflarınızdan gelir; takvim satır içi olarak yalnızca ay ızgarasını ve boyut değişkenlerini ayarlar.
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
