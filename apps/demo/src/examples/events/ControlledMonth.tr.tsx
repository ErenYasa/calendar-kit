import { useState } from 'react';
import { Calendar, type CalendarMonth, addMonthsToMonth, formatMonth, getMonth, getToday, lastDayOfMonth } from 'calendar-kit';

// Kontrollü visibleMonth: oklar yalnızca onVisibleMonthChange üzerinden bir ay
// ister. "Okları takip et" işaretini kaldırın, istek yok sayılır.
export default function ControlledMonth() {
  const [today] = useState(() => getToday());
  const thisMonth = getMonth(today);
  const [month, setMonth] = useState<CalendarMonth>(thisMonth);
  const [follow, setFollow] = useState(true);
  const [last, setLast] = useState('');
  const options = Array.from({ length: 12 }, (_, i) => addMonthsToMonth(thisMonth, i));

  return (
    <div>
      <p>
        <label>
          Ay{' '}
          <select value={month} onChange={(e) => setMonth(e.target.value as CalendarMonth)}>
            {options.map((m) => (
              <option key={m} value={m}>
                {formatMonth(m, 'en-US')}
              </option>
            ))}
          </select>
        </label>{' '}
        <label>
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Okları takip et
        </label>
      </p>
      <Calendar
        mode="single"
        // Gezinme, listede sunulan ayların içinde kalır.
        minDate={today}
        maxDate={lastDayOfMonth(options[options.length - 1]!)}
        visibleMonth={month}
        onVisibleMonthChange={(next, e) => {
          setLast(`İstenen ay: ${next} (reason: ${e.reason}, source: ${e.source})`);
          if (follow) setMonth(next);
        }}
      />
      <p role="status">{last}</p>
    </div>
  );
}
