import { Calendar, closedDates, getToday, addDays } from 'calendar-kit';

const today = getToday();
const booked = closedDates([addDays(today, 2), addDays(today, 3), addDays(today, 9)], 'booked');

// Shows availability; nothing can be selected. The notice above the grid can be
// changed or hidden with `messages={{ readOnlyNotice: '' }}`.
export default function ModeReadonly() {
  return <Calendar mode="readonly" rules={booked} />;
}
