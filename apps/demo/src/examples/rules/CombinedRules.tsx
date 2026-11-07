import { useMemo, useState } from 'react';
import { Calendar, type DateRange, addDays, closedDates, combineRules, countNights, getToday, stayRules } from 'calendar-kit';

// Three independent rule sets, combined into one where every rule must pass:
// - the product: Friday or Saturday check-in, 2 to 7 nights (schedule rules)
// - maintenance: two closed days (real unavailability, from closedDates)
// - the sales window: bookable for the next 45 days only
// "Custom dates" relaxes the schedule rules of every part; maintenance and
// the sales window still apply.
export default function CombinedRules() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [customDates, setCustomDates] = useState(false);

  const rules = useMemo(
    () =>
      combineRules(
        stayRules({ disablePast: true, checkInWeekdays: [5, 6], minNights: 2, maxNights: 7 }),
        closedDates([addDays(today, 10), addDays(today, 11)], 'maintenance'),
        { maxDate: addDays(today, 45) },
      ),
    [today],
  );

  return (
    <div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={today}
        rules={rules}
        relaxSchedule={customDates}
        value={range}
        onChange={setRange}
        messages={{ dayReasons: { maintenance: 'Closed for maintenance' } }}
      />
      <p>
        <label>
          <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Custom dates
        </label>{' '}
        {range.end ? `· ${countNights(range)} nights` : ''}
      </p>
    </div>
  );
}
