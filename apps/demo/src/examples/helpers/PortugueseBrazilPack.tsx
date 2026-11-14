import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, getDateParts, stayRules } from 'calendar-kit';
import { messagesPtBr } from './messagesPtBr';

// Every 9th, 18th and 27th night is booked; stays need at least 2 nights.
const rules = stayRules({
  minNights: 2,
  disablePast: true,
  getDayStatus: (date: CalendarDate) => (getDateParts(date).day % 9 === 0 ? 'booked' : 'available'),
});

// locale="pt-BR": month and weekday names, date formats and the week start
// (Sunday in Brazil) come from Intl. messagesPtBr: every text of the calendar.
export default function PortugueseBrazilPack() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [rejected, setRejected] = useState('');

  return (
    <div>
      <Calendar
        mode="range"
        locale="pt-BR"
        messages={messagesPtBr}
        rules={rules}
        value={range}
        onChange={setRange}
        onInvalidSelection={(e) => setRejected(e.message)}
      />
      <p>Last rejected click: {rejected || 'none'} (try a booked day, or an end one night after the start).</p>
    </div>
  );
}
