// Gezinme olayları: ayı URL’de tutun, görünen ayları kendi başlığınızda
// gösterin ve kullanıcıların nasıl gezindiğini raporlayın.
import { useState } from 'react';
import { Calendar, type CalendarMonth, addMonthsToMonth, formatMonth, getMonth, getToday, parseMonth } from 'calendar-kit';

// Uygulamanızın kendi fonksiyonu.
declare function track(name: string, data?: Record<string, unknown>): void;

// Kontrollü visibleMonth: ay URL’de tutulur (?month=2026-11).
export function MonthInUrl() {
  const [thisMonth] = useState(() => getMonth(getToday()));
  const [month, setMonth] = useState<CalendarMonth>(() => parseMonth(new URLSearchParams(location.search).get('month')) ?? thisMonth);

  const show = (next: CalendarMonth) => {
    setMonth(next);
    history.replaceState(null, '', `?month=${next}`);
  };

  return (
    <div>
      <label>
        Ay{' '}
        <select value={month} onChange={(e) => show(e.target.value as CalendarMonth)}>
          {Array.from({ length: 12 }, (_, i) => addMonthsToMonth(thisMonth, i)).map((m) => (
            <option key={m} value={m}>
              {formatMonth(m, 'en-US')}
            </option>
          ))}
        </select>
      </label>
      <Calendar
        mode="single"
        disablePast
        visibleMonth={month}
        // Oklar, klavyeyle sayfa değiştirme ve ref.goToMonth() yeni ayı burada ister.
        // Saklamazsanız takvim olduğu yerde kalır.
        onVisibleMonthChange={(next, e) => {
          show(next);
          track('month_viewed', { month: next, reason: e.reason, source: e.source, clamped: e.clamped });
        }}
      />
    </div>
  );
}

// Ekranda gerçekten görünen aylar, örneğin takvimin dışındaki bir başlık için.
// Sürekli modda kaydırmayı takip ederler (IntersectionObserver).
export function VisibleMonthsHeading() {
  const [months, setMonths] = useState<readonly CalendarMonth[]>([]);
  const first = months[0];
  const last = months[months.length - 1];

  return (
    <section aria-labelledby="dates-heading">
      <h2 id="dates-heading">{first && last ? `${formatMonth(first, 'en-US')} – ${formatMonth(last, 'en-US')}` : 'Tarihler'}</h2>
      <Calendar
        mode="range"
        navigation="continuous"
        orientation="vertical"
        numberOfMonths={2}
        maxBlockSize={480}
        onVisibleMonthsChange={(e) => setMonths(e.months)}
      />
    </section>
  );
}
