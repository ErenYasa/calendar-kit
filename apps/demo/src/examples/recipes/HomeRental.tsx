import { useMemo, useState } from 'react';
import { Calendar, type DateRange, type SelectionRules, countNights, getIncludedDays, getToday, stayRules } from 'calendar-kit';
import { useAvailability } from '../shared/availability';
import './Recipes.css';

/** Everything except `dates` is app state; the calendar only sees the dates. */
interface Booking {
  dates: DateRange;
  checkOutTime: '11:00' | '18:00';
}

export default function HomeRental() {
  const [booking, setBooking] = useState<Booking>({ dates: { start: null, end: null }, checkOutTime: '11:00' });
  const [customDates, setCustomDates] = useState(false);
  const { getDataStatus, dayInfo, ensure, retry } = useAvailability();

  const rules = useMemo<SelectionRules<Booking>[]>(
    () => [
      stayRules<Booking>({ minNights: 2, disablePast: true, getDayStatus: (d) => dayInfo(d)?.status }),
      // A business rule that depends on app state (passed as `ruleContext`):
      // late check-out is impossible when the next guest arrives that day.
      {
        getDayAvailability: (d, ctx) =>
          ctx.context.checkOutTime === '18:00' && dayInfo(d)?.status === 'booked' ? { canEnd: false, message: 'No late check-out: next guest arrives' } : undefined,
      },
    ],
    [dayInfo],
  );
  const total = getIncludedDays(booking.dates, 'exclusive').reduce((sum, d) => sum + (dayInfo(d)?.price ?? 0), 0);
  const nights = countNights(booking.dates);
  const choosingEnd = !!booking.dates.start && !booking.dates.end;

  return (
    <Calendar<{ label: string }, Booking>
      mode="range"
      numberOfMonths={2}
      minDate={getToday()}
      value={booking.dates}
      onChange={(dates) => setBooking((b) => ({ ...b, dates }))}
      rules={rules}
      ruleContext={booking}
      // "Custom dates": schedule rules such as the 2-night minimum are relaxed;
      // real bookings still apply.
      relaxSchedule={customDates}
      getDataStatus={getDataStatus}
      onRenderedMonthsChange={(e) => ensure(e.months)}
      onRetry={retry}
      getDayData={(d) => {
        const info = dayInfo(d);
        return info?.status === 'available' ? { label: `$${info.price}` } : undefined;
      }}
      getDayTooltip={({ day }) => {
        if (choosingEnd && day.selectedStart) return { content: 'Choose your check-out date', persistent: true };
        return day.disabled && !day.past ? day.reasonText : null;
      }}
      renderFooter={(ctx) => (
        <div className="recipe-footer">
          <div className="recipe-row">
            <span>Check-out</span>
            {(['11:00', '18:00'] as const).map((t) => (
              <button key={t} type="button" aria-pressed={booking.checkOutTime === t} onClick={() => setBooking((b) => ({ ...b, checkOutTime: t }))}>
                {t}
              </button>
            ))}
            <label>
              <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Custom dates
            </label>
          </div>
          <div className="recipe-row">
            <span>{nights ? `${nights} nights · $${total}` : 'Select dates'}</span>
            {!ctx.validation.valid && <span className="recipe-warn">These dates are no longer available.</span>}
            <button type="button" onClick={() => ctx.actions.clear()}>
              Clear
            </button>
            <button type="button" disabled={ctx.phase !== 'complete' || !ctx.validation.valid} onClick={() => alert(JSON.stringify(booking))}>
              Book
            </button>
          </div>
        </div>
      )}
    />
  );
}
