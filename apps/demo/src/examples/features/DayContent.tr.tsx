import { Calendar, type CalendarDate, type DefaultDayData, getMonth } from 'calendar-kit';
import { availabilityFor } from '../shared/availability.tr';

// `getDayData`, varsayılan gün içeriğinin çizdiklerini döndürür: sayının altında
// bir etiket, bir rozet, bir simge ve işaret noktaları. `description` günün
// erişilebilir etiketine eklenir. Veriler seçilebilirlikten ayrıdır (bkz. kurallar).
export default function DayContent() {
  const getDayData = (date: CalendarDate): DefaultDayData | undefined => {
    const info = availabilityFor(getMonth(date))[date];
    if (!info) return undefined;
    const deal = date.endsWith('5');
    return {
      label: `$${info.price}`,
      badge: deal ? '-%20' : undefined,
      icon: date.endsWith('-01') ? '★' : undefined,
      markers: info.status === 'booked' ? [{ color: '#d6336c', label: 'Kısmen dolu' }] : undefined,
      description: deal ? '%20 indirim' : undefined,
    };
  };
  return <Calendar mode="single" getDayData={getDayData} />;
}
