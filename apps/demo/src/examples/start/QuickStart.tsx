import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';
import 'calendar-kit/styles.css';

// Stays: the end date is the check-out day and is not counted as a night.
const rules = stayRules();

// Controlled: the range lives in this component's state (`value`), and the
// calendar reports every new selection through `onChange`.
export default function QuickStart() {
  const [stay, setStay] = useState<DateRange>({ start: null, end: null });
  const nights = countNights(stay);

  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} rules={rules} value={stay} onChange={setStay} />
      <p>{nights ? `${nights} nights: ${stay.start} → ${stay.end}` : 'Pick a check-in date, then a check-out date.'}</p>
    </div>
  );
}
