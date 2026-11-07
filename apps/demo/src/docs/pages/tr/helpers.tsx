import type { ReactNode } from 'react';
import arithmetic from '../../../snippets/helpers/arithmetic.tr.ts?code';
import comparing from '../../../snippets/helpers/comparing.tr.ts?code';
import locale from '../../../snippets/helpers/locale.tr.ts?code';
import messages from '../../../snippets/helpers/messages.tr.ts?code';
import parsing from '../../../snippets/helpers/parsing.tr.ts?code';
import parts from '../../../snippets/helpers/parts.tr.ts?code';
import ranges from '../../../snippets/helpers/ranges.tr.ts?code';
import today from '../../../snippets/helpers/today.tr.ts?code';
import { Example, Snippet } from '../../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../../ui';

/** Dışa aktarılan bir fonksiyon: başlık, gerçek imza, davranış. */
function Fn({ name, sig, children }: { name: string; sig: string; children: ReactNode }) {
  return (
    <>
      <h3 id={`fn-${name}`}>
        <code>{name}</code>
      </h3>
      <pre className="docs-pre docs-type-block">{sig}</pre>
      {children}
    </>
  );
}

const IMPORT = (
  <p>
    <code>calendar-kit/core</code> (React içermez; Server Component’lerde ve düz Node’da güvenle kullanılır) ya da <code>calendar-kit</code> üzerinden içe
    aktarın; ikisi de aynı fonksiyonları dışa aktarır.
  </p>
);

