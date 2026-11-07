import { useState } from 'react';
import { Calendar, type DateRange, type SelectionRules, eachDay, getWeekday } from 'calendar-kit';

// A rule the package does not know: a range may contain at most one weekend.
// `validateSelection` runs for every proposed selection; returning an issue
// rejects it and its `message` is announced and shown in the tooltip.
const rules: SelectionRules = {
  disablePast: true,
  validateSelection: (selection) => {
    if (selection.mode !== 'range' || !selection.value.start || !selection.value.end) return null;
    const saturdays = eachDay(selection.value.start, selection.value.end).filter((d) => getWeekday(d) === 6);
    return saturdays.length > 1 ? { code: 'custom', message: 'At most one weekend per booking' } : null;
  },
};

export default function CustomValidation() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <Calendar mode="range" numberOfMonths={2} rules={rules} value={range} onChange={setRange} />;
}
