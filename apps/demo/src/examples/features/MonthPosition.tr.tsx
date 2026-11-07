import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';

// Referans ay (seçimin ayı ya da bugünün ayı) ortada gösterilir:
// önceki · referans · sonraki.
export default function MonthPosition() {
  const [today] = useState(() => getToday());
  return <Calendar mode="single" numberOfMonths={3} monthPosition={2} defaultValue={addDays(today, 2)} />;
}
