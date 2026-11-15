import { useMemo, useState } from 'react';
import { Calendar, type DateRange, addDays, closedDates, combineRules, countNights, getToday, stayRules } from 'calendar-kit';

// Birbirinden bağımsız üç kural seti tek bir sette birleştirilir; seçim hepsinden geçmelidir:
// - ürün: cuma veya cumartesi giriş, 2–7 gece (takvim düzeni kuralları)
// - bakım: iki kapalı gün (gerçek kapalılık, closedDates ile)
// - satış penceresi: yalnızca sonraki 45 gün rezerve edilebilir
// "Özel tarihler" her parçanın takvim düzeni kurallarını kaldırır; bakım ve satış
// penceresi yine geçerlidir.
// Bakım sebebinin metni, takvimin yerel ayarıyla (İngilizce) uyumlu olsun diye
// messages içinde İngilizce bırakıldı.
export default function CombinedRules() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [customDates, setCustomDates] = useState(false);

  const rules = useMemo(
    () =>
      combineRules(
        stayRules({ disablePast: true, checkInWeekdays: [5, 6], minNights: 2, maxNights: 7 }),
        closedDates([addDays(today, 10), addDays(today, 11)], 'maintenance'),
        { maxDate: addDays(today, 45) },
      ),
    [today],
  );

  return (
    <div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        today={today}
        rules={rules}
        relaxSchedule={customDates}
        value={range}
        onChange={setRange}
        messages={{ dayReasons: { maintenance: 'Closed for maintenance' } }}
      />
      <p>
        <label>
          <input type="checkbox" role="switch" checked={customDates} onChange={(e) => setCustomDates(e.target.checked)} /> Özel tarihler
        </label>{' '}
        {range.end ? `· ${countNights(range)} gece` : ''}
      </p>
    </div>
  );
}
