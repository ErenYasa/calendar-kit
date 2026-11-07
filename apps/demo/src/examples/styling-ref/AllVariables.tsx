import { useState } from 'react';
import { Calendar, addDays, getMonth, addMonthsToMonth, getToday, type CalendarMonth } from 'calendar-kit';
import './AllVariables.css';

// Every public theme variable set to a loud value (see AllVariables.css), so
// you can see which pixels each one drives:
// - hover a day (--cal-hover), Tab to a day (--cal-focus)
// - click a new start, then hover a later day (--cal-preview band, --cal-accent outline)
// - the second month fails to load (--cal-danger) until you press Retry
// - the range start has a persistent tooltip (--cal-tooltip-*)
export default function AllVariables() {
  const [today] = useState(() => getToday());
  const [failed, setFailed] = useState<CalendarMonth | null>(() => addMonthsToMonth(getMonth(today), 1));
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      today={today}
      disablePast
      defaultValue={{ start: addDays(today, 1), end: addDays(today, 5) }}
      getDataStatus={(month) => (month === failed ? 'error' : 'loaded')}
      onRetry={() => setFailed(null)}
      getDayTooltip={({ day }) => (day.selectedStart ? { content: 'Tooltip: bg, colour, shadow and max-width come from variables', persistent: true } : null)}
      className="sr-loud"
    />
  );
}
