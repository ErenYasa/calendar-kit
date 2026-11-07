import { useState } from 'react';
import { Calendar, type DateRange, countNights, firstDayOfMonth, stayRules } from 'calendar-kit';
import './Slots.css';

const rules = stayRules({ minNights: 1, disablePast: true });

// Header and footer slots receive the calendar's state and its actions.
export default function Slots() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={rules}
      value={range}
      onChange={setRange}
      renderHeader={(ctx) => (
        <div className="slot-row">
          <strong>{ctx.phase === 'start-selected' ? 'Select check-out' : 'Select check-in'}</strong>
          <span>{ctx.visibleMonths.map((m) => ctx.formatDate(firstDayOfMonth(m), { month: 'long', year: 'numeric' })).join(' – ')}</span>
        </div>
      )}
      renderFooter={(ctx) => (
        <div className="slot-row">
          <span>{range.end ? `${countNights(range)} nights` : 'No dates'}</span>
          <button type="button" onClick={() => ctx.actions.clear()} disabled={ctx.phase === 'empty'}>
            Clear
          </button>
        </div>
      )}
    />
  );
}
