import { useMemo, useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, type DayRangeStatus, addDays, countDays, dayRangeRules, getToday } from 'calendar-kit';

const labels: Record<DayRangeStatus, string> = { available: '', closed: 'Kapalı', 'start-only': 'Başlangıç', 'end-only': 'Bitiş' };

// Dahil bitişli aralıklar: seçilen her gün rezervasyona dahildir. "Başlangıç" günleri
// yalnızca bir aralığı başlatabilir, "Bitiş" günleri yalnızca bitirebilir; ikisi de aralığın içinde olamaz.
export default function DayRangeStatuses() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const statuses = useMemo(() => {
    const map = new Map<CalendarDate, DayRangeStatus>();
    const put = (offset: number, status: DayRangeStatus) => map.set(addDays(today, offset), status);
    put(3, 'start-only');
    put(6, 'end-only');
    put(9, 'closed');
    put(12, 'start-only');
    put(15, 'end-only');
    return map;
  }, [today]);

  const rules = useMemo(() => dayRangeRules({ disablePast: true, maxDays: 10, getDayStatus: (date) => statuses.get(date) }), [statuses]);

  return (
    <div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={today}
        rules={rules}
        value={range}
        onChange={setRange}
        getDayData={(date) => {
          const status = statuses.get(date);
          return status ? { label: labels[status] } : undefined;
        }}
      />
      <p>{range.end ? `${countDays(range)} gün (${range.start} – ${range.end}, ikisi de dahil)` : 'En fazla 10 gün seçin.'}</p>
    </div>
  );
}
