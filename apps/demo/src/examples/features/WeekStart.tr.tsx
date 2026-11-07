import { Calendar } from 'calendar-kit';

// en-US haftayı pazar günü başlatır; `firstDayOfWeek` (0 = pazar … 6 = cumartesi)
// yerel ayarın varsayılanını geçersiz kılar. `weekdayFormat` dar/kısa/uzun adları seçer.
export default function WeekStart() {
  return <Calendar mode="single" locale="en-US" firstDayOfWeek={1} weekdayFormat="narrow" />;
}
