import { useState } from 'react';
import { Calendar, addDays, getMonth, getToday } from 'calendar-kit';

// Kontrolsüz: seçimi takvim tutar. `defaultValue` ve `defaultVisibleMonth`
// yalnızca bir kez, mount sırasında okunur.
export default function Uncontrolled() {
  const [today] = useState(() => getToday());
  return (
    <Calendar
      mode="single"
      defaultValue={addDays(today, 3)}
      defaultVisibleMonth={getMonth(today)}
      onChange={(date) => console.log('seçildi', date)}
    />
  );
}
