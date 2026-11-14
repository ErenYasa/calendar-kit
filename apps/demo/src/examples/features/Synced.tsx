import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, stayRules } from 'calendar-kit';
import './Synced.css';

const rules = stayRules({ minNights: 2, disablePast: true });

// There is no hidden store: two calendars share state by sharing props.
// Selecting in one updates the other; `activeEndpoint` is shared too, so a
// start picked in A can be finished in B.
// orientation="vertical" only lays out B's own two months (one above the
// other); where A and B sit on the page is decided by the .synced grid.
export default function Synced() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  return (
    <div className="synced">
      <Calendar mode="range" {...shared} aria-label="Calendar A" />
      <Calendar mode="range" {...shared} numberOfMonths={2} orientation="vertical" aria-label="Calendar B" />
    </div>
  );
}
