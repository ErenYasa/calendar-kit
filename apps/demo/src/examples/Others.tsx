import { useMemo, useState } from 'react';
import {
  Calendar,
  type CalendarDate,
  type DateRange,
  type DefaultDayData,
  addDays,
  closedDates,
  combineRules,
  countDays,
  dayRangeRules,
  getToday,
  getWeekday,
  messagesTr,
} from 'calendar-kit';

const TODAY = getToday();

const boatMessages = { ...messagesTr, dayReasons: { ...messagesTr.dayReasons, closed: 'Dolu', 'out-of-schedule': 'Hafta içi hizmet yok' } };
// A few booked days the app knows about (real unavailability, never relaxed).
const BOOKED = new Set([addDays(TODAY, 9), addDays(TODAY, 10), addDays(TODAY, 23)]);
const boatStatus = (d: CalendarDate) => (BOOKED.has(d) ? 'closed' : undefined);

function CustomDatesToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      Özel tarih: <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

/**
 * Boat chartered Saturday → Saturday only (inclusive days). "Özel tarih"
 * relaxes the schedule (weekday + length rules) so any free range can be
 * picked; booked days stay blocked.
 */
export function BoatWeeklyExample() {
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  const [custom, setCustom] = useState(false);
  const rules = useMemo(
    () => dayRangeRules({ disablePast: true, startWeekdays: [6], endWeekdays: [6], minDays: 8, getDayStatus: boatStatus }),
    [],
  );
  return (
    <Calendar
      mode="range"
      locale="tr-TR"
      messages={boatMessages}
      numberOfMonths={2}
      value={value}
      onChange={setValue}
      rules={rules}
      relaxSchedule={custom}
      renderFooter={() => (
        <div className="row">
          <CustomDatesToggle checked={custom} onChange={setCustom} />
          <span>{countDays(value) ? `${countDays(value)} gün (başlangıç ve bitiş dahil)` : custom ? 'İstediğiniz aralığı seçin' : 'Cumartesiden cumartesiye seçin'}</span>
        </div>
      )}
    />
  );
}

/**
 * Boat serving weekends only: one day (click once) or a multi-day range
 * (click again later) in the same calendar. Ranges cannot cross weekdays.
 */
export function BoatWeekendExample() {
  const [value, setValue] = useState<DateRange>({ start: null, end: null });
  const [custom, setCustom] = useState(false);
  const rules = useMemo(
    () => dayRangeRules({ disablePast: true, availableWeekdays: [6, 0], singleDayFirst: true, maxDays: 9, getDayStatus: boatStatus }),
    [],
  );
  const days = countDays(value);
  return (
    <Calendar<DefaultDayData>
      mode="range"
      locale="tr-TR"
      messages={boatMessages}
      numberOfMonths={2}
      value={value}
      onChange={setValue}
      rules={rules}
      relaxSchedule={custom}
      getDayData={(d) => (getWeekday(d) === 6 || getWeekday(d) === 0 ? { label: '€900' } : custom ? { label: '€650' } : undefined)}
      renderFooter={() => (
        <div className="row">
          <CustomDatesToggle checked={custom} onChange={setCustom} />
          <span>{days === 1 ? `Tek gün: ${value.start}` : days ? `${days} gün` : 'Bir gün seçin; aralık için ikinci bir gün seçin'}</span>
        </div>
      )}
    />
  );
}

/** Event tickets: single date, icons/badges, sold-out days. */
export function EventExample() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  const soldOut = useMemo(() => [addDays(TODAY, 3), addDays(TODAY, 10)], []);
  const data = (d: CalendarDate): DefaultDayData | undefined => {
    const wd = getWeekday(d);
    if (wd === 5) return { icon: '🎵', label: 'Konser', description: 'Akşam konseri' };
    if (wd === 6) return { icon: '🎭', badge: '2', markers: [{ color: '#e11d48', label: 'Son biletler' }], description: '2 gösteri, son biletler' };
    return undefined;
  };
  return (
    <Calendar<DefaultDayData>
      mode="single"
      locale="en-GB"
      value={value}
      onChange={setValue}
      rules={combineRules(closedDates(soldOut, 'sold-out'), { getDayAvailability: (d) => (data(d) ? undefined : { closed: true, reason: 'no-event' }) })}
      disablePast
      messages={{ dayReasons: { 'sold-out': 'Sold out', 'no-event': 'No event on this day' } }}
      getDayData={data}
      renderFooter={() => <p>{value ? `Tickets for ${value}` : 'Pick an event day'}</p>}
    />
  );
}

/** Lessons: independent multiple dates, max 5. */
export function MultipleExample() {
  const [value, setValue] = useState<readonly CalendarDate[]>([]);
  return (
    <Calendar
      mode="multiple"
      locale="de-DE"
      value={value}
      onChange={setValue}
      rules={{ maxSelections: 5, startWeekdays: [2, 4] }}
      disablePast
      numberOfMonths={2}
      overflow="reduce-months"
      messages={{ reasons: { 'weekday-start': () => 'Kurse nur Di/Do', 'max-selections': (p) => `Maximal ${p.max} Termine` } }}
      renderFooter={() => <p>{value.length} / 5 Termine: {[...value].sort().join(', ')}</p>}
    />
  );
}

/** Read-only availability display with an explicit legend. */
export function ReadonlyExample() {
  const closed = useMemo(() => new Set([addDays(TODAY, 2), addDays(TODAY, 3), addDays(TODAY, 9)]), []);
  return (
    <Calendar<DefaultDayData>
      mode="readonly"
      locale="tr-TR"
      messages={messagesTr}
      numberOfMonths={2}
      rules={closedDates(closed, 'booked')}
      modifiers={{ booked: (d) => closed.has(d.date) }}
      getDayData={(d) => (closed.has(d) ? { markers: [{ color: '#c2410c' }], description: 'Dolu' } : undefined)}
      className="readonly-demo"
      renderFooter={() => (
        <ul className="legend">
          <li>
            <span className="swatch" style={{ background: '#c2410c' }} /> Dolu
          </li>
          <li>
            <span className="swatch" style={{ border: '1.5px solid #9aa0a6' }} /> Bugün
          </li>
        </ul>
      )}
    />
  );
}
