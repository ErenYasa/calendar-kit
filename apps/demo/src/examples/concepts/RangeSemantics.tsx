import { useState } from 'react';
import { Calendar, type DateRange, countDays, countNights, dayRangeRules, stayRules } from 'calendar-kit';
import './RangeSemantics.css';

// The same two clicks mean different things:
// - a stay excludes the end day (check-out): 13 → 16 = 3 nights
// - a day range includes it (multi-day ticket): 13 → 16 = 4 days
const stay = stayRules({});
const days = dayRangeRules({});

export default function RangeSemantics() {
  const [nights, setNights] = useState<DateRange>({ start: null, end: null });
  const [tickets, setTickets] = useState<DateRange>({ start: null, end: null });

  return (
    <div className="semantics">
      <div>
        <h4>Stay (exclusive end)</h4>
        <Calendar mode="range" rules={stay} value={nights} onChange={setNights} />
        <p>{countNights(nights) ?? 0} nights</p>
      </div>
      <div>
        <h4>Days (inclusive end)</h4>
        <Calendar mode="range" rules={days} value={tickets} onChange={setTickets} />
        <p>{countDays(tickets) ?? 0} days</p>
      </div>
    </div>
  );
}
