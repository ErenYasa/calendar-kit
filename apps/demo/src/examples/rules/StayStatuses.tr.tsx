import { useMemo, useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, type StayDayStatus, addDays, countNights, getToday, stayRules } from 'calendar-kit';

const labels: Record<StayDayStatus, string> = {
  available: '',
  booked: 'Dolu',
  closed: 'Kapalı',
  'check-in-only': 'Yalnız giriş',
  'check-out-only': 'Yalnız çıkış',
};

// Durumlar bugüne göre yerleştirilir, böylece örnekte her zaman görünürler.
// Deneyin: ilk dolu gecenin sabahında çıkış yapın, dolu bir geceyi kapsayan bir
// konaklama seçin, "Yalnız giriş" gününde çıkış veya "Yalnız çıkış" gününde giriş yapın.
export default function StayStatuses() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const statuses = useMemo(() => {
    const map = new Map<CalendarDate, StayDayStatus>();
    const put = (offset: number, status: StayDayStatus) => map.set(addDays(today, offset), status);
    put(3, 'check-in-only');
    put(5, 'check-out-only');
    [8, 9, 10].forEach((n) => put(n, 'booked'));
    put(13, 'closed');
    put(16, 'check-in-only');
    put(17, 'check-in-only');
    return map;
  }, [today]);

  const rules = useMemo(() => stayRules({ disablePast: true, getDayStatus: (date) => statuses.get(date) }), [statuses]);

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
      <p>{range.end ? `${countNights(range)} gece, çıkış ${range.end}` : 'Önce bir giriş günü, ardından bir çıkış günü seçin.'}</p>
    </div>
  );
}
