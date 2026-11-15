import { useState } from 'react';
import { Calendar, type DateRange, getSelectionPhase } from 'calendar-kit';

// Bir başlangıç günü seçin, imleci gezdirince aralığın önizlemesi görünür, sonra
// bir bitiş günü seçin. Başlangıçtan önceki bir güne tıklamak yeni bir aralık
// başlatır. Parantez içinde getSelectionPhase’in verdiği aşama yazar ('empty',
// 'start-selected' veya 'complete').
export default function ModeRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const phase = getSelectionPhase({ mode: 'range', value: range });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} value={range} onChange={setRange} />
      <p>
        {range.start ?? '—'} → {range.end ?? '—'} ({phase})
      </p>
    </div>
  );
}
