import { useState } from 'react';
import { Calendar, type DateRange, countDays, dayRangeRules } from 'calendar-kit';

// A 3-day pass: one click selects the whole range.
const rules = dayRangeRules({ fixedDays: 3, disablePast: true });

export default function FixedLength() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />
      <p>{range.end ? `${countDays(range)} days: ${range.start} – ${range.end}` : 'Click a start day.'}</p>
    </div>
  );
}
