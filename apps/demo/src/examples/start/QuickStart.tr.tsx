import { useState } from 'react';
import { Calendar, type DateRange, countNights } from 'calendar-kit';
import 'calendar-kit/styles.css';

// Kontrollü bir aralık seçici: değer uygulamada tutulur, gece sayısı ondan hesaplanır.
export default function QuickStart() {
  const [stay, setStay] = useState<DateRange>({ start: null, end: null });
  const nights = countNights(stay);

  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} value={stay} onChange={setStay} />
      <p>{nights ? `${nights} gece: ${stay.start} → ${stay.end}` : 'Bir başlangıç ve bir bitiş tarihi seçin.'}</p>
    </div>
  );
}
