import type { ReactNode } from 'react';
import more from '../../../snippets/props/more.tr.tsx?code';
import overview from '../../../snippets/props/overview.tr.tsx?code';
import { Snippet } from '../../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../../ui';

const c = (s: string) => <code>{s}</code>;
const to = (slug: string, text: ReactNode) => <a href={`#/${slug}`}>{text}</a>;
const ev = (name: string, type: string, what: ReactNode) => ({
  name,
  type,
  description: (
    <>
      {what} Ayrıntılar: {to('api-events', 'Callback’ler ve olaylar')}.
    </>
  ),
});

export function PropsReference() {
  return (
    <Page
      title="Calendar prop’ları"
      lead={
        <>
          <code>{'<Calendar>'}</code>’ın tüm prop’ları, konuya göre gruplanmış. Yalnızca <code>mode</code> zorunludur. Kontrollü prop’lar kontrolsüz
          karşılıklarının yanında listelenir; her satır, prop’u canlı örnekte kullanan sayfaya bağlantı verir.
        </>
      }
    >
      <Section title="Sık kullanılan prop’lar">
        <p>
          Tipik bir rezervasyon takvimi: kurallı ve sınırlı kontrollü bir aralık, kapsayıcıya uyum sağlayan iki ay, gün başına veri, bir yerel ayar ve
          takvimin dışındaki kontroller için bir <code>ref</code>.
        </p>
        <Snippet files={overview} label="Sık kullanılan prop’lar" />
        <p>Diğer örneklerin kullanmadığı biçimlendirme, yerleşim ve kimlik prop’ları ile kalan controller metotları:</p>
        <Snippet files={more} label="Biçimlendirme, yerleşim ve kimlik" />
        <Note>
          <strong>Kontrollü veya kontrolsüz.</strong> Üç durum parçası çift olarak gelir: <code>value</code> / <code>defaultValue</code>,{' '}
          <code>activeEndpoint</code> / <code>defaultActiveEndpoint</code> ve <code>visibleMonth</code> / <code>defaultVisibleMonth</code>. Kontrollü
          prop’u (<code>undefined</code> dışında herhangi bir değer) vermek sahipliği size geçirir: takvim istekleri callback’i üzerinden bildirir ve sizin
          geri verdiğiniz değeri gösterir. <code>default…</code> prop’u mount sırasında bir kez okunur; sonraki değişiklikleri yok sayılır. Kontrollü bir
          prop’u değiştirmek hiçbir zaman ilgili callback’i çağırmaz.
        </Note>
      </Section>

      <Section title="Seçim">
        <p>
          <code>CalendarProps</code>, <code>mode</code> üzerinden bir birleşim (union) tipidir: <code>value</code>, <code>defaultValue</code> ve{' '}
          <code>onChange</code>’in tipi ona göre belirlenir; <code>activeEndpoint</code> yalnızca aralıklarda vardır. Bkz.{' '}
          {to('selection-modes', 'Seçim modları')} ve {to('core-concepts', 'Temel kavramlar')}.
        </p>
        <PropsTable
          caption="Seçim prop’ları"
          rows={[
            {
              name: 'mode',
              type: "'single' | 'range' | 'multiple' | 'readonly'",
              required: true,
              description: (
                <>
                  Bir tıklamanın ne yaptığı: tek bir tarih seçmek, bir başlangıç ve bitiş seçmek, bir kümedeki tarihleri açıp kapatmak ya da hiçbir şey
                  ({c('readonly')} müsaitliği “Yalnızca görüntüleme” notuyla gösterir, değer prop’u yoktur ve controller’ın {c('select()')} metodu geçersiz
                  döner). Kontrolsüz bir takvimde çalışma anında değiştirilirse, {c('onChange')} çağrılmadan yeni modun boş değeriyle başlanır.{' '}
                  {to('selection-modes', 'Seçim modları')}.
                </>
              ),
            },
            {
              name: 'value',
              type: 'single: CalendarDate | null · range: DateRange · multiple: readonly CalendarDate[]',
              description: (
                <>
                  <strong>Kontrollü</strong> seçim (çifti: {c('defaultValue')}). {c('undefined')} dışındaki her değer takvimi kontrollü yapar; bu nedenle{' '}
                  {c('null')} veya {c("{ start: null, end: null }")} kontrollü boş bir seçimdir. {c('onChange')}’in verdiğini saklayın, aksi hâlde
                  tıklamaların görünür bir etkisi olmaz. {c('visibleMonth')}/{c('defaultVisibleMonth')} yoksa başlangıç ayı seçimin ayıdır (tek tarih,
                  aralık başlangıcı veya çoklu seçimdeki en erken tarih). {to('core-concepts', 'Temel kavramlar → Kontrollü')}.
                </>
              ),
            },
            {
              name: 'defaultValue',
              type: <><code>value</code> ile aynı</>,
              description: (
                <>
                  <strong>Kontrolsüz</strong> başlangıç seçimi (çifti: {c('value')}); mount sırasında bir kez okunur, sonraki değişiklikler yok sayılır.{' '}
                  {c('ref.reset()')} bu değere geri döner. {c('value')} verildiğinde yok sayılır. {to('core-concepts', 'Temel kavramlar → Kontrolsüz')}.
                </>
              ),
            },
            {
              name: 'onChange',
              type: '(value, e: ChangeEvent) => void',
              description: (
                <>
                  Değeri değiştiren her kabul edilmiş kullanıcı veya controller eyleminden sonra yeni değerle çağrılır (aralık modunda ilk tıklamada{' '}
                  {c('{ start, end: null }')} ile, sonra iki uçla). Prop değişikliklerinde, reddedilen tıklamalarda veya değer aynı kaldığında hiç
                  çağrılmaz (seçili tarihi yeniden seçmek, mevcut değerle {c('select()')}/{c('reset()')}, boş seçimde {c('clear()')}). {c('e')} içinde{' '}
                  {c('reason')}, {c('source')}, {c('phase')} ve {c('validation')} bulunur. {to('api-events', 'onChange')}.
                </>
              ),
            },
            {
              name: 'activeEndpoint',
              type: "'start' | 'end'",
              description: (
                <>
                  Yalnızca aralık. Sonraki tıklamanın belirleyeceği <strong>kontrollü</strong> uç (çifti: {c('defaultActiveEndpoint')});{' '}
                  {c('onActiveEndpointChange')} ile birlikte kullanın. Tek bir aralığı düzenleyen takvimler arasında {c('value')} ile birlikte paylaşın; böylece
                  birinde seçilen başlangıçtan sonra diğeri bitişi bekler. Verilmezse değerden türetilir (yalnızca başlangıç seçiliyken {c('end')}).{' '}
                  {to('synced', 'Senkron takvimler')}, {to('recipe-three-calendars', 'Üç senkron takvim')}.
                </>
              ),
            },
            {
              name: 'defaultActiveEndpoint',
              type: "'start' | 'end'",
              default: <>değerden türetilir</>,
              description: (
                <>
                  Yalnızca aralık. <strong>Kontrolsüz</strong> başlangıç ucu; örneğin önceden doldurulmuş bir aralıkta kullanıcının yalnızca bitişi
                  değiştirebilmesi için {c("'end'")}. Seçim hâlâ başlangıçtaki seçimken geçerlidir; bir değişiklikten sonra uç seçimi izler.{' '}
                  {c('activeEndpoint')} verildiğinde yok sayılır. {to('selection-modes', 'Seçim modları → Başlangıç değerleri')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Kurallar ve zaman">
        <p>
          Tüm sınırlar tek bir kural kümesinde birleşir: <code>rules</code> prop’u (tek bir küme veya dizi), kısayol prop’ları <code>minDate</code>,{' '}
          <code>maxDate</code>, <code>disablePast</code>, <code>disableFuture</code> ve <code>getDataStatus</code> ile <code>combineRules</code>{' '}
          üzerinden birleştirilir; böylece her zaman daha katı olan değer kazanır (en geç <code>minDate</code>, en erken <code>maxDate</code>, herhangi
          birindeki <code>disablePast</code>). Bkz. {to('api-rules', 'Kurallar ve adaptörler')}.
        </p>
        <PropsTable
          caption="Kural ve zaman prop’ları"
          rows={[
            {
              name: 'rules',
              type: 'SelectionRules<TContext> | readonly (SelectionRules<TContext> | null | undefined | false)[]',
              description: (
                <>
                  Sınırlar, uzunluklar, hafta günleri, gün başına müsaitlik ve özel doğrulama. Bir dizide her küme geçmelidir ve falsy öğeler atlanır;
                  böylece {c('[stayRules(…), closed && closedDates(closed)]')} çalışır. Nesneyi sabit tutun (modül kapsamı veya {c('useMemo')}): yeni bir
                  kimlik kuralları yeniden birleştirir ve yeniden doğrular. {to('length-rules', 'Uzunluk kuralları')},{' '}
                  {to('day-rules', 'Başlangıç/bitiş günleri')}, {to('api-rules', 'Kurallar ve adaptörler')}.
                </>
              ),
            },
            {
              name: 'minDate / maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Seçilebilir ilk/son gün (dahil); {c('null')} sınır yok demektir. {c('disablePast')}’ın aksine gezinmeyi de sınırlar: oklar, klavye,{' '}
                  {c('goToMonth()')} ve daha fazla ay yükleme bu ayların ötesine geçmez (istekler sınıra çekilir). {c('rules')} içindeki{' '}
                  {c('minDate')}/{c('maxDate')} ile birleştirilir; daha dar aralık kazanır. {to('date-limits', 'Tarih sınırları')}.
                </>
              ),
            },
            {
              name: 'disablePast / disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bugünden önceki / sonraki günler seçilemez (sebep {c('past')} / {c('future')}, araç ipucu yok). Yalnızca günleri devre dışı bırakır:
                  kullanıcı yine de o aylara gezinebilir. {c('today')}/{c('timeZone')}’a bağlıdır. {to('date-limits', 'Tarih sınırları')}.
                </>
              ),
            },
            {
              name: 'ruleContext',
              type: 'TContext',
              description: (
                <>
                  Kural callback’lerinizin ihtiyaç duyduğu her türlü uygulama verisi (seçilen saatler, kişi sayısı); onlara {c('ctx.context')} olarak
                  iletilir. Yeni bir değer seçimi ve her günü yeniden doğrular, bu yüzden nesneleri memoize edin.{' '}
                  {to('recipe-home-rental', 'Ev kiralama tarifi')}.
                </>
              ),
            },
            {
              name: 'relaxSchedule',
              type: 'boolean | RelaxScheduleOptions',
              default: 'false',
              description: (
                <>
                  “Özel tarihler” anahtarı: takvim (schedule) kurallarını yok sayar — {c('startWeekdays')}/{c('endWeekdays')}/{c('availableWeekdays')},{' '}
                  {c('schedule: true')} olarak işaretlenmiş müsaitlik ({c('weekdays')}) ve {c('minLength')}/{c('maxLength')}/{c('fixedLength')}{' '}
                  ({c('length')}) — gerçek müsaitlik, sınırlar, geçmiş/gelecek, veri durumu ve doğrulayıcılar ise geçerli kalır. {c('true')} veya{' '}
                  {c('{}')} iki grubu da gevşetir; {c('{ weekdays: false }')} yalnızca uzunlukları gevşetir.{' '}
                  {to('recipe-boat-rental', 'Tekne kiralama tarifi')}, {to('api-rules', 'relaxRules')}.
                </>
              ),
            },
            {
              name: 'today',
              type: 'CalendarDate',
              default: <>istemcide hesaplanır</>,
              description: (
                <>
                  {c('disablePast')}/{c('disableFuture')}, bugün işareti, {c('day.past')}/{c('day.future')} ve varsayılan ay için “bugün”ü sabitler. SSR
                  ve testler için verin: verilmezse sunucu bugünü bilemez ve {c('value')} veya {c('defaultVisibleMonth')} bir ay belirtmedikçe, istemcinin
                  tamamladığı bir yükleme yer tutucusu render eder. Verildiğinde {c('timeZone')} yok sayılır ve bugün hiç yenilenmez.{' '}
                  {to('react-nextjs', 'React ve Next.js')}.
                </>
              ),
            },
            {
              name: 'timeZone',
              type: 'string (IANA)',
              default: <>tarayıcının saat dilimi</>,
              description: (
                <>
                  {c('today')} verilmediğinde bugünü hesaplamak için kullanılan saat dilimi; örneğin bir mekânın yerel tarihi için{' '}
                  {c("'Europe/Istanbul'")}. Hesaplanan bugün gece yarısından sonra (en az saatte bir kontrol edilir) ve sekme yeniden görünür olduğunda
                  yenilenir. {to('date-limits', 'Tarih sınırları → Bugün')}.
                </>
              ),
            },
            {
              name: 'highlightToday',
              type: 'boolean',
              default: 'true',
              description: (
                <>
                  İnce bugün halkasını ve varsayılan “Bugün” araç ipucunu çizer. {c('false')} ikisini de gizler; {c('day.today')}, {c('data-today')} ve
                  günün erişilebilir etiketindeki “bugün” sözcüğü kalır. {to('date-limits', 'Tarih sınırları → Bugün')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Veri ve yükleme">
        <p>
          Takvim hiçbir zaman veri çekmez. Render ettiği aylar için veriyi siz yüklersiniz (<code>onRenderedMonthsChange</code>’ten başlayın) ve bu
          prop’larla tanımlarsınız. Bkz. {to('loading', 'Yükleme ve hatalar')} ve {to('day-content', 'Gün içeriği')}.
        </p>
        <PropsTable
          caption="Veri prop’ları"
          rows={[
            {
              name: 'getDayData',
              type: '(date: CalendarDate) => TDayData | undefined',
              description: (
                <>
                  Seçilebilirlikten ayrı, gün başına görüntüleme verisi (fiyatlar, rozetler). {c('DefaultDayData')} biçimi ({c('label')}, {c('badge')},{' '}
                  {c('icon')}, {c('markers')}, {c('description')}) varsayılan gün içeriği tarafından çizilir; başka her biçim render prop’larınıza{' '}
                  {c('data')} olarak ulaşır. Her render’da render edilen her gün için çağrılır: hafif tutun ve değişmeyen günler için aynı nesneyi
                  döndürün ki yeniden render edilmesinler. {to('day-content', 'Gün içeriği')}.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: '(month: CalendarMonth) => DataStatus',
              default: <>her ay <code>'loaded'</code></>,
              description: (
                <>
                  Her ayın verisinin durumu. {c("'loading'")} ve {c("'unknown'")} aylar araç ipucu olmadan gün iskeletleri çizer; {c("'error'")} aylar
                  hata arayüzünü gösterir. Kuralları da besler: {c("'loaded'")} olmayan bir ayın günleri, kurallar {c("unknownDataPolicy: 'allow'")}{' '}
                  ayarlamadıkça seçilemez (sebepler {c('data-loading')}, {c('data-unknown')}, {c('data-error')}). {c('rules')} içindeki bir{' '}
                  {c('getDataStatus')} ile birleştirilir (daha kötü durum kazanır). {to('loading', 'Yükleme ve hatalar')}.
                </>
              ),
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Takvim genelinde bir bayrak. Takvim bu bayrak olmadan hiç render edilmemişse <em>ilk yükleme</em>dir: her gün bir iskelettir, seçim tüm
                  veri yükleniyormuş gibi doğrulanır ve {c("renderLoading({ scope: 'initial' })")} kullanılır. Daha sonra yeniden açılırsa bir{' '}
                  <em>arka plan yenilemesi</em>dir: günler, seçim ve odak kalır; yalnızca {c('aria-busy')} ve {c('LoadingSnapshot.refreshing')} değişir.
                  Ay bazında yükleme {c('getDataStatus')}’a aittir. {to('loading', 'Yükleme ve hatalar → İlk yükleme')}.
                </>
              ),
            },
            {
              name: 'onRetry',
              type: '(months: readonly CalendarMonth[]) => void',
              description: (
                <>
                  Varsayılan hata arayüzünün Yeniden dene düğmesi ve {c('renderError')} içindeki {c('retry()')} tarafından {c('[month]')} ile çağrılır.
                  Varsayılan Yeniden dene düğmesi yalnızca bu prop verildiğinde gösterilir. {to('loading', 'Yükleme ve hatalar')}.
                </>
              ),
            },
            {
              name: 'modifiers',
              type: 'Record<string, (day: DayState) => boolean>',
              description: (
                <>
                  Stil için kendi gün bayraklarınız: her fonksiyon render edilen her gün için çalışır; {c('true')} döndüren adlar {c('day.modifiers')}{' '}
                  içine ve gün hücresiyle düğmesine {c('data-mod-<name>')} olarak eklenir. Seçimi etkilemezler (bunun için {c('rules')} kullanın). Küçük
                  harfli, tireli adlar kullanın: HTML öznitelik adlarını küçük harfe çevirir.{' '}
                  {to('styling', 'Stil → Durum öznitelikleri ve modifier’lar')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Yerleşim">
        <p>
          Yerleşim pencereyi değil, takvimin kendi kapsayıcısının genişliğini (ResizeObserver) izler. Bir ay en az{' '}
          <code>7 × minDaySize.width + 16</code> px gerektirir; istenen aylar yan yana sığmadığında ne olacağına <code>overflow</code> karar verir ve{' '}
          <code>onLayoutChange</code> bunu bildirir. Bkz. {to('orientation', 'Yön ve ay sayısı')} ve {to('responsive', 'Duyarlı yerleşim')}.
        </p>
        <PropsTable
          caption="Yerleşim prop’ları"
          rows={[
            {
              name: 'orientation',
              type: "'horizontal' | 'vertical'",
              default: "'horizontal'",
              description: (
                <>
                  Aylar yan yana veya tek sütunda alt alta; cihazdan bağımsızdır. Dikey yerleşimler {c('overflow')} kullanmaz (tek sütun her zaman sığar,
                  tek bir ay bile sığmıyorsa kaydırılır). Çoğunlukla {c('navigation="continuous"')} ve {c('maxBlockSize')} ile birlikte kullanılır.{' '}
                  {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'numberOfMonths',
              type: 'number',
              default: '1',
              description: (
                <>
                  Penceredeki (sayfalı) veya başlangıçta render edilen (sürekli) ay sayısı. Hiçbir zaman sessizce değişmez: yalnızca{' '}
                  {c("overflow='reduce-months'")} daha az ay gösterir. Ondalıklar aşağı yuvarlanır; 1’den küçük veya sonlu olmayan değerlerde 1’e dönülür.
                  Aynı zamanda {c('monthsPerLoad')}’un varsayılanıdır. {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'monthPosition',
              type: 'number',
              default: '1',
              description: (
                <>
                  Referans ayın ({c('visibleMonth')}, seçimin ayı veya bugünün ayı) penceredeki 1’den başlayan konumu: üç ayla {c('3')}, ondan önceki iki
                  ayı gösterir. 1…etkin ay sayısı aralığına çekilir; {c('minDate')}/{c('maxDate')} yakınında ulaşılamayan ayları göstermek yerine pencere
                  kayar. {to('month-position', 'Referans ayın konumu')}.
                </>
              ),
            },
            {
              name: 'overflow',
              type: "'wrap' | 'scroll' | 'reduce-months'",
              default: "'wrap'",
              description: (
                <>
                  Yalnızca yatay, aylar sığmadığında: {c('wrap')} onları yeni satırlara geçirir, {c('scroll')} tek satırı korur ve içeride yatay kaydırma
                  çubuğu gösterir, {c('reduce-months')} daha az ay gösterir (sayfalama yine {c('stepMonths')} kadar ilerler). Tek bir ay bile sığmıyorsa
                  her strateji iç kaydırmaya döner. {to('responsive', 'Duyarlı yerleşim')}.
                </>
              ),
            },
            {
              name: 'minDaySize',
              type: 'number | { width: number; height: number }',
              default: '40',
              description: (
                <>
                  Etkileşimli bir günün px cinsinden en küçük boyutu (sayı iki kenarı da belirler). Kaç ayın sığacağına genişlik karar verir; günler
                  kapsayıcıyla birlikte bunun ötesine büyür. Dokunma hedefleri için artırın; {c('unstyled')} kullanırken özel CSS’inizi bununla tutarlı
                  tutun. {to('day-size', 'Gün boyutu ve iç kaydırma')}.
                </>
              ),
            },
            {
              name: 'maxDaySize',
              type: 'number',
              default: '56',
              description: (
                <>
                  Gün hücresi yüksekliğinin px cinsinden üst sınırı (hiçbir zaman {c('minDaySize')} yüksekliğinin altında değil); böylece geniş
                  kapsayıcılar uzun ızgaralar üretmez. {c('--cal-day-max')}’ı ayarlar. Canlı örneği yok; bkz.{' '}
                  {to('day-size', 'Gün boyutu ve iç kaydırma')}.
                </>
              ),
            },
            {
              name: 'monthGap',
              type: 'number',
              default: '32',
              description: (
                <>
                  Aylar arasındaki px cinsinden boşluk. Sığma hesabının parçasıdır; daha büyük bir boşluk ayların daha erken alt satıra geçmesine veya
                  azalmasına yol açar. {c('--cal-month-gap')}’i ayarlar; CSS’te değil burada değiştirin. {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'fixedWeeks',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Her zaman 6 hafta satırı render eder; böylece yükseklik 4, 5 ve 6 haftalık aylar arasında değişmez (açılır pencerelerde ve yan yana
                  aylarda kullanışlıdır). {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'maxBlockSize',
              type: 'number | string',
              description: (
                <>
                  Aylar alanının en büyük yüksekliği (px sayısı veya herhangi bir CSS uzunluğu, örneğin {c("'60vh'")}). Bunun üstünde aylar takvimin
                  içinde kayar, header ve footer görünür kalır; sürekli modda otomatik yükleme ve görünen ay takibi de bu iç kaydırma alanını izler.{' '}
                  {to('day-size', 'Gün boyutu ve iç kaydırma')}, {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'resizeThreshold',
              type: 'number',
              default: '0',
              description: (
                <>
                  {c('onResize')}’ın yeniden çağrılması için son bildirilen boyuttan bu yana gereken en küçük px değişimi (genişlik veya yükseklik).
                  Yalnızca bildirimleri seyreltir; yerleşim yine her değişikliğe uyum sağlar. {to('api-events', 'onResize')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Gezinme">
        <p>
          <strong>Referans ay</strong> pencerenin çapasıdır: <code>visibleMonth</code>, yoksa <code>defaultVisibleMonth</code>, yoksa seçimin ayı, yoksa
          bugünün ayı. Kullanıcının pencereler arasında sayfa mı çevireceğine yoksa büyüyen bir listeyi mi kaydıracağına <code>navigation</code> karar
          verir. Bkz. {to('load-more', 'Kademeli ay yükleme')} ve {to('go-to-month', 'Programla gezinme')}.
        </p>
        <PropsTable
          caption="Gezinme prop’ları"
          rows={[
            {
              name: 'visibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              description: (
                <>
                  <strong>Kontrollü</strong> referans ay (çifti: {c('defaultVisibleMonth')}); {c('onVisibleMonthChange')} ile birlikte kullanın. Bu
                  durumda oklar, klavyeyle sayfalama, {c('ref.next()')} ve {c('goToMonth()')} yalnızca bir ay ister; ilerlemek için onu saklayın. Ayı
                  URL’de tutmak veya takvimleri senkronlamak için kullanın. Ayrıştırılamayan bir değer yok sayılır. Sürekli modda bir prop değişikliği{' '}
                  {c('goToMonth()')} gibi çalışır: render edilmiş bir aya kaydırır (liste korunur) veya render edilmemiş bir ayın çevresinde listeyi
                  yeniden kurar; yumuşak kaydırma, odak hareketi veya {c('visibleMonthChange')} olmadan. Onu {c('onVisibleMonthsChange')}’ten değil,{' '}
                  {c('onVisibleMonthChange')}’ten besleyin. {to('api-events', 'onVisibleMonthChange (canlı örnek)')}.
                </>
              ),
            },
            {
              name: 'defaultVisibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              default: <>seçimin ayı, yoksa bugünün ayı</>,
              description: (
                <>
                  <strong>Kontrolsüz</strong> başlangıç referans ayı; mount sırasında bir kez okunur. Ayrıca sunucu HTML’ini {c('today')} olmadan da
                  eksiksiz yapar. {c('visibleMonth')} verildiğinde yok sayılır. {to('core-concepts', 'Temel kavramlar → Başlangıç ayı')},{' '}
                  {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'navigation',
              type: "'paged' | 'continuous'",
              default: "'paged'",
              description: (
                <>
                  {c('paged')}: önceki/sonraki oklarıyla {c('numberOfMonths')} aylık bir pencere. {c('continuous')}: daha fazla ay yüklendikçe büyüyen
                  bir liste (ok yok; {c('renderNavigation')} ve {c('stepMonths')} uygulanmaz); dikey ve mobil yerleşimlere uygundur.{' '}
                  {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'stepMonths',
              type: 'number',
              default: '1',
              description: (
                <>
                  Sayfalı: okların, {c('renderNavigation')}’ın {c('previous()')}/{c('next()')} fonksiyonlarının ve {c('ref.previous()')}/
                  {c('ref.next()')}’in ilerlettiği ay sayısı; bütün sayfa çevirmek için {c('numberOfMonths')} değerini verin. PageUp/PageDown her zaman bir
                  ay ilerler. Geçersiz değerlerde 1’e dönülür. {to('orientation', 'Yön ve ay sayısı → Birden çok ay')}.
                </>
              ),
            },
            {
              name: 'loadMore',
              type: "'button' | 'auto' | 'manual'",
              default: "'button'",
              description: (
                <>
                  Yalnızca sürekli: ayların nasıl ekleneceği. {c('button')} “Daha fazla tarih göster” düğmeleri gösterir; {c('auto')} listenin sonu
                  görüntü alanına (veya {c('maxBlockSize')} alanına) 200 px yaklaştığında yükler; {c('manual')} hiçbir kontrol render etmez, örneğin{' '}
                  {c('renderFooter')} içinden {c("ref.loadMore('next')")}’i siz çağırırsınız. {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'loadDirections',
              type: "'next' | 'previous' | 'both'",
              default: "'next'",
              description: (
                <>
                  Yalnızca sürekli: listenin hangi uçlarının yerleşik arayüzü alacağı (daha fazla ay yükleme düğmeleri veya {c('renderLoadMore')}{' '}
                  kontrolleri ve {c("loadMore='auto'")} gözcüleri). Yükleme {c('minDate')}/{c('maxDate')} aylarında durur. Controller bu prop’la sınırlı
                  değildir: {c('ref.loadMore(direction)')} her iki yönde ay ekler (yalnızca sürekli modda, yine sınırlarda durarak).{' '}
                  {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'monthsPerLoad',
              type: 'number',
              default: 'numberOfMonths',
              description: (
                <>
                  Yalnızca sürekli: her yüklemede eklenen ay sayısı (min/max’ta kırpılır). Klavye odağı listenin ötesine en fazla bu kadar ay geçerse
                  liste de genişler. Geçersiz değerlerde varsayılana dönülür. {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'maxRenderedMonths',
              type: 'number',
              default: '24',
              description: (
                <>
                  Yalnızca sürekli: DOM sınırı. Bu sayı aşılınca her yüklemede listenin karşı ucundan aylar çıkarılır (klavye odağını tutan ay asla);
                  hiçbir zaman {c('numberOfMonths')}’un altına inmez. Yavaş cihazlardaki uzun listeler için düşürün. Canlı örneği yok; bkz.{' '}
                  {to('load-more', 'Kademeli ay yükleme')}.
                </>
              ),
            },
            {
              name: 'loadMoreLabels',
              type: 'Partial<Record<LoadDirection, ReactNode>>',
              default: 'messages.loadNext / loadPrevious',
              description: (
                <>
                  Yön başına varsayılan daha fazla ay yükleme düğmelerinin içeriği; düğme, davranışı ve erişilebilirliği aynı kalır. Ayrıca{' '}
                  {c('renderLoadMore')}’a {c('label')} olarak iletilir. {to('load-more', 'Kademeli ay yükleme → loadMoreLabels')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Yerelleştirme">
        <p>
          <code>locale</code> yalnızca tarihleri biçimlendirir. Takvimin kendi metinleri (düğme etiketleri, sebepler, duyurular, “Bugün”){' '}
          <code>messages</code>’tan gelir ve her yerel ayar için varsayılanı İngilizcedir: <code>messagesTr</code> gibi bir paketi{' '}
          <code>locale=&quot;tr-TR&quot;</code> ile birlikte verin. Bkz. {to('i18n', 'Yerel ayarlar, hafta başı ve RTL')} ve{' '}
          {to('api-messages', 'Mesajlar ve biçimlendirme')}.
        </p>
        <PropsTable
          caption="Yerelleştirme prop’ları"
          rows={[
            {
              name: 'locale',
              type: 'string (BCP 47)',
              default: "'en-US'",
              description: (
                <>
                  Ay başlıkları, hafta günü adları, rakamlar, gün etiketleri ve mesajlardaki tarihler için Intl yerel ayarı; ayrıca {c('direction')} ve{' '}
                  {c('firstDayOfWeek')} varsayılanlarının kaynağı. Varsayılanı sabittir, böylece sunucu ve tarayıcı aynı çıktıyı render eder. Takvimin
                  metinlerini <strong>çevirmez</strong> (bkz. {c('messages')}). {to('i18n', 'Yerel ayarlar, hafta başı ve RTL')}.
                </>
              ),
            },
            {
              name: 'messages',
              type: 'CalendarMessagesInput',
              default: 'messagesEn',
              description: (
                <>
                  İngilizcenin üzerine birleştirilen kısmi geçersiz kılmalar: hazır bir paket ({c('messagesTr')}, {c('messagesDe')}, …) veya tek tek
                  anahtarlar verin; iç içe {c('reasons')} ve {c('dayReasons')} anahtar anahtar birleştirilir, böylece kendi{' '}
                  {c('DayAvailability.reason')} etiketleriniz için metin ekleyebilirsiniz. Memoize edin. {to('api-messages', 'Mesajlar ve biçimlendirme')}.
                </>
              ),
            },
            {
              name: 'direction',
              type: "'ltr' | 'rtl'",
              default: <>yerel ayardan</>,
              description: (
                <>
                  Yerleşim yönü (kökte {c('dir')}); Arapça, İbranice, Farsça, Urduca ve diğer sağdan sola diller için varsayılan {c('rtl')}’dir. Ay sırası
                  kronolojik kalır; yatay ok tuşları görsel yönü izler. {to('i18n', 'Yerel ayarlar → Arapça (RTL)')}.
                </>
              ),
            },
            {
              name: 'firstDayOfWeek',
              type: 'Weekday (0–6, 0 = Sunday)',
              default: <>yerel ayarın bölgesinden</>,
              description: (
                <>
                  Her haftanın ilk sütunu; örneğin {c('en-US')}’de pazartesi başlangıcı için {c('1')}. Varsayılan, statik bir bölge tablosundan gelir
                  (ABD için pazar, bazı bölgeler için cumartesi, diğerlerinde pazartesi). {to('i18n', 'Yerel ayarlar → Hafta başlangıcı')}.
                </>
              ),
            },
            {
              name: 'weekdayFormat',
              type: "'narrow' | 'short' | 'long'",
              default: "'short'",
              description: (
                <>
                  Görünen hafta günü başlıklarının Intl genişliği ({c('M')}, {c('Mon')}, {c('Monday')}); tam ad erişilebilir etiket olarak kalır.{' '}
                  {c('formatWeekday')} tarafından yok sayılır. {to('i18n', 'Yerel ayarlar → Hafta başlangıcı')}.
                </>
              ),
            },
            {
              name: 'monthTitleFormat',
              type: 'Intl.DateTimeFormatOptions',
              default: "{ month: 'long', year: 'numeric' }",
              description: (
                <>
                  Ay başlıkları için Intl seçenekleri, örneğin {c("{ month: 'short', year: '2-digit' }")}. {c('formatMonthTitle')} verildiğinde yok
                  sayılır. Canlı örneği yok; bkz. {to('api-messages', 'Mesajlar ve biçimlendirme → Yerel ayara göre biçimlendirme')}.
                </>
              ),
            },
            {
              name: 'formatMonthTitle',
              type: '(month: CalendarMonth, locale: string) => string',
              description: (
                <>
                  Ay başlığı metnini kendiniz döndürürsünüz (ayrıca {c('renderMonthHeader')}’a {c('title')} olarak iletilir ve ızgaranın etiketi olarak
                  kullanılır). İşaretleme (markup) için {c('renderMonthHeader')} kullanın. Canlı örneği yok; bkz.{' '}
                  {to('api-messages', 'Mesajlar ve biçimlendirme')}.
                </>
              ),
            },
            {
              name: 'formatWeekday',
              type: '(weekday: Weekday, locale: string) => ReactNode',
              description: (
                <>
                  Her hafta günü başlığının görünen içeriği (örneğin tek bir harf veya bir simge); yerelleştirilmiş tam ad erişilebilir etiket olarak
                  kalır. Canlı örneği yok; bkz. {to('i18n', 'Yerel ayarlar, hafta başı ve RTL')}.
                </>
              ),
            },
            {
              name: 'formatDayLabel',
              type: '(date: CalendarDate, locale: string) => string',
              description: (
                <>
                  Her günün erişilebilir etiketinin ve {c('day.label')}’ın tarih kısmı (varsayılan: hafta günü, gün, ay ve yıl). “Bugün”, “seçili” gibi
                  durumlar ve reddetme sebebi yine eklenir. Canlı örneği yok; bkz. {to('accessibility', 'Klavye ve erişilebilirlik')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Render ve araç ipuçları">
        <p>
          Render prop’ları varsayılan arayüzün parçalarını değiştirir; durum, klavye yönetimi ve ARIA takvimde kalır. Render fonksiyonlarını sabit tutun
          (modül kapsamı veya <code>useCallback</code>): günler yalnızca durumları, verileri veya bu fonksiyonlar değiştiğinde yeniden render edilir. Slot
          davranışının ayrıntıları: {to('styling-reference', 'Stil başvurusu → Slotlar')}.
        </p>
        <PropsTable
          caption="Gün render ve araç ipucu prop’ları"
          rows={[
            {
              name: 'renderDay',
              type: '(props: DayRenderProps<TDayData>) => ReactNode',
              description: (
                <>
                  Etkileşimli gün öğesinin tamamını render eder. Üzerine {c('getDayProps()')} yayın (ref, gezici {c('tabIndex')}, ARIA, {c('data-*')},
                  işleyiciler); kendi işleyicilerinizi onun üzerinden verin ve takvimin işlemesini atlamak için içlerinde {c('preventDefault()')} çağırın.
                  Düğme olmayan öğeler Enter/Space desteğini takvimden alır. {c('renderDayContent')}’e göre önceliklidir.{' '}
                  {to('styling', 'Stil → renderDay ve getDayProps')}.
                </>
              ),
            },
            {
              name: 'renderDayContent',
              type: '(ctx: DayRenderContext<TDayData>) => ReactNode',
              description: (
                <>
                  Yalnızca varsayılan gün düğmesinin içini değiştirir (sayı ve {c('DefaultDayData')} çizimi); düğme, halka, bant ve ARIA kalır. İçine
                  etkileşimli öğeler koymayın. {c('renderDay')} verildiğinde yok sayılır. {to('styling', 'Stil → renderDayContent')}.
                </>
              ),
            },
            {
              name: 'getDayTooltip',
              type: '(ctx: DayRenderContext<TDayData>) => TooltipContent | null | undefined',
              description: (
                <>
                  Gün başına araç ipucu. Verildiğinde varsayılan araç ipuçlarının (reddetme sebepleri ve “Bugün”) <strong>yerine geçer</strong>; sebepleri
                  korumak için {c('day.reasonText')} döndürün. {c('{ content, persistent: true }')} ipucunu üzerine gelinmeden gösterir (ilk kalıcı gün
                  kazanır); örneğin “Çıkış tarihinizi seçin”. İskelet olarak çizilen günler araç ipucu almaz. {to('tooltip', 'Araç ipucu')}.
                </>
              ),
            },
            {
              name: 'renderDayTooltip',
              type: '(props: DayTooltipRenderProps) => ReactNode',
              description: (
                <>
                  Açık araç ipucunun içeriğini {c('day')}, {c('content')}, {c('trigger')} ve gerçekte kullanılan {c('placement')}’tan render eder;
                  konumlandırılmış kutu, ok ve {c('aria-describedby')} bağlantısı kalır. {to('styling-reference', 'Stil başvurusu → Slotlar')}.
                </>
              ),
            },
            {
              name: 'tooltip',
              type: 'TooltipOptions',
              description: (
                <>
                  {c('placement')} (tercih edilen taraf, varsayılan {c("'top'")}; sığmadığında diğerleri denenir), {c('boundary')} (varsayılan{' '}
                  {c("'calendar'")} veya {c("'viewport'")}), {c('offset')} (varsayılan 8 px), {c('className')}, {c('container')} (portal hedefi,
                  varsayılan {c('document.body')}; modal içinde dialog’u kullanın) ve {c('openDate')} (kontrollü açık gün, {c('null')} = kapalı;
                  yalnızca içeriği olan günler açılır). {to('tooltip', 'Araç ipucu')}, {to('placement', 'Satır içi, modal ve portal')}.
                </>
              ),
            },
          ]}
        />
        <PropsTable
          caption="Slot prop’ları"
          rows={[
            {
              name: 'renderHeader / renderFooter',
              type: '(ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Ayların üstündeki / altındaki içeriğiniz (özet, saat seçiciler, Temizle/Uygula düğmeleri). {c('ctx')} anlık durumu, {c('messages')},{' '}
                  {c('formatDate')} ve {c('ctx.actions')}’ı (controller) içerir; bu yüzden ref gerekmez. {c('null')} hiçbir sarmalayıcı render etmez.{' '}
                  {to('slots', 'Slotlar ve render prop’ları')}.
                </>
              ),
            },
            {
              name: 'renderMonthHeader',
              type: '(props: MonthHeaderRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Her ayın başlık satırını değiştirir. Bu başlığa ait varsayılan okları korumak için {c('props.navigation')}’ı render edin (
                  {c('renderNavigation')} veya sürekli gezinmede {c('null')}). Bu durumda ay {c('aria-label')} ile etiketlenir.{' '}
                  {to('slots', 'Slotlar → Gezinme ve ay başlıkları')}.
                </>
              ),
            },
            {
              name: 'renderNavigation',
              type: '(props: NavigationRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Yalnızca sayfalı: ayların üstünde, varsayılan okların yerine geçen tek bir gezinme çubuğu. {c('previous()')}/{c('next()')}{' '}
                  {c('stepMonths')} kadar ilerler; düğmelerinizi {c('canPrevious')}/{c('canNext')} ile devre dışı bırakın. Sürekli modda render edilmez.{' '}
                  {to('slots', 'Slotlar → Gezinme ve ay başlıkları')}.
                </>
              ),
            },
            {
              name: 'renderLoading',
              type: '(props: LoadingRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Görünür bir yükleme göstergesi; varsayılan olarak yalnızca iskelet günler ve ekran okuyucu metni gösterilir. Her {c('scope')} için
                  çağrılır: {c("'initial'")} (ilk yüklemede {c('loading')}), {c("'month'")} (yüklenen her ay, iskelet kalır) ve {c("'load-more'")} (yeni
                  eklenen aylar). Arka plan yenilemesinde çağrılmaz. {to('loading', 'Yükleme ve hatalar → Görünür bir yükleme göstergesi')}.
                </>
              ),
            },
            {
              name: 'renderError',
              type: '(props: ErrorRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Durumu {c("'error'")} olan her aydaki varsayılan hata kutusunun yerine geçer; {c('retry()')}, {c('onRetry([month])')}’i çağırır. Canlı
                  örneği yok; bkz. {to('styling-reference', 'Stil başvurusu → Slotlar')}.
                </>
              ),
            },
            {
              name: 'renderLoadMore',
              type: '(props: LoadMoreRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  {c("loadMore='button'")} ile sürekli modda: {c('loadDirections')} içindeki her yön için varsayılan daha fazla ay yükleme düğmesinin
                  yerine farklı bir kontrol. {c('minDate')}/{c('maxDate')}’te de {c('canLoad: false')} ile çağrılır (orada varsayılan düğme kaldırılır
                  ve {c('loadMore()')} hiçbir şey yapmaz); böylece devre dışı bir kontrol veya bir mesaj gösterebilir.{' '}
                  {to('load-more', 'Kademeli ay yükleme → renderLoadMore')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Stil ve kimlik">
        <PropsTable
          caption="Stil ve kimlik prop’ları"
          rows={[
            {
              name: 'className / style',
              type: 'string / CSSProperties',
              description: (
                <>
                  Kök öğede, varsayılan {c('cal-root')} sınıfından sonra. Tema değişkenlerini ({c('--cal-accent')}, …) burada veya CSS’te ayarlayın; boyut
                  değişkenleri {c('--cal-day-min-w/h')}, {c('--cal-day-max')} ve {c('--cal-month-gap')} her zaman prop’lardan gelen değerle üzerine
                  yazılır. {to('styling', 'Stil → CSS değişkenleri')}.
                </>
              ),
            },
            {
              name: 'classNames',
              type: 'CalendarClassNames',
              description: (
                <>
                  Parça başına ek sınıflar ({c('root')}, {c('month')}, {c('dayButton')}, {c('tooltip')}, …); varsayılanların yanına (veya{' '}
                  {c('unstyled')} ile tek başına) eklenir. {c('dayCell')}, {c('dayButton')} ve {c('dayContent')} ayrıca{' '}
                  {c('(day) => string | undefined')} da kabul eder. Nesneyi sabit tutun: yeni bir nesne her günü yeniden render eder.{' '}
                  {to('styling', 'Stil → classNames')}.
                </>
              ),
            },
            {
              name: 'unstyled',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Tüm varsayılan {c('cal-*')} sınıflarını kaldırır, böylece stil dosyası artık uygulanmaz; stili {c('classNames')} ve {c('data-*')}{' '}
                  öznitelikleri üzerinden verin. Yerleşim yine de {c('minDaySize')} ve 8 px ay dolgusunu varsayar. {to('styling', 'Stil → unstyled')}.
                </>
              ),
            },
            {
              name: 'id',
              type: 'string',
              default: <>otomatik üretilir (<code>useId</code>)</>,
              description: (
                <>
                  Kök öğenin id’si; olaylarda, controller’da ve {c('ctx')}’te {c('instanceId')} olarak da geçer. İç id’ler bundan türetilir:{' '}
                  {c('<id>-tooltip')} (günün {c('aria-describedby')}’ı), {c('<id>-months')}, {c('<id>-day-<date>')}. Testlerde sabit id’ler için veya
                  ortak işleyicilerde takvimleri ayırt etmek için verin; sayfada benzersiz olmalıdır. {to('api-controller', 'Controller → instanceId')}.
                </>
              ),
            },
            {
              name: 'aria-label',
              type: 'string',
              default: <><code>messages.calendar</code> (“Calendar”)</>,
              description: (
                <>
                  Takvim grubunun erişilebilir adı. Bir sayfadaki her takvime ayrı bir ad verin (“Giriş”, “Dönüş tarihi”).{' '}
                  {to('accessibility', 'Klavye ve erişilebilirlik')}.
                </>
              ),
            },
            {
              name: 'ref',
              type: 'Ref<CalendarController>',
              description: (
                <>
                  Emir kipi (imperative) controller: {c('goToMonth')}, {c('next')}/{c('previous')}, {c('loadMore')}, {c('clear')}, {c('reset')},{' '}
                  {c('select')}, {c('setActiveEndpoint')}, {c('focusDate')}, {c('getSnapshot')}. Slotların içinde aynı nesne {c('ctx.actions')}’tır.{' '}
                  {to('api-controller', 'Controller (ref)')}, {to('go-to-month', 'Programla gezinme')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Olay callback’leri">
        <p>
          Hepsi isteğe bağlıdır; her biri <code>instanceId</code> içeren tipli bir olay alır. İçerikler, kaynaklar ve sıralama{' '}
          {to('api-events', 'Callback’ler ve olaylar')} sayfasında belgelenmiştir. <code>onChange</code>, Seçim bölümünde listelenir.
        </p>
        <PropsTable
          caption="Olay callback’leri"
          rows={[
            ev('onReady', '(e: ReadyEvent) => void', 'Her mount’ta bir kez, ilk ölçümden sonra, yerleşim bilgisiyle.'),
            ev('onDateClick', '(e: DateClickEvent) => void', 'Her gün etkinleştirmesinde (işaretçi veya klavye), kabul edilsin ya da reddedilsin; gün durumu ve sorunla birlikte.'),
            ev('onSelectionComplete', '(e: SelectionCompleteEvent) => void', 'Geçerli bir seçim tamamlandı: tekli seçim (seçili tarihi yeniden seçmek dahil), aralığın iki ucu, çoklu modda maxSelections’a ulaşılması veya yeni bir değerin geçerli bir select() ile seçilmesi.'),
            ev('onSelectionClear', '(e: SelectionClearEvent) => void', 'Seçim boşaldı (clear(), boş değere reset(), son tarihin kaldırılması, …).'),
            ev('onInvalidSelection', '(e: InvalidSelectionEvent) => void', 'Bir tıklama veya select() reddedildi (her seferinde, hiçbir zaman tekilleştirilmez); sorunu ve yerelleştirilmiş mesajını taşır. e.date, CalendarDate | null’dır: reddedilen bir select()’in günü yoksa null.'),
            ev('onValidationChange', '(e: ValidationChangeEvent) => void', 'Mevcut seçimin geçerliliği değişti; ayrıca mount’ta ve kurallar, veri veya bugün değiştiğinde.'),
            ev('onActiveEndpointChange', '(endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void', 'Aralık: sonraki tıklamanın ucu değişti (activeEndpoint kontrollüyse bir istek).'),
            ev('onVisibleMonthChange', '(month: CalendarMonth, e: VisibleMonthChangeEvent) => void', 'Referans ayın değişmesi istendi (oklar, klavye, goToMonth()); prop değişikliklerinde veya ay aynı kaldığında hiçbir zaman (ör. maxDate’te next()).'),
            ev('onVisibleMonthsChange', '(e: VisibleMonthsChangeEvent) => void', 'Ekrandaki aylar değişti; sürekli modda kaydırmayla olanlar dahil.'),
            ev('onRenderedMonthsChange', '(e: RenderedMonthsChangeEvent) => void', 'DOM’a ay eklendi veya DOM’dan ay çıkarıldı, mount’ta da: veri isteklerini burada başlatın.'),
            ev('onLoadMore', '(e: LoadMoreEvent) => void', 'Sürekli: bir düğme, otomatik yükleme veya ref.loadMore() ile ay eklendi.'),
            ev('onLoadingChange', '(e: LoadingChangeEvent) => void', 'LoadingSnapshot değişti (ilk yükleme, yenileme, yüklenen veya hatalı aylar).'),
            ev('onResize', '(e: ResizeEvent) => void', 'Kök öğe ilk kez ölçüldü veya resizeThreshold’dan fazla boyut değiştirdi.'),
            ev('onLayoutChange', '(e: LayoutChangeEvent) => void', 'Sütunlar, etkin ay sayısı, etkin taşma stratejisi veya en küçük boyut durumu değişti.'),
            ev('onDayFocusChange', '(e: DayFocusChangeEvent) => void', 'Odaklanan gün değişti (klavye, tıklama veya focusDate()).'),
            ev('onTooltipOpenChange', '(e: TooltipOpenChangeEvent) => void', 'Bir gün araç ipucu açıldı, kapandı veya başka bir güne geçti; tetikleyicisiyle birlikte.'),
            ev('onOutsideClick', '(e: OutsideClickEvent) => void', 'Takvimin ve portallarının (araç ipucu, slot açılır pencereleri) dışında bir pointerdown: açılır pencereyi burada kapatın.'),
            ev('onScroll', '(e: ScrollEvent) => void', 'Aylar alanı kaydırıldı; animasyon karesi başına en fazla bir kez.'),
            ev('onEvent', '(e: CalendarEvent) => void', 'Change dahil her olay, kendi özel callback’inden sonra.'),
          ]}
        />
      </Section>
    </Page>
  );
}

const typeLinks: readonly (readonly [string, ReactNode, string, string])[] = [
  ['CalendarDate, CalendarMonth, Weekday, DateParts', 'Markalı (branded) “YYYY-MM-DD” / “YYYY-MM” string’leri, 0 = pazar ve { year, month, day }.', 'api-dates', 'Tarih yardımcıları'],
  ['SelectionRules, DayAvailability, RuleContext', 'Kural kümesi, gün başına sonuç ve kural callback’lerinin ctx’i.', 'api-rules', 'Kurallar ve adaptörler'],
  ['StayRulesOptions, StayDayStatus, StayReason', 'stayRules() seçenekleri, gece başına durumları ve sebep etiketleri.', 'api-rules', 'Kurallar ve adaptörler'],
  ['DayRangeRulesOptions, DayRangeStatus', 'dayRangeRules() seçenekleri ve gün başına durumları.', 'api-rules', 'Kurallar ve adaptörler'],
  ['RelaxScheduleOptions', '{ weekdays?: boolean; length?: boolean }, ikisinin de varsayılanı true (bkz. relaxSchedule).', 'api-rules', 'Kurallar ve adaptörler'],
  ['SelectionEngine, SelectionEngineInput, ActivationPlan', 'Takvimin arkasındaki arayüzsüz (headless) motor ve plan(date)’in döndürdüğü değer.', 'api-rules', 'Kurallar ve adaptörler'],
  ['CalendarMessages, CalendarMessagesInput, ReasonMessage, MessageFormatHelpers', 'Metin paketi, kısmi geçersiz kılmalar ve sebep fonksiyonları.', 'api-messages', 'Mesajlar ve biçimlendirme'],
  ['CalendarController, GoToMonthOptions, GoToMonthResult, CalendarSnapshot', 'Ref API’si ve anlık durumu.', 'api-controller', 'Controller (ref)'],
  ['CalendarEvent, CalendarEventType, EventSource, ReadyEvent … ScrollEvent', 'Tüm olay içerikleri, birleşim tipi ve kaynak değerleri.', 'api-events', 'Callback’ler ve olaylar'],
  ['CalendarLayout, LoadingSnapshot', 'onLayoutChange / onReady ve onLoadingChange içerikleri.', 'api-events', 'Callback’ler ve olaylar'],
  ['CalendarPart, ClassNameValue', 'classNames anahtarları ve değer tipleri.', 'styling-reference', 'Stil başvurusu'],
  ['MonthHeaderRenderProps, NavigationRenderProps, LoadingRenderProps, ErrorRenderProps, LoadMoreRenderProps, DayTooltipRenderProps', 'Slotların prop’ları.', 'styling-reference', 'Stil başvurusu'],
  ['DefaultDayData', 'Varsayılan gün içeriğinin çizdiği biçim.', 'day-content', 'Gün içeriği'],
];

export function TypesReference() {
  return (
    <Page
      title="Tipler"
      lead={
        <>
          Genel API’nin dışa aktarılan tüm tipleri. Hepsi <code>calendar-kit</code>’ten dışa aktarılır; React tipleri ayrıca <code>calendar-kit/client</code>’tan,
          React’ten bağımsız olanlar ayrıca <code>calendar-kit/core</code>’dan. Başka sayfalarda tam olarak belgelenen tipler önce bağlantıyla listelenir;
          geri kalanlar burada gösterilir.
        </>
      }
    >
      <Section title="Başka sayfalarda belgelenenler">
        <DataTable
          caption="Başka sayfalarda belgelenen tipler"
          head={['Tipler', 'Ne oldukları', 'Sayfa']}
          rows={typeLinks.map(([names, what, slug, title]) => [<code key="n">{names}</code>, what, to(slug, title)])}
        />
      </Section>

      <Section title="Prop’lar">
        <pre className="docs-pre docs-type-block">{`type CalendarProps<TDayData = unknown, TContext = unknown> =
  CalendarBaseProps<TDayData, TContext> & SelectionProps

// Seçim prop’ları dışındaki her şey, CalendarEventHandlers dahil
interface CalendarBaseProps<TDayData, TContext> extends CalendarEventHandlers { … }

type SelectionProps =
  | SingleSelectionProps     // { mode: 'single';   value?, defaultValue?: CalendarDate | null; onChange? }
  | RangeSelectionProps      // { mode: 'range';    value?, defaultValue?: DateRange; onChange?;
                             //   activeEndpoint?, defaultActiveEndpoint?: RangeEndpoint }
  | MultipleSelectionProps   // { mode: 'multiple'; value?, defaultValue?: readonly CalendarDate[]; onChange? }
  | ReadonlySelectionProps   // { mode: 'readonly' }

interface CalendarEventHandlers {
  onReady?, onDateClick?, onSelectionComplete?, onSelectionClear?, onInvalidSelection?,
  onValidationChange?, onActiveEndpointChange?, onVisibleMonthChange?, onVisibleMonthsChange?,
  onRenderedMonthsChange?, onLoadMore?, onLoadingChange?, onResize?, onLayoutChange?,
  onDayFocusChange?, onTooltipOpenChange?, onOutsideClick?, onScroll?, onEvent?
}`}</pre>
        <p>
          <code>TDayData</code>, <code>getDayData</code>’nın döndürdüğü tiptir (render prop’larındaki <code>data</code>’yı tipler); <code>TContext</code>{' '}
          ise <code>ruleContext</code>’in tipidir (kurallardaki <code>ctx.context</code>’i tipler). İkisi de prop’lardan çıkarılır. Takvimi kendi
          bileşeninize sarmak için <code>CalendarProps</code>’u, yalnızca tek bir modu kabul etmek için bir <code>*SelectionProps</code> varyantını ve
          callback’leri iletmek için <code>CalendarEventHandlers</code>’ı kullanın. Tüm prop’lar: {to('api-props', 'Calendar prop’ları')}.
        </p>
      </Section>

      <Section title="Seçim değerleri">
        <pre className="docs-pre docs-type-block">{`type SelectionMode = 'single' | 'range' | 'multiple' | 'readonly'

interface DateRange { start: CalendarDate | null; end: CalendarDate | null }
type RangeEndpoint = 'start' | 'end'          // sonraki etkinleştirmenin belirlediği uç
type RangeSemantics = 'inclusive' | 'exclusive'
  // dahil [start, end]: 13–20 Kasım = 8 gün · hariç [start, end): 7 gece

type Selection =
  | { mode: 'single'; value: CalendarDate | null }
  | { mode: 'range'; value: DateRange }
  | { mode: 'multiple'; value: readonly CalendarDate[] }
  | { mode: 'readonly'; value: null }

type SelectionPhase = 'empty' | 'start-selected' | 'complete'
  // complete: tek bir tarih, aralığın iki ucu veya çoklu modda en az bir tarih

interface SelectionState { selection: Selection; activeEndpoint: RangeEndpoint }

type DataStatus = 'unknown' | 'loading' | 'loaded' | 'error'`}</pre>
        <p>
          <code>Selection</code>; anlık durumlarda, <code>SlotContext</code>’te, doğrulayıcılarda ve <code>ValidationChangeEvent</code>’te bulunan, moda
          göre etiketlenmiş değerdir. <code>SelectionState</code> buna etkin ucu ekler; motorun girdi durumu ve <code>ActivationPlan.next</code>’tir.{' '}
          <code>DataStatus</code>, <code>getDataStatus</code>’un ay başına döndürdüğü değerdir (bkz. {to('loading', 'Yükleme ve hatalar')});{' '}
          <code>RangeSemantics</code> {to('core-concepts', 'Temel kavramlar')} sayfasında açıklanır.
        </p>
      </Section>

      <Section title="Doğrulama">
        <pre className="docs-pre docs-type-block">{`interface ValidationResult { valid: boolean; issue: ValidationIssue | null }

interface ValidationIssue {
  code: ReasonCode
  date?: CalendarDate      // soruna yol açan gün
  params?: IssueParams     // mesaj şablonları için değerler, ör. { min: 2, actual: 1, unit: 'nights' }
  dayReason?: string       // sorunlu günün DayAvailability.reason değeri
  message?: string         // hazır metin; tüm şablonlara üstün gelir
}

type IssueParams = Record<string, string | number | boolean | null | undefined>

type ReasonCode =
  | 'invalid-date' | 'before-min' | 'after-max' | 'past' | 'future'
  | 'closed' | 'start-not-allowed' | 'end-not-allowed' | 'blocked-in-range'
  | 'weekday-start' | 'weekday-end' | 'min-length' | 'max-length' | 'fixed-length'
  | 'same-day' | 'end-before-start' | 'max-selections'
  | 'data-unknown' | 'data-loading' | 'data-error' | 'custom'

type ActivationKind =      // bir günü etkinleştirmenin şu anda ne yapacağı (day.action)
  | 'select'      // tekli (zaten seçili olan tarih de)
  | 'start'       // aralık: yeni başlangıç
  | 'complete'    // aralık: bitiş seçildi veya sabit uzunluklu aralık
  | 'toggle-on' | 'toggle-off'   // çoklu
  | 'clear'       // aralık: aynı gün desteği olmadan tek başlangıca tıklama
  | 'none'        // salt okunur mod
  | 'rejected'`}</pre>
        <p>
          Sorunlar size <code>day.reason</code> olarak, <code>onInvalidSelection</code>, <code>onValidationChange</code> ve <code>ref.select()</code>{' '}
          içinde ulaşır. Her <code>ReasonCode</code>’un <code>messages.reasons</code> içinde bir metni vardır ({to('api-messages', 'Mesajlar')}); bunları
          üreten kurallar {to('api-rules', 'Kurallar ve adaptörler')} sayfasındadır.
        </p>
      </Section>

      <Section title="Günler">
        <pre className="docs-pre docs-type-block">{`interface DayState {
  date: CalendarDate; month: CalendarMonth; dayOfMonth: number
  dayText: string          // yerel ayarın rakamlarıyla sayı
  weekday: Weekday
  column: number           // hafta satırı içinde 0–6 (mantıksal, RTL’den bağımsız)
  label: string            // tam erişilebilir tarih (formatDayLabel)
  today: boolean; past: boolean; future: boolean
  disabled: boolean        // etkinleştirme şu anda reddedilir (reason açıklar); yine odaklanabilir
  unavailable: boolean     // hiçbir aşamada seçilemez (kapalı, sınır dışı, veri yok)
  readOnly: boolean
  selected: boolean; selectedSingle: boolean; selectedStart: boolean; selectedEnd: boolean
  inRange: boolean         // başlangıç ile bitiş arasında (uçlar hariç)
  included: boolean        // rangeSemantics’e göre seçime sayılır
  inPreviewRange: boolean; previewStart: boolean; previewEnd: boolean   // üzerine gelme/odak önizlemesi
  focused: boolean; hovered: boolean
  action: ActivationKind   // bir tıklamanın ne yapacağı
  canStart: boolean; canEnd: boolean; canPassThrough: boolean
  outOfSchedule: boolean   // kısıtlama takvim (schedule) kuralından gelir (bkz. relaxSchedule)
  dataStatus: DataStatus; loading: boolean
  reason: ValidationIssue | null; reasonText: string | null   // yerelleştirilmiş sebep
  modifiers: Readonly<Record<string, boolean>>                 // true olan modifier’larınız
  weekStart: boolean; weekEnd: boolean; monthStart: boolean; monthEnd: boolean
}

interface DayRenderContext<TDayData> { day: DayState; data: TDayData | undefined }

interface DayRenderProps<TDayData> extends DayRenderContext<TDayData> {
  getDayProps: (props?: DayPropsInput) => DayProps
  defaultContent: ReactNode   // gün sayısı + varsayılan DefaultDayData çizimi
}

// getDayProps’a verebilecekleriniz: öznitelikleriniz ve işleyicileriniz
type DayPropsInput = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>
  // <button> için vermeyin (type="button" yazılır); başka bir öğe için null:
  // type özniteliği yok, siz bir role vermedikçe role="button", Enter/Space seçer
  type?: 'button' | null
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}

// Döndürdüğü: öğenize yayacağınız birleştirilmiş öznitelikler
type DayProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref: (el: HTMLElement | null) => void
  type?: 'button'
  tabIndex: number
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}`}</pre>
        <p>
          <code>DayState</code>; render prop’larına, <code>modifiers</code>’a, araç ipuçlarına ve <code>classNames</code> fonksiyonlarına iletilir; aynı
          durum günde <code>data-*</code> öznitelikleri olarak da bulunur ({to('styling-reference', 'Stil başvurusu')}). <code>DayRenderContext</code>,{' '}
          <code>renderDayContent</code> ve <code>getDayTooltip</code>’in argümanıdır; <code>DayRenderProps</code> ise <code>renderDay</code>’in.{' '}
          <code>getDayProps</code>’ta önce sizin işleyicileriniz çalışır; <code>onClick</code>, <code>onKeyDown</code>, <code>onPointerEnter</code> veya{' '}
          <code>onFocus</code> içinde <code>event.preventDefault()</code> takvimin o olayı işlemesini atlar; <code>ref</code>, <code>className</code> ve{' '}
          <code>aria-describedby</code> değerleriniz birleştirilir. <code>&lt;button&gt;</code> olmayan bir öğeye yayarken <code>type: null</code> verin (
          {to('styling', 'Stil → renderDay ve getDayProps')}).
        </p>
      </Section>

      <Section title="Araç ipuçları">
        <pre className="docs-pre docs-type-block">{`type TooltipContent = ReactNode | { content: ReactNode; persistent?: boolean }
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'
type TooltipBoundary = 'calendar' | 'viewport'
type TooltipTrigger = 'hover' | 'focus' | 'touch' | 'persistent' | 'controlled'

interface TooltipOptions {
  placement?: TooltipPlacement      // tercih edilen taraf, varsayılan 'top'
  boundary?: TooltipBoundary        // varsayılan 'calendar'
  offset?: number                   // px, varsayılan 8
  className?: string
  container?: HTMLElement | null    // portal hedefi, varsayılan document.body
  openDate?: CalendarDate | null    // kontrollü açık gün; null = kapalı, undefined = kontrolsüz
}

interface DayTooltipRenderProps {
  day: DayState; content: ReactNode; trigger: TooltipTrigger; placement: TooltipPlacement
}`}</pre>
        <p>
          <code>TooltipContent</code>, <code>getDayTooltip</code>’in döndürdüğü değerdir; <code>persistent: true</code> içeren nesne biçimi araç ipucunu
          üzerine gelme veya odak olmadan gösterir. <code>calendar</code> araç ipucunu takvimin aylar alanı içinde tutar; <code>viewport</code> ise
          takvimin dışına, pencerenin içine taşmasına izin verir. <code>TooltipTrigger</code> ipucunun neden açık olduğunu söyler (<code>renderDayTooltip</code>{' '}
          ve <code>onTooltipOpenChange</code> içinde). Bkz. {to('tooltip', 'Araç ipucu')}.
        </p>
      </Section>

      <Section title="Yerleşim ve gezinme">
        <pre className="docs-pre docs-type-block">{`type Orientation = 'horizontal' | 'vertical'
type OverflowStrategy = 'scroll' | 'wrap' | 'reduce-months'
type NavigationMode = 'paged' | 'continuous'
type LoadMoreMode = 'button' | 'auto' | 'manual'
type LoadDirection = 'next' | 'previous'
type LoadingScope = 'initial' | 'month' | 'load-more'`}</pre>
        <p>
          <code>orientation</code>, <code>overflow</code>, <code>navigation</code> ve <code>loadMore</code>’un değer tipleri (bkz.{' '}
          {to('api-props', 'Calendar prop’ları')}). <code>LoadDirection</code>; <code>ref.loadMore()</code>, <code>loadMoreLabels</code> ve{' '}
          <code>onLoadMore</code> tarafından kullanılır; <code>loadDirections</code> ayrıca <code>&apos;both&apos;</code> değerini de kabul eder.{' '}
          <code>LoadingScope</code>, <code>renderLoading</code>’in <code>scope</code>’udur.
        </p>
      </Section>

      <Section title="Slotlar ve stil">
        <pre className="docs-pre docs-type-block">{`interface SlotContext extends CalendarSnapshot {
  instanceId: string
  actions: CalendarController    // ref ile aynı nesne
  messages: CalendarMessages     // birleştirilmiş mesajlar
  locale: string
  formatDate(date: CalendarDate, options?: Intl.DateTimeFormatOptions): string
}

type CalendarClassNames =
  Partial<Record<Exclude<CalendarPart, 'dayCell' | 'dayButton' | 'dayContent'>, string>> & {
    dayCell?: ClassNameValue
    dayButton?: ClassNameValue
    dayContent?: ClassNameValue
  }
type ClassNameValue = string | ((day: DayState) => string | undefined)`}</pre>
        <p>
          <code>SlotContext</code> her slotun ikinci argümanıdır ({c('renderHeader')}, {c('renderFooter')}, {c('renderMonthHeader')},{' '}
          {c('renderNavigation')}, {c('renderLoading')}, {c('renderError')}, {c('renderLoadMore')}). <code>formatDate</code> varsayılan olarak takvimin
          yerel ayarında uzun bir tarih (“13 Kasım 2026”) üretir. <code>CalendarClassNames</code>, <code>classNames</code>’in tipidir; anahtarları{' '}
          {to('styling-reference', 'Stil başvurusu')} sayfasında listelenen <code>CalendarPart</code> adlarıdır.
        </p>
      </Section>
    </Page>
  );
}
