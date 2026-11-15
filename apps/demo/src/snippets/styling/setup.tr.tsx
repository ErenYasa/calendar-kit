// Önce varsayılan temayı, sonra kendi geçersiz kılmalarınızı içe aktarın.
// Böylece özgüllük eşit olduğunda (örneğin kökte tek bir sınıf) sizin kurallarınız kazanır.
import 'calendar-kit/styles.css';
import './theme.tr.css';
import { Calendar, type DayState } from 'calendar-kit';

const isWeekend = (day: DayState) => day.weekday === 0 || day.weekday === 6;

export function ThemedCalendar() {
  return (
    <Calendar
      mode="range"
      className="booking"
      modifiers={{ weekend: isWeekend }}
      classNames={{
        dayCell: 'booking-cell',
        dayButton: 'booking-day',
        // Fonksiyonlar günün DayState’ini alır ve bir sınıf (ya da undefined) döndürür.
        dayContent: (day) => (day.reason?.code === 'closed' ? 'booking-closed' : undefined),
      }}
    />
  );
}