export function DateHelpers() {
  return (
    <Page
      title="Tarih yardımcıları"
      lead="Takvimin tarih modeli için saf fonksiyonlar: girdiyi ayrıştırıp doğrulayın, gün ve ay aritmetiği yapın, karşılaştırın, parçaları okuyun, bir saat dilimindeki bugünü alın ve aralıkları ölçün. Hiçbiri bir şey render etmez ve sunucunun/cihazın saat dilimine bağlı değildir."
    >
      <Section title="Tarih modeli">
        <p>
          Bir gün, bir <code>CalendarDate</code>’tir: <code>YYYY-MM-DD</code> biçiminde, gerçek bir Gregoryen tarih olduğu kontrol edilmiş bir dize. Bir ay ise{' '}
          <code>YYYY-MM</code> biçiminde bir <code>CalendarMonth</code>’tur. İkisi de markalı (branded) dize türleridir; bu yüzden düz bir <code>string</code>,
          TypeScript onu kabul etmeden önce aşağıdaki ayrıştırıcılardan birinden geçmelidir. Buna karşılık bir <code>CalendarDate</code>, dize beklenen her yerde
          kullanılabilir (JSON, URL’ler, map anahtarları, <code>&lt;</code>/<code>&gt;</code> karşılaştırması).
        </p>
        <p>
          Tüm aritmetik, tarihi tam sayı bir gün numarasına çevirip geri dönüştürür; bu yüzden sonuçlar asla sunucunun/cihazın saat dilimine veya yaz saatine
          bağlı olmaz ve ayrıştırmada <code>new Date(string)</code> hiç kullanılmaz. Geçerli yıllar 0001 ile 9999 arasıdır.
        </p>
        <PropsTable
          caption="Türler"
          rows={[
            { name: 'CalendarDate', type: 'string & { brand }', description: <>Doğrulanmış bir gün, <code>"2026-11-13"</code>. Saat yok, saat dilimi yok.</> },
            { name: 'CalendarMonth', type: 'string & { brand }', description: <>Doğrulanmış bir ay, <code>"2026-11"</code>.</> },
            { name: 'Weekday', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', description: <>0 = pazar … 6 = cumartesi; <code>Date#getDay</code> ile aynı numaralandırma.</> },
            { name: 'DateParts', type: '{ year: number; month: number; day: number }', description: 'Sayısal parçalar; ay 1–12, gün 1–31.' },
          ]}
        />
        {IMPORT}
        <Note>
          <p>
            <code>CalendarDate</code> alan fonksiyonlar ona güvenir ve yeniden doğrulamaz. Ayrıştırılmak yerine <code>as CalendarDate</code> ile dönüştürülen
            değerler anlamsız sonuçlar verir. Aritmetik desteklenen yılların dışına asla çıkmaz: <code>addDays</code>, <code>addMonths</code> ve{' '}
            <code>addMonthsToMonth</code>, iki uçtan birinin ötesine geçen bir sonucu desteklenen ilk veya son güne ya da aya çeker (
            <code>addDays(&quot;9999-12-30&quot;, 5)</code> sonucu <code>&quot;9999-12-31&quot;</code>’dir); <code>NaN</code> bir miktar ise en yakın sınır
            olmadığı için <code>RangeError</code> fırlatır.
          </p>
        </Note>
      </Section>

      <Section title="Ayrıştırma ve doğrulama">
        <p>Dizeleri veya sayıları tarihe çevirmek için bunları uygulamanızın sınırlarında (URL parametreleri, form alanları, API yanıtları, sabit değerler) kullanın.</p>
        <DataTable
          caption="Hangi ayrıştırıcı kullanılmalı"
          head={['Fonksiyon', 'Girdi', 'Geçersiz girdi', 'Kullanım amacı']}
          rows={[
            [<code key="a">parseDate</code>, 'unknown', <code key="b">null</code>, 'Herhangi bir türdeki güvenilmeyen değerler.'],
            [<code key="a">isCalendarDate</code>, 'unknown', <code key="b">false</code>, 'Aynı kontrol, koşullarda tür koruyucu (type guard) olarak.'],
            [<code key="a">toCalendarDate</code>, 'string', 'RangeError fırlatır', 'Sabit değerler ve geçerli olması gereken değerler (hata açıkça görünsün).'],
            [<code key="a">createDate</code>, 'yıl, ay, gün sayıları', <code key="b">null</code>, 'Sayısal alanlardan tarih oluşturmak.'],
          ]}
        />
        <Fn name="parseDate" sig="function parseDate(input: unknown): CalendarDate | null">
          <p>
            <code>YYYY-MM-DD</code>’yi katı biçimde ayrıştırır. <code>input</code>, tam olarak dört yıl, iki ay ve iki gün hanesinden oluşan ve 0001-01-01 ile
            9999-12-31 arasında gerçek bir günü belirten bir dize olduğunda tarihi döndürür; aksi halde <code>null</code>. Dize olmayan değerler, sıfırla
            doldurulmamış parçalar (<code>2026-1-5</code>), saatler veya saat dilimleri (<code>2026-11-13T10:00Z</code>), baştaki/sondaki boşluklar, imkânsız
            günler (<code>2026-02-30</code>) ve 0000 yılı reddedilir. Asla hata fırlatmaz.
          </p>
        </Fn>
        <Fn name="isCalendarDate" sig="function isCalendarDate(input: unknown): input is CalendarDate">
          <p>
            Tam olarak <code>parseDate(input)</code> bir tarih döndüreceği durumda <code>true</code> döndürür ve <code>input</code>’u{' '}
            <code>CalendarDate</code>’e daraltır. Ayrıştırılmış bir kopya yerine özgün değeri korumak istediğinizde kullanın.
          </p>
        </Fn>
        <Fn name="toCalendarDate" sig="function toCalendarDate(input: string): CalendarDate">
          <p>
            <code>parseDate</code> ile aynı kurallar; ancak tarihi doğrudan döndürür ve geçersiz girdide bir <code>RangeError</code> (
            <code>Invalid calendar date "…" (expected YYYY-MM-DD)</code>) fırlatır. Koddaki, testlerdeki ve{' '}
            <code>minDate={'{'}toCalendarDate('2026-12-01'){'}'}</code> gibi prop’lardaki sabit değerler için kullanışlıdır; hatayı yakalamıyorsanız kullanıcı
            girdisinde kullanmayın.
          </p>
        </Fn>
        <Fn name="createDate" sig="function createDate(year: number, month: number, day: number): CalendarDate | null">
          <p>
            Sayılardan bir tarih oluşturur; <code>month</code> 1–12’dir (<code>Date</code>’teki gibi 0–11 değil). Herhangi bir parça tam sayı değilse, yıl
            1–9999 dışındaysa veya gün o ayda yoksa (artık olmayan bir yılda 29 Şubat) <code>null</code> döndürür. Taşma yapmaz: 32. gün, sonraki ayın 1’i
            değil, <code>null</code>’dır.
          </p>
        </Fn>
        <Fn name="parseMonth" sig="function parseMonth(input: unknown): CalendarMonth | null">
          <p>
            Bir ayı ayrıştırır. <code>YYYY-MM</code>’yi ya da günü atılan geçerli bir tam <code>YYYY-MM-DD</code>’yi kabul eder. Dize olmayan değerler, 01–12
            dışındaki aylar, 0001–9999 dışındaki yıllar ve geçerli bir gün olmayan tam tarihler için <code>null</code> döndürür.
          </p>
        </Fn>
        <Fn name="toCalendarMonth" sig="function toCalendarMonth(input: string): CalendarMonth">
          <p>
            <code>parseMonth</code> gibidir, ancak <code>null</code> döndürmek yerine bir <code>RangeError</code> (
            <code>Invalid calendar month "…" (expected YYYY-MM)</code>) fırlatır.
          </p>
        </Fn>
        <Fn name="createMonth" sig="function createMonth(year: number, month: number): CalendarMonth | null">
          <p>
            Sayılardan bir ay oluşturur (ay 1–12). Tam sayı olmayan değerler, 1–9999 dışındaki yıllar veya 1–12 dışındaki aylar için <code>null</code> döndürür.
          </p>
        </Fn>
        <Snippet files={parsing} label="Ayrıştırma ve doğrulama" />
      </Section>

      <Section title="Aritmetik">
        <Fn name="addDays" sig="function addDays(date: CalendarDate, amount: number): CalendarDate">
          <p>
            <code>date</code>’ten <code>amount</code> gün sonraki günü döndürür (negatifse önceki). Ay ve yıl geçişleri ele alınır; yaz saati bir günün
            kaybolmasına veya tekrarlanmasına yol açamaz. Kesirli bir <code>amount</code> sıfıra doğru kırpılır (<code>1.5</code> → 1, <code>-1.5</code> → −1).{' '}
            <code>addMonths</code> gibi, sonuç asla 0001-01-01 – 9999-12-31 aralığının dışına çıkmaz: iki uçtan birinin ötesine geçen bir kaydırma o günde durur
            (<code>addDays(&quot;9999-12-30&quot;, 5)</code> → <code>&quot;9999-12-31&quot;</code>, <code>addDays(&quot;0001-01-02&quot;, -5)</code> →{' '}
            <code>&quot;0001-01-01&quot;</code>, <code>Infinity</code> → <code>&quot;9999-12-31&quot;</code>). <code>NaN</code> bir miktar{' '}
            <code>RangeError(&apos;Invalid amount&apos;)</code> fırlatır.
          </p>
        </Fn>
        <Fn name="addMonths" sig="function addMonths(date: CalendarDate, amount: number): CalendarDate">
          <p>
            Bir tarihi tam aylar kadar kaydırır (kesirli bir <code>amount</code> sıfıra doğru kırpılır) ve ayın günü varsa onu korur. Yoksa gün, hedef ayın son
            gününe çekilir: 31 Ocak + 1 ay, 28 Şubat’tır (artık yılda 29). Sınıra çekme sonradan geri alınmaz; bu yüzden 31 Ocak’a iki kez bir ay eklemek 31
            Mart değil 28 Mart verir. Bu önemliyse toplamı tek çağrıda ekleyin. Sonuçlar asla 0001–9999 dışına çıkmaz: iki uçtan birinin ötesine geçen bir
            kaydırma ilk veya son ayda durur. <code>NaN</code> bir miktar bir <code>RangeError</code> fırlatır.
          </p>
        </Fn>
        <Fn name="addMonthsToMonth" sig="function addMonthsToMonth(month: CalendarMonth, amount: number): CalendarMonth">
          <p>
            <code>addMonths</code>’ın ay karşılığı; sınıra çekilecek bir günün olmadığı gezinme ve ay listeleri için. Kesirli miktarlar sıfıra doğru kırpılır.
            Sonuçlar 0001-01 ile 9999-12 arasında tutulur (örneğin <code>9999-12</code> + 1, <code>9999-12</code> olarak kalır). <code>NaN</code> bir miktar
            bir <code>RangeError</code> fırlatır.
          </p>
        </Fn>
        <Fn name="diffDays" sig="function diffDays(a: CalendarDate, b: CalendarDate): number">
          <p>
            <code>a</code>’dan <code>b</code>’ye takvim günü sayısı, yani <code>b − a</code>: <code>b</code> daha sonraysa pozitif, daha önceyse negatif,
            aynı gün için 0. 24 saatlik dönemleri değil gün sınırlarını sayar; bu yüzden aradaki bir yaz saati değişikliği fark yaratmaz.
          </p>
        </Fn>
        <Fn name="diffMonths" sig="function diffMonths(a: CalendarMonth, b: CalendarMonth): number">
          <p>
            <code>a</code>’dan <code>b</code>’ye ay sayısı (<code>b − a</code>). Tarih değil ay alır: iki tarihin kaç ay sayfası arayla olduğunu öğrenmek için{' '}
            <code>getMonth(date)</code> verin. Günler dikkate alınmaz; bu yüzden 31 Ocak ile 1 Şubat arasında bir ay vardır.
          </p>
        </Fn>
        <Fn name="eachDay" sig="function eachDay(start: CalendarDate, end: CalendarDate): CalendarDate[]">
          <p>
            <code>start</code>’tan <code>end</code>’e kadar, iki uç da dahil olmak üzere her tarih, sırayla. <code>end</code>, <code>start</code>’tan önceyse
            boş bir dizi, ikisi eşitse tek bir tarih döndürür. Seçilen bir aralığın saydığı günler için (bu, geceye mi güne mi göre sayıldığına bağlıdır){' '}
            <code>getIncludedDays</code>’i kullanın.
          </p>
        </Fn>
        <Fn name="eachMonth" sig="function eachMonth(start: CalendarMonth, count: number): CalendarMonth[]">
          <p>
            <code>start</code> ile başlayan <code>count</code> ardışık ay. <code>eachDay</code>’in aksine bir bitiş değil bir uzunluk alır; 0 veya daha küçük
            bir sayı boş bir dizi döndürür.
          </p>
        </Fn>
        <Fn name="clampDate" sig="function clampDate(date: CalendarDate, min?: CalendarDate | null, max?: CalendarDate | null): CalendarDate">
          <p>
            <code>date</code> ondan önceyse <code>min</code>’i, sonraysa <code>max</code>’ı, aksi halde <code>date</code>’i döndürür. Eksik veya{' '}
            <code>null</code> bir sınır yok sayılır. Önce minimum kontrol edilir; bu yüzden <code>min</code>, <code>max</code>’tan sonra olduğunda erken bir
            tarih <code>min</code>’i döndürür. Başlangıç ayını veya odaklanan günü <code>minDate</code>/<code>maxDate</code> içinde tutmak için kullanışlıdır.
          </p>
        </Fn>
        <Snippet files={arithmetic} label="Aritmetik" />
      </Section>

      <Section title="Karşılaştırma">
        <p>
          Tarihler sıfırla doldurulmuş ISO dizeleri olduğundan dize sırası kronolojik sıradır; bu fonksiyonlar yalnızca niyeti açık hale getirir ve sıralama
          karşılaştırıcısı olarak çalışır.
        </p>
        <Fn name="compareDates" sig="function compareDates(a: CalendarDate, b: CalendarDate): number">
          <p>
            <code>a</code> daha önceyse <code>-1</code>, daha sonraysa <code>1</code>, eşitse <code>0</code> döndürür. Tarihleri artan sırada sıralamak için{' '}
            <code>Array#sort</code>’a verin.
          </p>
        </Fn>
        <Fn name="isBefore" sig="const isBefore: (a: CalendarDate, b: CalendarDate) => boolean">
          <p>
            <code>a</code>, <code>b</code>’den kesin olarak önceyse <code>true</code>; aynı gün <code>false</code> verir.
          </p>
        </Fn>
        <Fn name="isAfter" sig="const isAfter: (a: CalendarDate, b: CalendarDate) => boolean">
          <p>
            <code>a</code>, <code>b</code>’den kesin olarak sonraysa <code>true</code>; aynı gün <code>false</code> verir.
          </p>
        </Fn>
        <Fn name="isSameDate" sig="const isSameDate: (a: CalendarDate | null | undefined, b: CalendarDate | null | undefined) => boolean">
          <p>
            İkisi de aynı tarihse <code>true</code>. Seçim değerlerini doğrudan verebilmeniz için <code>null</code>/<code>undefined</code> kabul eder; iki boş
            değer aynı tarih <em>sayılmaz</em> (<code>false</code>).
          </p>
        </Fn>
        <Fn name="isWithin" sig="function isWithin(date: CalendarDate, start: CalendarDate, end: CalendarDate): boolean">
          <p>
            <code>start ≤ date ≤ end</code> olduğunda <code>true</code>; iki sınır da dahildir. Sınırları yeniden sıralamaz: <code>end</code>,{' '}
            <code>start</code>’tan önceyse sonuç her zaman <code>false</code>’tur. Çıkış gününün konaklamaya dahil olmadığı bir konaklama için{' '}
            <code>addDays(end, -1)</code>’e göre test edin veya <code>getIncludedDays</code>’i kullanın.
          </p>
        </Fn>
        <Snippet files={comparing} label="Karşılaştırma" />
      </Section>

      <Section title="Parçalar ve ay sınırları">
        <Fn name="getDateParts" sig="function getDateParts(date: CalendarDate): DateParts">
          <p>
            Bir tarihi sayılara ayırır: ay 1–12 olmak üzere <code>{'{ year, month, day }'}</code>. <code>createDate</code>’in tersidir.
          </p>
        </Fn>
        <Fn name="getWeekday" sig="function getWeekday(date: CalendarDate): Weekday">
          <p>
            Haftanın günü, 0 = pazar … 6 = cumartesi; yalnızca tarihten hesaplanır (<code>Date</code> yok, saat dilimi yok). Bu, <code>firstDayOfWeek</code>{' '}
            ve hafta günü kurallarının kullandığı numaralandırmadır.
          </p>
        </Fn>
        <Fn name="getMonth" sig="function getMonth(date: CalendarDate): CalendarMonth">
          <p>
            Bir tarihin ait olduğu ay, bir <code>CalendarMonth</code> dizesi olarak (<code>"2026-11"</code>). Bir tarihi ay fonksiyonlarına vermek veya
            tarihleri aya göre gruplamak için kullanın.
          </p>
        </Fn>
        <Fn name="getMonthParts" sig="function getMonthParts(month: CalendarMonth): { year: number; month: number }">
          <p>
            Bir ayı sayılara ayırır. Tarihten ay dizesine giden <code>getMonth</code>’un aksine, bu ay dizesinden sayılara gider.
          </p>
        </Fn>
        <Fn name="firstDayOfMonth" sig="function firstDayOfMonth(month: CalendarMonth): CalendarDate">
          <p>Ayın 1’i, bir tarih olarak.</p>
        </Fn>
        <Fn name="lastDayOfMonth" sig="function lastDayOfMonth(month: CalendarMonth): CalendarDate">
          <p>
            Artık yılları hesaba katarak ayın son günü, bir tarih olarak. <code>firstDayOfMonth</code> ve <code>eachDay</code> ile birlikte bir ayın günlerini
            listeler; ör. ay bazında müsaitlik verisi oluşturmak için.
          </p>
        </Fn>
        <Fn name="daysInMonth" sig="function daysInMonth(year: number, month: number): number">
          <p>
            Düz sayılardan bir ayın uzunluğu (28–31), ay 1–12. Argümanlarını doğrulamaz; elinizde zaten bir <code>CalendarMonth</code> varsa{' '}
            <code>lastDayOfMonth</code>’u kullanın.
          </p>
        </Fn>
        <Fn name="isLeapYear" sig="function isLeapYear(year: number): boolean">
          <p>Gregoryen artık yıl kuralı: 4’e bölünebilen yıllar, ancak 400’e bölünemeyen yüzyıllar hariç (1900 artık yıl değildir, 2000 artık yıldır).</p>
        </Fn>
        <Snippet files={parts} label="Parçalar ve ay sınırları" />
      </Section>

      <Section title="Bugün ve JavaScript tarihleri">
        <p>
          Bir <code>Date</code> bir andır; hangi takvim gününe denk geldiği saat dilimine bağlıdır. Bu fonksiyonlar bu seçimi açık hale getirir.
        </p>
        <Fn name="getToday" sig="function getToday(options?: { timeZone?: string; now?: Date | number }): CalendarDate">
          <p>
            <code>now</code> anının (bir <code>Date</code> veya epoch milisaniyesi; varsayılan: şu anki zaman), <code>"Europe/Istanbul"</code> gibi bir IANA
            adı olan <code>timeZone</code>’da görülen takvim günü. Saat dilimi olmadan (ya da boş bir dizeyle) çalışılan ortamın yerel saat dilimi kullanılır;
            bu, sunucuda sunucunun saat dilimidir. İkisini birlikte vermek sonucu deterministik yapar; sunucu tarafı render ve testler için istediğiniz budur.
            Sonucu Calendar’ın <code>today</code> prop’una verin.
          </p>
          <p>
            Bilinmeyen bir saat dilimi adı, <code>Intl.DateTimeFormat</code>’ın bir <code>RangeError</code> fırlatmasına yol açar. Geçersiz bir{' '}
            <code>now</code> (ör. <code>NaN</code> veya geçersiz bir <code>Date</code>), saat dilimi verilsin ya da verilmesin{' '}
            <code>RangeError(&apos;Invalid time value&apos;)</code> fırlatır.
          </p>
        </Fn>
        <Fn name="fromJSDate" sig="function fromJSDate(date: Date, timeZone?: string): CalendarDate">
          <p>
            Var olan bir <code>Date</code>’i, <code>timeZone</code>’da denk geldiği takvim gününe çevirir (varsayılan: çalışılan ortamın yerel saat dilimi).
            Konumsal (positional) imzalı <code>getToday({'{ now: date, timeZone }'})</code>’dir ve aynı hata davranışına sahiptir. API’lerden veya başka tarih
            seçicilerden gelen zaman damgaları için kullanın; her zaman UTC gününü veren <code>toISOString()</code>’i asla dilimlemeyin.
          </p>
        </Fn>
        <Fn name="toUTCDate" sig="function toUTCDate(date: CalendarDate): Date">
          <p>
            Ters yön: o günün 00:00 UTC’sindeki bir <code>Date</code> (100’den küçük yıllar doğru ele alınır). Onu <code>timeZone: 'UTC'</code> ile
            biçimlendirin; aksi halde yerel saat dilimi önceki günü gösterebilir. Görüntüleme için{' '}
            <a href="#/api-messages">Mesajlar ve biçimlendirme</a> sayfasındaki <code>formatDate</code> bunu zaten yapar.
          </p>
        </Fn>
        <Snippet files={today} label="Bugün ve JavaScript tarihleri" />
      </Section>

      <Section title="Aralıklar ve seçim">
        <p>
          Bir <code>DateRange</code>, aralık modundaki bir Calendar’ın değeri olan <code>{'{ start: CalendarDate | null; end: CalendarDate | null }'}</code>
          ’dir. <code>end</code>’in anlamı <code>RangeSemantics</code>’e bağlıdır: <code>'exclusive'</code> aralıklar <code>[start, end)</code>,{' '}
          <code>end</code>’in çıkış günü olduğu konaklamalardır (<code>stayRules</code>); <code>'inclusive'</code> aralıklar <code>[start, end]</code> her
          günü sayar (<code>dayRangeRules</code>, varsayılan). 13 → 20 Kasım, 7 gece ya da 8 gündür.
        </p>
        <DataTable
          caption="Aralık uzunluğu yardımcıları"
          head={['Fonksiyon', 'Saydığı', '13 → 16 Kasım', 'Aynı gün', 'Tamamlanmamış aralık']}
          rows={[
            [<code key="a">countNights</code>, 'geceler, bitiş hariç', '3', '0', 'null'],
            [<code key="a">countDays</code>, 'günler, iki uç da dahil', '4', '1', 'null'],
            [<code key="a">getRangeLength</code>, 'semantiğe göre ikisinden biri', '3 veya 4', '0 veya 1', 'null'],
          ]}
        />
        <Fn name="countNights" sig="function countNights(range: DateRange): number | null">
          <p>
            Bir konaklamadaki gece sayısı, gün olarak <code>end − start</code>. Uçlardan biri eksikken <code>null</code> döndürür; böylece “henüz seçilmedi”
            durumunu 0’dan (aynı gün aralığı) ayırt edebilirsiniz. Sırayı kontrol etmez; başlangıçtan önceki bir bitiş negatif bir sayı verir.
          </p>
        </Fn>
        <Fn name="countDays" sig="function countDays(range: DateRange): number | null">
          <p>
            Dahil bitişli bir aralıktaki gün sayısı, <code>end − start + 1</code>. Uçlardan biri eksikken <code>null</code>; sıra kontrol edilmez.
          </p>
        </Fn>
        <Fn name="getRangeLength" sig="function getRangeLength(range: DateRange, semantics: RangeSemantics): number | null">
          <p>
            <code>semantics</code>’in gerektirdiği birimde uzunluk: <code>'exclusive'</code> için geceler (<code>countNights</code> ile aynı),{' '}
            <code>'inclusive'</code> için günler (<code>countDays</code> ile aynı). İki tür takvime de hizmet eden kodda kullanın.
          </p>
        </Fn>
        <Fn name="getIncludedDays" sig="function getIncludedDays(range: DateRange, semantics: RangeSemantics): CalendarDate[]">
          <p>
            Bir aralığın gerçekten kullandığı tarihler; ör. gecelik fiyatları toplamak veya müsaitliği kontrol etmek için. Hariç bitişli aralıklar bitişi (çıkış
            gününü) dışarıda bırakır; dahil bitişli aralıklar onu tutar. Hariç bitişli aynı gün aralığı (günübirlik kullanım), 0 gece sayılsa da o tek günü
            döndürür. Uçlardan biri eksikse veya bitiş başlangıçtan önceyse boş bir dizi döndürür.
          </p>
        </Fn>
        <Fn name="getSelectionPhase" sig="function getSelectionPhase(selection: Selection): SelectionPhase">
          <p>
            <code>{'{ mode, value }'}</code> verildiğinde bir seçimin hangi aşamada olduğu: <code>'empty'</code> (hiçbir şey seçilmedi),{' '}
            <code>'start-selected'</code> (başlangıcı olan, bitiş bekleyen aralık) veya <code>'complete'</code> (tek bir tarih, aralığın iki ucu ya da çoklu
            modda en az bir tarih). Salt okunur seçimler her zaman <code>'empty'</code>’dir; yalnızca bitişi olan bir aralık da <code>'empty'</code>’dir. Bir
            “Uygula” düğmesini etkinleştirmek veya bir ipucu metni seçmek için kullanışlıdır.
          </p>
        </Fn>
        <Snippet files={ranges} label="Aralıklar ve seçim" />
      </Section>
    </Page>
  );
}

const MESSAGE_KEYS = [
  { name: 'calendar', type: 'string', description: <><code>aria-label</code> prop’u verilmediğinde takvim kökünün erişilebilir adı.</> },
  { name: 'previousMonth / nextMonth', type: 'string', description: 'Gezinme düğmelerinin erişilebilir adları; özel bir gezinme slotuna da etiketleri olarak aktarılır.' },
  {
    name: 'loadNext / loadPrevious',
    type: 'string',
    description: (
      <>
        <code>loadMoreLabels</code> ayarlanmamışsa, sürekli gezinmedeki “daha fazla yükle” düğmelerinin metni.
      </>
    ),
  },
  {
    name: 'loading',
    type: 'string',
    description: 'Veri yüklenirken ekran okuyucu durum metni (günlerin kendisi bir iskelet gösterir): ilk yükleme için ve her ay için “<ay başlığı>: <loading>” olarak. Yükleme başladığında da duyurulur ve renderLoading’e aktarılır.',
  },
  { name: 'error / retry', type: 'string', description: <>Verisi yüklenemeyen bir ayın mesajı ve düğme metni (<code>renderError</code>’a da aktarılır); bir ay başarısız olduğunda <code>error</code> duyurulur.</> },
  { name: 'today', type: 'string', description: 'Ekran okuyucular için bugünün gün etiketine eklenir.' },
  { name: 'todayLabel', type: 'string', description: <><code>highlightToday</code> açıkken ve günün başka bir araç ipucu yoksa bugün üzerindeki varsayılan araç ipucu.</> },
  { name: 'readOnlyNotice', type: 'string', description: <>Salt okunur bir takvimin üstündeki açıklama. <code>''</code> onu gizler.</> },
  { name: 'selected', type: 'string', description: 'Seçili günün etiketine eklenir (tekli ve çoklu modlar).' },
  { name: 'rangeStart / rangeEnd', type: 'string', description: 'Aralığın başlangıç ve bitiş günlerinin etiketlerine eklenir.' },
  { name: 'inRange', type: 'string', description: 'Aralık uçları arasındaki günlerin etiketlerine eklenir.' },
  { name: 'unavailable', type: 'string', description: 'Sebep metni olmayan, devre dışı veya müsait olmayan bir günün etiketine eklenir.' },
  { name: 'announceStart', type: '(date: string) => string', description: 'Bir aralık başlangıcı seçildiğinde ve bitiş henüz açıkken duyurulur.' },
  { name: 'announceRange', type: '(start: string, end: string) => string', description: 'Bir aralık tamamlandığında duyurulur.' },
  { name: 'announceSingle', type: '(date: string) => string', description: 'Tek bir tarih seçildiğinde duyurulur.' },
  { name: 'announceAdded / announceRemoved', type: '(date: string, count: number) => string', description: 'Çoklu modda bir tarih eklenip çıkarıldığında duyurulur; count, seçili tarihlerin yeni sayısıdır.' },
  { name: 'announceCleared', type: 'string', description: 'Tekli veya aralık seçimi boşaldığında duyurulur.' },
  { name: 'announceRejected', type: '(date: string, reason: string) => string', description: 'Bir tıklama veya tuş basışı reddedildiğinde duyurulur; reason, biçimlendirilmiş sorun metnidir.' },
  { name: 'reasons', type: 'Record<ReasonCode, ReasonMessage>', description: 'Her sebep kodu için bir fonksiyon. Metin; devre dışı bir günün etiket eki, varsayılan araç ipucu (past, future, before-min, after-max, invalid-date, data-unknown, data-loading için değil), announceRejected içindeki sebep ve invalidSelection olaylarının mesajıdır.' },
  { name: 'dayReasons', type: 'Record<string, string>', description: <>Kurallarınızın veya adaptörlerin <code>reason</code> etiketleri için metinler (<code>booked</code>, <code>check-out-only</code>, …).</> },
];

export function MessagesReference() {
  return (
    <Page
      title="Mesajlar ve biçimlendirme"
      lead="Ay, hafta günü ve tarih adları, takvimin yerel ayarında Intl’den gelir; takvimin kendi metinleri (düğme adları, ekran okuyucu duyuruları, sebepler) ise değiştirebileceğiniz ya da kısmen geçersiz kılabileceğiniz bir mesaj paketinden gelir."
    >
      <Section title="Yerel ayara göre biçimlendirme">
        <p>
          Bunlar, Calendar’ın başlıkları, üst bilgileri ve etiketleri için kullandığı fonksiyonlardır; kendi arayüzünüz (özetler, girdiler, araç ipuçları) onunla
          uyumlu olsun diye dışa aktarılırlar. Yerel ayar herhangi bir BCP 47 etiketidir; <code>undefined</code>, biçimlendirmede çalışma ortamının varsayılanı,
          hafta ve yön tablolarında ise <code>en-US</code> anlamına gelir. Geçersiz bir yerel ayar etiketi, <code>Intl</code>’in bir <code>RangeError</code>{' '}
          fırlatmasına yol açar.
        </p>
        <Fn name="formatDate" sig="function formatDate(date: CalendarDate, locale: string | undefined, options: Intl.DateTimeFormatOptions): string">
          <p>
            Bir tarihi <code>Intl.DateTimeFormat</code> ile biçimlendirir. <code>options</code> zorunludur (yerel ayarın varsayılan sayısal biçimi için{' '}
            <code>{'{}'}</code> verin). Tarih, <code>timeZone: 'UTC'</code> zorlanarak UTC gece yarısından biçimlendirilir; böylece yerel saat dilimi onu asla
            önceki güne kaydıramaz; <code>options</code> içindeki bir <code>timeZone</code> geçersiz kılınır. Biçimlendiriciler yerel ayar ve seçeneklere göre
            önbelleğe alınır.
          </p>
        </Fn>
        <Fn
          name="formatMonth"
          sig={`function formatMonth(
  month: CalendarMonth,
  locale: string | undefined,
  options?: Intl.DateTimeFormatOptions, // default { month: 'long', year: 'numeric' }
): string`}
        >
          <p>
            Bir ayı ilk gününü biçimlendirerek biçimlendirir; böylece <code>formatDate</code>’in tarih aldığı yerde bir <code>CalendarMonth</code> alır.
            Seçenek verilmezse Calendar’ın gösterdiği ay başlığını verir (“November 2026”); Calendar’ın <code>monthTitleFormat</code> prop’u buraya başka
            seçenekler aktarır.
          </p>
        </Fn>
        <Fn
          name="getWeekdayNames"
          sig={`function getWeekdayNames(
  locale: string | undefined,
  firstDayOfWeek: Weekday,
  format?: 'narrow' | 'short' | 'long', // default 'short'
): { weekday: Weekday; short: string; long: string }[]`}
        >
          <p>
            <code>firstDayOfWeek</code>’ten başlayarak görüntüleme sırasında yedi öğe. <code>short</code>, <code>format</code>’taki addır (adına rağmen, dar
            veya uzun biçim isterseniz öyle olur); <code>long</code> her zaman tam addır ve <code>abbr</code> başlıkları ya da ekran okuyucular için uygundur.
          </p>
        </Fn>
        <Fn name="getDefaultFirstDayOfWeek" sig="function getDefaultFirstDayOfWeek(locale: string | undefined): Weekday">
          <p>
            <code>firstDayOfWeek</code> ayarlanmadığında Calendar’ın kullandığı hafta başlangıcı: US, CA, BR, JP, IL, SA gibi bölgeler için 0 (pazar); EG, AE,
            IR gibi bölgeler için 6 (cumartesi); diğerleri için 1 (pazartesi). Bölge etiketten alınır; bölgesi olmayan bir etiket bazı diller için varsayılan
            bir bölge kullanır (<code>en</code> → US, <code>ar</code> → EG, <code>he</code> → IL, <code>fa</code> → IR, <code>pt</code> → BR, …) ve{' '}
            <code>undefined</code>, <code>en-US</code> olarak ele alınır. Bunlar <code>Intl.Locale#weekInfo</code> değil yerleşik tablolardır; bu yüzden sunucu
            ve tarayıcı her zaman aynı sonucu verir.
          </p>
        </Fn>
        <Fn name="getLocaleDirection" sig="function getLocaleDirection(locale: string | undefined): 'ltr' | 'rtl'">
          <p>
            Etiketin dili sağdan sola yazılıyorsa (ar, he, fa, ur, ps, yi, dv, ckb, sd, ug) <code>'rtl'</code>, aksi halde <code>'ltr'</code>. Yalnızca dil alt
            etiketi kontrol edilir. Bu, Calendar’ın <code>direction</code> prop’u için varsayılan değerdir.
          </p>
        </Fn>
        <Snippet files={locale} label="Yerel ayara göre biçimlendirme" />
      </Section>

      <Section title="Mesaj paketleri">
        <p>
          Calendar her zaman <code>messagesEn</code> ile başlar ve <code>messages</code> prop’unu onun üzerine uygular. <code>locale</code>’i değiştirmek
          metinleri <em>değiştirmez</em>; eşleşen paketi de verin. Her paket ayrı bir export’tur; bu yüzden kullanılmayanlar tree-shaking ile atılır.
        </p>
        <DataTable
          caption="Yerleşik paketler (hepsi CalendarMessages türünde)"
          head={['Export', 'Dil', 'Kapsam']}
          rows={[
            [<code key="a">messagesEn</code>, 'İngilizce', 'Eksiksiz; varsayılan paket (Calendar, messages’ı bunun üzerine birleştirir).'],
            [<code key="a">messagesTr</code>, 'Türkçe', 'Eksiksiz; her sebep ve gün sebebi dahil.'],
            [
              <code key="a">messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr</code>,
              'Almanca, Fransızca, İspanyolca, İtalyanca, Felemenkçe, Arapça',
              <>
                Eksiksiz: tüm arayüz metinleri ve duyurular, her sebep ve her gün sebebi (<code>start-only</code>, <code>end-only</code> ve{' '}
                <code>out-of-schedule</code> dahil); gece ve gün sayıları için dilin çoğul biçimleriyle (Arapçada: bir, iki, 3–10, 11–99 ve geri kalanlar).
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="Mesajları geçersiz kılma">
        <p>
          Yalnızca değiştirmek istediğiniz anahtarları verin. Calendar’da <code>messages</code> İngilizcenin üzerine birleştirilir; İngilizce olmayan bir paketi
          geçersiz kılmak için onu <code>mergeMessages</code> ile kendiniz birleştirin. Bu örnekte bir başlangıç ve ardından sonraki günü seçin ya da dolu bir
          güne (9., 18., 27.) tıklayın.
        </p>
        <Example src="helpers/CustomMessages" title="İngilizce ve Almanca üzerine özel mesajlar" />
        <Fn name="mergeMessages" sig="function mergeMessages(base: CalendarMessages, override?: CalendarMessagesInput): CalendarMessages">
          <p>
            Yeni ve eksiksiz bir paket döndürür: <code>override</code>’ın üst düzey anahtarları <code>base</code>’inkilerin yerine geçer; <code>reasons</code> ve{' '}
            <code>dayReasons</code> ise anahtar anahtar birleştirilir, böylece tek bir sebebi geçersiz kılmak diğerlerinin hepsini korur. Geçersiz kılma
            verilmezse <code>base</code>’in kendisini döndürür. <code>undefined</code> değeriyle bulunan bir anahtar, üst düzeyde olduğu gibi{' '}
            <code>reasons</code> ve <code>dayReasons</code> içinde de listelenmemiş sayılır ve temel metni korur. Sonucu bir kez oluşturun (modül kapsamında
            veya <code>useMemo</code> ile); Calendar, <code>messages</code> nesnesinin kimliği her değiştiğinde yeniden birleştirir.
          </p>
        </Fn>
        <PropsTable
          caption="CalendarMessagesInput"
          rows={[
            { name: <>herhangi bir <code>CalendarMessages</code> anahtarı</>, type: <><code>CalendarMessages</code> içindekiyle aynı</>, description: 'İsteğe bağlıdır; temel değerin yerine geçer.' },
            { name: 'reasons', type: 'Partial<Record<ReasonCode, ReasonMessage>>', description: 'Yalnızca değiştirilecek sebep kodları.' },
            { name: 'dayReasons', type: 'Record<string, string>', description: 'Temel gün sebebi metinlerine eklenir ya da onların yerine geçer.' },
          ]}
        />
        <Snippet files={messages} label="Mesajları birleştirme ve biçimlendirme" />
      </Section>

      <Section title="CalendarMessages anahtarları">
        <p>
          Bir paketin her anahtarı ve Calendar’ın onu nerede kullandığı. Bir günün erişilebilir etiketi, biçimlendirilmiş tarihi ve ardından virgülle ayrılmış
          ilgili eklerdir; duyurulardaki tarihler takvimin yerel ayarında “13 November 2026” biçiminde biçimlendirilir.
        </p>
        <PropsTable caption="CalendarMessages" rows={MESSAGE_KEYS} />
      </Section>

      <Section title="Sebep mesajları">
        <p>
          Bir gün devre dışı olduğunda veya bir seçim reddedildiğinde motor; bir sebep <code>code</code>’u, isteğe bağlı <code>params</code>, günün{' '}
          <code>dayReason</code> etiketi ve isteğe bağlı hazır bir <code>message</code> içeren bir <code>ValidationIssue</code> üretir. Calendar bunu{' '}
          <code>formatIssue</code> ile metne çevirir. Bir sebep mesajının kullanabileceği parametreler:
        </p>
        <DataTable
          caption="Sebep parametreleri"
          head={['Kod', 'params']}
          rows={[
            [<code key="a">before-min / after-max</code>, <code key="b">{'{ min } / { max }'}</code>],
            [<code key="a">past / future</code>, <code key="b">{'{ today }'}</code>],
            [<code key="a">min-length / max-length / fixed-length</code>, <code key="b">{"{ min | max | length, unit: 'nights' | 'days', actual? }"}</code>],
            [<code key="a">end-before-start</code>, <code key="b">{'{ start }'}</code>],
            [<code key="a">max-selections</code>, <code key="b">{'{ max, actual }'}</code>],
            [<code key="a">invalid-date</code>, <code key="b">{"{ value, field?: 'start' | 'end' }"}</code>],
          ]}
        />
        <Fn name="ReasonMessage" sig="type ReasonMessage = (params: IssueParams, f: MessageFormatHelpers) => string">
          <p>
            Her <code>reasons</code> öğesinin türü. <code>params</code>, sorunun parametreleridir (hiç yoksa boş bir nesne); parametrelerdeki tarihler{' '}
            <code>YYYY-MM-DD</code> dizeleridir, bu yüzden onları <code>f.date</code> ile biçimlendirin.
          </p>
        </Fn>
        <Fn name="MessageFormatHelpers" sig={'interface MessageFormatHelpers {\n  locale: string;\n  date: (value: unknown) => string;\n}'}>
          <p>
            Sebep mesajlarına aktarılır. Calendar’da <code>locale</code> takvimin yerel ayarıdır; <code>date</code> ise geçerli bir tarih dizesini o yerel ayarda
            gün, uzun ay adı ve yıl olarak biçimlendirir; diğer her değer dize olarak döndürülür (<code>null</code>/<code>undefined</code> için{' '}
            <code>''</code>).
          </p>
        </Fn>
        <Fn
          name="formatIssue"
          sig="function formatIssue(issue: ValidationIssue, messages: CalendarMessages, helpers: MessageFormatHelpers): string"
        >
          <p>Bir sorunun metnini döndürür; şu sırayla bakar:</p>
          <ol>
            <li>
              ayarlanmışsa <code>issue.message</code> (<code>DayAvailability.message</code>’dan veya kendi <code>validateSelection</code>’ınızdan);
            </li>
            <li>
              yalnızca <code>closed</code>, <code>start-not-allowed</code> ve <code>end-not-allowed</code> için: o metin varsa{' '}
              <code>messages.dayReasons[issue.dayReason]</code>;
            </li>
            <li>
              <code>messages.reasons[issue.code]</code>, ya da kod için bir fonksiyon yoksa <code>messages.reasons.custom</code>.
            </li>
          </ol>
          <p>
            Buna yalnızca Calendar dışında ihtiyaç duyarsınız; örneğin <code>onValidationChange</code>’in sorununu kendi arayüzünüzde göstermek için. Bu durumda
            yardımcıları kendiniz sağlarsınız (yukarıdaki kod parçasına bakın). Calendar içinde aynı metin zaten <code>DayState.reasonText</code>’te ve{' '}
            <code>invalidSelection</code> olaylarının <code>message</code> alanında bulunur.
          </p>
        </Fn>
      </Section>
    </Page>
  );
}
