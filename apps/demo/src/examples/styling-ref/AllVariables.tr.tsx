import { useState } from 'react';
import { Calendar, addDays, getMonth, addMonthsToMonth, getToday, type CalendarMonth } from 'calendar-kit';
import './AllVariables.tr.css';

// Herkese açık her tema değişkeni göze batan bir değere ayarlı (bkz.
// AllVariables.tr.css); böylece her birinin hangi pikselleri etkilediğini görürsünüz:
// - bir günün üzerine gelin (--cal-hover), Tab ile bir güne gidin (--cal-focus)
// - yeni bir başlangıç gününe tıklayın, sonra daha ileriki bir günün üzerine gelin (--cal-preview bandı, --cal-accent dış çizgisi)
// - ikinci ay, Yeniden dene’ye basılana kadar hata gösterir (--cal-danger)
// - aralık başlangıcında sürekli açık bir tooltip var (--cal-tooltip-*)
export default function AllVariables() {
  const [today] = useState(() => getToday());
  const [failed, setFailed] = useState<CalendarMonth | null>(() => addMonthsToMonth(getMonth(today), 1));
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      today={today}
      disablePast
      defaultValue={{ start: addDays(today, 1), end: addDays(today, 5) }}
      getDataStatus={(month) => (month === failed ? 'error' : 'loaded')}
      onRetry={() => setFailed(null)}
      getDayTooltip={({ day }) => (day.selectedStart ? { content: 'Tooltip: arka plan, renk, gölge ve en büyük genişlik değişkenlerden gelir', persistent: true } : null)}
      className="sr-loud"
    />
  );
}
