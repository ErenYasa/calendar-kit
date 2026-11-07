import { useState } from 'react';
import { Calendar, type DateRange, countDays, countNights, dayRangeRules, stayRules } from 'calendar-kit';
import './RangeSemantics.css';

// Aynı iki tıklama farklı anlamlara gelir:
// - konaklama bitiş gününü (çıkış) hariç tutar: 13 → 16 = 3 gece
// - gün aralığı onu dahil eder (çok günlük bilet): 13 → 16 = 4 gün
const stay = stayRules({});
const days = dayRangeRules({});

export default function RangeSemantics() {
  const [nights, setNights] = useState<DateRange>({ start: null, end: null });
  const [tickets, setTickets] = useState<DateRange>({ start: null, end: null });

  return (
    <div className="semantics">
      <div>
        <h4>Konaklama (hariç bitiş)</h4>
        <Calendar mode="range" rules={stay} value={nights} onChange={setNights} />
        <p>{countNights(nights) ?? 0} gece</p>
      </div>
      <div>
        <h4>Günler (dahil bitiş)</h4>
        <Calendar mode="range" rules={days} value={tickets} onChange={setTickets} />
        <p>{countDays(tickets) ?? 0} gün</p>
      </div>
    </div>
  );
}
