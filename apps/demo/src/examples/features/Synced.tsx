import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, stayRules } from 'calendar-kit';
import './Synced.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// There is no hidden store: two calendars share state by sharing props.
// Selecting in one updates the other; `activeEndpoint` is shared too, so a
// start picked on the left can be finished on the right.
export default function Synced() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="synced">
      <Calendar mode="range" {...shared} aria-label="Calendar A" />
      <Calendar mode="range" {...shared} orientation="vertical" aria-label="Calendar B" />
    </div>
  );
}
