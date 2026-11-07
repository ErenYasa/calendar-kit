import { useState } from 'react';
import { Calendar, type CalendarDate } from 'calendar-kit';

// Course sessions: pick up to 4 dates, Tuesdays and Thursdays only.
// In multiple mode `startWeekdays` decides which weekdays can be picked, and
// the texts for the two rejections are overridden through `messages.reasons`.
export default function SessionDays() {
  const [dates, setDates] = useState<readonly CalendarDate[]>([]);
  return (
    <div>
      <Calendar
        mode="multiple"
        numberOfMonths={2}
        rules={{ disablePast: true, startWeekdays: [2, 4], maxSelections: 4 }}
        messages={{
          reasons: {
            'weekday-start': () => 'Sessions run on Tuesdays and Thursdays',
            'max-selections': (p) => `You can book ${p.max} sessions`,
          },
        }}
        value={dates}
        onChange={setDates}
      />
      <p>{dates.length ? `Sessions: ${[...dates].sort().join(', ')}` : 'No sessions yet.'}</p>
    </div>
  );
}
