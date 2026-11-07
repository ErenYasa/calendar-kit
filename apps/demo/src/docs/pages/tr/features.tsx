import { Example } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function SelectionModes() {
  return (
    <Page title="Seçim modları" lead="Bir tıklamanın neyi seçeceğini mode prop’u ile belirleyin. Her modun kendi değer tipi, başlangıç değeri ve onChange imzası vardır.">
      <Section title="Tek tarih">
        <Example src="features/ModeSingle" title="Tek tarih" />
      </Section>
      <Section title="Aralık">
        <p>İlk tıklama başlangıcı, ikincisi bitişi belirler. Fareyle üzerine gelindiğinde aralık önizlenir; başlangıçtan önceki bir güne tıklamak yeni bir aralık başlatır.</p>
        <Example src="features/ModeRange" title="Tarih aralığı" />
      </Section>
      <Section title="Çoklu tarih">
        <p>Tıklamalar tarihleri seçer veya seçimi kaldırır. <code>rules.maxSelections</code> en fazla kaç farklı tarihin seçilebileceğini sınırlar.</p>
        <Example src="features/ModeMultiple" title="Çoklu tarih" />
        <p>
          Çoklu modda hafta günü kuralları seçilen her tarihe uygulanır: <code>startWeekdays</code> hangi hafta günlerinin seçilebileceğini sınırlar. Reddedilen
          seçimler duyurulur ve günün araç ipucunda gösterilir; metinleri <code>messages.reasons</code>’tan gelir.
        </p>
        <Example src="features/SessionDays" title="Salı ve perşembe seansları" />
      </Section>
      <Section title="Salt okunur">
        <p>Müsaitliği aynı kurallar ve verilerle gösterir, ancak hiçbir şey seçilemez. Izgaranın üstündeki bir bildirim bunu açıklar.</p>
        <Example src="features/ModeReadonly" title="Salt okunur müsaitlik" />
      </Section>
      <Section title="Başlangıç değerleri">
        <PropsTable
          rows={[
            { name: 'value', type: 'CalendarDate | null · DateRange · readonly CalendarDate[]', description: 'Moda ait kontrollü değer.' },
            { name: 'defaultValue', type: <><code>value</code> ile aynı</>, description: 'Kontrolsüz başlangıç değeri; mount sırasında bir kez okunur.' },
            { name: 'onChange', type: '(value, event) => void', description: 'Kullanıcı ve controller değişikliklerinde çağrılır; prop değişikliklerinde asla çağrılmaz.' },
            { name: 'activeEndpoint / defaultActiveEndpoint', type: "'start' | 'end'", description: 'Yalnızca aralık modu: sonraki tıklamanın hangi ucu belirleyeceği.' },
          ]}
        />
      </Section>
    </Page>
  );
}

