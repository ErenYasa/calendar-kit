// Çoğu takvimin ihtiyaç duyduğu prop’lar: kurallı ve sınırlı kontrollü bir aralık,
// kapsayıcısına uyum sağlayan iki ay, gün başına veri, bir yerel ayar ve takvimin
// dışındaki kontroller için bir ref.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type CalendarDate, type DateRange, type DefaultDayData, addDays, getToday, getWeekday, stayRules } from 'calendar-kit';

// Bileşenin dışında bir kez tanımlanır: sabit kurallar her render’da yeniden
// birleştirilmez; aynı veri nesnesini döndürmek de değişmeyen günlerin yeniden
// render edilmesini önler.
const rules = stayRules({ minNights: 2, maxNights: 14 });
const weekend: DefaultDayData = { label: '€140' };
const weekday: DefaultDayData = { label: '€110' };
const getDayData = (date: CalendarDate) => (getWeekday(date) >= 5 ? weekend : weekday);

export function StayPicker() {
  const ref = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [maxDate] = useState(() => addDays(getToday(), 365));

  return (
    <div>
      <Calendar
        ref={ref}
        mode="range"
        value={range}
        onChange={(next) => setRange(next)}
        rules={rules}
        disablePast
        maxDate={maxDate}
        numberOfMonths={2}
        overflow="reduce-months"
        getDayData={getDayData}
        locale="en-GB"
        aria-label="Konaklama tarihleri"
        className="stay-calendar"
      />
      <button type="button" onClick={() => ref.current?.clear()}>
        Tarihleri temizle
      </button>
    </div>
  );
}
