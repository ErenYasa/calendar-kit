import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, countNights, stayRules } from 'calendar-kit';
import './ThreeCalendars.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// One booking, three views: a compact month, a two-month overview and a
// continuous vertical list. They share `value` and `activeEndpoint`; each keeps
// its own visible month, focus and tooltip.
export default function ThreeCalendars() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="three">
      <p className="three-summary">{range.end ? `${range.start} → ${range.end} · ${countNights(range)} nights` : `The next click sets the ${endpoint} date.`}</p>
      <Calendar mode="range" {...shared} minDaySize={34} aria-label="Compact" />
      <Calendar mode="range" {...shared} orientation="vertical" navigation="continuous" maxBlockSize={330} aria-label="List" />
      <div className="three-wide">
        <Calendar mode="range" {...shared} numberOfMonths={2} aria-label="Overview" />
      </div>
    </div>
  );
}
