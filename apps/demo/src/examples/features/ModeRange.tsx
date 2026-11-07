import { useState } from 'react';
import { Calendar, type DateRange, getSelectionPhase } from 'calendar-kit';

export default function ModeRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const phase = getSelectionPhase({ mode: 'range', value: range });
  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} value={range} onChange={setRange} />
      <p>
        {range.start ?? '—'} → {range.end ?? '—'} ({phase})
      </p>
    </div>
  );
}
