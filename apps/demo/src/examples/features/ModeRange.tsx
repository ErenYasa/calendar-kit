import { useState } from 'react';
import { Calendar, type DateRange, getSelectionPhase } from 'calendar-kit';

// Click a start, move the pointer to preview the range, then click an end.
// Clicking a day before the start begins a new range. In parentheses: the
// phase from getSelectionPhase ('empty', 'start-selected' or 'complete').
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
