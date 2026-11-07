import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';

// 2 to 7 nights. Ends that would break the rule are disabled while a start is
// selected, and the reason is in the day's label and tooltip.
const rules = stayRules({ minNights: 2, maxNights: 7, disablePast: true });

export default function MinMaxLength() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />
      <p>{range.end ? `${countNights(range)} nights` : 'Choose 2–7 nights.'}</p>
    </div>
  );
}
