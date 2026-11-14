import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// Günübirlik kullanım: bir konaklama aynı gün başlayıp bitebilir (0 gece).
// Burada minNights vermeyin: 0 gecelik bir konaklama 1 veya daha fazla gecelik her sınırı geçemez.
const dayUse = stayRules({ allowSameDay: true });

export default function SameDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" rules={dayUse} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} gece${range.start === range.end ? ' (günübirlik)' : ''}` : 'Günübirlik kullanım için aynı güne iki kez, konaklama için iki farklı güne tıklayın.'}</p>
    </div>
  );
}
