import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

export default function ModeSingle() {
  const [date, setDate] = useState<CalendarDate | null>(null);
  return (
    <div>
      <Calendar mode="single" value={date} onChange={setDate} />
      <p>Seçili: {date ?? 'yok'}</p>
    </div>
  );
}
