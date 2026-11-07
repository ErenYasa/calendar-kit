import { useState } from 'react';
import { Calendar, type DateRange, countNights, stayRules } from 'calendar-kit';
import './Recipes.css';

// Haftalık kiralamalar: cumartesiden cumartesiye, 7 veya 14 gece. Bunlar takvim
// (schedule) kurallarıdır; "Özel tarihler" özel bir talep için bunları gevşetir,
// bakım günleri ise (gerçek müsait olmama durumu) yine geçerlidir.
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
            <span>{range.end ? `Teknede ${countNights(range)} gece` : 'Cumartesiden cumartesiye'}</span>
            <label>
              <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Özel tarihler
            </label>
          </div>
        </div>
      )}
    />
  );
}
