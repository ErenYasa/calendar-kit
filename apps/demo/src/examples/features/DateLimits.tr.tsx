import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// Yalnızca önümüzdeki 30 gün; örneğin açıldığı günden itibaren sayılır.
// Gezinme, sınırları içeren aylarda durur.
export default function DateLimits() {
  const [today] = useState(() => getToday());
  return <Calendar mode="single" numberOfMonths={2} minDate={today} maxDate={addDays(today, 30)} />;
}
