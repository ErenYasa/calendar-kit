import { useState } from 'react';
import { Calendar, type DateRange, countNights } from 'calendar-kit';
import 'calendar-kit/styles.css';

export default function QuickStart() {
  const [stay, setStay] = useState<DateRange>({ start: null, end: null });
  const nights = countNights(stay);

  return (
    <div>
      <Calendar mode="range" numberOfMonths={2} value={stay} onChange={setStay} />
      <p>{nights ? `${nights} nights: ${stay.start} → ${stay.end}` : 'Pick a start and an end date.'}</p>
    </div>
  );
}
