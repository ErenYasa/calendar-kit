import { Calendar, type CalendarDate, type DefaultDayData, getMonth } from 'calendar-kit';
import { availabilityFor } from '../shared/availability';

// `getDayData` returns what the default day content draws: a label under the
// number, a badge, an icon and marker dots. `description` becomes the day's
// accessible description (read after its label). Data is separate from
// selectability (see rules).
export default function DayContent() {
  const getDayData = (date: CalendarDate): DefaultDayData | undefined => {
    const info = availabilityFor(getMonth(date))[date];
    if (!info) return undefined;
    const deal = date.endsWith('5');
    return {
      label: `$${info.price}`,
      badge: deal ? '-20%' : undefined,
      icon: date.endsWith('-01') || date.endsWith('-15') ? '★' : undefined, // the 15th: price, icon and badge together
      markers: info.status === 'booked' ? [{ color: '#d6336c', label: 'Partly booked' }] : undefined,
      // The dots are hidden from screen readers and the default content does not
      // use a marker's label, so its meaning goes into the description too.
      description: [deal && '20% discount', info.status === 'booked' && 'Partly booked'].filter(Boolean).join(', ') || undefined,
    };
  };
  // In a small cell a badge longer than the circle is cut with an ellipsis.
  // The full text stays reachable: screen readers read `description` after the
  // day's label, and the tooltip shows it on hover, keyboard focus and tap.
  return <Calendar<DefaultDayData> mode="single" getDayData={getDayData} getDayTooltip={({ data }) => data?.description ?? null} />;
}
