import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// Varsayılan kontroller: sürekli gezinme, yerleşik ve yerelleştirilmiş düğmelerle
// ("Show earlier dates" / "Show more dates") her basışta `monthsPerLoad` ay ekler;
// her iki yönde minDate/maxDate’e kadar.
export default function LoadMoreDefault() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="single"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={1}
        minDate={addDays(today, -90)}
        maxDate={addDays(today, 365)}
        maxBlockSize={420}
      />
    </div>
  );
}