export function DateLimits() {
  return (
    <Page title="Tarih sınırları" lead="Hangi günlerin seçilebileceğini ve takvimin ne kadar ileri/geri gidebileceğini sınırlayın.">
      <Section title="En erken ve en geç tarih">
        <p>
          <code>minDate</code> ve <code>maxDate</code> sınırların dışındaki günleri devre dışı bırakır ve gezinmeyi bu tarihleri içeren aylarda durdurur.
        </p>
        <Example src="features/DateLimits" title="Önümüzdeki 30 gün" />
      </Section>
      <Section title="Geçmiş ve gelecek">
        <p>
          <code>disablePast</code> ve <code>disableFuture</code> bugüne göre çalışır (<code>today</code> prop’u ya da <code>timeZone</code> içinde hesaplanan
          değer). min/max’tan farklı olarak yalnızca seçimi kısıtlarlar; gezinmeyi sınırlamazlar.
        </p>
        <Example src="features/PastFuture" title="disablePast ve disableFuture" />
      </Section>
      <Section title="Referans ay sonda iken disableFuture">
        <p>
          Geçmiş tarihler için içinde bulunulan ayı <code>monthPosition</code> ile pencerenin sonuna koyun: takvim böylece önceki ayı ve bu ayı gösterir.{' '}
          <code>disableFuture</code> yalnızca bugünden sonraki günleri engeller; pencereyi kendiliğinden asla kaydırmaz.
        </p>
        <Example src="features/DisableFutureWindow" title="Yalnızca geçmişi gösteren pencere" />
      </Section>
      <Section title="Bugün">
        <p>
          Bugün, <code>today</code> prop’undan gelir ya da <code>timeZone</code> içinde (varsayılan: tarayıcının saat dilimi) hesaplanır ve gece yarısından sonra
          görünen ay değişmeden yenilenir. <code>disablePast</code>/<code>disableFuture</code>’ı, işaretçiyi ve etiketi belirler.{' '}
          <code>highlightToday=&#123;false&#125;</code> yalnızca daireyi ve “Bugün” araç ipucunu gizler.
        </p>
        <Example src="features/TodayMarker" title="Bugün işaretçisi ve saat dilimi" />
      </Section>
      <PropsTable
        rows={[
          { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'Dahil sınırlar; kural olarak da kullanılabilir.' },
          { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Bugüne göre.' },
          { name: 'today', type: 'CalendarDate', description: 'Açıkça verilen bugün (SSR ve testler için önerilir).' },
          { name: 'timeZone', type: 'string', description: 'today verilmediğinde bugünü hesaplamak için kullanılan IANA saat dilimi.' },
        ]}
      />
    </Page>
  );
}

export function LengthRules() {
  return (
    <Page title="Uzunluk kuralları" lead="En kısa, en uzun ve sabit aralık süreleri; konaklamalarda gece, gün aralıklarında gün olarak ölçülür.">
      <Section title="En kısa ve en uzun">
        <p>
          Bir başlangıç seçiliyken kuralı bozacak bitişler devre dışı bırakılır; sebepleri günün erişilebilir etiketinde ve varsayılan araç ipucunda yer alır.{' '}
          <code>requireReachableEnd</code> ile (her iki adaptörde de açık) ardından geçerli bir bitiş gelemeyecek başlangıç reddedilir — örneğin 2 gecelik
          minimumda sonraki gece doluysa.
        </p>
        <Example src="features/MinMaxLength" title="2 ila 7 gece" />
      </Section>
      <Section title="Sabit süre">
        <p>Sabit sürede tek tıklama aralığın tamamını oluşturur.</p>
        <Example src="features/FixedLength" title="3 günlük geçiş" />
      </Section>
      <PropsTable
        caption="Seçenekler"
        rows={[
          { name: 'stayRules({ minNights, maxNights, fixedNights })', type: 'number', description: 'Hariç bitişli aralıklar, gece olarak sayılır.' },
          { name: 'dayRangeRules({ minDays, maxDays, fixedDays })', type: 'number', description: 'Dahil bitişli aralıklar, gün olarak sayılır.' },
          { name: 'rules.minLength / maxLength / fixedLength', type: 'number', description: 'Adaptörsüz aynısı; birim rangeSemantics’e göre belirlenir.' },
          { name: 'relaxSchedule', type: 'boolean | { weekdays?, length? }', default: 'false', description: '“Özel tarihler”: süre ve hafta günü kurallarını yok sayar, rezervasyonlar yine geçerlidir.' },
        ]}
      />
      <Note>
        <p>
          Ulaşılabilir bitiş araması en fazla 63 bitiş adayını kontrol eder. Bir başlangıç yalnızca hiçbir bitişin olmadığı kanıtlandığında reddedilir; arama
          önce adaylarını tüketirse başlangıç seçilebilir kalır ve bitişi her zamanki gibi doğrulanır.
        </p>
      </Note>
    </Page>
  );
}

export function DayRules() {
  return (
    <Page title="Başlangıç/bitiş günleri ve doğrulama" lead="Hangi günlerin bir aralığı başlatıp bitirebileceğini, hangilerinin içinden geçilebileceğini belirleyin ve kendi kurallarınızı ekleyin.">
      <Section title="Başlangıç ve bitiş günleri">
        <p>
          Hafta günü kuralları (<code>checkInWeekdays</code>, <code>checkOutWeekdays</code>, <code>availableWeekdays</code>) ve gün bazlı durumlar (
          <code>check-in-only</code>, <code>check-out-only</code>, <code>booked</code>, <code>closed</code>) her günün <code>canStart</code>,{' '}
          <code>canEnd</code> ve <code>canPassThrough</code> değerlerini belirler. Adaptör kullanmadan bunları <code>rules.getDayAvailability(date, ctx)</code>’ten
          döndürün.
        </p>
        <Example src="features/StartEndDays" title="Cuma/cumartesi giriş" />
      </Section>
      <Section title="Özel doğrulama">
        <p>
          <code>validateSelection(selection, ctx)</code> önerilen her seçim için çalışır (tıklamalar, klavye ve <code>ref.select()</code>). Reddetmek için{' '}
          <code>message</code> içeren bir sorun döndürün. Kurallar <code>ruleContext</code> üzerinden uygulama durumuna bağlı olabilir (<code>ctx.context</code>{' '}
          olarak erişilir); bu değer değişince seçim yeniden doğrulanır.
        </p>
        <Example src="features/CustomValidation" title="En fazla bir hafta sonu" />
      </Section>
      <PropsTable
        caption="DayAvailability (her gün için döndürülür)"
        rows={[
          { name: 'closed', type: 'boolean', description: 'Bu günde hiçbir şey yapılamaz.' },
          { name: 'canStart / canEnd / canPassThrough', type: 'boolean', default: '!closed', description: 'Başlangıç veya tekli seçim / aralık bitişi / aralığın içi.' },
          { name: 'reason', type: 'string', description: 'Kendi etiketiniz (ör. check-out-only); messages.dayReasons ile yerelleştirilir.' },
          { name: 'message', type: 'string', description: 'Araç ipuçları ve duyurular için hazır metin.' },
          { name: 'schedule', type: 'boolean', description: 'Kısıtlama bir takvim (schedule) kuralıdır; relaxSchedule tarafından yok sayılır.' },
        ]}
      />
      <p>
        Birden fazla kural seti birleştirilebilir: <code>rules</code> bir dizi kabul eder (falsy öğeler atlanır) ya da <code>combineRules(...)</code> kullanın.
      </p>
    </Page>
  );
}

export function Orientation() {
  return (
    <Page title="Yön ve ay sayısı" lead="Cihazdan bağımsız olarak bir veya daha fazla ayı yan yana ya da alt alta gösterin.">
      <Section title="Birden fazla ay">
        <Example src="features/MultipleMonths" title="Üç ay" />
      </Section>
      <Section title="Dikey">
        <Example src="features/Vertical" title="Dikey aylar" />
      </Section>
      <Section title="Sayfalı veya sürekli gezinme">
        <p>
          <code>navigation=&quot;paged&quot;</code> (varsayılan) <code>numberOfMonths</code> aylık bir pencere gösterir; oklar bu pencereyi{' '}
          <code>stepMonths</code> ay kaydırarak değiştirir, bu da yatay yerleşimlere uyar. <code>navigation=&quot;continuous&quot;</code> kullanıcının
          kaydırdığı, giderek büyüyen bir liste tutar; dikey ve mobil yerleşimlere uyar. Kontrolleri için <a href="#/load-more">Kademeli ay yükleme</a> sayfasına
          bakın.
        </p>
      </Section>
      <PropsTable
        rows={[
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'Penceredeki ay sayısı (her iki yönde de).' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Yerleşim yönü.' },
          { name: 'stepMonths', type: 'number', default: '1', description: 'Sayfalı gezinmede önceki/sonraki ile kaydırılan ay sayısı.' },
          { name: 'monthGap', type: 'number', default: '32', description: 'Aylar arasındaki boşluk (px).' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Her zaman 6 hafta satırı render eder (sabit yükseklik).' },
        ]}
      />
    </Page>
  );
}

export function MonthPosition() {
  return (
    <Page title="Referans ayın konumu" lead="Birden fazla aylık bir pencerede referans ayın nerede görüneceği.">
      <Section title="Ortada konum">
        <p>
          <code>monthPosition</code> 1’den başlar: 3 ayda <code>1</code> referans ay + sonraki 2 ayı, <code>2</code> önceki + referans + sonraki ayı gösterir.
          Sıralama her zaman kronolojiktir. Pencere <code>minDate</code>/<code>maxDate</code>’i aşacaksa sınırların içine kaydırılır.
        </p>
        <Example src="features/MonthPosition" title="Referans ay ortada" />
      </Section>
    </Page>
  );
}

export function Responsive() {
  return (
    <Page title="Duyarlı yerleşim" lead="Takvim kendi kapsayıcısını ölçer (ResizeObserver); bu yüzden kenar çubuğunda, modalda veya tam sayfada aynı şekilde çalışır.">
      <Section title="Taşma stratejileri">
        <p>
          En küçük ay genişliği <code>7 × minDaySize</code> artı iç boşluktur. İstenen aylar sığmadığında karar <code>overflow</code>’undur:{' '}
          <code>wrap</code> (varsayılan) ayları yeni bir satıra taşır, <code>scroll</code> onları takvimin içinde yatay kaydırır, <code>reduce-months</code>{' '}
          daha az ay gösterir. İstenen sayı asla sessizce değişmez: <code>onLayoutChange</code> geçerli yerleşimi bildirir. Seçim ve odak yeniden
          boyutlandırmada korunur.
        </p>
        <Example src="features/Responsive" title="Kapsayıcıya göre yerleşim" />
      </Section>
      <Section title="wrap">
        <p>Varsayılan. Hiçbir şey gizlenmez: sığmayan aylar yeni satıra geçer, takvim uzar. Dikey alanı olan sayfalar için uygundur.</p>
        <Example src="features/OverflowWrap" title="overflow: wrap" />
      </Section>
      <Section title="scroll">
        <p>Tek satırın yüksekliğini korur; ay alanı takvimin içinde yatay kaydırılır. Araç çubukları veya sabit yükseklikli paneller için uygundur.</p>
        <Example src="features/OverflowScroll" title="overflow: scroll" />
      </Section>
      <Section title="reduce-months">
        <p>
          Aylar sığmadığı sürece istenenden az ay gösterir, yer açılınca istenen sayıya döner. Referans ay görünür kalır (konumu sınıra çekilir). Geçerli
          yerleşimi <code>onLayoutChange</code>’ten okuyun.
        </p>
        <Example src="features/OverflowReduce" title="overflow: reduce-months" />
      </Section>
    </Page>
  );
}

export function DaySize() {
  return (
    <Page title="Gün boyutu ve iç kaydırma" lead="Dokunma hedeflerini büyük tutun; sayfa yerine ay alanı kaydırılsın.">
      <Section title="En küçük gün boyutu">
        <p>
          <code>minDaySize</code> (varsayılan 40 px) etkileşimli bir günün en küçük boyutudur; <code>maxDaySize</code> (varsayılan 56) hücre yüksekliğini
          sınırlar. Tek bir ay bile sığmazsa ay alanı takvimin içinde yatay kaydırılır — sayfa asla taşmaz ve kaydırma çubuğu gizlenmez. Header ve footer
          slotları kaydırma alanının dışında kalır. <code>maxBlockSize</code> dikey kaydırma ekler.
        </p>
        <Example src="features/DaySize" title="Dar bir kutuda 48 px’lik günler" />
      </Section>
    </Page>
  );
}

export function LoadMore() {
  return (
    <Page title="Kademeli ay yükleme" lead="Sürekli gezinme sayfalar yerine giderek büyüyen bir ay listesi render eder; aylar istek üzerine başa veya sona eklenir.">
      <Section title="Sürekli gezinme nasıl çalışır">
        <p>
          <code>navigation=&quot;continuous&quot;</code> ile takvim önce referans ayın çevresinde <code>numberOfMonths</code> ay render eder. Her yükleme,{' '}
          <code>loadDirections</code>’ın izin verdiği yönlerde listenin başına veya sonuna <code>monthsPerLoad</code> ay (varsayılan:{' '}
          <code>numberOfMonths</code>) ekler ve <code>minDate</code>/<code>maxDate</code>’i içeren aylarda durur. Önceki ayların eklenmesi kaydırma konumunu
          korur; böylece kullanıcının parmağının altındaki tarihler zıplamaz. DOM’da en fazla <code>maxRenderedMonths</code> (varsayılan 24) ay kalır: aylar
          uzak uçtan çıkarılır, klavye odağını tutan ay asla çıkarılmaz. Klavye odağı listenin sonunu geçtiğinde eklenen aylar dahil her ekleme{' '}
          <code>onLoadMore</code> ve <code>onRenderedMonthsChange</code>’i çağırır (verinizi orada yükleyin); referans ayı değiştirmez, bu yüzden{' '}
          <code>onVisibleMonthChange</code> çağrılmaz. Sayfalı gezinme (varsayılan) ise pencereyi önceki/sonraki oklarıyla değiştirir — bkz.{' '}
          <a href="#/orientation">Yön ve ay sayısı</a>.
        </p>
        <p>
          <code>loadDirections</code> yalnızca hangi yerleşik arayüzün bulunacağına karar verir: adını verdiği uçlardaki daha fazla yükle düğmeleri (veya{' '}
          <code>renderLoadMore</code> kontrolleri) ve <code>loadMore=&quot;auto&quot;</code> gözcüleri (sentinel). Controller’ı kısıtlamaz:{' '}
          <code>ref.loadMore(direction)</code> (veya <code>ctx.actions.loadMore</code>), <code>loadDirections</code> ne derse desin her iki yönde de ay ekler;
          yine yalnızca sürekli modda ve yine <code>minDate</code>/<code>maxDate</code>’te durarak. Klavye odağını listenin herhangi bir ucunun ötesine taşımak da
          listeyi uzatır.
        </p>
        <p>
          Kontrollü bir <code>visibleMonth</code> burada da çalışır: prop’u değiştirmek <code>goToMonth()</code> gibi davranır. Zaten render edilmiş bir aya
          kaydırılır ve yüklenen aylar kalır; render edilmemiş bir ay için liste onun çevresinde yeniden kurulur (<code>maxRenderedMonths</code> sınırında;
          veri yüklemenin takip edebilmesi için <code>onRenderedMonthsChange</code> ile bildirilir) ve ay render edilince ona kaydırılır. Geçiş anlıktır, odak
          hareket etmez ve kendi prop değişikliğiniz için <code>onVisibleMonthChange</code> çağrılmaz. Prop’u <code>onVisibleMonthsChange</code>’ten değil,{' '}
          <code>onVisibleMonthChange</code>’ten güncelleyin: görünen aylar kullanıcının kaydırmasını izler; onları geri yazmak takvimin kaydırmanın peşinden
          koşmasına yol açar. Ayrıntılar için bkz. <a href="#/api-events">Callback’ler ve olaylar → onVisibleMonthChange</a>.
        </p>
      </Section>
      <Section title="Varsayılan kontroller">
        <p>Yerelleştirilmiş “Daha önceki tarihleri göster” / “Daha fazla tarih göster” düğmeleri arayüzünüze uyuyorsa varsayılanları kullanın. Burada iki yön de açıktır.</p>
        <Example src="features/LoadMoreDefault" title="Varsayılan daha fazla yükle düğmeleri" />
      </Section>
      <Section title="Özel içerik: loadMoreLabels">
        <p>
          <code>loadMoreLabels=&#123;&#123; previous, next &#125;&#125;</code> herhangi bir <code>ReactNode</code> alır ve yalnızca varsayılan düğmelerin
          içeriğini değiştirir. Davranış, odak yönetimi ve erişilebilirlik paketin elinde kalır; yalnızca metin veya bir simge farklıysa bunu tercih edin.
          Örnek, iki yönde de yüklenecek bir şey olsun diye içinde bulunulan aydan iki ay sonra başlar.
        </p>
        <Example src="features/LoadMore" title="loadMoreLabels" />
      </Section>
      <Section title="Farklı bir kontrol: renderLoadMore">
        <p>
          <code>renderLoadMore(&#123; direction, canLoad, loading, loadMore, label &#125;, ctx)</code> her düğmenin yerine kendi kontrolünüzü render eder.
          Kontrolün farklı görünmesi veya davranması gerektiğinde (örneğin bir bağlantı) kullanın. <code>loadDirections</code> ile açılan her yön için çağrılır
          (bunların dışında hiç kontrol yoktur), <code>minDate</code>/<code>maxDate</code>’te bile: orada <code>canLoad</code> değeri <code>false</code>’tur,
          varsayılan düğme kaldırılmış olurdu ve <code>loadMore()</code> hiçbir şey yapmaz; bu yüzden renderer’ınız devre dışı bir kontrol ya da “Başka tarih
          yok” gibi bir metin gösterebilir (veya <code>null</code> döndürebilir). Erişilebilirliği sizin sorumluluğunuzdadır; sınıra ulaşıldığı anda klavye
          odağı kontrolün içindeyse takvim odağı yeni eklenen ilk güne taşır, böylece kullanıcı artık yükleme yapmayan bir kontrolde kalmaz. Örnek, bitiş
          durumuna kolayca ulaşılsın diye iki ay ilerideki bir <code>maxDate</code>’te durur.
        </p>
        <Example src="features/LoadMoreRender" title="renderLoadMore" />
      </Section>
      <Section title="Liste dışındaki kontroller: loadMore=&quot;manual&quot;">
        <p>
          <code>loadMore=&quot;manual&quot;</code> ay alanında hiçbir kontrol render etmez; aylar yalnızca controller üzerinde{' '}
          <code>loadMore(&apos;previous&apos; | &apos;next&apos;)</code> çağırdığınızda eklenir (<code>ref</code> veya bir slottaki <code>ctx.actions</code>).
          Kontrolleri bir footer’a, araç çubuğuna veya yapışkan (sticky) bir çubuğa koymak için kullanın. <code>loadMore=&quot;auto&quot;</code>, listenin
          sonu görünür alana kaydırıldığında yükler.
        </p>
        <Example src="features/LoadMoreManual" title="Footer’dan elle yükleme" />
      </Section>
      <PropsTable
        rows={[
          { name: 'navigation', type: "'paged' | 'continuous'", default: "'paged'", description: 'Oklarla N aylık sayfalar ya da giderek büyüyen bir liste.' },
          { name: 'loadMore', type: "'button' | 'auto' | 'manual'", default: "'button'", description: 'Listede düğmeler, liste sonuna yaklaşınca otomatik (IntersectionObserver) ya da yalnızca controller üzerinden.' },
          { name: 'loadDirections', type: "'next' | 'previous' | 'both'", default: "'next'", description: 'Listenin yerleşik kontrol / otomatik yükleme gözcüsü alan uçları. ref.loadMore(direction) her durumda iki yönde de çalışır.' },
          { name: 'monthsPerLoad', type: 'number', default: 'numberOfMonths', description: 'Her yüklemede eklenen ay sayısı.' },
          { name: 'maxRenderedMonths', type: 'number', default: '24', description: 'DOM sınırı (asla numberOfMonths’tan az değil); uzak uçtaki aylar çıkarılır.' },
          { name: 'loadMoreLabels', type: '{ previous?, next?: ReactNode }', description: 'Varsayılan düğmelerin içeriği.' },
          { name: 'renderLoadMore', type: '(props, ctx) => ReactNode', description: 'Her yön için kendi kontrolünüz.' },
        ]}
      />
    </Page>
  );
}

export function GoToMonth() {
  return (
    <Page title="Programla gezinme" lead="Seçimi değiştirmeden, controller ref’i aracılığıyla görünümü kendi arayüzünüzden taşıyın.">
      <Section title="İlk müsait tarihe git">
        <p>
          <code>ref.goToMonth(month, &#123; focus, behavior &#125;)</code>, <code>&#123; month, clamped &#125;</code> döndürür; min/max dışındaki hedefler sınıra
          çekilir. Takvim müsaitlik aramaz: ilk müsait ayı uygulamanız bilir ve onu iletir.
        </p>
        <Example src="features/GoToMonth" title="İlk müsait tarihe git" />
      </Section>
      <p>
        Diğer controller metotları: <code>next()</code>, <code>previous()</code>, <code>loadMore(direction)</code>, <code>focusDate(date)</code> — bkz.{' '}
        <a href="#/api-controller">Controller</a>.
      </p>
    </Page>
  );
}

export function TooltipPage() {
  return (
    <Page title="Araç ipucu" lead="Günleri açıklayın: bir günün neden seçilemediğini, bir fiyatı ya da aralık seçilirken bir ipucunu.">
      <Section title="Gün araç ipuçları">
        <p>
          <code>getDayTooltip(&#123; day, data &#125;)</code>’ten metin veya <code>&#123; content, persistent &#125;</code> döndürün. Araç ipuçları fareyle
          üzerine gelindiğinde, klavye odağında ve dokunmada açılır; <code>persistent</code> olanlar etkileşim olmadan görünür. Varsayılan olarak reddedilen
          günler sebeplerini, bugün ise “Bugün” metnini gösterir.
        </p>
        <Example src="features/Tooltip" title="Sebepler ve ipuçları" />
      </Section>
      <Section title="Görüntü alanı sınırı ve konumlandırma">
        <p>
          Varsayılan <code>boundary=&quot;calendar&quot;</code> ile araç ipucu kendi ayının içinde, ay başlığının ve hafta günü satırının altında kalır; böylece
          gezinmeyi asla örtmez. <code>boundary=&quot;viewport&quot;</code> ise pencere içinde kalmak koşuluyla takvimin dışına taşmasına izin verir (dar
          takvimlerde kullanışlıdır). Önce tercih edilen <code>placement</code>, sonra karşı taraf, ardından kalan taraflar denenir; metin kesilmek yerine alt
          satıra geçer.
        </p>
        <Example src="features/TooltipViewport" title="Görüntü alanı sınırı, sağa yerleşim" />
      </Section>
      <PropsTable
        caption="tooltip prop’u"
        rows={[
          { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tercih edilen taraf; sığmazsa karşı taraf, ardından sağ ve sol denenir.' },
          { name: 'boundary', type: "'calendar' | 'viewport'", default: "'calendar'", description: 'calendar: ayın içinde, başlığın ve hafta günü satırının altında kalır. viewport: takvimin dışına taşabilir.' },
          { name: 'offset', type: 'number', default: '8', description: 'Güne olan boşluk (px).' },
          { name: 'container', type: 'HTMLElement | null', default: 'document.body', description: 'Portal hedefi (ör. bir <dialog>).' },
          { name: 'openDate', type: 'CalendarDate | null', description: 'Kontrollü açık gün.' },
          { name: 'className', type: 'string', description: 'Araç ipucuna eklenen ek sınıf.' },
        ]}
      />
      <ul>
        <li>Araç ipucu sabit konumlandırmayla portal üzerinden render edilir; kökün araç ipucu CSS değişkenleri ve yazı tipi ona kopyalanır.</li>
        <li>Escape odağı taşımadan kapatır; dışarıya dokunmak dokunmayla açılan araç ipucunu kapatır. Metin kesilmek yerine alt satıra geçer.</li>
        <li>İskelet günler (yükleme) asla araç ipucu göstermez. Sebep her zaman günün aria-label’ında da bulunur.</li>
        <li><code>renderDayTooltip(&#123; day, content, trigger, placement &#125;)</code> araç ipucunun içeriğini değiştirir.</li>
      </ul>
    </Page>
  );
}

export function DayContent() {
  return (
    <Page title="Gün içeriği" lead="Verilerinizi — fiyatlar, rozetler, simgeler ve işaretçiler — bir günün seçilebilir olup olmamasından bağımsız olarak günlerde gösterin.">
      <Section title="Etiketler, rozetler, simgeler ve işaretçiler">
        <p>
          <code>getDayData(date)</code> <code>DefaultDayData</code> yapısını döndürdüğünde varsayılan gün içeriği bunu çizer. Paket fiyat veya kapasite
          hesaplamaz; değerleri kendiniz biçimlendirin.
        </p>
        <Example src="features/DayContent" title="Fiyatlar, fırsatlar ve işaretçiler" />
      </Section>
      <PropsTable
        caption="DefaultDayData"
        rows={[
          { name: 'label', type: 'ReactNode', description: 'Sayının altında kısa metin (ör. bir fiyat).' },
          { name: 'badge', type: 'ReactNode', description: 'Küçük bir rozet.' },
          { name: 'icon', type: 'ReactNode', description: 'Üst başlangıç köşesinde küçük bir simge (rozet üst bitiş köşesindedir); sayıyı veya etiketi kaydırmaz.' },
          { name: 'markers', type: '{ color?, label?, className? }[]', description: 'Noktalar; her etiket ekran okuyucuya duyurulur.' },
          { name: 'description', type: 'string', description: 'Erişilebilir etikete eklenir.' },
        ]}
      />
      <p>
        Bunların dışındaki her şey için içeriği (<code>renderDayContent</code>) veya günün tamamını (<code>renderDay</code>) değiştirin — bkz.{' '}
        <a href="#/styling">Stil ve özelleştirme</a>.
      </p>
    </Page>
  );
}

export function Loading() {
  return (
    <Page title="Yükleme ve hatalar" lead="Takvim hiçbir zaman veri çekmez. Verileri uygulamanız yükler ve neyin bilindiğini takvime söyler.">
      <Section title="İlk yükleme ve arka planda yenileme">
        <p>
          Takvim daha önce hiç onsuz gösterilmemişken <code>loading</code> <strong>ilk yükleme</strong> anlamına gelir: günler eşit boyutlu bir iskelet olarak
          çizilir (görünür metin yok; ekran okuyucular için bir durum mesajı ve <code>aria-busy</code>) ve hiçbir gün işaretçi, klavye veya controller ile
          seçilemez. Daha sonra yeniden açılırsa <strong>arka planda yenileme</strong> olur: görünüm, seçim ve odak oldukları gibi kalır. İskeleti yeniden
          göstermek için yeni bir <code>key</code> ile yeniden mount edin.
        </p>
        <Example src="features/InitialLoad" title="İlk yükleme ve yenileme" />
      </Section>
      <Section title="Ay bazında veri, hatalar ve yeniden deneme">
        <p>
          İstekleri <code>onRenderedMonthsChange</code>’ten başlatın ve her ayın durumunu <code>getDataStatus(month)</code>’tan döndürün:{' '}
          <code>unknown</code>, <code>loading</code>, <code>loaded</code> veya <code>error</code>. Verisi yüklenmemiş günler seçilemez (
          <code>unknownDataPolicy: &apos;allow&apos;</code> bunu değiştirir). Hata durumunda <code>onRetry(months)</code>’u çağıran bir yeniden dene düğmesi
          gösterilir.
        </p>
        <Example src="features/MonthData" title="Asenkron müsaitlik" />
      </Section>
      <Section title="Görünür bir yükleme göstergesi">
        <p>
          Varsayılan yükleme görünümü yalnızca gün iskeleti ve ekran okuyucu için bir durumdan ibarettir. <code>renderLoading</code> kendi görünür
          göstergenizi ekler; <code>scope</code> (<code>&apos;month&apos;</code>, <code>&apos;load-more&apos;</code> veya <code>&apos;initial&apos;</code>),
          etkilenen <code>months</code> ve yerelleştirilmiş metinle çağrılır.
        </p>
        <Example src="features/LoadingIndicator" title="Aylar için renderLoading" />
      </Section>
      <PropsTable
        rows={[
          { name: 'loading', type: 'boolean', description: 'Takvim genelinde yükleme (ilk yükleme veya yenileme, yukarıya bakın).' },
          { name: 'getDataStatus', type: '(month) => DataStatus', description: 'Her ayın verisinin durumu.' },
          { name: 'onRetry', type: '(months) => void', description: 'Varsayılan hata arayüzü tarafından çağrılır.' },
          { name: 'renderLoading', type: "({ scope: 'initial' | 'month' | 'load-more', months, status }) => ReactNode", description: 'Ek görünür bir gösterge (iskelet kalır).' },
          { name: 'renderError', type: '({ months, retry }) => ReactNode', description: 'Özel hata arayüzü.' },
          { name: 'onLoadingChange', type: '(event) => void', description: 'Yalnızca geçişlerde: initial, refreshing, loadingMonths, errorMonths, busy.' },
        ]}
      />
      <Note>
        <p>
          Kullanıcı azaltılmış hareketi tercih ettiğinde iskelet parıltısı ve dönen gösterge durur. Yükleyicinizde eskimiş yanıtlara karşı önlem alın: örnek,
          artık render edilmeyen aylar için yapılan istekleri iptal eder.
        </p>
      </Note>
    </Page>
  );
}

export function I18n() {
  return (
    <Page title="Yerel ayarlar, hafta başı ve RTL" lead="Ay ve hafta günü adları Intl’den, takvimin kendi metinleri mesaj paketlerinden gelir.">
      <Section title="Türkçe">
        <Example src="features/LocaleTurkish" title="Türkçe yerel ayar" />
      </Section>
      <Section title="Arapça, sağdan sola">
        <p>
          <code>direction</code> varsayılan olarak yerel ayardan belirlenir (ar, he, fa, ur, … → rtl). Yatay ok tuşları ters çevrilir; ayların sırası
          kronolojik kalır.
        </p>
        <Example src="features/Rtl" title="Arapça (RTL)" />
      </Section>
      <Section title="Hafta başlangıcı">
        <Example src="features/WeekStart" title="en-US’te pazartesi başlangıcı" />
      </Section>
      <Section title="Bir sayfada birden fazla dil">
        <p>
          Her örneğin kendi yerel ayarı ve mesajları vardır. Fransızca, İspanyolca, İtalyanca, Felemenkçe, Almanca ve Arapça paketleri İngilizce ve Türkçe gibi
          eksiksizdir: her metin ve ret sebebi çevrilmiştir (bkz. <a href="#/api-messages">Mesajlar ve biçimlendirme</a>). Farklı bir ifade gerekiyorsa tek
          tek metinleri <code>messages</code> üzerinden geçersiz kılın.
        </p>
        <Example src="features/MoreLocales" title="Fransızca, İspanyolca, İtalyanca ve Felemenkçe" />
      </Section>
      <PropsTable
        rows={[
          { name: 'locale', type: 'string', default: "'en-US'", description: 'Intl biçimlendirmesi için BCP 47 yerel ayarı.' },
          { name: 'messages', type: 'Partial<CalendarMessages>', default: 'messagesEn', description: 'Hazır paketler: messagesEn, messagesTr, messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr. Kısmi geçersiz kılmalar birleştirilir.' },
          { name: 'direction', type: "'ltr' | 'rtl'", default: <>yerel ayardan</>, description: 'Yerleşim yönü.' },
          { name: 'firstDayOfWeek', type: '0–6', default: <>yerel ayardan</>, description: '0 = pazar.' },
          { name: 'weekdayFormat', type: "'narrow' | 'short' | 'long'", default: "'short'", description: 'Hafta günü başlık adları.' },
          { name: 'monthTitleFormat', type: 'Intl.DateTimeFormatOptions', description: 'Ay başlığı biçimi.' },
          { name: 'formatMonthTitle / formatWeekday / formatDayLabel', type: 'functions', description: 'Bu metinler üzerinde tam kontrol.' },
        ]}
      />
    </Page>
  );
}

export function Slots() {
  return (
    <Page title="Slotlar ve render prop’ları" lead="Takvimin çevresine ve içine kendi arayüzünüzü ekleyin; slotlar takvimin durumunu ve eylemlerini alır.">
      <Section title="Header ve footer">
        <p>
          Slotlar bir bağlam alır: <code>selection</code>, <code>phase</code>, <code>validation</code>, <code>activeEndpoint</code>, <code>visibleMonths</code>,{' '}
          <code>renderedMonths</code>, <code>focusedDate</code>, <code>today</code>, <code>layout</code>, <code>messages</code>, <code>locale</code>,{' '}
          <code>formatDate</code> ve <code>actions</code> (controller).
        </p>
        <Example src="features/Slots" title="Header ve footer slotları" />
      </Section>
      <Section title="Gezinme ve ay başlıkları">
        <Example src="features/CustomNavigation" title="Özel gezinme" />
      </Section>
      <PropsTable
        rows={[
          { name: 'renderHeader / renderFooter', type: '(ctx) => ReactNode', description: 'Ayların üstünde / altında (kaydırma alanının dışında).' },
          { name: 'renderNavigation', type: '({ canPrevious, canNext, previous, next, months, labels }, ctx)', description: 'Okların yerini alır (sayfalı mod).' },
          { name: 'renderMonthHeader', type: '({ month, title, index, navigation, status }, ctx)', description: 'Bir ayın başlık satırının yerini alır.' },
          { name: 'renderLoading / renderError / renderLoadMore', type: 'functions', description: 'Bkz. Yükleme ve Kademeli ay yükleme.' },
          { name: 'renderDayTooltip / renderDayContent / renderDay', type: 'functions', description: 'Bkz. Araç ipucu ve Stil ve özelleştirme.' },
        ]}
      />
    </Page>
  );
}

export function Placement() {
  return (
    <Page title="Satır içi, modal ve portal" lead="Takvim her zaman satır içi içeriktir; açma, kapatma ve odak yönetimi uygulamanıza aittir.">
      <Section title="Satır içi">
        <p>
          Diğer tüm örnekler satır içidir: takvim sayfanın bir parçasıdır. Kendini asla kapatmaz. <code>onOutsideClick</code>, React ağacının dışındaki işaretçi
          basışlarını bildirir (araç ipucu gibi kendi portalları içeride sayılır).
        </p>
      </Section>
      <Section title="Modal">
        <p>
          <code>showModal()</code> ile açılan yerel bir <code>&lt;dialog&gt;</code> odağı içinde tutar, Escape ile kapanır ve odağı geri verir. Modal bir
          diyalog üst katmanda (top layer) olduğu için araç ipucu portalını <code>tooltip.container</code> ile diyaloğun içine yönlendirin.
        </p>
        <Example src="features/Modal" title="Diyalog içinde takvim" />
      </Section>
      <Section title="Portal üzerinden açılır pencere (popover)">
        <p>
          Bir portal yalnızca takvimin DOM’unu başka bir yere taşır (burada <code>document.body</code> içine); hiçbir şeyi konumlandırmaz. Açılır pencereyi
          konumlandırmak uygulamanızın sorumluluğundadır — takvim yalnızca kendi araç ipucunu konumlandırır. <code>position: fixed</code> ile bir kez
          yerleştirilen bir açılır pencere, sayfa kaydırılırken konduğu yerde kalır; böylece tetikleyicisinden kopar ve ekranın dışına taşabilir. Örnek,
          konumu her kaydırmada (herhangi bir kaydırma kapsayıcısında, capture aşamasında) ve yeniden boyutlandırmada tetikleyiciye göre yeniden hesaplar ve
          bunu kare başına tek güncellemeye indirger; üstte daha fazla yer varsa yukarı doğru açılır; açılır pencereyi yatayda görüntü alanının içinde tutar ve
          yüksekliğini kullanılabilir alanla sınırlar; tetikleyici görünümden çıkınca da kapanır.
        </p>
        <p>
          Kapatmak da uygulamanın işidir: Escape (takvim Escape’i yalnızca araç ipuçlarından biri açıkken tüketir), <code>onOutsideClick</code> ile bildirilen
          bir dış tıklama (takvimin kendi portalları içeride sayılır), <code>onSelectionComplete</code> içinde bir seçim (<code>onChange</code> değil: zaten
          seçili tarihi yeniden seçmek değişiklik yaymaz, ama seçimi yine tamamlar) ya da sayfayla birlikte unmount. Odak <code>onReady</code> sırasında{' '}
          <code>ref.focusDate()</code> ile ızgaraya taşınır ve kapanışta <code>focus(&#123; preventScroll: true &#125;)</code> ile tetikleyiciye döner. Takvim,
          sabit konumlu bir açılır pencerenin içindeki bir güne odaklanmak için sayfayı asla kendisi kaydırmaz.
        </p>
        <Example src="features/Popover" title="Açılır pencere" />
        <Note>
          <p>
            Birçok bileşen için çakışma yönetimi mi gerekiyor? Bir konumlandırma kütüphanesi (örneğin Floating UI) aynı işi yapar; takvim konumlandırılmış her
            kapsayıcının içinde çalışır.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

export function Synced() {
  return (
    <Page title="Senkron takvimler" lead="Birden fazla takvim aynı seçimi gösterip düzenleyebilir. Gizli bir store yoktur: durumu prop’lar üzerinden paylaşın.">
      <Section title="Paylaşılan değer ve uç">
        <Example src="features/Synced" title="İki takvim, tek seçim" />
      </Section>
      <Section title="Satır içi ve diyalogda">
        <p>
          Diyalogdaki bir takvim yalnızca başka bir örnektir: ona aynı durumu verin. Mount edildiğinde güncel değeri gösterir ve değişiklikleri satır içinde
          hemen görünür. Araç ipucu portalı diyaloğun içine (üst katman) yönlendirilir.
        </p>
        <Example src="features/SyncedDialog" title="Satır içi ve diyalog senkronize" />
      </Section>
      <Section title="Satır içi, modal ve portal">
        <p>
          Aynı fikir, takvim nerede render edilirse edilsin çalışır. Burada tek bir aralığı üç takvim düzenler: sayfada satır içi, modal bir{' '}
          <code>&lt;dialog&gt;</code> içinde ve <code>createPortal</code> ile <code>document.body</code> içine render edilen bir açılır pencerede. Gizli bir
          store yoktur: üçü de aynı <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code>, <code>onActiveEndpointChange</code> ve{' '}
          <code>rules</code> değerlerini alır. Satır içinde bir başlangıç seçin, diyalogda tamamlayın; açılır pencere ardından aralığın tamamıyla açılır.
        </p>
        <ul>
          <li>
            <strong>Paylaşılan</strong> (siz ilettiğiniz için): seçim, sıradaki doldurulacak uç ve kurallar.
          </li>
          <li>
            <strong>Takvime özgü</strong>: görünen ay, klavye odağı, fareyle üzerine gelme ve araç ipucu. Siz kontrol etmedikçe her takvim kendininkini tutar.
          </li>
          <li>
            Diyalog üst katmanda olduğu için takvimi <code>tooltip={'{{ container: dialogContentElement }}'}</code> alır;{' '}
            <code>document.body</code> içine portal edilen bir araç ipucu diyaloğun arkasında kalırdı.
          </li>
          <li>
            Portal yalnızca DOM’u taşır. Açılır pencereyi konumlandırmak (tetikleyiciyi izlemek, yön değiştirmek, görüntü alanında kalmak) ve kapatmak
            uygulamanın işidir; bkz. <a href="#/placement">Satır içi, modal ve portal</a>.
          </li>
          <li>Sonradan mount edilen bir takvim güncel değeri gösterir; birini kapatmak veya unmount etmek diğerlerini sıfırlamaz.</li>
        </ul>
        <Example src="features/SyncedEverywhere" title="Satır içi, modal ve portal senkronize" />
      </Section>
      <PropsTable
        caption="Neler paylaşılır"
        rows={[
          { name: <>Seçim</>, type: 'value', description: 'Aynı value’yu ilettiğinizde paylaşılır.' },
          { name: <>Kurallar ve müsaitlik</>, type: 'rules', description: 'Aynı kaynaktan oluşturulduğunda paylaşılır.' },
          { name: <>Görünen ay</>, type: 'visibleMonth', description: 'Siz kontrol etmedikçe takvime özgüdür.' },
          { name: <>Etkin uç</>, type: 'activeEndpoint', description: 'Kontrollü olduğunda paylaşılır; aksi halde değerden türetilir (yine tutarlıdır).' },
          { name: <>Odak, üzerine gelme, araç ipucu, render edilen aylar</>, type: '—', description: 'Her zaman takvime özgüdür.' },
        ]}
      />
      <p>Sonradan mount edilen bir takvim güncel değeri gösterir; birini unmount etmek diğerlerini sıfırlamaz. Ayrıca bkz. <a href="#/recipe-three-calendars">Üç senkron takvim tarifi</a>.</p>
    </Page>
  );
}

export function Accessibility() {
  return (
    <Page title="Klavye ve erişilebilirlik" lead="Her ay tek sekme durağı olan bir ARIA ızgarasıdır; günler tam etiketli düğmelerdir.">
      <Section title="Deneyin">
        <Example src="features/Keyboard" title="Klavyeyle gezinme" />
      </Section>
      <PropsTable
        caption="Tuşlar"
        rows={[
          { name: '← → ↑ ↓', type: 'move', description: 'Önceki/sonraki gün ve hafta. Yatay oklar RTL’de ters çevrilir.' },
          { name: 'Home / End', type: 'move', description: 'Haftanın başı / sonu.' },
          { name: 'PageUp / PageDown', type: 'move', description: 'Önceki / sonraki ay (Shift ile: yıl).' },
          { name: 'Enter / Space', type: 'select', description: 'Odaktaki günü etkinleştirir.' },
          { name: 'Escape', type: 'dismiss', description: 'Açık bir araç ipucunu odağı taşımadan kapatır (yalnızca biri açıkken tüketilir).' },
        ]}
      />
      <ul>
        <li>Aylar <code>role=&quot;grid&quot;</code>, günler gezici (roving) bir <code>tabIndex</code> ile <code>gridcell</code> + <code>&lt;button&gt;</code>’dur.</li>
        <li>Gün etiketleri tam tarihi, bugün/başlangıç/bitiş/aralık içi bilgisini ve günün neden devre dışı olduğunu içerir. Devre dışı günler <code>aria-disabled</code> kullanır ve odaklanabilir kalır.</li>
        <li>Canlı bir bölge (live region) seçimleri, retleri ve yüklemeyi duyurur.</li>
        <li>Odağı görünen ayların dışına taşımak gezinme yapar; ay eklemek veya çıkarmak odağı asla kaybettirmez.</li>
        <li>Modal odak tuzakları ve odağın geri verilmesi uygulamanın işidir; takvim yalnızca kendi ızgarasının içindeki odağı yönetir.</li>
      </ul>
      <Note>
        <p>Ekran okuyucu davranışı (VoiceOver, NVDA, TalkBack) henüz test edilmedi; işaretleme ARIA ızgara (grid) desenini izler.</p>
      </Note>
    </Page>
  );
}
