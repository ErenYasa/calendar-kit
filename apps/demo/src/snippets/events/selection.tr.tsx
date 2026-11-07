// Bir rezervasyon formunda seçim olayları: taslağı kaydedin, dönüşüm hunisini
// izleyin, reddedilen tıklamaları açıklayın ve gönder düğmesini geçerlilikle
// senkron tutun.
import { useState } from 'react';
import { Calendar, type DateRange, type RangeEndpoint, type ValidationResult, countNights, stayRules } from 'calendar-kit';

// Uygulamanızın kendi fonksiyonları.
declare function track(name: string, data?: Record<string, unknown>): void;
declare function saveDraft(dates: DateRange): void;

const rules = stayRules({ minNights: 2, disablePast: true });
const EMPTY: DateRange = { start: null, end: null };

export function StayDates() {
  const [dates, setDates] = useState<DateRange>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, issue: null });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Calendar
        mode="range"
        numberOfMonths={2}
        rules={rules}
        value={dates}
        onChange={(next, e) => {
          // Kontrollü: takvim `next` değerini ancak siz sakladığınızda gösterir.
          setDates(next);
          setError(null);
          saveDraft(next);
          track('dates_changed', { reason: e.reason, source: e.source, phase: e.phase });
        }}
        onSelectionComplete={(e) => {
          // `e.value` `unknown` türündedir: modunuza göre dönüştürün (cast).
          const range = e.value as DateRange;
          track('dates_completed', { nights: countNights(range), source: e.source });
        }}
        onSelectionClear={(e) => track('dates_cleared', { source: e.source })}
        onInvalidSelection={(e) => setError(e.message)}
        onValidationChange={(e) => setValidation(e.current)}
        onDateClick={(e) => {
          // Reddedilenler dahil her etkinleştirme (mesaj onInvalidSelection’dadır).
          if (!e.accepted && e.issue) track('date_rejected', { code: e.issue.code, reason: e.issue.dayReason });
        }}
      />
      <p role="alert">{error}</p>
      <button type="submit" disabled={!dates.end || !validation.valid}>
        Devam
      </button>
    </form>
  );
}

// Kontrollü activeEndpoint: "Giriş / Çıkış" alanları sonraki tıklamanın hangi
// ucu seçeceğine karar verir. onActiveEndpointChange, onChange gibi bir istektir.
export function CheckInCheckOut() {
  const [dates, setDates] = useState<DateRange>(EMPTY);
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');

  return (
    <div>
      <div role="group" aria-label="Düzenlenecek tarihler">
        <button type="button" aria-pressed={endpoint === 'start'} onClick={() => setEndpoint('start')}>
          Giriş: {dates.start ?? 'tarih ekleyin'}
        </button>
        <button type="button" aria-pressed={endpoint === 'end'} disabled={!dates.start} onClick={() => setEndpoint('end')}>
          Çıkış: {dates.end ?? 'tarih ekleyin'}
        </button>
        <button
          type="button"
          onClick={() => {
            // İki prop da sizin: ikisini birlikte sıfırlayın (prop değişiklikleri callback çağırmaz).
            setDates(EMPTY);
            setEndpoint('start');
          }}
        >
          Temizle
        </button>
      </div>
      <Calendar
        mode="range"
        rules={rules}
        value={dates}
        onChange={setDates}
        activeEndpoint={endpoint}
        onActiveEndpointChange={(next) => setEndpoint(next)}
      />
    </div>
  );
}
