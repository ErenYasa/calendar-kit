import { useState } from 'react';
import { Calendar, type DateRange, countNights, firstDayOfMonth, stayRules } from 'calendar-kit';
import './Slots.css';

const rules = stayRules({ minNights: 1, disablePast: true });

// Üst bilgi (header) ve alt bilgi (footer) slotları takvimin durumunu ve eylemlerini alır.
export default function Slots() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      rules={rules}
      value={range}
      onChange={setRange}
      renderHeader={(ctx) => (
        <div className="slot-row">
          <strong>{ctx.phase === 'start-selected' ? 'Çıkış tarihini seçin' : 'Giriş tarihini seçin'}</strong>
          <span>{ctx.visibleMonths.map((m) => ctx.formatDate(firstDayOfMonth(m), { month: 'long', year: 'numeric' })).join(' – ')}</span>
        </div>
      )}
      renderFooter={(ctx) => (
        <div className="slot-row">
          <span>{range.end ? `${countNights(range)} gece` : 'Tarih yok'}</span>
          <button type="button" onClick={() => ctx.actions.clear()} disabled={ctx.phase === 'empty'}>
            Temizle
          </button>
        </div>
      )}
    />
  );
}
