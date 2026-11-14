// Biçimlendirmeyi, yerleşimi ve kimliği değiştiren prop’lar ile controller metotları.
// Her biri gerçek kullanımıyla gösterilir; varsayılanlar ve sınırlar için prop tablosuna bakın.
import { useRef, useState } from 'react';
import { Calendar, type CalendarController, type DateRange, type SelectionRules, stayRules } from 'calendar-kit';

// Yalnızca tam haftalar: tek tıklama 7 gece seçer.
const weekRules = stayRules({ fixedNights: 7 });
// Serbest uzunluk, en az 2 gün. stayRules requireReachableEnd’i kendisi açar;
// düz kurallarda siz eklersiniz; böylece geçerli bir bitişe hiç ulaşamayacak başlangıç günleri devre dışı olur.
const flexibleRules: SelectionRules = { minLength: 2, requireReachableEnd: true };

export function FormattingAndLayout({ weeksOnly = false }: { weeksOnly?: boolean }) {
  const calendar = useRef<CalendarController>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <Calendar
        ref={calendar}
        id="week-picker" // kök id; tooltip’in id’si bundan türetilir ("week-picker-tooltip")
        style={{ ['--cal-accent' as string]: '#0b6e4f' }} // kök öğede CSS değişkenleri
        mode="range"
        rules={weeksOnly ? weekRules : flexibleRules}
        value={range}
        onChange={setRange}
        defaultActiveEndpoint="start" // uncontrolled: ilk tıklamanın belirleyeceği uç (boş bir aralıkta varsayılan da 'start')
        direction="ltr" // yerel ayar ne olursa olsun yönü sabitler
        monthTitleFormat={{ month: 'short', year: '2-digit' }} // ay başlıkları için Intl seçenekleri; yalnızca formatMonthTitle yokken kullanılır
        formatMonthTitle={(month, locale) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(`${month}-15T12:00:00Z`))} // başlık metnini kendisi döndürür ("November"), bu yüzden yukarıdaki monthTitleFormat yok sayılır
        formatWeekday={(weekday) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday]} // görünen hafta günü başlığı (ReactNode); ekran okuyucu yine tam adı okur
        formatDayLabel={(date, locale) => new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))} // her günün ekran okuyucu etiketinin tarih kısmı
        numberOfMonths={2}
        monthGap={16} // aylar arası px
        maxDaySize={48} // geniş ekranlarda hücre yüksekliğini sınırlar
        fixedWeeks // her ay 6 hafta satırıyla gösterilir; yükseklik aydan aya değişmez
        navigation="continuous"
        maxRenderedMonths={12} // sürekli: sayfada aynı anda en fazla 12 ay
      />
      {/* Sürekli modda previous()/next() önceki/sonraki aya kaydırır. */}
      <button type="button" onClick={() => calendar.current?.previous()}>
        Önceki
      </button>
      <button type="button" onClick={() => calendar.current?.next()}>
        Sonraki
      </button>
      {/* Sonraki tıklama aralığın bitişini taşır. weeksOnly ile etkisi yoktur: sabit uzunlukta tıklama her zaman iki ucu birden belirler. */}
      <button type="button" onClick={() => calendar.current?.setActiveEndpoint('end')}>
        Çıkışı değiştir
      </button>
    </div>
  );
}
