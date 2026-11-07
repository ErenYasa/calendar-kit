import { Calendar, type CalendarDate, type DefaultDayData, getMonth } from 'calendar-kit';
import { availabilityFor } from '../shared/availability';

// `getDayData` returns what the default day content draws: a label under the
// number, a badge, an icon and marker dots. `description` is added to the
// day's accessible label. Data is separate from selectability (see rules).
export default function DayContent() {
  const getDayData = (date: CalendarDate): DefaultDayData | undefined => {
    const info = availabilityFor(getMonth(date))[date];
    if (!info) return undefined;
    const deal = date.endsWith('5');
    return {
      label: `$${info.price}`,
      badge: deal ? '-20%' : undefined,
      icon: date.endsWith('-01') ? '★' : undefined,
      markers: info.status === 'booked' ? [{ color: '#d6336c', label: 'Partly booked' }] : undefined,
      description: deal ? '20% discount' : undefined,
    };
  };
  return <Calendar mode="single" getDayData={getDayData} />;
}
