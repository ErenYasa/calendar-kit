import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, stayRules } from 'calendar-kit';
import './Synced.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// Gizli bir depo (store) yoktur: iki takvim aynı prop’ları alarak durumu paylaşır.
// Birinde seçim yapmak diğerini günceller; `activeEndpoint` da paylaşılır, böylece
// soldakinde seçilen başlangıç sağdakinde tamamlanabilir.
export default function Synced() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="synced">
      <Calendar mode="range" {...shared} aria-label="Takvim A" />
      <Calendar mode="range" {...shared} orientation="vertical" aria-label="Takvim B" />
    </div>
  );
}
