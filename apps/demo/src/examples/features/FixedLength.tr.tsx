import { useState } from 'react';
import { Calendar, type DateRange, countDays, dayRangeRules } from 'calendar-kit';

// 3 günlük bir geçiş kartı: tek tıklama tüm aralığı seçer.
const rules = dayRangeRules({ fixedDays: 3, disablePast: true });

export default function FixedLength() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />
      <p>{range.end ? `${countDays(range)} gün: ${range.start} – ${range.end}` : 'Bir başlangıç günü seçin.'}</p>
    </div>
  );
}
