import { useMemo, useState } from 'react';
import { Calendar, addDays, closedDates, getToday } from 'calendar-kit';

// Müsaitliği gösterir; hiçbir şey seçilemez. Izgaranın üstündeki bildirim
// `messages={{ readOnlyNotice: '' }}` ile değiştirilebilir veya gizlenebilir.
export default function ModeReadonly() {
  const [today] = useState(() => getToday());
  const booked = useMemo(() => closedDates([addDays(today, 2), addDays(today, 3), addDays(today, 9)], 'booked'), [today]);
  return <Calendar mode="readonly" rules={booked} />;
}
