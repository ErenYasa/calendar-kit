import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';
import './Recipes.css';

// Weekly charters: Saturday to Saturday, 7 or 14 nights. These are schedule
// rules; "Custom dates" relaxes them for a special request, while maintenance
// days (real unavailability) still apply.
const maintenanceDays = ['03', '04'];
const rules = stayRules({
  disablePast: true,
  checkInWeekdays: [6],
  checkOutWeekdays: [6],
  minNights: 7,
  maxNights: 14,
  getDayStatus: (d) => (maintenanceDays.includes(d.slice(8)) ? 'closed' : undefined),
});

export default function BoatRental() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [customDates, setCustomDates] = useState(false);
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={rules}
      relaxSchedule={customDates}
      value={range}
      onChange={setRange}
      renderFooter={() => (
        <div className="recipe-footer">
          <div className="recipe-row">
            <span>{range.end ? `${countNights(range)} nights on board` : 'Saturday to Saturday'}</span>
            <label>
              <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Custom dates
            </label>
          </div>
        </div>
      )}
    />
  );
}
