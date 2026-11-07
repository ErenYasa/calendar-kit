import { useMemo, useState } from 'react';
import { Calendar, type DateRange, type SelectionRules, countNights, getIncludedDays, getToday, stayRules } from 'calendar-kit';
import { useAvailability } from '../shared/availability.tr';
import './Recipes.css';

/** `dates` dışındaki her şey uygulama durumudur; takvim yalnızca tarihleri görür. */
interface Booking {
  dates: DateRange;
  checkOutTime: '11:00' | '18:00';
}

export default function HomeRental() {
  const [booking, setBooking] = useState<Booking>({ dates: { start: null, end: null }, checkOutTime: '11:00' });
  const [customDates, setCustomDates] = useState(false);
  const [today] = useState(() => getToday());
  const { getDataStatus, dayInfo, ensure, retry } = useAvailability();

  const rules = useMemo<SelectionRules<Booking>[]>(
    () => [
      stayRules<Booking>({ minNights: 2, disablePast: true, getDayStatus: (d) => dayInfo(d)?.status }),
      // Uygulama durumuna bağlı bir iş kuralı (`ruleContext` olarak aktarılır):
      // sonraki misafir o gün geliyorsa geç çıkış mümkün değildir.
      {
        getDayAvailability: (d, ctx) =>
          ctx.context.checkOutTime === '18:00' && dayInfo(d)?.status === 'booked' ? { canEnd: false, message: 'Geç çıkış yok: sonraki misafir geliyor' } : undefined,
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
      minDate={today}
      value={booking.dates}
      onChange={(dates) => setBooking((b) => ({ ...b, dates }))}
      rules={rules}
      ruleContext={booking}
      // "Özel tarihler": 2 gecelik minimum gibi takvim (schedule) kuralları
      // gevşetilir; gerçek rezervasyonlar yine geçerlidir.
      relaxSchedule={customDates}
      getDataStatus={getDataStatus}
      onRenderedMonthsChange={(e) => ensure(e.months)}
      onRetry={retry}
      getDayData={(d) => {
        const info = dayInfo(d);
        return info?.status === 'available' ? { label: `$${info.price}` } : undefined;
      }}
      getDayTooltip={({ day }) => {
        if (choosingEnd && day.selectedStart) return { content: 'Çıkış tarihinizi seçin', persistent: true };
        return day.disabled && !day.past ? day.reasonText : null;
      }}
      renderFooter={(ctx) => (
        <div className="recipe-footer">
          <div className="recipe-row">
            <span>Çıkış</span>
            {(['11:00', '18:00'] as const).map((t) => (
              <button key={t} type="button" aria-pressed={booking.checkOutTime === t} onClick={() => setBooking((b) => ({ ...b, checkOutTime: t }))}>
                {t}
              </button>
            ))}
            <label>
              <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Özel tarihler
            </label>
          </div>
          <div className="recipe-row">
            <span>{nights ? `${nights} gece · $${total}` : 'Tarih seçin'}</span>
            {!ctx.validation.valid && <span className="recipe-warn">Bu tarihler artık müsait değil.</span>}
            <button type="button" onClick={() => ctx.actions.clear()}>
              Temizle
            </button>
            <button type="button" disabled={ctx.phase !== 'complete' || !ctx.validation.valid} onClick={() => alert(JSON.stringify(booking))}>
              Rezervasyon yap
            </button>
          </div>
        </div>
      )}
    />
  );
}
