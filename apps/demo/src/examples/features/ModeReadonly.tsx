import { useMemo, useState } from 'react';
import { Calendar, addDays, closedDates, getToday } from 'calendar-kit';

// Shows availability; nothing can be selected. The notice above the grid can be
// changed or hidden with `messages={{ readOnlyNotice: '' }}`.
export default function ModeReadonly() {
  const [today] = useState(() => getToday());
  const booked = useMemo(() => closedDates([addDays(today, 2), addDays(today, 3), addDays(today, 9)], 'booked'), [today]);
  return <Calendar mode="readonly" rules={booked} />;
}
