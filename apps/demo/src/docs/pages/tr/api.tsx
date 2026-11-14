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
          <code>{'<Calendar>'}</code>’ın tüm prop’ları, konuya göre gruplanmış. Yalnızca <code>mode</code> zorunludur. Her satır önce prop’un ekranda
          neyi değiştirdiğini, sonra varsayılan değerini ve özel durumlarını anlatır; prop’u canlı bir örnekte kullanan sayfaya bağlantı verir. Controlled
          prop’lar (değeri kendi state’inizde tutarsınız, örneğin <code>value</code> + <code>onChange</code>) uncontrolled karşılıklarının (değeri takvim
          tutar; yalnızca başlangıç değerini verirsiniz, örneğin <code>defaultValue</code>) yanında listelenir.
        </>
      }
    >
      <Section title="Sık kullanılan prop’lar">
        <p>
          Tipik bir rezervasyon takvimi: kuralları ve sınırları olan controlled bir aralık, kapsayıcıya uyan iki ay, gün başına veri, bir yerel ayar ve
          takvimin dışındaki düğmeler için bir <code>ref</code>.
        </p>
        <Snippet files={overview} label="Sık kullanılan prop’lar" />
        <p>Diğer örneklerin kullanmadığı biçimlendirme, yerleşim ve kimlik prop’ları ile kalan controller metotları:</p>
        <Snippet files={more} label="Biçimlendirme, yerleşim ve kimlik" />
        <Note>
          <strong>Controlled mı, uncontrolled mı?</strong> Üç durum parçası çift prop olarak gelir: <code>value</code> / <code>defaultValue</code>,{' '}
          <code>activeEndpoint</code> / <code>defaultActiveEndpoint</code> ve <code>visibleMonth</code> / <code>defaultVisibleMonth</code>. Controlled
          prop’u verdiğinizde (<code>undefined</code> dışında herhangi bir değer) değeri siz tutarsınız: takvim değişiklik isteğini callback ile bildirir ve
          sizin geri verdiğiniz değeri gösterir. <code>default…</code> prop’u (uncontrolled) yalnızca ilk render’da okunur; sonraki değişiklikleri yok
          sayılır. Controlled bir prop’u siz değiştirdiğinizde ilgili callback çağrılmaz.
        </Note>
      </Section>

      <Section title="Seçim">
        <p>
          <code>CalendarProps</code>, <code>mode</code> üzerinden bir birleşim (union) tipidir: <code>value</code>, <code>defaultValue</code> ve{' '}
          <code>onChange</code>’in tipi ona göre belirlenir; <code>activeEndpoint</code> yalnızca aralık modunda vardır. Bkz.{' '}
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
                  Bir tıklamanın ne yaptığı: tek bir tarih seçmek, bir başlangıç ve bitiş seçmek, tarihleri tek tek seçip kaldırmak ya da hiçbir şey
                  ({c('readonly')} müsaitliği “Yalnızca görüntüleme” notuyla gösterir, değer prop’u yoktur ve controller’ın {c('select()')} metodu geçersiz
                  sonuç döndürür). Uncontrolled bir takvimde mod sonradan değiştirilirse seçim, {c('onChange')} çağrılmadan yeni modun boş değeriyle
                  başlar.{' '}
                  {to('selection-modes', 'Seçim modları')}.
                </>
              ),
            },
            {
              name: 'value',
              type: 'single: CalendarDate | null · range: DateRange · multiple: readonly CalendarDate[]',
              description: (
                <>
                  Takvimin gösterdiği seçili tarih(ler); değeri kendi state’inizde tutarsınız: <strong>controlled</strong> (çifti: {c('defaultValue')}). {c('undefined')} dışındaki her değer takvimi controlled
                  yapar; bu nedenle {c('null')} veya {c("{ start: null, end: null }")} controlled ama boş bir seçimdir. {c('onChange')}’in verdiği değeri
                  saklayın; saklamazsanız tıklamalar ekranda hiçbir şeyi değiştirmez. {c('visibleMonth')}/{c('defaultVisibleMonth')} yoksa başlangıç ayı seçimin ayıdır (tek tarih,
                  aralık başlangıcı veya çoklu seçimdeki en erken tarih). {to('core-concepts', 'Temel kavramlar → controlled')}.
                </>
              ),
            },
            {
              name: 'defaultValue',
              type: <><code>value</code> ile aynı</>,
              description: (
                <>
                  Takvim ilk göründüğünde gösterilen seçim; sonrasında seçimi takvim kendisi tutar (<strong>uncontrolled</strong>, çifti: {c('value')}).
                  Yalnızca ilk render’da okunur, sonraki
                  değişiklikler yok sayılır. {c('ref.reset()')} bu değere döner. {c('value')} verildiğinde yok sayılır.{' '}
                  {to('core-concepts', 'Temel kavramlar → uncontrolled')}.
                </>
              ),
            },
            {
              name: 'onChange',
              type: '(value, e: ChangeEvent) => void',
              description: (
                <>
                  Değeri değiştiren her kullanıcı veya controller eyleminden sonra yeni değerle çağrılır (aralık modunda ilk tıklamada{' '}
                  {c('{ start, end: null }')} ile, sonra iki uçla). Prop değişikliklerinde, seçilemeyen bir güne tıklandığında (seçim değişmez) veya değer
                  aynı kaldığında çağrılmaz (seçili tarihi yeniden seçmek, mevcut değerle {c('select()')}/{c('reset()')}, boş seçimde {c('clear()')}). {c('e')} içinde{' '}
                  {c('reason')}, {c('source')}, {c('phase')} ve {c('validation')} bulunur. {to('api-events', 'onChange')}.
                </>
              ),
            },
            {
              name: 'activeEndpoint',
              type: "'start' | 'end'",
              description: (
                <>
                  Yalnızca aralık modunda. Sonraki tıklamanın aralığın hangi ucunu belirleyeceği; değeri kendi state’inizde tutarsınız (<strong>controlled</strong>,
                  çifti: {c('defaultActiveEndpoint')});{' '}
                  {c('onActiveEndpointChange')} ile birlikte kullanın. Aynı aralığı düzenleyen takvimler arasında {c('value')} ile birlikte paylaşın; böylece
                  birinde başlangıç seçilince diğeri bitişi bekler. Verilmezse değere göre belirlenir (yalnızca başlangıç seçiliyken {c('end')}).{' '}
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
                  Yalnızca aralık modunda. İlk tıklamanın hangi ucu belirleyeceği (<strong>uncontrolled</strong>); örneğin {c("'end'")} verirseniz önceden
                  doldurulmuş bir aralıkta ilk tıklama yeni bir aralık başlatmaz, bitişi taşır. Seçim başlangıç değerindeyken geçerlidir; seçim değişince uç yeniden seçime göre belirlenir.{' '}
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
          kullanılarak birleştirilir; her zaman daha katı olan değer geçerli olur (en geç <code>minDate</code>, en erken <code>maxDate</code>, herhangi
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
                  Kullanıcının hangi günleri ve aralıkları seçebileceği: sınırlar, uzunluklar, hafta günleri, gün başına müsaitlik ve özel doğrulama. Kurala
                  uymayan günler devre dışı çizilir. Dizi verildiğinde seçim her kümeden geçmelidir; falsy öğeler atlanır,
                  böylece {c('[stayRules(…), closed && closedDates(closed)]')} yazabilirsiniz. Nesneyi sabit tutun (modül kapsamı veya {c('useMemo')}): her
                  render’da yeni bir nesne kuralların yeniden birleştirilmesine ve seçimin yeniden doğrulanmasına yol açar. {to('length-rules', 'Uzunluk kuralları')},{' '}
                  {to('day-rules', 'Başlangıç/bitiş günleri')}, {to('api-rules', 'Kurallar ve adaptörler')}.
                </>
              ),
            },
            {
              name: 'minDate / maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Kullanıcının seçebileceği ilk / son gün (dahil); dışındaki günler devre dışıdır. {c('null')} sınır yok demektir. {c('disablePast')}’ın aksine gezinmeyi de sınırlar: oklar, klavye,{' '}
                  {c('goToMonth()')} ve daha fazla ay yükleme bu ayların ötesine geçmez (istekler sınıra çekilir). {c('rules')} içindeki{' '}
                  {c('minDate')}/{c('maxDate')} ile birleştirilir; daha dar olan aralık geçerli olur. {to('date-limits', 'Tarih sınırları')}.
                </>
              ),
            },
            {
              name: 'disablePast / disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bugünden önceki / sonraki günler seçilemez (sebep {c('past')} / {c('future')}; bu günlerde varsayılan tooltip gösterilmez). Yalnızca günleri devre
                  dışı bırakır: kullanıcı yine de o aylara gidebilir. {c('today')}/{c('timeZone')}’a bağlıdır. {to('date-limits', 'Tarih sınırları')}.
                </>
              ),
            },
            {
              name: 'ruleContext',
              type: 'TContext',
              description: (
                <>
                  Kural callback’lerinizin hangi günlerin seçilebileceğine karar verirken ihtiyaç duyduğu uygulama durumu (seçilen saatler, kişi sayısı). Her
                  kural callback’i ikinci argüman olarak {c('ctx')} alır (bugün, mevcut seçim, …); bu değer onun {c('ctx.context')} alanıdır. Yeni bir değer
                  verildiğinde seçim ve her gün yeniden doğrulanır, bu yüzden nesneleri memoize edin. {to('recipe-home-rental', 'Ev kiralama uygulama örneği')}.
                </>
              ),
            },
            {
              name: 'relaxSchedule',
              type: 'boolean | RelaxScheduleOptions',
              default: 'false',
              description: (
                <>
                  Kullanıcının normal takvim düzeninin dışındaki tarihleri de seçebilmesini sağlar; örneğin bir “Özel tarihler” anahtarının arkasında. Takvim
                  düzeni (schedule) kurallarını yok sayar: {c('startWeekdays')}/{c('endWeekdays')}/{c('availableWeekdays')},{' '}
                  {c('schedule: true')} olarak işaretlenmiş müsaitlik ({c('weekdays')}) ve {c('minLength')}/{c('maxLength')}/{c('fixedLength')}{' '}
                  ({c('length')}). Gerçek müsaitlik, sınırlar, geçmiş/gelecek, veri durumu ve doğrulayıcılar ise geçerli kalır. {c('true')} veya{' '}
                  {c('{}')} iki grubu da kaldırır; {c('{ weekdays: false }')} yalnızca uzunluk kurallarını kaldırır.{' '}
                  {to('recipe-boat-rental', 'Tekne kiralama uygulama örneği')}, {to('api-rules', 'relaxRules')}.
                </>
              ),
            },
            {
              name: 'today',
              type: 'CalendarDate',
              default: <>istemcide hesaplanır</>,
              description: (
                <>
                  Takvimin “bugün” saydığı tarih: bugün işaretinin nerede çizileceğini, {c('disablePast')}/{c('disableFuture')}’ın hangi günleri devre dışı
                  bırakacağını, {c('day.past')}/{c('day.future')} değerlerini ve ilk gösterilen ayı belirler. SSR ve testler için verin: verilmezse sunucu bugünün tarihini bilemez ve {c('value')} veya {c('defaultVisibleMonth')} bir ay belirtmedikçe
                  boş bir yer tutucu render eder; ayları tarayıcı doldurur. Verildiğinde {c('timeZone')} yok sayılır ve bugün kendiliğinden güncellenmez.{' '}
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
                  {c('today')} verilmediğinde takvim tarihi “bugün” sayılan saat dilimi; örneğin bir mekânın yerel tarihi için{' '}
                  {c("'Europe/Istanbul'")}. Hesaplanan bugün gece yarısından sonra (en az saatte bir kontrol edilir) ve sekme yeniden görünür olduğunda
                  güncellenir. {to('date-limits', 'Tarih sınırları → Bugün')}.
                </>
              ),
            },
            {
              name: 'highlightToday',
              type: 'boolean',
              default: 'true',
              description: (
                <>
                  Bugünün çevresindeki ince halkayı ve varsayılan “Bugün” tooltip’ini gösterir. {c('false')} ikisini de gizler; {c('day.today')},{' '}
                  {c('data-today')} ve günün ekran okuyucu etiketindeki “bugün” sözcüğü kalır. {to('date-limits', 'Tarih sınırları → Bugün')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Veri ve yükleme">
        <p>
          Takvim kendisi veri çekmez. Render ettiği ayların verisini siz yüklersiniz (<code>onRenderedMonthsChange</code>’ten başlayın) ve bu
          prop’larla takvime verirsiniz. Bkz. {to('loading', 'Yükleme ve hatalar')} ve {to('day-content', 'Günlerde etiket, badge ve simge')}.
        </p>
        <PropsTable
          caption="Veri prop’ları"
          rows={[
            {
              name: 'getDayData',
              type: '(date: CalendarDate) => TDayData | undefined',
              description: (
                <>
                  Her günün numarasının altında gösterilenler (fiyat, badge, simge veya noktalar); hangi günlerin seçilebileceğini etkilemez.{' '}
                  {c('DefaultDayData')} biçimi ({c('label')}, {c('badge')},{' '}
                  {c('icon')}, {c('markers')}, {c('description')}) varsayılan gün içeriği tarafından çizilir; başka her biçim render prop’larınıza{' '}
                  {c('data')} olarak gelir. Her render’da her gün için çağrılır: hızlı çalışmalı ve değişmeyen günler için aynı nesneyi döndürmelidir,
                  yoksa o günler gereksiz yere yeniden render edilir. {to('day-content', 'Günlerde etiket, badge ve simge')}.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: '(month: CalendarMonth) => DataStatus',
              default: <>her ay <code>'loaded'</code></>,
              description: (
                <>
                  Takvime her ayın verisinin hazır olup olmadığını bildirir. {c("'loading'")} ve {c("'unknown'")} aylarda günler, tarihler yüklenirken
                  gösterilen boş yer tutucular olarak çizilir (tooltip yok); {c("'error'")} aylarda bir hata kutusu gösterilir. Seçimi de etkiler: {c("'loaded'")} olmayan bir ayın günleri,
                  kurallarda {c("unknownDataPolicy: 'allow'")} verilmedikçe seçilemez (sebepler {c('data-loading')}, {c('data-unknown')}, {c('data-error')}). {c('rules')} içindeki bir{' '}
                  {c('getDataStatus')} ile birleştirilir (daha kötü olan durum geçerli olur). {to('loading', 'Yükleme ve hatalar')}.
                </>
              ),
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Takvimin tamamını yükleniyor olarak gösterir. Takvim ilk render’ından beri bu bayrakla gösteriliyorsa <em>ilk yükleme</em>dir: günler boş yer
                  tutucu olarak çizilir, hiçbir gün seçilemez (seçim her ayın verisi yükleniyormuş gibi doğrulanır; varsayılan{' '}
                  {c("unknownDataPolicy: 'block'")} ile) ve{' '}
                  {c("renderLoading({ scope: 'initial' })")} kullanılır. Takvim bir kez yüklemesiz gösterildikten sonra açılırsa <em>arka plan yenilemesi</em>dir:
                  günler, seçim ve odak olduğu gibi kalır ve günler seçilebilir kalır; yalnızca {c('aria-busy')} ve {c('LoadingSnapshot.refreshing')} değişir.
                  Ay bazında yükleme için {c('getDataStatus')}’u kullanın. {to('loading', 'Yükleme ve hatalar → İlk yükleme')}.
                </>
              ),
            },
            {
              name: 'onRetry',
              type: '(months: readonly CalendarMonth[]) => void',
              description: (
                <>
                  Hata veren her ayın varsayılan hata kutusuna bir Yeniden dene düğmesi ekler; kullanıcı düğmeye bastığında veya {c('renderError')}’ınız{' '}
                  {c('retry()')}’ı çağırdığında {c('[month]')} ile çağrılır. Bu prop yoksa varsayılan hata kutusunda Yeniden dene düğmesi olmaz. {to('loading', 'Yükleme ve hatalar')}.
                </>
              ),
            },
            {
              name: 'modifiers',
              type: 'Record<string, (day: DayState) => boolean>',
              description: (
                <>
                  Stil için kendi gün işaretleriniz (örneğin tatil günleri): her fonksiyon render edilen her gün için çağrılır; {c('true')} döndüren adlar {c('day.modifiers')}{' '}
                  içine ve gün hücresiyle düğmesine {c('data-mod-<name>')} olarak eklenir. Seçimi etkilemezler (bunun için {c('rules')} kullanın). Küçük
                  harfli, tireli adlar seçin: HTML öznitelik adlarını küçük harfe çevirir.{' '}
                  {to('styling', 'Stil → Durum nitelikleri ve modifier’lar')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Yerleşim">
        <p>
          Yerleşim pencereye değil, takvimin kendi kapsayıcısının genişliğine (ResizeObserver ile) göre belirlenir. Bir ay en az{' '}
          <code>7 × minDaySize.width + 16</code> px gerektirir; istenen aylar yan yana sığmadığında ne olacağını <code>overflow</code> belirler ve{' '}
          <code>onLayoutChange</code> sonucu bildirir. Bkz. {to('orientation', 'Yön ve ay sayısı')} ve {to('responsive', 'Responsive yerleşim')}.
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
                  Aylar yan yana mı, tek sütunda alt alta mı; cihaza göre değişmez. Dikey yerleşimde {c('overflow')} kullanılmaz (tek sütun her zaman sığar;
                  tek bir ay bile sığmıyorsa yatay kaydırılır). Çoğunlukla {c('navigation="continuous"')} ve {c('maxBlockSize')} ile birlikte kullanılır.{' '}
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
                  Takvimin aynı anda gösterdiği (sayfalı) veya ilk render ettiği (sürekli) ay sayısı. Takvim bunu kendiliğinden azaltmaz; daha az ayı yalnızca{' '}
                  {c("overflow='reduce-months'")} gösterir. Ondalıklar aşağı yuvarlanır; 1’den küçük veya sonlu olmayan değerler 1 sayılır.
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
                  Referans ayın ({c('visibleMonth')}, seçimin ayı veya bugünün ayı) gösterilen aylar arasında kaçıncı sırada görüneceği (1’den başlar). Referans ayı değiştirmez,
                  yalnızca yanında hangi ayların görüneceğini belirler: referans ay Kasım ve üç ay gösteriliyorsa değer {c('3')} olduğunda Eylül, Ekim ve Kasım gösterilir.
                  1 ile etkin ay sayısı arasına çekilir; {c('minDate')}/{c('maxDate')} yakınında, ulaşılamayan aylar yerine gösterilen aylar kaydırılır. {to('month-position', 'Referans ayın konumu')}.
                </>
              ),
            },
            {
              name: 'overflow',
              type: "'wrap' | 'scroll' | 'reduce-months'",
              default: "'wrap'",
              description: (
                <>
                  Yalnızca yatayda ve aylar sığmadığında: {c('wrap')} ayları alt satırlara geçirir, {c('scroll')} tek satırı korur ve takvimin içinde yatay
                  kaydırma çubuğu gösterir, {c('reduce-months')} daha az ay gösterir (oklar yine {c('stepMonths')} kadar ilerler). Tek bir ay bile
                  sığmıyorsa her seçenekte takvimin içi kaydırılır. {to('responsive', 'Responsive yerleşim')}.
                </>
              ),
            },
            {
              name: 'minDaySize',
              type: 'number | { width: number; height: number }',
              default: '40',
              description: (
                <>
                  Bir gün hücresinin px cinsinden en küçük boyutu (tek sayı iki kenarı da belirler). Kaç ayın sığacağı genişliğe göre hesaplanır; yer varsa
                  günler bundan büyük olur. Dokunmatik ekranlarda daha büyük hedefler için artırın; {c('unstyled')} kullanırken kendi CSS’inizi bu değerle
                  uyumlu tutun. {to('day-size', 'Gün boyutu ve iç kaydırma')}.
                </>
              ),
            },
            {
              name: 'maxDaySize',
              type: 'number',
              default: '56',
              description: (
                <>
                  Gün hücresi yüksekliğinin px cinsinden üst sınırı (hiçbir zaman {c('minDaySize')} yüksekliğinden küçük olmaz); böylece geniş
                  kapsayıcılarda ızgara gereksiz uzamaz. {c('--cal-day-max')}’ı ayarlar. Canlı örneği yok; bkz.{' '}
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
                  Aylar arasındaki boşluk (px). Ayların sığıp sığmadığı hesaplanırken kullanılır; boşluk büyüdükçe aylar daha erken alt satıra geçer ya da
                  sayıları azalır. {c('--cal-month-gap')}’i ayarlar; CSS’te değil burada değiştirin. {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'fixedWeeks',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Her ay 6 hafta satırıyla çizilir; 4 veya 5 satıra ihtiyaç duyan aylara sonda boş satırlar eklenir, böylece hafta satırı sayısı aydan aya
                  değişmez (popover’larda ve yan yana aylarda kullanışlıdır). Gösterilen ay sayısını değiştirmez. {to('orientation', 'Yön ve ay sayısı')}.
                </>
              ),
            },
            {
              name: 'maxBlockSize',
              type: 'number | string',
              description: (
                <>
                  Aylar alanının en büyük yüksekliği (px sayısı veya herhangi bir CSS uzunluğu, örneğin {c("'60vh'")}). İçerik daha uzunsa aylar takvimin
                  içinde kayar, header ve footer görünür kalır; sürekli modda otomatik yükleme ve görünen ayların takibi de bu iç kaydırma alanına göre çalışır.{' '}
                  {to('day-size', 'Gün boyutu ve iç kaydırma')}, {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'resizeThreshold',
              type: 'number',
              default: '0',
              description: (
                <>
                  {c('onResize')}’ın yeniden çağrılması için son bildirilen boyuta göre gereken en küçük değişim (px; genişlik veya yükseklik).
                  Yalnızca bildirimlerin sıklığını azaltır; yerleşim yine her boyut değişikliğine uyar. {to('api-events', 'onResize')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Gezinme">
        <p>
          <strong>Referans ay</strong>, gösterilen ayların kendisine göre belirlendiği aydır: <code>visibleMonth</code>, yoksa <code>defaultVisibleMonth</code>,
          yoksa seçimin ayı, yoksa bugünün ayı. Kullanıcının oklarla sayfa mı değiştireceğini yoksa büyüyen bir listeyi mi kaydıracağını{' '}
          <code>navigation</code> belirler. Bkz. {to('load-more', 'Daha fazla ay yükleme')} ve {to('go-to-month', 'Ayı koddan değiştirme')}.
        </p>
        <PropsTable
          caption="Gezinme prop’ları"
          rows={[
            {
              name: 'visibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              description: (
                <>
                  Takvimin gösterdiği ay (referans ay); değeri kendi state’inizde tutarsınız: <strong>controlled</strong> (çifti: {c('defaultVisibleMonth')}); {c('onVisibleMonthChange')} ile birlikte
                  kullanın. Bu durumda oklar, klavyeyle sayfa değiştirme, {c('ref.next()')} ve {c('goToMonth()')} yalnızca yeni bir ay ister; ayın
                  değişmesi için onu saklayın. Ayı URL’de tutmak veya takvimleri senkron tutmak için kullanın. Geçerli bir ay olmayan değer yok sayılır.
                  Sürekli modda prop değişikliği {c('goToMonth()')} gibi çalışır: render edilmiş bir aya kaydırır (liste korunur) veya render edilmemiş bir
                  ayın çevresinde listeyi yeniden kurar; yumuşak kaydırma, odak taşıma ve {c('visibleMonthChange')} olmadan. Değeri{' '}
                  {c('onVisibleMonthsChange')}’ten değil, {c('onVisibleMonthChange')}’ten alın. {to('api-events', 'onVisibleMonthChange (canlı örnek)')}.
                </>
              ),
            },
            {
              name: 'defaultVisibleMonth',
              type: 'CalendarMonth ("YYYY-MM")',
              default: <>seçimin ayı, yoksa bugünün ayı</>,
              description: (
                <>
                  İlk gösterilen ay; sonrasında ayı takvim kendisi tutar (<strong>uncontrolled</strong>). Yalnızca ilk render’da okunur. Ayrıca{' '}
                  {c('today')} verilmese de sunucunun ayları render etmesini sağlar. {c('visibleMonth')} verildiğinde yok sayılır. {to('core-concepts', 'Temel kavramlar → Başlangıç ayı')},{' '}
                  {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'navigation',
              type: "'paged' | 'continuous'",
              default: "'paged'",
              description: (
                <>
                  {c('paged')}: önceki/sonraki oklarıyla değişen {c('numberOfMonths')} ay. {c('continuous')}: yeni aylar yüklendikçe büyüyen
                  bir liste (ok yok; {c('renderNavigation')} ve {c('stepMonths')} kullanılmaz); dikey ve mobil yerleşimlere uygundur.{' '}
                  {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'stepMonths',
              type: 'number',
              default: '1',
              description: (
                <>
                  Sayfalı modda: okların, {c('renderNavigation')}’ın {c('previous()')}/{c('next()')} fonksiyonlarının ve {c('ref.previous()')}/
                  {c('ref.next()')}’in kaç ay ilerleyeceği; tüm görünen ayları birden değiştirmek için {c('numberOfMonths')} değerini verin. PageUp/PageDown
                  her zaman bir ay ilerler. Geçersiz değerler 1 sayılır. {to('orientation', 'Yön ve ay sayısı → Birden çok ay')}.
                </>
              ),
            },
            {
              name: 'loadMore',
              type: "'button' | 'auto' | 'manual'",
              default: "'button'",
              description: (
                <>
                  Yalnızca sürekli modda: ayların nasıl ekleneceği. {c('button')} “Daha fazla tarih göster” düğmeleri gösterir; {c('auto')} listenin sonu
                  ekranın (veya {c('maxBlockSize')} alanının) 200 px yakınına gelince yeni ay yükler; {c('manual')} hiçbir düğme render etmez, örneğin{' '}
                  {c('renderFooter')} içinden {c("ref.loadMore('next')")}’i siz çağırırsınız. {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'loadDirections',
              type: "'next' | 'previous' | 'both'",
              default: "'next'",
              description: (
                <>
                  Yalnızca sürekli modda: listenin hangi uçlarında yerleşik yükleme arayüzü olacağı (daha fazla ay yükleme düğmeleri veya{' '}
                  {c('renderLoadMore')} içeriği ve {c("loadMore='auto'")} gözcüleri). Yükleme {c('minDate')}/{c('maxDate')} aylarında durur. Controller bu
                  prop’la sınırlı değildir: {c('ref.loadMore(direction)')} iki yöne de ay ekler (yalnızca sürekli modda ve yine sınırlarda durarak).{' '}
                  {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'monthsPerLoad',
              type: 'number',
              default: 'numberOfMonths',
              description: (
                <>
                  Yalnızca sürekli modda: her yüklemede eklenen ay sayısı (min/max sınırında daha az). Klavye odağı listenin sonundan en fazla bu kadar ay
                  öteye giderse liste genişletilir. Geçersiz değerlerde varsayılan kullanılır. {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'maxRenderedMonths',
              type: 'number',
              default: '24',
              description: (
                <>
                  Yalnızca sürekli modda: listenin indirildiği ay sayısı. Bu sayı aşılınca her yükleme listenin karşı ucundan ay kaldırır, klavye odağını tutan
                  ay hariç (odak orada kaldığı sürece liste daha uzun olabilir; odak ayrıldıktan sonraki ilk yüklemede kırpılır); sınır hiçbir zaman {c('numberOfMonths')}’un altına inmez. Yavaş cihazlardaki uzun listeler için düşürün. Canlı örneği yok; bkz.{' '}
                  {to('load-more', 'Daha fazla ay yükleme')}.
                </>
              ),
            },
            {
              name: 'loadMoreLabels',
              type: 'Partial<Record<LoadDirection, ReactNode>>',
              default: 'messages.loadNext / loadPrevious',
              description: (
                <>
                  Her yön için varsayılan daha fazla ay yükleme düğmesinin metni (veya başka içeriği); düğmenin kendisi, davranışı ve erişilebilirliği aynı kalır. Ayrıca{' '}
                  {c('renderLoadMore')}’a {c('label')} olarak gelir. {to('load-more', 'Daha fazla ay yükleme → loadMoreLabels')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Yerelleştirme">
        <p>
          <code>locale</code> tarihlerin biçimini belirler (ay ve gün adları, tarih biçimleri, varsayılan hafta başlangıcı ve yazı yönü). Takvimin kendi
          metinleri (düğme etiketleri, sebepler, ekran okuyucu duyuruları, “Bugün”) <code>messages</code>’tan gelir ve yerel ayar ne olursa olsun
          varsayılanı İngilizcedir: Türkçe için <code>messagesTr</code> paketini <code>locale=&quot;tr-TR&quot;</code> ile birlikte verin. Bkz. {to('i18n', 'Yerel ayarlar, hafta başı ve RTL')} ve{' '}
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
                  {c('firstDayOfWeek')} varsayılanlarının kaynağı. Varsayılanı sabittir, böylece sunucu ve tarayıcı aynı çıktıyı üretir. Takvimin
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
                  Takvimin kendi metinleri (düğme etiketleri, sebepler, duyurular). İngilizce metinlerin üzerine birleştirilir: hazır bir paket ({c('messagesTr')}, {c('messagesDe')}, …) ya da yalnızca değiştirmek istediğiniz
                  anahtarları verin; eksik kalan her anahtar İngilizceden gelir. İç içe {c('reasons')} ve {c('dayReasons')} anahtar anahtar birleştirilir,
                  böylece kendi {c('DayAvailability.reason')} etiketleriniz için metin ekleyebilirsiniz. Başka bir dilde birkaç anahtarı değiştirecekseniz
                  o dilin paketinden başlayın. Nesneyi memoize edin. {to('api-messages', 'Mesajlar ve biçimlendirme')}.
                </>
              ),
            },
            {
              name: 'direction',
              type: "'ltr' | 'rtl'",
              default: <>yerel ayardan</>,
              description: (
                <>
                  Yerleşim yönü (kökte {c('dir')}); Arapça, İbranice, Farsça, Urduca ve diğer sağdan sola diller için varsayılan {c('rtl')}’dir. Aylar yine
                  kronolojik sıradadır; sağ/sol ok tuşları ekrandaki yöne göre hareket eder. {to('i18n', 'Yerel ayarlar → Arapça (RTL)')}.
                </>
              ),
            },
            {
              name: 'firstDayOfWeek',
              type: 'Weekday (0–6, 0 = Sunday)',
              default: <>yerel ayarın bölgesinden</>,
              description: (
                <>
                  Haftanın ilk sütunu; örneğin {c('en-US')}’de haftayı pazartesi başlatmak için {c('1')}. Varsayılan, sabit bir bölge tablosundan gelir
                  (ABD’de pazar, bazı bölgelerde cumartesi, diğerlerinde pazartesi). {to('i18n', 'Yerel ayarlar → Hafta başlangıcı')}.
                </>
              ),
            },
            {
              name: 'weekdayFormat',
              type: "'narrow' | 'short' | 'long'",
              default: "'short'",
              description: (
                <>
                  Hafta günü başlıklarının uzunluğu (Intl; {c('M')}, {c('Mon')}, {c('Monday')}); ekran okuyucu yine tam adı okur.{' '}
                  {c('formatWeekday')} verildiğinde yok sayılır. {to('i18n', 'Yerel ayarlar → Hafta başlangıcı')}.
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
                  Ay başlığı metnini kendiniz döndürürsünüz (bu metin {c('renderMonthHeader')}’a {c('title')} olarak da gelir ve ızgaranın etiketi olur).
                  Başlığın HTML’ini değiştirmek için {c('renderMonthHeader')} kullanın. Canlı örneği yok; bkz.{' '}
                  {to('api-messages', 'Mesajlar ve biçimlendirme')}.
                </>
              ),
            },
            {
              name: 'formatWeekday',
              type: '(weekday: Weekday, locale: string) => ReactNode',
              description: (
                <>
                  Her hafta günü başlığının görünen içeriği (örneğin tek bir harf veya bir simge); ekran okuyucu yine yerelleştirilmiş tam adı okur. Canlı örneği yok; bkz. {to('i18n', 'Yerel ayarlar, hafta başı ve RTL')}.
                </>
              ),
            },
            {
              name: 'formatDayLabel',
              type: '(date: CalendarDate, locale: string) => string',
              description: (
                <>
                  Her günün ekran okuyucu etiketinin ve {c('day.label')}’ın tarih kısmı (varsayılan: hafta günü, gün, ay ve yıl). “Bugün”, “seçili” gibi
                  durumlar ve günün neden seçilemediği yine eklenir. Canlı örneği yok; bkz. {to('accessibility', 'Klavye ve erişilebilirlik')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Render ve tooltip’ler">
        <p>
          Render prop’ları varsayılan arayüzün parçalarını değiştirir; durum, klavye yönetimi ve ARIA takvimde kalır. Render fonksiyonlarını sabit tutun
          (modül kapsamı veya <code>useCallback</code>): bir gün yalnızca durumu, verisi veya bu fonksiyonlar değiştiğinde yeniden render edilir. Slot
          davranışının ayrıntıları: {to('styling-reference', 'Stil başvurusu → Slotlar')}.
        </p>
        <PropsTable
          caption="Gün render ve tooltip prop’ları"
          rows={[
            {
              name: 'renderDay',
              type: '(props: DayRenderProps<TDayData>) => ReactNode',
              description: (
                <>
                  Etkileşimli gün öğesinin tamamını siz render edersiniz. Öğeye {c('getDayProps()')} sonucunu yayın (ref, roving {c('tabIndex')}, ARIA,{' '}
                  {c('data-*')}, işleyiciler); kendi işleyicilerinizi de onun üzerinden verin ve takvimin o olayı işlemesini istemiyorsanız içlerinde{' '}
                  {c('preventDefault()')} çağırın. Düğme olmayan öğelerde Enter/Space’i takvim işler. {c('renderDayContent')} ile birlikte verilirse bu geçerli
                  olur.{' '}
                  {to('styling', 'Stil → renderDay ve getDayProps')}.
                </>
              ),
            },
            {
              name: 'renderDayContent',
              type: '(ctx: DayRenderContext<TDayData>) => ReactNode',
              description: (
                <>
                  Yalnızca varsayılan gün düğmesinin içini değiştirir (sayı ve {c('DefaultDayData')} çizimi); düğme, halka, bant ve ARIA olduğu gibi kalır. İçine
                  etkileşimli öğeler koymayın. {c('renderDay')} verildiğinde yok sayılır. {to('styling', 'Stil → renderDayContent')}.
                </>
              ),
            },
            {
              name: 'getDayTooltip',
              type: '(ctx: DayRenderContext<TDayData>) => TooltipContent | null | undefined',
              description: (
                <>
                  Her günün tooltip’i. Verildiğinde varsayılan tooltip’lerin (devre dışı bir günün neden seçilemediği ve “Bugün”) <strong>yerine geçer</strong>;
                  sebepleri yine göstermek için {c('day.reasonText')} döndürün. {c('{ content, persistent: true }')} tooltip’i fareyle üzerine gelinmeden
                  gösterir (birden çok gün varsa ilki); örneğin “Çıkış tarihinizi seçin”. Yükleme sırasında yer tutucu olarak çizilen günlerde tooltip
                  gösterilmez. {to('tooltip', 'Tooltip')}.
                </>
              ),
            },
            {
              name: 'renderDayTooltip',
              type: '(props: DayTooltipRenderProps) => ReactNode',
              description: (
                <>
                  Açık tooltip’in içeriğini {c('day')}, {c('content')}, {c('trigger')} ve gerçekte kullanılan {c('placement')} ile siz render edersiniz;
                  konumlandırılmış kutu, ok ve {c('aria-describedby')} bağlantısı takvimde kalır. {to('styling-reference', 'Stil başvurusu → Slotlar')}.
                </>
              ),
            },
            {
              name: 'tooltip',
              type: 'TooltipOptions',
              description: (
                <>
                  Gün tooltip’lerinin nerede ve nasıl açılacağı: {c('placement')} (tercih edilen taraf, varsayılan {c("'top'")}; sığmazsa diğer taraflar denenir), {c('boundary')} (varsayılan{' '}
                  {c("'calendar'")} veya {c("'viewport'")}), {c('offset')} (varsayılan 8 px), {c('className')}, {c('container')} (portal hedefi,
                  varsayılan {c('document.body')}; modal içinde dialog öğesini verin) ve {c('openDate')} (controlled açık gün: hangi günün tooltip’inin açık
                  olduğunu siz belirlersiniz, {c('null')} = kapalı; yalnızca içeriği olan günler açılır). {to('tooltip', 'Tooltip')}, {to('placement', 'Satır içinde, diyalogda veya popover’da')}.
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
                  {c('formatDate')} ve {c('ctx.actions')}’ı (controller) içerir; bu yüzden ref gerekmez. {c('null')} döndürürseniz sarmalayıcı da render
                  edilmez.{' '}
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
                  {c('renderNavigation')} varsa veya sürekli gezinmede {c('null')}’dır). Bu durumda ayın adı {c('aria-label')} ile verilir.{' '}
                  {to('slots', 'Slotlar → Gezinme ve ay başlıkları')}.
                </>
              ),
            },
            {
              name: 'renderNavigation',
              type: '(props: NavigationRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Yalnızca sayfalı modda: ayların üstünde, varsayılan okların yerine geçen tek bir gezinme çubuğu. {c('previous()')}/{c('next()')}{' '}
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
                  Görünür bir yükleme göstergesi; varsayılan olarak yalnızca tarihler yüklenirken gösterilen boş yer tutucular ve ekran okuyucu metni vardır.
                  Her {c('scope')} için çağrılır: {c("'initial'")} (ilk yüklemede {c('loading')}), {c("'month'")} (yüklenen her ay; yer tutucular
                  görünmeye devam eder) ve {c("'load-more'")} (yeni eklenen aylar). Arka plan yenilemesinde çağrılmaz. {to('loading', 'Yükleme ve hatalar → Görünür bir yükleme göstergesi')}.
                </>
              ),
            },
            {
              name: 'renderError',
              type: '(props: ErrorRenderProps, ctx: SlotContext) => ReactNode',
              description: (
                <>
                  Durumu {c("'error'")} olan her ayda varsayılan hata kutusunun yerine geçer; {c('retry()')}, {c('onRetry([month])')}’i çağırır. Canlı
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
                  yerine kendi içeriğiniz. {c('minDate')}/{c('maxDate')} sınırında da {c('canLoad: false')} ile çağrılır (orada varsayılan düğme
                  gösterilmez ve {c('loadMore()')} hiçbir şey yapmaz); böylece devre dışı bir düğme veya bir mesaj gösterebilirsiniz.{' '}
                  {to('load-more', 'Daha fazla ay yükleme → renderLoadMore')}.
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
                  Takvimin kök öğesinin sınıfı ve satır içi stili; sınıf, varsayılan {c('cal-root')} sınıfından sonra eklenir. Tema değişkenlerini ({c('--cal-accent')}, …) burada veya CSS’te ayarlayın;
                  boyut değişkenleri {c('--cal-day-min-w/h')}, {c('--cal-day-max')} ve {c('--cal-month-gap')} ise her zaman prop’lardan hesaplanan
                  değerle yazılır. {to('styling', 'Stil → CSS değişkenleri')}.
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
                  {c('(day) => string | undefined')} da kabul eder. Nesneyi sabit tutun: her render’da yeni bir nesne tüm günleri yeniden render ettirir.{' '}
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
                  Tüm varsayılan {c('cal-*')} sınıflarını kaldırır, böylece stil dosyası hiçbir öğeye uygulanmaz; stilleri {c('classNames')} ve {c('data-*')}{' '}
                  nitelikleriyle verin. Yerleşim hesabı yine de {c('minDaySize')} ve ay başına 8 px iç boşluk varsayar. {to('styling', 'Stil → unstyled')}.
                </>
              ),
            },
            {
              name: 'id',
              type: 'string',
              default: <>otomatik üretilir (<code>useId</code>)</>,
              description: (
                <>
                  Kök öğenin id’si; olaylarda, controller’da ve slot bağlamı {c('ctx')}’te {c('instanceId')} olarak da bulunur. İç id’ler bundan türetilir:{' '}
                  {c('<id>-tooltip')} (günün {c('aria-describedby')}’ı), {c('<id>-months')}, {c('<id>-day-<date>')}. Testlerde sabit id’ler için veya
                  ortak bir işleyicide takvimleri ayırt etmek için verin; sayfada benzersiz olmalıdır. {to('api-controller', 'Controller → instanceId')}.
                </>
              ),
            },
            {
              name: 'aria-label',
              type: 'string',
              default: <><code>messages.calendar</code> (“Calendar”)</>,
              description: (
                <>
                  Takvimin ekran okuyucunun okuduğu adı. Bir sayfada birden çok takvim varsa her birine ayrı bir ad verin (“Giriş”, “Dönüş tarihi”).{' '}
                  {to('accessibility', 'Klavye ve erişilebilirlik')}.
                </>
              ),
            },
            {
              name: 'ref',
              type: 'Ref<CalendarController>',
              description: (
                <>
                  Takvimi kendi kodunuzdan yöneten controller (imperative API); örneğin takvimin dışındaki bir “Tarihleri temizle” düğmesi için: {c('goToMonth')}, {c('next')}/{c('previous')}, {c('loadMore')}, {c('clear')}, {c('reset')},{' '}
                  {c('select')}, {c('setActiveEndpoint')}, {c('focusDate')}, {c('getSnapshot')}. Slotların içinde aynı nesne {c('ctx.actions')} olarak gelir.{' '}
                  {to('api-controller', 'Controller (ref)')}, {to('go-to-month', 'Ayı koddan değiştirme')}.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Olay callback’leri">
        <p>
          Hepsi isteğe bağlıdır; her biri <code>instanceId</code> içeren tipli bir olay alır. Olay alanları, kaynaklar ve sıralama{' '}
          {to('api-events', 'Callback’ler ve olaylar')} sayfasında anlatılır. <code>onChange</code>, Seçim bölümünde listelenir.
        </p>
        <PropsTable
          caption="Olay callback’leri"
          rows={[
            ev('onReady', '(e: ReadyEvent) => void', 'Her mount’ta bir kez, ilk ölçümden sonra, yerleşim bilgisiyle.'),
            ev('onDateClick', '(e: DateClickEvent) => void', 'Bir güne her tıklandığında veya Enter/Space’e basıldığında (gün seçilebilir olsun ya da olmasın); gün durumu ve varsa sorunla birlikte.'),
            ev('onSelectionComplete', '(e: SelectionCompleteEvent) => void', 'Geçerli bir seçim tamamlandı: tekli seçim (seçili tarihi yeniden seçmek dahil), aralığın iki ucu, çoklu modda maxSelections’a ulaşılması ya da select() ile geçerli yeni bir değer verilmesi.'),
            ev('onSelectionClear', '(e: SelectionClearEvent) => void', 'Seçim boşaldı (clear(), boş değere reset(), son tarihin kaldırılması, …).'),
            ev('onInvalidSelection', '(e: InvalidSelectionEvent) => void', 'Seçilemeyen bir güne tıklandı ya da select() geçersiz bir değer aldı (seçim değişmez; tekrarlar da her seferinde bildirilir); sorunu ve yerelleştirilmiş mesajını taşır. e.date, CalendarDate | null’dır: reddedilen bir select()’in günü yoksa null.'),
            ev('onValidationChange', '(e: ValidationChangeEvent) => void', 'Mevcut seçimin geçerliliği değişti; mount’ta da gelir ve kurallar, veri veya bugünün tarihi değiştiğinde de gelebilir.'),
            ev('onActiveEndpointChange', '(endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void', 'Aralık modu: sonraki tıklamanın belirleyeceği uç değişti (activeEndpoint controlled ise bir istektir).'),
            ev('onVisibleMonthChange', '(month: CalendarMonth, e: VisibleMonthChangeEvent) => void', 'Referans ayın değişmesi istendi (oklar, klavye, goToMonth()); prop değişikliklerinde veya ay aynı kaldığında gelmez (ör. maxDate’te next()).'),
            ev('onVisibleMonthsChange', '(e: VisibleMonthsChangeEvent) => void', 'Ekrandaki aylar değişti; sürekli modda kaydırmayla olanlar dahil.'),
            ev('onRenderedMonthsChange', '(e: RenderedMonthsChangeEvent) => void', 'DOM’a ay eklendi veya DOM’dan ay kaldırıldı (mount’ta da gelir): veri isteklerini burada başlatın.'),
            ev('onLoadMore', '(e: LoadMoreEvent) => void', 'Sürekli modda bir düğme, otomatik yükleme veya ref.loadMore() ile ay eklendi.'),
            ev('onLoadingChange', '(e: LoadingChangeEvent) => void', 'LoadingSnapshot değişti (ilk yükleme, yenileme, yüklenen veya hatalı aylar).'),
            ev('onResize', '(e: ResizeEvent) => void', 'Kök öğe ilk kez ölçüldü ya da boyutu resizeThreshold’dan fazla değişti.'),
            ev('onLayoutChange', '(e: LayoutChangeEvent) => void', 'Sütunlar, etkin ay sayısı, etkin taşma stratejisi veya en küçük boyut durumu değişti.'),
            ev('onDayFocusChange', '(e: DayFocusChangeEvent) => void', 'Odaklanan gün değişti (klavye, tıklama veya focusDate()).'),
            ev('onTooltipOpenChange', '(e: TooltipOpenChangeEvent) => void', 'Bir günün tooltip’i açıldı, kapandı veya başka bir güne geçti; tooltip’i neyin açtığıyla birlikte.'),
            ev('onOutsideClick', '(e: OutsideClickEvent) => void', 'Takvimin ve portal’larının (tooltip, slotlarınızdaki popover’lar) dışında bir pointerdown: takvimi gösteren popover’ı burada kapatın.'),
            ev('onScroll', '(e: ScrollEvent) => void', 'Aylar alanı kaydırıldı; animasyon karesi başına en fazla bir kez.'),
            ev('onEvent', '(e: CalendarEvent) => void', 'Change dahil her olay, kendi callback’inden sonra.'),
          ]}
        />
      </Section>
    </Page>
  );
}

const typeLinks: readonly (readonly [string, ReactNode, string, string])[] = [
  ['CalendarDate, CalendarMonth, Weekday, DateParts', 'Çalışma anında “YYYY-MM-DD” / “YYYY-MM” biçiminde düz string’ler; TypeScript’te branded type’tır, yani ayrı tipler oldukları için tarih beklenen yere sıradan bir string verilemez. Weekday’de 0 = pazar; DateParts { year, month, day }.', 'api-dates', 'Tarih yardımcıları'],
  ['SelectionRules, DayAvailability, RuleContext', 'Kural kümesi, gün başına sonuç ve ctx: kural callback’lerinin ikinci argümanı (bugün, mevcut seçim, ruleContext değeriniz).', 'api-rules', 'Kurallar ve adaptörler'],
  ['StayRulesOptions, StayDayStatus, StayReason', 'stayRules() seçenekleri, gece başına durumları ve sebep etiketleri.', 'api-rules', 'Kurallar ve adaptörler'],
  ['DayRangeRulesOptions, DayRangeStatus', 'dayRangeRules() seçenekleri ve gün başına durumları.', 'api-rules', 'Kurallar ve adaptörler'],
  ['RelaxScheduleOptions', '{ weekdays?: boolean; length?: boolean }, ikisinin de varsayılanı true (bkz. relaxSchedule).', 'api-rules', 'Kurallar ve adaptörler'],
  ['SelectionEngine, SelectionEngineInput, ActivationPlan', 'Takvimin arkasındaki, React olmadan da kullanılabilen (headless) seçim motoru ve plan(date)’in döndürdüğü değer.', 'api-rules', 'Kurallar ve adaptörler'],
  ['CalendarMessages, CalendarMessagesInput, ReasonMessage, MessageFormatHelpers', 'Metin paketi, kısmi değişiklikler (İngilizceyle tamamlanır) ve sebep fonksiyonları.', 'api-messages', 'Mesajlar ve biçimlendirme'],
  ['CalendarController, GoToMonthOptions, GoToMonthResult, CalendarSnapshot', 'Ref API’si (takvimi koddan yöneten metotlar) ve mevcut durumun anlık görüntüsü (snapshot).', 'api-controller', 'Controller (ref)'],
  ['CalendarEvent, CalendarEventType, EventSource, ReadyEvent … ScrollEvent', 'Tüm olay nesneleri, birleşim tipi ve kaynak değerleri.', 'api-events', 'Callback’ler ve olaylar'],
  ['CalendarLayout, LoadingSnapshot', 'onLayoutChange / onReady ve onLoadingChange olaylarının içerdiği nesneler.', 'api-events', 'Callback’ler ve olaylar'],
  ['CalendarPart, ClassNameValue', 'classNames anahtarları ve değer tipleri.', 'styling-reference', 'Stil başvurusu'],
  ['MonthHeaderRenderProps, NavigationRenderProps, LoadingRenderProps, ErrorRenderProps, LoadMoreRenderProps, DayTooltipRenderProps', 'Slotların prop’ları.', 'styling-reference', 'Stil başvurusu'],
  ['DefaultDayData', 'getDayData’nın döndürebileceği, varsayılan gün içeriğinin çizdiği biçim (etiket, badge, simge, noktalar).', 'day-content', 'Günlerde etiket, badge ve simge'],
];

export function TypesReference() {
  return (
    <Page
      title="Tipler"
      lead={
        <>
          Genel API’nin dışa aktarılan tüm tipleri. Hepsi <code>calendar-kit</code>’ten dışa aktarılır; React tipleri ayrıca <code>calendar-kit/client</code>’tan,
          React’ten bağımsız olanlar ayrıca <code>calendar-kit/core</code>’dan. Başka sayfalarda ayrıntılı anlatılan tipler önce bağlantılarıyla listelenir;
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
type RangeEndpoint = 'start' | 'end'          // sonraki tıklamanın belirlediği uç
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
          göre etiketlenmiş değerdir. <code>SelectionState</code> buna etkin ucu ekler; motorun girdi olarak aldığı ve <code>ActivationPlan.next</code>{' '}
          olarak döndürdüğü durumdur.{' '}
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

type ActivationKind =      // bir güne tıklamanın şu anda ne yapacağı (day.action)
  | 'select'      // tekli (zaten seçili olan tarih de)
  | 'start'       // aralık: yeni başlangıç
  | 'complete'    // aralık: bitiş seçildi veya sabit uzunluklu aralık
  | 'toggle-on' | 'toggle-off'   // çoklu
  | 'clear'       // aralık: aynı gün seçimi kapalıyken, bitişi olmayan başlangıca yeniden tıklama
  | 'none'        // salt okunur mod
  | 'rejected'`}</pre>
        <p>
          Sorunlar size <code>day.reason</code> olarak ve <code>onInvalidSelection</code>, <code>onValidationChange</code> ile <code>ref.select()</code>{' '}
          üzerinden ulaşır. Her <code>ReasonCode</code>’un <code>messages.reasons</code> içinde bir metni vardır ({to('api-messages', 'Mesajlar')}); bunları
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
  disabled: boolean        // şu anda seçilemez, tıklanırsa seçim değişmez (sebep: reason); yine odaklanılabilir
  unavailable: boolean     // hiçbir aşamada seçilemez (kapalı, sınır dışı, veri yok)
  readOnly: boolean
  selected: boolean; selectedSingle: boolean; selectedStart: boolean; selectedEnd: boolean
  inRange: boolean         // başlangıç ile bitiş arasında (uçlar hariç)
  included: boolean        // rangeSemantics’e göre seçime dahil
  inPreviewRange: boolean; previewStart: boolean; previewEnd: boolean   // üzerine gelme/odak önizlemesi
  focused: boolean; hovered: boolean
  action: ActivationKind   // bir tıklamanın ne yapacağı
  canStart: boolean; canEnd: boolean; canPassThrough: boolean
  outOfSchedule: boolean   // kısıtlama takvim düzeni (schedule) kuralından gelir (bkz. relaxSchedule)
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

// getDayProps’a verebilecekleriniz: nitelikleriniz ve işleyicileriniz
type DayPropsInput = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref?: Ref<HTMLElement>
  // <button> için vermeyin (type="button" yazılır); başka bir öğe için null:
  // type niteliği yazılmaz, siz bir role vermedikçe role="button" eklenir, Enter/Space seçer
  type?: 'button' | null
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}

// Döndürdüğü: öğenize yayacağınız birleştirilmiş nitelikler
type DayProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  ref: (el: HTMLElement | null) => void
  type?: 'button'
  tabIndex: number
  [dataAttr: \`data-\${string}\`]: string | number | boolean | undefined
}`}</pre>
        <p>
          <code>DayState</code>; render prop’larına, <code>modifiers</code>’a, tooltip callback’lerine ve <code>classNames</code> fonksiyonlarına verilir;
          aynı durum günde <code>data-*</code> nitelikleri olarak da bulunur ({to('styling-reference', 'Stil başvurusu')}). <code>DayRenderContext</code>,{' '}
          <code>renderDayContent</code> ve <code>getDayTooltip</code>’in argümanıdır; <code>DayRenderProps</code> ise <code>renderDay</code>’in.{' '}
          <code>getDayProps</code>’ta önce sizin işleyicileriniz çalışır; <code>onClick</code>, <code>onKeyDown</code>, <code>onPointerEnter</code> veya{' '}
          <code>onFocus</code> içinde <code>event.preventDefault()</code> çağırırsanız takvim o olayı işlemez; <code>ref</code>, <code>className</code> ve{' '}
          <code>aria-describedby</code> değerleriniz birleştirilir. <code>&lt;button&gt;</code> olmayan bir öğeye yayarken <code>type: null</code> verin (
          {to('styling', 'Stil → renderDay ve getDayProps')}).
        </p>
      </Section>

      <Section title="Tooltip’ler">
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
  openDate?: CalendarDate | null    // controlled açık gün; null = kapalı, undefined = uncontrolled
}

interface DayTooltipRenderProps {
  day: DayState; content: ReactNode; trigger: TooltipTrigger; placement: TooltipPlacement
}`}</pre>
        <p>
          <code>TooltipContent</code>, <code>getDayTooltip</code>’in döndürdüğü değerdir; <code>persistent: true</code> içeren nesne biçimi tooltip’i
          fareyle üzerine gelmeden veya odak olmadan gösterir. <code>calendar</code> tooltip’i takvimin aylar alanı içinde tutar; <code>viewport</code> ise
          takvimin dışına taşmasına, pencerenin içinde kalmasına izin verir. <code>TooltipTrigger</code> tooltip’in neden açık olduğunu söyler (<code>renderDayTooltip</code>{' '}
          ve <code>onTooltipOpenChange</code> içinde). Bkz. {to('tooltip', 'Tooltip')}.
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
          <code>SlotContext</code> (slot bağlamı, genellikle <code>ctx</code> diye adlandırılır) slotlara mevcut durumu ve controller’ı verir:{' '}
          {c('renderHeader')} ve {c('renderFooter')}’ın tek argümanı, {c('renderMonthHeader')}, {c('renderNavigation')}, {c('renderLoading')},{' '}
          {c('renderError')} ve {c('renderLoadMore')}’un ikinci argümanıdır. <code>formatDate</code> varsayılan olarak takvimin yerel ayarında uzun
          biçimli bir tarih üretir ({c('en-US')}’de “November 13, 2026”, tr-TR’de “13 Kasım 2026”). <code>CalendarClassNames</code>, <code>classNames</code>’in tipidir; anahtarları{' '}
          {to('styling-reference', 'Stil başvurusu')} sayfasında listelenen <code>CalendarPart</code> adlarıdır.
        </p>
      </Section>
    </Page>
  );
}
