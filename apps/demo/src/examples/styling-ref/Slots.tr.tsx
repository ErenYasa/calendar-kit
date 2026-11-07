import { useState } from 'react';
import { Calendar, addDays, getToday, type DateRange } from 'calendar-kit';
import './Slots.css';

// Slotlar tek bir bölgenin yerine geçer ve takvimin durumunu alır (`ctx`, bir
// SlotContext): anlık durum (snapshot), controller (`ctx.actions`), mesajlar,
// yerel ayar ve `formatDate`. Her biri, varsayılan sınıfını ve sizin
// `classNames` anahtarınızı (header, navigation, footer) yine alan bir öğeye sarılır.
export default function Slots() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: addDays(today, 3), end: addDays(today, 7) });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      today={today}
      disablePast
      value={range}
      onChange={setRange}
      classNames={{ header: 'sl-header', navigation: 'sl-nav', footer: 'sl-footer' }}
      renderHeader={(ctx) => <strong>Aşama: {ctx.phase}</strong>}
      // Varsayılan okların yerine geçer (yalnızca sayfalı gezinme).
      renderNavigation={(nav, ctx) => (
        <>
          <button type="button" className="sl-button" onClick={nav.previous} disabled={!nav.canPrevious} aria-label={nav.labels.previous}>
            ←
          </button>
          <button type="button" className="sl-button" onClick={() => ctx.actions.goToMonth(today)}>
            Bugün
          </button>
          <button type="button" className="sl-button" onClick={nav.next} disabled={!nav.canNext} aria-label={nav.labels.next}>
            →
          </button>
        </>
      )}
      // Ay başlığı satırının yerine geçer. Bir başlık öğesi bırakın: ekran okuyucular için ayı adlandırır.
      renderMonthHeader={({ title, index }) => (
        <h3 className="sl-month-title">
          <span className="sl-index">{index + 1}</span> {title}
        </h3>
      )}
      // Varsayılan gün düğmesinin içi: burada düğme veya bağlantı olmasın.
      renderDayContent={({ day }) => (
        <span className="sl-day">
          {day.dayText}
          {day.weekEnd && <span className="sl-dot" aria-hidden="true" />}
        </span>
      )}
      getDayTooltip={({ day }) => (day.selectedStart || day.selectedEnd ? day.label : null)}
      // Araç ipucu içeriğini sarar; `content`, getDayTooltip’in döndürdüğü değerdir.
      renderDayTooltip={({ day, content, placement }) => (
        <span className="sl-tip">
          {day.selectedStart ? 'Başlangıç' : 'Bitiş'} · {content} ({placement})
        </span>
      )}
      renderFooter={(ctx) => (
        <span>
          {range.start && range.end ? `${ctx.formatDate(range.start)} – ${ctx.formatDate(range.end)}` : 'Bir aralık seçin'}
          <button type="button" className="sl-button" onClick={() => ctx.actions.clear()}>
            Temizle
          </button>
        </span>
      )}
    />
  );
}
