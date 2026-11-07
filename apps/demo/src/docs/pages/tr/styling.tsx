import getDayProps from '../../../snippets/styling/getDayProps.tr.tsx?code';
import setup from '../../../snippets/styling/setup.tr.tsx?code';
import statusSlots from '../../../snippets/styling/statusSlots.tr.tsx?code';
import unstyled from '../../../snippets/styling/unstyled.tr.tsx?code';
import { Example, Snippet } from '../../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../../ui';

export function Styling() {
  return (
    <Page
      title="Stil ve özelleştirme"
      lead="Varsayılan temayla başlayın ve yalnızca ihtiyacınız kadar ilerleyin: önce değişkenler, sonra sınıflar ve durum nitelikleri, sonra özel içerik, en son kendi HTML yapınız."
    >
      <PropsTable
        caption="Hangi yaklaşım?"
        rows={[
          { name: <>CSS değişkenleri</>, type: <>renkler, köşe yarıçapı, boyutlar</>, description: 'Tema (marka renkleri, koyu mod). En ucuz yol; HTML yapısına yönelik seçici gerekmez.' },
          { name: 'classNames', type: <>parçalar</>, description: 'Tasarım sisteminizin sınıflarını belirli parçalara eklemek.' },
          { name: <><code>data-*</code> öznitelikleri</>, type: <>durum</>, description: 'Durumları (seçili, aralıkta, devre dışı, kendi modifier’larınız) kendi CSS’inizden stillemek.' },
          { name: 'renderDayContent', type: <>günün içi</>, description: 'Varsayılan, erişilebilir gün düğmesinin içinde farklı içerik.' },
          { name: 'renderDay + getDayProps', type: <>günün tamamı</>, description: 'Klavye, odak, ARIA ve seçimi koruyarak kendi gün öğeniz.' },
          { name: 'unstyled', type: <>her şey</>, description: 'Hiçbir varsayılan sınıf yok; her parçayı siz stillersiniz.' },
        ]}
      />
      <Section title="Varsayılan tema">
        <p>
          <code>calendar-kit/styles.css</code> dosyasını kendi CSS’inizden önce bir kez içe aktarın. Tüm görsel kurallar takvim kökünde tanımlanan CSS
          değişkenlerini okur; bu yüzden temaların çoğu hiç seçici gerektirmez. Hiçbir kural <code>!important</code> kullanmaz. Bugün, hover ve yükleme
          iskeleti (skeleton) <code>:where()</code> içine sarılıdır ve özgüllük eklemez; seçili, devre dışı, müsait değil ve aralık uçları stilleri en
          fazla üç sınıflık düz seçicilerdir — bunları değiştirmek için değişkenleri (<code>--cal-accent</code>, <code>--cal-range</code>, …) ya da en
          az aynı özgüllükte bir seçici kullanın. Her değişken, sınıf ve nitelik için <a href="#/styling-reference">Stil referansı</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="CSS değişkenleri">
        <p>
          Değişkenleri kökte <code>className</code> ya da <code>style</code> ile ayarlayın. Kullanılabilenler: <code>--cal-color</code>,{' '}
          <code>--cal-muted</code>, <code>--cal-bg</code>, <code>--cal-accent</code>, <code>--cal-accent-contrast</code>, <code>--cal-range</code>,{' '}
          <code>--cal-preview</code>, <code>--cal-hover</code>, <code>--cal-focus</code>, <code>--cal-today</code>, <code>--cal-ring</code>,{' '}
          <code>--cal-danger</code>, <code>--cal-radius</code>, <code>--cal-circle</code>, <code>--cal-font</code> ve araç ipucu değişkenleri{' '}
          <code>--cal-tooltip-bg</code>, <code>--cal-tooltip-color</code>, <code>--cal-tooltip-shadow</code>, <code>--cal-tooltip-max-width</code>{' '}
          (portal ile render edilen araç ipucuna kopyalanır).
        </p>
        <Example src="styling/CssVariables" title="Değişkenlerle koyu tema" />
      </Section>
      <Section title="classNames">
        <p>
          Parçalar: <code>root, header, footer, viewport, months, month, monthHeader, monthTitle, navigation, navButton, weekdays, weekday, grid, week, dayCell,
          dayButton, dayContent, rangeBackground, tooltip, loadMore, loading, error, liveRegion, readOnlyNotice</code>. <code>dayCell</code>,{' '}
          <code>dayButton</code> ve <code>dayContent</code>, günün durumunu alan bir fonksiyon da kabul eder.
        </p>
        <Example src="styling/ClassNames" title="classNames" />
      </Section>
      <Section title="Durum nitelikleri ve modifier’lar">
        <p>
          Gün hücreleri ve düğmeleri <code>data-today</code>, <code>data-past</code>, <code>data-disabled</code>, <code>data-unavailable</code>,{' '}
          <code>data-selected</code>, <code>data-range-start</code>, <code>data-range-end</code>, <code>data-in-range</code>, <code>data-preview</code>,{' '}
          <code>data-focused</code>, <code>data-loading</code>, <code>data-reason</code>, <code>data-mod-*</code> ve daha fazlasını taşır; hücrelerde ayrıca{' '}
          <code>data-band=&quot;start | mid | end&quot;</code> bulunur. CSS’iniz iç sınıf adlarına bağlı kalmasın diye bunları kendi sınıflarınızla birlikte
          kullanın.
        </p>
        <Example src="styling/DataAttributes" title="Modifier’lar ve data nitelikleri" />
      </Section>
      <Section title="renderDayContent">
        <Example src="styling/DayContentRender" title="Özel gün içeriği" />
      </Section>
      <Section title="renderDay ve getDayProps">
        <p>
          <code>getDayProps</code>; ref’i (araç ipucu çapası, gezici odak), <code>tabIndex</code>’i, ARIA niteliklerini, <code>data-*</code> durumunu ve olay
          işleyicilerini sizinkilerle birleştirir. Bir <code>&lt;button&gt;</code> üzerinde <code>getDayProps(yourProps)</code> şeklinde çağırın:{' '}
          <code>type=&quot;button&quot;</code> yazar.
        </p>
        <Example src="styling/RenderDay" title="Özel gün öğesi" />
        <p>
          Düğme olmayan bir öğe için (bir <code>&lt;div&gt;</code>, bir <code>&lt;span&gt;</code>) <code>type: null</code> verin:{' '}
          <code>getDayProps(&#123; type: null &#125;)</code> hiçbir <code>type</code> niteliği yazmaz ve kendi <code>role</code>’ünüzü vermediğiniz sürece{' '}
          <code>role=&quot;button&quot;</code> ekler. Odak bir düğmedekiyle tamamen aynı çalışır: sekme sırasında tek bir gün bulunur (gezici (roving){' '}
          <code>tabIndex</code>) ve ok, Page ve Home/End tuşları günler arasında gezinir. Enter ve Space odaktaki günü seçer; düğme olmayan bir öğede bu
          tuşları takvim kendisi işler, yerel bir düğme ise bunları tıklamaya çevirir.
        </p>
        <Example src="styling/RenderDayDiv" title="Gün öğesi olarak bir div" />
      </Section>
      <Section title="unstyled">
        <p>
          Hiçbir varsayılan sınıf adı eklenmez, bu yüzden varsayılan temanın hiçbir kısmı uygulanmaz — hafta satırı ızgaraları ve gün hücresi boyutları dahil.
          Satır içi kalanlar yalnızca ay ızgarası (sütunlar), viewport’un taşma ayarı ve boyut değişkenleridir; haftaları ve günleri siz yerleştirirsiniz
          (örnek 7 sütunlu bir ızgara kullanır). Gün boyutunuzu <code>minDaySize</code> ile tutarlı tutun: takvim kaç ayın sığacağına bununla karar verir.
        </p>
        <Example src="styling/Unstyled" title="Stilsiz takvim" />
      </Section>
      <Note>
        <p>
          <code>renderDayContent</code> içine asla düğme veya bağlantı koymayın: gün zaten bir düğmedir. Gün içinde bir eylem gerekiyorsa günü kendiniz render
          edin (<code>renderDay</code>) ve eylemi düğmenin dışına, örneğin bir araç ipucuna veya bir slota taşıyın.
        </p>
      </Note>
    </Page>
  );
}

const c = (s: string) => <code>{s}</code>;
const yes = 'var';

export function StylingReference() {
  return (
    <Page
      title="Stil referansı"
      lead="Varsayılan temanın ve HTML yapısının stil için sunduğu her şey: classNames parçaları ve her birinin uygulandığı öğe, CSS değişkenleri, data-* durum nitelikleri, modifier’lar, slotlar ve cascade’in nasıl kullanılması gerektiği."
    >
      <Section title="classNames">
        <p>
          <code>classNames</code> bir parçaya sizin sınıfınızı ekler. Varsayılan (stilli) modda varsayılan <code>cal-*</code> sınıfının yanına eklenir;{' '}
          <code>unstyled</code> ile tek sınıf odur. Kök ayrıca <code>classNames.root</code>’tan sonra <code>className</code> prop’unu da alır. Render
          edilmeyen parçalar (bir slot yerlerine geçtiyse ya da özellik kapalıysa) hiçbir şey almaz.
        </p>
        <DataTable
          caption="classNames anahtarları"
          head={['Anahtar', 'Varsayılan sınıf', 'Öğe', 'Ne zaman render edilir']}
          rows={[
            [c('root'), c('cal-root'), <>Dıştaki {c('div[role=group]')}. Kökün data-* niteliklerini, tema değişkenlerini ve satır içi boyut değişkenlerini taşır.</>, 'Her zaman.'],
            [c('readOnlyNotice'), c('cal-readonly-notice'), <>Göz simgeli {c('<p>')}, kökün ilk çocuğu.</>, <>{c('mode="readonly"')} ve {c('messages.readOnlyNotice')} boş değilse.</>],
            [c('header'), c('cal-header'), <>{c('renderHeader')} sonucunu saran {c('div')}.</>, <>{c('renderHeader')}; {c('null')}, {c('undefined')} veya {c('false')} dışında bir şey döndürdüğünde.</>],
            [c('navigation'), c('cal-navigation'), <>{c('renderNavigation')} sonucunu saran, ayların üstündeki {c('div')}.</>, <>{c('renderNavigation')} ayarlıysa ve {c('navigation="paged"')} ise.</>],
            [c('weekdays'), c('cal-weekdays'), <>Hafta günü adlarının satırı: her ay ızgarasının içinde bir {c('row')}, ya da tek sütunlu sürekli gezinmede viewport’un üstünde tek bir ortak satır (varsayılan temada yapışkan/sticky).</>, 'Her zaman.'],
            [c('weekday'), c('cal-weekday'), <>Her hafta günü adı için bir {c('span')} (ızgara içinde {c('columnheader')}).</>, 'Her zaman.'],
            [c('viewport'), c('cal-viewport'), 'Tüm ayları (ve daha fazla ay yükleme alanlarını) saran kaydırma kabı.', 'Her zaman.'],
            [c('months'), c('cal-months'), 'Ay bölümlerinin ızgarası.', 'Her zaman.'],
            [c('month'), c('cal-month'), <>Her ay için bir {c('<section>')}. {c('data-month')}, {c('data-status')}, {c('data-skeleton')} taşır.</>, 'Render edilen her ay için.'],
            [c('monthHeader'), c('cal-month-header'), 'Ay başlığını ve varsayılan okları içeren satır.', <>{c('renderMonthHeader')} yoksa (bu slot satırın tamamının yerine geçer).</>],
            [c('monthTitle'), c('cal-month-title'), <>Ay adını içeren {c('<h2>')}.</>, <>{c('renderMonthHeader')} yoksa.</>],
            [c('navButton'), c('cal-nav-button'), <>{c('data-direction')} taşıyan varsayılan önceki / sonraki {c('<button>')}. Önceki ilk ay başlığında, sonraki ilk satırın son başlığında (yatay) ya da ilk başlıkta (dikey) bulunur.</>, <>{c('navigation="paged"')} ve {c('renderNavigation')} yoksa. Ay başlığınız render ederse {c('MonthHeaderRenderProps.navigation')} içinde de.</>],
            [c('grid'), c('cal-grid'), <>Her ay için bir {c('div[role=grid]')} (hafta günü satırı + haftalar).</>, 'Her ay için.'],
            [c('week'), c('cal-week'), <>Her hafta için bir {c('div[role=row]')}.</>, 'Her hafta için.'],
            [c('dayCell'), c('cal-day'), <>Her gün için bir {c('div[role=gridcell]')}. Günün data-* niteliklerini, ayrıca {c('data-band')} ve {c('data-band-preview')} taşır. Fonksiyon kabul eder.</>, <>Her gün için. Baştaki/sondaki boş hücreler yalnızca {c('cal-day-empty')} alır, anahtarı yoktur.</>],
            [c('rangeBackground'), c('cal-range-bg'), <>Hücrenin içinde aralık veya önizleme bandını çizen {c('span')}.</>, <>Yalnızca çizilen bandın parçası olan hücrelerde ({c('data-band')} ayarlı).</>],
            [c('dayButton'), c('cal-day-button'), <>Gün {c('<button>')}’u ya da {c('renderDay')} ile {c('getDayProps')} üzerinden gelen kendi öğeniz. Günün data-* niteliklerini taşır. Fonksiyon kabul eder.</>, 'Her gün için.'],
            [c('dayContent'), c('cal-day-content'), <>Varsayılan düğmenin içinde, sayıyı ya da {c('renderDayContent')} çıktısını saran {c('span')}. Fonksiyon kabul eder.</>, <>{c('renderDay')} yoksa.</>],
            [c('tooltip'), c('cal-tooltip'), <>Portal ile render edilen {c('div[role=tooltip]')} ({c('document.body')} ya da {c('tooltip.container')} içinde). {c('tooltip.className')} ondan sonra eklenir. {c('data-placement')} taşır.</>, 'Bir gün araç ipucu açıkken.'],
            [c('loadMore'), c('cal-load-more'), <>{c('data-direction')} taşıyan varsayılan daha fazla ay yükleme {c('<button>')}’u.</>, <>{c('navigation="continuous"')}, {c('loadMore="button"')}, yüklenebilecek ay var ve {c('renderLoadMore')} yoksa.</>],
            [c('loading'), c('cal-loading'), <>{c('data-scope="initial"')} taşıyan varsayılan ilk yükleme göstergesi: hiç ay render edilmemişken ay ızgarasında bir spinner, ilk {c('loading')} sırasında da görsel olarak gizli bir durum metni.</>, <>Yalnızca ilk yükleme, {c('renderLoading')} olmadan. Ay ve daha fazla ay yüklemesinin bu sınıfla varsayılan bir öğesi yoktur (günler iskelet olarak çizilir).</>],
            [c('error'), c('cal-error'), <>Veri durumu {c('error')} olan bir ayda {c('div[role=alert]')}; {c('onRetry')} ayarlıysa bir {c('cal-retry')} düğmesiyle.</>, <>Ay durumu {c('error')} ve {c('renderError')} yoksa.</>],
            [c('liveRegion'), c('cal-live'), 'Duyurular için görsel olarak gizli aria-live bölgesi.', 'Her zaman (unstyled iken de satır içi stillerle görsel olarak gizli tutulur).'],
          ]}
        />
        <p>
          <code>CalendarPart</code>’ın 24 anahtarının tamamı bir yerde uygulanır, <code>rangeBackground</code> dahil. Bazı varsayılan sınıfların anahtarı
          yoktur; bunlar yalnızca çevrelerindeki parçalar üzerinden stillenebilir: <code>cal-day-empty</code>, <code>cal-day-number</code>,{' '}
          <code>cal-day-label</code>, <code>cal-day-badge</code>, <code>cal-day-icon</code>, <code>cal-day-markers</code>, <code>cal-day-marker</code> (her
          işaretçi gün verisinde kendi <code>className</code>’ini alır), <code>cal-retry</code>, <code>cal-load-more-area</code>, <code>cal-spinner</code> ve{' '}
          <code>cal-tooltip-arrow</code>.
        </p>
        <h3>Günün fonksiyonları: dayCell, dayButton, dayContent</h3>
        <p>
          Bu üçü <code>ClassNameValue = string | ((day: DayState) =&gt; string | undefined)</code> kabul eder. Fonksiyon her render’da her gün için çalışır
          ve <code>modifiers</code>, <code>renderDayContent</code> ve <code>renderDay</code> ile aynı <code>DayState</code>’i alır. Sınıf istemiyorsanız{' '}
          <code>undefined</code> döndürün.
        </p>
        <PropsTable
          caption="DayState"
          rows={[
            { name: 'date, month', type: 'CalendarDate, CalendarMonth', description: <>{c('YYYY-MM-DD')} ve {c('YYYY-MM')}.</> },
            { name: 'dayOfMonth, dayText, weekday, column', type: 'number, string, Weekday, number', description: <>Gün numarası, yerel ayara göre biçimlendirilmiş sayı, hafta günü (0 = Pazar), satırdaki 0–6 sütun (mantıksal; RTL’de de).</> },
            { name: 'label', type: 'string', description: 'Erişilebilir tam tarih etiketi.' },
            { name: 'today, past, future', type: 'boolean', description: 'Takvimin bugününe göre.' },
            { name: 'disabled', type: 'boolean', description: <>Şu anda etkinleştirilmesi reddedilir ({c('reason')} sebebini söyler). Yine de odaklanabilir.</> },
            { name: 'unavailable', type: 'boolean', description: 'Hiçbir aşamada seçilemez (kapalı, sınır dışı, veri eksik).' },
            { name: 'outOfSchedule', type: 'boolean', description: <>Kısıtlama düzenli takvimden (schedule) gelir (bkz. {c('relaxSchedule')}).</> },
            { name: 'readOnly', type: 'boolean', description: <>{c('mode="readonly"')}.</> },
            { name: 'selected, selectedSingle, selectedStart, selectedEnd', type: 'boolean', description: <>{c('selected')}, diğer üçünden herhangi biridir.</> },
            { name: 'inRange', type: 'boolean', description: 'Aralık başlangıcı ile bitişi arasında (uçlar hariç).' },
            { name: 'included', type: 'boolean', description: <>{c('rangeSemantics')}’e göre seçime sayılır (konaklamalarda bitiş hariçtir).</> },
            { name: 'inPreviewRange, previewStart, previewEnd', type: 'boolean', description: 'Üzerine gelinen (ya da klavyeyle odaklanılan) güne tıklamanın oluşturacağı aralık.' },
            { name: 'focused, hovered', type: 'boolean', description: 'Takvim içindeki klavye/DOM odağı bu günde; işaretçi bu günün üzerinde (dokunmatik değil).' },
            { name: 'action, canStart, canEnd, canPassThrough', type: 'ActivationKind, boolean…', description: 'Bir tıklamanın şu anda ne yapacağı ve günün müsaitliği.' },
            { name: 'dataStatus, loading', type: "DataStatus, boolean", description: <>Ayın veri durumu; {c('loading')}, ay yüklenirken ya da ilk yükleme sırasında true olur.</> },
            { name: 'reason, reasonText', type: 'ValidationIssue | null, string | null', description: 'Neden devre dışı/müsait değil olduğu ve yerelleştirilmiş metni.' },
            { name: 'modifiers', type: 'Record<string, boolean>', description: <>true döndüren {c('modifiers')} fonksiyonlarınız.</> },
            { name: 'weekStart, weekEnd, monthStart, monthEnd', type: 'boolean', description: 'Satırın ilk/son sütunu; ayın ilk/son günü.' },
          ]}
        />
        <Note>
          <p>
            Gün hücreleri memoize edilir ve <code>classNames</code>’i referansla karşılaştırır. Nesneyi (ve fonksiyonlarını) bileşenin dışında ya da{' '}
            <code>useMemo</code> ile tanımlayın; satır içi bir nesne, üst bileşenin her render’ında tüm günleri yeniden render eder.
          </p>
        </Note>
      </Section>

      <Section title="CSS değişkenleri">
        <p>
          Varsayılan tema herkese açık değişkenlerini <code>.cal-root</code> üzerinde tanımlar ve her rengi, köşe yarıçapını ve daire boyutunu bunlardan
          okur. Bunları kökte geçersiz kılın: <code>className</code> ile (<code>calendar-kit/styles.css</code>’ten sonra yüklenen bir stil dosyasında),{' '}
          <code>style</code> ile ya da bir durum seçicisiyle hücrede (aşağıdaki durum örneğine bakın). Kök bunları kendisi tanımladığı için{' '}
          <code>body</code> veya <code>.dark</code> gibi bir üst öğede ayarlanan değer takvime ulaşmaz; bunun yerine kökü seçin, örneğin{' '}
          <code>.dark .cal-root</code> ya da <code>.dark .my-calendar</code>. İstisnalar <code>--cal-font</code> (<code>inherit</code> olarak tanımlı) ve{' '}
          <code>--cal-tooltip-max-width</code>’tir (tanımlı değil); bunlar üst öğelerden miras alınır.
        </p>
        <DataTable
          caption="Herkese açık tema değişkenleri"
          head={['Değişken', 'Varsayılan', 'Etkilediği']}
          rows={[
            [c('--cal-font'), c('inherit'), 'Kökün font-family değeri (ve kökün font-family değerini kopyalayan araç ipucu).'],
            [c('--cal-color'), c('#1f2328'), 'Kökün metin rengi: gün sayıları, ay başlıkları, gezinme okları, rengi miras alan düğmeler.'],
            [c('--cal-muted'), c('#8b9198'), 'Hafta günü adları, devre dışı ve müsait olmayan gün sayıları, salt okunur bildirim metni, yükleme metni.'],
            [c('--cal-bg'), c('#fff'), 'Kök arka planı, ortak (yapışkan) hafta günü satırının arka planı ve odaklanan gün ile odak halkası arasındaki boşluk.'],
            [c('--cal-accent'), c('#1f2328'), 'Seçili gün dairesi, önizlenen aralık bitişinin dış çizgisi, gün rozetleri.'],
            [c('--cal-accent-contrast'), c('#fff'), 'Seçili dairedeki sayı, rozet metni.'],
            [c('--cal-range'), c('#eef0f2'), 'Seçili aralık bandı; ayrıca gezinme ve daha fazla ay yükleme düğmelerinin hover’ı, ortak hafta günü satırının kenarlığı, footer’ın üst kenarlığı ve iskeletin parıltısı.'],
            [c('--cal-preview'), c('#f4f5f6'), 'Bitiş seçilirken önizleme bandı; ayrıca salt okunur bildirimin arka planı ve iskeletin parıltısı.'],
            [c('--cal-hover'), c('#d0d4d9'), 'Üzerine gelinen günün ince dış çizgisi (devre dışı, seçili veya salt okunur değilse).'],
            [c('--cal-focus'), c('#2563eb'), 'Günlerin, gezinme düğmelerinin, daha fazla ay yükleme ve yeniden deneme düğmelerinin klavye odak halkası.'],
            [c('--cal-today'), c('#9aa0a6'), <>Bugünün dairesinin ince dış çizgisi (yalnızca {c('highlightToday')} açıkken).</>],
            [c('--cal-ring'), c('#c4c7cc'), 'Çok günlük bir bandın başlangıç ve bitişindeki dış yarım halka.'],
            [c('--cal-danger'), c('#b42318'), 'Ay hata mesajı: metin rengi ve arka plan olarak bunun %8’lik tonu.'],
            [c('--cal-radius'), c('12px'), 'Bandın hafta veya ay kenarında kırıldığı yerlerde yuvarlatılmış bant uçları.'],
            [c('--cal-circle'), c('0.84'), 'Hücrenin kısa kenarına oranla daire boyutu: seçim, bugün, hover ve odak daireleri, bant yüksekliği, uçtaki yarım halkalar, etiket/rozet genişliği, iskelet hapları.'],
            [c('--cal-tooltip-bg'), c('#fff'), 'Araç ipucu ve okunun arka planı.'],
            [c('--cal-tooltip-color'), c('#1f2328'), 'Araç ipucunun metin rengi.'],
            [c('--cal-tooltip-shadow'), c('0 4px 16px rgb(0 0 0 / 0.14)'), 'Araç ipucunun box-shadow değeri.'],
            [c('--cal-tooltip-max-width'), <>ayarlı değil ({c('280px')} yedek değer)</>, 'Araç ipucunun max-width değeri (hiçbir zaman pencere genişliğinin 16px eksiğinden geniş olmaz).'],
          ]}
        />
        <p>
          Araç ipucu kökün dışına portal ile render edilir, bu yüzden değişkenler ona miras yoluyla ulaşmaz: açıldığında takvim dört{' '}
          <code>--cal-tooltip-*</code> değişkenini ve font-family değerini kökün hesaplanmış stilinden okur ve araç ipucuna satır içi yazar. Araç ipucu
          kurallarında aynı değerler yedek değer olarak bulunur.
        </p>
        <Example src="styling-ref/AllVariables" title="Herkese açık her değişken, değiştirilmiş" />
        <p>
          Bazı değişkenler her render’da prop’lardan köke satır içi olarak yazılır. Satır içi stiller stil dosyanızı yener ve sizin{' '}
          <code>style</code> prop’unuzdan sonra yazılır; bu yüzden bunları ayarlamanın etkisi olmaz: bunun yerine prop’u değiştirin. Kendi CSS’inizde
          okuyabilirsiniz.
        </p>
        <DataTable
          caption="İç değişkenler (bileşen tarafından ayarlanır)"
          head={['Değişken', 'Kaynağı', 'Temada kullanımı']}
          rows={[
            [c('--cal-day-min-w'), <>{c('minDaySize')} genişliği (varsayılan 40)</>, 'Hafta günü ve hafta satırlarının en küçük sütun genişliği.'],
            [c('--cal-day-min-h'), <>{c('minDaySize')} yüksekliği (varsayılan 40)</>, 'En küçük gün hücresi yüksekliği.'],
            [c('--cal-day-max'), <>{c('maxDaySize')} (varsayılan 56)</>, 'En büyük gün hücresi yüksekliği.'],
            [c('--cal-month-gap'), <>{c('monthGap')} (varsayılan 32)</>, 'Aylar arasındaki sütun boşluğu.'],
            [c('--cal-month-padding'), 'sabit 8px', 'Her ayın yatay iç boşluğu, ortak hafta günü satırının iç boşluğu ve ay yükleme göstergesinin konumu.'],
            [c('--cal-month-min'), 'hesaplanan en küçük ay genişliği', 'Varsayılan tema kullanmaz.'],
            [c('--cal-columns'), 'güncel ay sütunu sayısı', 'Varsayılan tema kullanmaz.'],
            [c('--cal-tooltip-arrow'), 'araç ipucu konumu (araç ipucu öğesinde)', 'Okun araç ipucu kenarı boyunca kayması.'],
          ]}
        />
      </Section>

      <Section title="data-* nitelikleri">
        <p>
          Durum nitelikler olarak sunulur; bu, <code>unstyled</code> ile ve kendi sınıflarınızla da çalışan stil sözleşmesidir. Boolean nitelikler ya boş
          değerle bulunur ya da hiç bulunmaz: bunları <code>[data-selected=&quot;true&quot;]</code> ile değil, <code>[data-selected]</code> ile seçin.
        </p>
        <DataTable
          caption="Kök (cal-root)"
          head={['Nitelik', 'Değerler', 'Anlamı']}
          rows={[
            [c('data-mode'), c('single | range | multiple | readonly'), 'Seçim modu.'],
            [c('data-phase'), c('empty | start-selected | complete'), <>Seçim aşaması. {c('start-selected')} yalnızca aralık modunda; salt okunur modda her zaman {c('empty')}.</>],
            [c('data-orientation'), c('horizontal | vertical'), 'Yerleşim yönü.'],
            [c('data-navigation'), c('paged | continuous'), 'Gezinme modu.'],
            [c('data-overflow'), c('none | scroll | wrap | reduce-months'), 'Yerleşimin sığmak için şu anda ne yaptığı (etkin taşma stratejisi).'],
            [c('data-at-min-size'), yes, <>Gün hücreleri {c('minDaySize')} boyutunda ve daha fazla küçülemez.</>],
            [c('data-measured'), yes, 'İlk yerleşim ölçümü yapıldı (sunucu HTML’inde ve ilk effect’ten önce yoktur).'],
            [c('data-highlight-today'), yes, <>{c('highlightToday={false}')} değilse. Varsayılan bugün dış çizgisi bunu gerektirir.</>],
            [c('dir'), c('ltr | rtl'), 'data-* değil, ama tema okları ve bandın yarım halkalarını yansıtmak için kullanır.'],
          ]}
        />
        <DataTable
          caption="Ay (cal-month bölümü)"
          head={['Nitelik', 'Değerler', 'Anlamı']}
          rows={[
            [c('data-month'), c('YYYY-MM'), 'Ay.'],
            [c('data-status'), c('unknown | loading | error'), <>{c('getDataStatus')}’tan gelir; {c('loaded')} iken yoktur. Tema {c('unknown')} ve {c('loading')} için günleri iskelet olarak çizer.</>],
            [c('data-skeleton'), yes, <>İlk yükleme (takvim henüz onsuz gösterilmemişken {c('loading')} açık): günler iskelet olarak çizilir.</>],
          ]}
        />
        <DataTable
          caption="Gün hücresi (cal-day) ve gün düğmesi (cal-day-button)"
          head={['Nitelik', 'Değerler', 'Anlamı']}
          rows={[
            [c('data-date'), c('YYYY-MM-DD'), 'Tarih (her zaman bulunur).'],
            [c('data-today'), yes, 'Bugün.'],
            [c('data-past'), yes, 'Bugünden önce.'],
            [c('data-disabled'), yes, <>Etkinleştirme şu anda reddedilir ({c('day.disabled')}).</>],
            [c('data-unavailable'), yes, <>Hiçbir aşamada seçilemez ({c('day.unavailable')}).</>],
            [c('data-out-of-schedule'), yes, 'Bir takvim (schedule) kuralıyla kısıtlı.'],
            [c('data-selected'), yes, 'Seçili tekli veya çoklu gün ya da bir aralık ucu.'],
            [c('data-range-start'), yes, 'Aralık başlangıcı.'],
            [c('data-range-end'), yes, 'Aralık bitişi.'],
            [c('data-in-range'), yes, 'Başlangıç ile bitiş arasında (uçlar hariç).'],
            [c('data-included'), yes, <>{c('rangeSemantics')} tarafından sayılır (başlangıçtan bitişe kadar, ya da konaklamalarda bitiş hariç).</>],
            [c('data-preview'), yes, 'Önizleme aralığının içinde (uçlar hariç).'],
            [c('data-preview-start'), yes, 'Önizleme aralığının başlangıcı.'],
            [c('data-preview-end'), yes, 'Önizleme aralığının bitişi.'],
            [c('data-focused'), yes, 'Odakta.'],
            [c('data-hovered'), yes, 'İşaretçi üzerinde (fare veya kalem, dokunmatik değil).'],
            [c('data-loading'), yes, 'Ayı yükleniyor ya da ilk yükleme sürüyor.'],
            [c('data-status'), c('unknown | loading | error'), <>Ayın veri durumu; {c('loaded')} iken yoktur.</>],
            [c('data-reason'), <>bir {c('ReasonCode')}</>, <>Gün devre dışı, müsait değil ya da sebepli salt okunur olduğunda {c('reason.code')}: {c('past')}, {c('closed')}, {c('before-min')}, {c('min-length')}, {c('data-error')}, …</>],
            [c('data-day-reason'), 'sizin metniniz', <>Günün {c('DayAvailability.reason')} değeri, örneğin {c('"maintenance"')}.</>],
            [c('data-week-start'), yes, <>Satırın ilk sütunu ({c('firstDayOfWeek')}’i izler).</>],
            [c('data-week-end'), yes, 'Satırın son sütunu.'],
            [c('data-month-start'), yes, 'Ayın ilk günü.'],
            [c('data-month-end'), yes, 'Ayın son günü.'],
            [c('data-mod-<name>'), yes, <>{c('<name>')} modifier’ınız true döndürdü.</>],
          ]}
        />
        <DataTable
          caption="Yalnızca hücre"
          head={['Nitelik', 'Değerler', 'Anlamı']}
          rows={[
            [c('data-band'), c('start | mid | end'), <>Çizilen banttaki konum: önizleme varken önizleme, yoksa başlangıç ≠ bitiş olduğunda seçili aralık. Tek günlük bir seçim bant çizmez. Hücre bu durumda {c('cal-range-bg')} span’ini de içerir.</>],
            [c('data-band-preview'), yes, 'Çizilen bant seçim değil, önizlemedir.'],
          ]}
        />
        <DataTable
          caption="Diğer öğeler"
          head={['Nitelik', 'Öğe', 'Değerler']}
          rows={[
            [c('data-direction'), <>Gezinme düğmesi ({c('cal-nav-button')})</>, c('previous | next')],
            [c('data-direction'), <>Daha fazla ay yükleme düğmesi ({c('cal-load-more')}) ve alanı ({c('cal-load-more-area')})</>, c('previous | next')],
            [c('data-scope'), <>Varsayılan yükleme öğesi ({c('cal-loading')})</>, <>{c('initial')} (varsayılan arayüzün render ettiği tek kapsam)</>],
            [c('data-placement'), <>Araç ipucu ({c('cal-tooltip')})</>, <>{c('top | bottom | left | right')}: yön değiştirmeden (flip) sonra fiilen kullanılan taraf.</>],
          ]}
        />
        <p>
          Hücre ve düğme aynı gün niteliklerini taşır, bu yüzden ikisinden birini seçebilirsiniz. Düğmenin çevresindeki şeyler (aralık bandı, bir kenarlık)
          için hücreyi, düğmenin kendisi için düğmeyi seçin. <code>renderDay</code> ile nitelikler öğenize <code>getDayProps</code> üzerinden ulaşır.
        </p>
        <Example src="styling-ref/StateAttributes" title="Her durum kendi renginde" />
        <p>
          Örnek, durumları <code>.sr-cell[data-…]</code> üzerinde tema değişkenleri ayarlayarak yeniden renklendirir: varsayılan daire, bant ve halkalar bu
          değişkenleri okur, bu yüzden seçicilerine dokunmadan değişirler. <code>data-band-preview</code>’u ve <code>data-preview-end</code> dış çizgisini
          görmek için yeni bir başlangıç tıkladıktan sonra daha sonraki bir günün üzerine gelin.
        </p>
      </Section>

      <Section title="Modifier’lar">
        <p>
          <code>modifiers=&#123;&#123; name: (day) =&gt; boolean &#125;&#125;</code> kendi gün durumlarınızı ekler. Her fonksiyon render edilen her gün için,
          günün <code>DayState</code>’iyle çalışır (modifier’lar uygulanmadan önce; bu yüzden bir modifier diğerini okuyamaz). true döndürdüğünde:
        </p>
        <ul>
          <li>
            <code>day.modifiers.name</code>; <code>classNames</code> fonksiyonlarında, <code>renderDayContent</code>, <code>renderDay</code>,{' '}
            <code>getDayTooltip</code> ve <code>renderDayTooltip</code> içinde <code>true</code> olur (false olan modifier’lar nesneye eklenmez);
          </li>
          <li>
            hücrede ve düğmede <code>data-mod-name</code> ayarlanır.
          </li>
        </ul>
        <p>
          Nitelik adında geçerli olan adlar kullanın, tercihen küçük harf ve tire (<code>&apos;long-stay&apos;</code>): HTML nitelik adlarını küçük harfe
          çevirir, bu yüzden <code>longStay</code> DOM’da <code>data-mod-longstay</code> olur.
        </p>
        <Snippet files={setup} label="Tema, durum sınıfları ve modifier’lar" />
      </Section>

      <Section title="Slotlar ve render callback’leri">
        <p>
          Slotlar bir bölgenin yerine sizin içeriğinizi koyar. Çoğu, slotun kendi prop’larını ve bir <code>SlotContext</code> alır: takvimin anlık durumu
          (<code>selection</code>, <code>activeEndpoint</code>, <code>phase</code>, <code>validation</code>, <code>referenceMonth</code>,{' '}
          <code>visibleMonths</code>, <code>renderedMonths</code>, <code>layout</code>, <code>focusedDate</code>, <code>today</code>), ayrıca{' '}
          <code>instanceId</code>, <code>actions</code> (ref ile aynı controller), <code>messages</code>, <code>locale</code> ve{' '}
          <code>formatDate</code>.
        </p>
        <PropsTable
          caption="Slotlar"
          rows={[
            { name: 'renderHeader', type: '(ctx) => ReactNode', description: <>{c('div.cal-header')} ({c('classNames.header')}) içinde, salt okunur bildirimden sonra, aylardan önce.</> },
            { name: 'renderFooter', type: '(ctx) => ReactNode', description: <>{c('div.cal-footer')} ({c('classNames.footer')}) içinde, aylardan sonra. Tema {c('--cal-range')} renginde bir üst kenarlık ekler.</> },
            { name: 'renderNavigation', type: '(NavigationRenderProps, ctx) => ReactNode', description: <>Yalnızca sayfalı gezinme. Ayların üstündeki {c('div.cal-navigation')} içindedir ve varsayılan okların yerine geçer. Prop’lar: {c('canPrevious')}, {c('canNext')}, {c('previous()')}, {c('next()')}, {c('months')}, {c('labels')}.</> },
            { name: 'renderMonthHeader', type: '(MonthHeaderRenderProps, ctx) => ReactNode', description: <>Sarmalayıcı olmadan {c('cal-month-header')} satırının tamamının yerine geçer. Prop’lar: {c('month')}, {c('title')}, {c('index')}, {c('status')} ve {c('navigation')}: bu başlığa ait varsayılan oklar ya da {c('null')} ({c('renderNavigation')} veya sürekli gezinmede her zaman null). Ay bu durumda {c('aria-label')} ile adlandırılır.</> },
            { name: 'renderLoading', type: '(LoadingRenderProps, ctx) => ReactNode', description: <>Sarmalayıcı yok. {c('scope')} {c('initial')}: ilk yükleme sırasında viewport’tan sonra; {c('month')}: yüklenen bir ayın içinde, ızgarasından sonra (iskelet kalır); {c('load-more')}: eklenen aylar yüklenirken daha fazla ay yükleme alanında (bunun varsayılanı yoktur).</> },
            { name: 'renderError', type: '(ErrorRenderProps, ctx) => ReactNode', description: <>Durumu {c('error')} olan her ayda {c('div.cal-error')}’un yerine geçer. {c('retry()')}, {c('onRetry([month])')} çağırır.</> },
            { name: 'renderLoadMore', type: '(LoadMoreRenderProps, ctx) => ReactNode', description: <>Alanının içindeki varsayılan daha fazla ay yükleme düğmesinin yerine geçer (sürekli, {c('loadMore="button"')}, yönler {c('loadDirections')} içinde); {c('minDate')}/{c('maxDate')} sınırında da {c('canLoad: false')} ile çağrılır, orada {c('loadMore()')} bir şey yapmaz. Prop’lar: {c('direction')}, {c('canLoad')}, {c('loading')}, {c('loadMore()')}, {c('label')}.</> },
            { name: 'renderDayTooltip', type: '(DayTooltipRenderProps) => ReactNode', description: <>Açık araç ipucunun içeriği; {c('div.cal-tooltip')} içinde, oktan önce. Prop’lar: {c('day')}, {c('content')} ({c('getDayTooltip')}’ten ya da varsayılan sebep metninden), {c('trigger')}, {c('placement')}. ctx yok.</> },
            { name: 'renderDayContent', type: '({ day, data }) => ReactNode', description: <>Varsayılan gün düğmesindeki {c('span.cal-day-content')} içinde. Geri kalan her şey (düğme, daire, bant, ARIA) kalır. Etkileşimli öğe olmamalı.</> },
            { name: 'renderDay', type: '({ day, data, getDayProps, defaultContent }) => ReactNode', description: <>Düğmenin ve içerik span’inin yerine geçer. Hücre, data-* nitelikleri, aralık bandı span’i ve gizli açıklama kalır.</> },
          ]}
        />
        <Example src="styling-ref/Slots" title="Header, gezinme, ay başlığı, gün içeriği, araç ipucu ve footer slotları" />
        <Snippet files={statusSlots} label="Yükleme, hata ve daha fazla ay yükleme slotları" />
        <h3>getDayProps</h3>
        <p>
          <code>getDayProps(yourProps)</code> gün öğeniz için prop’ları döndürür. Sıra: önce günün data-* nitelikleri, sonra sizin prop’larınız, en son da
          takvimin kendi prop’ları; bunlar kazanır: ref (sizinkiyle birleştirilir: öğeyi gezici odak ve araç ipucu çapası olarak kaydeder),{' '}
          <code>type=&quot;button&quot;</code> (ya da düğme olmayan bir öğe için <code>type: null</code> ile <code>type</code> yok ve siz bir{' '}
          <code>role</code> vermezseniz <code>role=&quot;button&quot;</code>), <code>id</code>, <code>tabIndex</code>, <code>aria-label</code>,{' '}
          <code>aria-disabled</code>, <code>aria-pressed</code>, <code>aria-current</code>, ayrıca sizinkilerle birleştirilen <code>className</code> ve{' '}
          <code>aria-describedby</code>. Sınıf listesi <code>cal-day-button</code> ve <code>classNames.dayButton</code> ile başlar; bu yüzden özel bir öğe,{' '}
          <code>unstyled</code> kullanmadığınız sürece varsayılan daireyi, odak halkasını ve devre dışı görünümünü korur.
        </p>
        <p>
          Olay işleyicileri (<code>onClick</code>, <code>onKeyDown</code>, <code>onPointerEnter</code>, <code>onPointerLeave</code>,{' '}
          <code>onPointerDown</code>, <code>onFocus</code>, <code>onBlur</code>) birleştirilir: önce sizinki çalışır, takviminki ise yalnızca{' '}
          <code>event.preventDefault()</code> çağırmadıysanız çalışır.
        </p>
        <Snippet files={getDayProps} label="Özel bir öğede getDayProps" />
        <h3>unstyled</h3>
        <p>
          <code>unstyled</code> tüm varsayılan <code>cal-*</code> sınıflarını kaldırır; yalnızca sizin <code>classNames</code> değerleriniz (ve{' '}
          <code>className</code>, <code>tooltip.className</code>, işaretçi sınıfları) kalır. Yapının yine çalışması için satır içi kalanlar:
        </p>
        <ul>
          <li>kökteki iç boyut değişkenleri (CSS’inizde kullanabilirsiniz);</li>
          <li>
            viewport’un <code>overflow-x: auto</code> ayarı (ve <code>maxBlockSize</code> ile <code>max-block-size</code> / <code>overflow-y</code>);
          </li>
          <li>ay ızgarası: <code>display: grid</code> ve ölçülen yerleşimden gelen sütun şablonu;</li>
          <li>görsel olarak gizli metinler (açıklamalar, durum, canlı bölge) ve araç ipucunun konumu, genişliği ve kopyalanan tema değişkenleri;</li>
          <li>gün verisinden gelen işaretçi renkleri.</li>
        </ul>
        <p>
          Satır içi olmayanlar: hafta günü ve hafta ızgaraları, hücre boyutları, daire, aralık bandı (span’i yine render edilir, stilsiz) ve tüm renkler.
          Hafta satırlarını yerleştirmek ve günleri boyutlandırmak sizin sınıflarınıza kalır.
        </p>
        <Snippet files={unstyled} label="unstyled ile gereken en az yerleşim CSS’i" />
      </Section>

      <Section title="Cascade sözleşmesi">
        <ul>
          <li>
            <code>calendar-kit/styles.css</code> dosyasını kendi CSS’inizden önce bir kez içe aktarın. Varsayılan kuralların çoğu tek sınıftır (
            <code>.cal-root</code>, <code>.cal-month</code>), bu yüzden aynı öğedeki tek bir sınıfınız yalnızca sırayla kazanır. Hiçbir kural{' '}
            <code>!important</code> kullanmaz, sizin de buna ihtiyacınız olmaz.
          </li>
          <li>
            Durum kuralları <code>.cal-day[data-…] .cal-day-button</code>’u (ve <code>::before</code> dairesini) seçer. Bugün, hover ve iskelet durumlarını{' '}
            <code>:where()</code> içine sarar; bu yüzden bu durumlar özgüllük eklemez ve en son tanımlanan klavye odak halkası her zaman kazanır. Seçili,
            devre dışı, müsait değil, aralık halkaları ve önizleme bitişi en fazla üç sınıflık düz seçicilerdir.
          </li>
          <li>
            Bir özelliği geçersiz kılmak yerine bir değişkeni değiştirmeyi tercih edin: değişkenler kullanıldıkları her yerde okunur, bu yüzden{' '}
            <code>--cal-accent</code>’i ayarlayan bir <code>.my-cell[data-selected]</code>, daireyi çizen seçici hangisi olursa olsun daireyi yeniden
            renklendirir. Daire düğmenin bir <code>::before</code> öğesidir; düğmenin kendisine verilen arka plan tüm kare hücreyi doldurur.
          </li>
          <li>
            Bir durum kuralının bir özelliğini geçersiz kılmak için özgüllüğünü yakalayın, örneğin <code>.my-calendar .my-cell[data-unavailable] .my-day</code>.
          </li>
          <li>
            Kendi sınıflarınızı <code>classNames</code> ve data-* nitelikleriyle seçin. İç sınıf adları (<code>cal-day-number</code>,{' '}
            <code>cal-range-bg</code>, …) ve DOM iç içeliği uygulama ayrıntılarıdır; sözleşme yukarıdaki nitelikler, değişkenler ve parçalardır ve bunlar{' '}
            <code>unstyled</code> ile de çalışmaya devam eder.
          </li>
        </ul>
      </Section>
    </Page>
  );
}
