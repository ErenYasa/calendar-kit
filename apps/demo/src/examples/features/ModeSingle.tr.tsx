import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// Bir güne tıklayınca o gün seçilir; başka bir güne tıklamak seçimi onunla
// değiştirir. Alttaki satır onChange’e gelen değeri gösterir ('YYYY-MM-DD'
// biçiminde bir metin veya null).
export default function ModeSingle() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  return (
    <div>
      <Calendar mode="single" value={date} onChange={setDate} />
      <p>Seçili: {date ?? 'yok'}</p>
    </div>
  );
}
