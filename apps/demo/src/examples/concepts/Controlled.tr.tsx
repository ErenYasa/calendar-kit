import { useState } from 'react';
import { Calendar, type CalendarDate, addDays, getToday } from 'calendar-kit';

// Kontrollü: `value` uygulamaya aittir; her değişiklik `onChange` üzerinden geçer.
export default function Controlled() {
  const [today] = useState(() => getToday());
  const [date, setDate] = useState<CalendarDate | null>(() => addDays(today, 3));

  return (
    <div>
      <Calendar mode="single" value={date} onChange={setDate} />
      <p>
        Seçili: {date ?? 'yok'}{' '}
        <button type="button" onClick={() => setDate(addDays(today, 7))}>
          Bugün + 7’yi seç
        </button>{' '}
        <button type="button" onClick={() => setDate(null)}>
          Temizle
        </button>
      </p>
    </div>
  );
}
