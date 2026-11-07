import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, countNights, stayRules } from 'calendar-kit';
import './ThreeCalendars.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// Tek rezervasyon, üç görünüm: kompakt bir ay, iki aylık bir genel bakış ve
// sürekli dikey bir liste. `value` ve `activeEndpoint`’i paylaşırlar; her biri
// kendi görünen ayını, odağını ve araç ipucunu ayrı tutar.
export default function ThreeCalendars() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="three">
      <p className="three-summary">
        {range.end
          ? `${range.start} → ${range.end} · ${countNights(range)} gece`
          : `Sonraki tıklama ${endpoint === 'start' ? 'başlangıç' : 'bitiş'} tarihini belirler.`}
      </p>
      <Calendar mode="range" {...shared} minDaySize={34} aria-label="Kompakt" />
      <Calendar mode="range" {...shared} orientation="vertical" navigation="continuous" maxBlockSize={330} aria-label="Liste" />
      <div className="three-wide">
        <Calendar mode="range" {...shared} numberOfMonths={2} aria-label="Genel bakış" />
      </div>
    </div>
  );
}
