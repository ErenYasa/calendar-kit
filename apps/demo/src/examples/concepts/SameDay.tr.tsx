import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// Günübirlik kullanım: bir konaklama aynı gün başlayıp bitebilir (0 gece).
// Hariç bitişli aynı gün aralığının uzunluğu 0'dır; bu yüzden minimum konaklama ayarlanamaz.
const dayUse = stayRules({ allowSameDay: true });

export default function SameDay() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" rules={dayUse} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} gece (günübirlik kullanım için aynı güne iki kez tıklayın)` : 'Günübirlik kullanım için bir güne iki kez tıklayın.'}</p>
    </div>
  );
}
