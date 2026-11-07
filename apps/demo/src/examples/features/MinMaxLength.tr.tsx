import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// 2 ile 7 gece arası. Bir başlangıç seçiliyken kuralı bozacak bitişler devre
// dışı kalır; sebep günün etiketinde ve araç ipucunda yer alır.
const rules = stayRules({ minNights: 2, maxNights: 7, disablePast: true });

export default function MinMaxLength() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} gece` : '2–7 gece seçin.'}</p>
    </div>
  );
}
