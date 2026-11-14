// Biçimlendirmeyi, yerleşimi ve kimliği değiştiren prop’lar ile controller metotları.
// Her biri gerçek kullanımıyla gösterilir; varsayılanlar ve sınırlar için prop tablosuna bakın.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, type SelectionRules, stayRules } from 'calendar-kit';

const rules: SelectionRules[] = [
  stayRules({ fixedNights: 7 }), // tek tıklama bütün bir haftayı seçer
  // stayRules bunu zaten açar; düz kurallarda, geçerli bir bitişe hiç ulaşamayacak
  // başlangıç günlerini seçilemez yapmak için açın:
  { requireReachableEnd: true },
];

export function FormattingAndLayout() {
  const calendar = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar
        ref={calendar}
        id="week-picker" // kök id; tooltip’in id’si bundan türetilir ("week-picker-tooltip")
        style={{ ['--cal-accent' as string]: '#0b6e4f' }} // kök öğede CSS değişkenleri
        mode="range"
        rules={rules}
        value={range}
        onChange={setRange}
        defaultActiveEndpoint="start" // uncontrolled uç (takvim tutar): ilk tıklamanın hangi ucu belirleyeceği
        direction="ltr" // yerel ayar ne olursa olsun yönü sabitler
        monthTitleFormat={{ month: 'short', year: '2-digit' }} // ay başlıkları için Intl seçenekleri
        formatMonthTitle={(month, locale) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(`${month}-15T12:00:00Z`))}
        formatWeekday={(weekday) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday]} // başlık metni (ReactNode)
        formatDayLabel={(date, locale) => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))} // ekran okuyucu etiketi
        numberOfMonths={2}
        monthGap={16} // aylar arası px
        maxDaySize={48} // geniş ekranlarda hücre yüksekliğini sınırlar
        fixedWeeks // her zaman altı hafta satırı: yükseklik aylar arasında zıplamaz
        navigation="continuous"
        maxRenderedMonths={12} // sürekli: DOM’da en fazla 12 ay
      />
      <button type="button" onClick={() => calendar.current?.previous()}>
        Önceki
      </button>
      <button type="button" onClick={() => calendar.current?.next()}>
        Sonraki
      </button>
      <button type="button" onClick={() => calendar.current?.setActiveEndpoint('end')}>
        Çıkışı değiştir
      </button>
    </div>
  );
}
