import { useState } from 'react';
import { Calendar, type CalendarDate, type DateRange, countDays, dayRangeRules } from 'calendar-kit';
import './Recipes.css';

// A festival runs Thursday to Sunday. One click buys a day ticket; a click on a
// later day extends it to a multi-day pass (up to 4 days). Sold-out days are
// closed; low capacity is shown as the day's label.
const PRICE = 45;
const ticketsLeft = (d: CalendarDate) => (Number(d.slice(8)) * 7) % 40;
const rules = dayRangeRules({
  disablePast: true,
  singleDayFirst: true,
  maxDays: 4,
  availableWeekdays: [4, 5, 6, 0],
  getDayStatus: (d) => (ticketsLeft(d) === 0 ? 'closed' : undefined),
});

export default function EventTickets() {
  const [days, setDays] = useState<DateRange>({ start: null, end: null });
  const [people, setPeople] = useState(1);
  const count = countDays(days) ?? 0;
  return (
    <Calendar<{ label: string }>
      mode="range"
      numberOfMonths={2}
      rules={rules}
      value={days}
      onChange={setDays}
      getDayData={(d) => (ticketsLeft(d) > 0 && ticketsLeft(d) < 10 ? { label: `${ticketsLeft(d)} left` } : undefined)}
      renderFooter={() => (
        <div className="recipe-footer">
          <div className="recipe-row">
            <span>{count ? `${count}-day pass × ${people} = $${count * people * PRICE}` : 'Pick a festival day'}</span>
            <label>
              Tickets{' '}
              <input type="number" min={1} max={8} value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))} style={{ width: 56 }} />
            </label>
          </div>
        </div>
      )}
    />
  );
}
