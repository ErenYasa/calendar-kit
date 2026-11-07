import { useState } from 'react';
import { Calendar, type DateRange, stayRules } from 'calendar-kit';

const rules = stayRules({ minNights: 2, disablePast: true });

// Hover, focus or tap a day. A rejected day explains why; once a start is
// chosen, a persistent hint asks for the check-out date.
export default function Tooltip() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const choosingEnd = !!range.start && !range.end;

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={rules}
      value={range}
      onChange={setRange}
      tooltip={{ placement: 'top', boundary: 'calendar' }}
      getDayTooltip={({ day }) => {
        if (day.past) return null;
        if (day.disabled && day.reasonText) return day.reasonText;
        if (choosingEnd && day.selectedStart) return { content: 'Choose your check-out date', persistent: true };
        return day.weekday === 5 || day.weekday === 6 ? 'Weekend rate' : 'Weekday rate';
      }}
    />
  );
}
