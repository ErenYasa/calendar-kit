import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, stayRules } from 'calendar-kit';
import './Synced.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// Gizli bir store yoktur: iki takvim aynı prop’ları alarak durumu paylaşır.
// Birinde seçim yapmak diğerini günceller; `activeEndpoint` da paylaşılır, böylece
// A’da seçilen başlangıç B’de tamamlanabilir.
// orientation="vertical" yalnızca B’nin kendi iki ayını yerleştirir (alt alta);
// A ile B’nin sayfadaki yerini .synced grid’i belirler.
export default function Synced() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="synced">
      <div>
        <p className="synced-label">Takvim A</p>
        <Calendar mode="range" {...shared} aria-label="Takvim A" />
      </div>
      <div>
        <p className="synced-label">Takvim B · numberOfMonths=&#123;2&#125; orientation="vertical"</p>
        <Calendar mode="range" {...shared} numberOfMonths={2} orientation="vertical" aria-label="Takvim B" />
      </div>
    </div>
  );
}
