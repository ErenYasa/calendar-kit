import { Calendar, type CalendarDate, type DefaultDayData, getMonth } from 'calendar-kit';
import { availabilityFor } from '../shared/availability.tr';

// `getDayData`, varsayılan gün içeriğinin çizdiklerini döndürür: sayının altında
// bir etiket, bir badge, bir simge ve işaret noktaları. `description` günün
// erişilebilir açıklaması olur (ekran okuyucu onu etiketten sonra okur). Veriler
// seçilebilirlikten ayrıdır (bkz. kurallar).
export default function DayContent() {
  const getDayData = (date: CalendarDate): DefaultDayData | undefined => {
    const info = availabilityFor(getMonth(date))[date];
    if (!info) return undefined;
    const deal = date.endsWith('5');
    return {
      label: `$${info.price}`,
      badge: deal ? '-%20' : undefined,
      icon: date.endsWith('-01') || date.endsWith('-15') ? '★' : undefined, // ayın 15’i: fiyat, simge ve badge bir arada
      markers: info.status === 'booked' ? [{ color: '#d6336c', label: 'Kısmen dolu' }] : undefined,
      description: deal ? '%20 indirim' : undefined,
    };
  };
  // Küçük bir hücrede daireden uzun bir badge üç noktayla kısaltılır. Tam metne
  // yine ulaşılır: ekran okuyucu `description`’ı günün etiketinden sonra okur,
  // tooltip de onu üzerine gelince, klavye odağında ve dokununca gösterir.
  return <Calendar<DefaultDayData> mode="single" getDayData={getDayData} getDayTooltip={({ data }) => data?.description ?? null} />;
}
