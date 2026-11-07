import { useState } from 'react';
import { Calendar, type DateRange, stayRules } from 'calendar-kit';

const rules = stayRules({ minNights: 3, disablePast: true });

// boundary="viewport": the tooltip may extend beyond the calendar (it stays in
// the window) and may cover the calendar's header. placement="right" is tried
// first; when it does not fit, left, then top and bottom are tried.
export default function TooltipViewport() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div style={{ maxWidth: 360 }}>
      <Calendar
        mode="range"
        rules={rules}
        value={range}
        onChange={setRange}
        tooltip={{ boundary: 'viewport', placement: 'right', offset: 12 }}
        getDayTooltip={({ day }) => (day.disabled && !day.past ? day.reasonText : day.past ? null : `${day.label}: available`)}
      />
    </div>
  );
}
