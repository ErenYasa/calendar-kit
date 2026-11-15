import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// En fazla 5 ayrı tarih; seçili bir tarihe tıklamak onu seçimden çıkarır.
export default function ModeMultiple() {
  const [dates, setDates] = useState<readonly CalendarDate[]>([]);
  return (
    <div>
      <Calendar mode="multiple" rules={{ maxSelections: 5 }} value={dates} onChange={setDates} />
      <p>
        {dates.length}/5 seçili: {[...dates].sort().join(', ') || 'yok'}
      </p>
    </div>
  );
}
