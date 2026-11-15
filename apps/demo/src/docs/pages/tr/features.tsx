import { Example } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function SelectionModes() {
  return (
    <Page
      title="Seçim modları"
      lead="mode prop’u bir tıklamanın neyi seçeceğini belirler: tek bir tarih, bir tarih aralığı, birbirinden bağımsız birkaç tarih ya da hiçbir şey (salt okunur). Değerin ve onChange callback’inin tipi her modda farklıdır."
    >
      <Section title="Tek tarih">
        <p>
          Tıklanan tarih seçilir; başka bir tarihe tıklamak seçimi onunla değiştirir. Değer bir <code>CalendarDate</code>’tir, yani{' '}
          <code>&apos;2026-11-13&apos;</code> gibi bir tarih metni; hiçbir şey seçili değilken <code>null</code>’dır.
        </p>
        <Example src="features/ModeSingle" title="Tek tarih" />
      </Section>
      <Section title="Aralık">
        <p>
          İlk tıklama başlangıcı, ikinci tıklama bitişi belirler. Yalnızca başlangıç seçiliyken daha sonraki bir günün üzerine gelindiğinde o güne kadarki
          aralık önizlenir. Başlangıçtan önceki bir güne tıklamak o günden yeni bir aralık başlatır; iki uç da seçildikten sonraki tıklama da yeni bir aralık
          başlatır. Değer bir <code>DateRange</code>’dir: <code>&#123; start, end &#125;</code>; henüz seçilmemiş uç <code>null</code>’dır.
        </p>
        <Example src="features/ModeRange" title="Tarih aralığı" />
      </Section>
      <Section title="Çoklu tarih">
        <p>
          Her tıklama tarihi seçime ekler; seçili bir tarihe tıklamak onu seçimden çıkarır. Değer bir tarih dizisidir.{' '}
          <code>rules.maxSelections</code> en fazla kaç tarih seçilebileceğini belirler; sınıra ulaşıldığında kullanıcı bir tarihi kaldırana kadar yeni
          tarih kabul edilmez.
        </p>
        <Example src="features/ModeMultiple" title="En fazla 5 tarih" />
        <p>
          Bir aralığın hangi günlerde başlayabileceğini sınırlayan kurallar, burada hangi tarihlerin seçilebileceğini de sınırlar. Örneğin{' '}
          <code>startWeekdays</code> değeri <code>[2, 4]</code> olduğunda yalnızca salı ve perşembe seçilebilir (0 = pazar). Kullanıcı izin verilmeyen bir
          güne tıkladığında seçim değişmez: takvim nedeni ekran okuyucular için canlı bölgesine (live region) yazar, günün tooltip’i (güne gelindiğinde ya da odaklanıldığında açılan küçük kutu) da nedeni
          gösterir. Bu metinleri <code>messages.reasons</code> üzerinden değiştirebilirsiniz.
        </p>
        <p>
          Bazı nedenlerde, gün zaten seçilemez göründüğü için varsayılan tooltip açılmaz: geçmişteki ya da gelecekteki bir gün,{' '}
          <code>minDate</code>/<code>maxDate</code> dışındaki bir gün, geçersiz bir tarih veya verisi henüz yüklenmemiş bir gün. Ekran okuyucular nedeni yine
          günün etiketinde duyar. <code>getDayTooltip</code> verirseniz takvim varsayılan tooltip’lerin yerine sizin içeriğinizi gösterir.
        </p>
        <Example src="features/SessionDays" title="Salı ve perşembe seansları" />
      </Section>
      <Section title="Salt okunur">
        <p>
          Takvim aynı günleri, kuralları ve verileri (örneğin hangi tarihlerin dolu olduğunu) gösterir, ancak tıklamalar hiçbir şey seçmez. Izgaranın
          üstündeki bir bildirim kullanıcıya tarihlerin seçilemeyeceğini söyler; bu bildirimi <code>messages.readOnlyNotice</code> ile değiştirebilir veya
          gizleyebilirsiniz.
        </p>
        <Example src="features/ModeReadonly" title="Salt okunur müsaitlik" />
      </Section>
      <Section title="Değer prop’ları: Controlled veya uncontrolled">
        <p>
          <strong>Controlled</strong>: seçimi kendi bileşeninizin state’inde tutar ve takvime geri verirsiniz, örneğin{' '}
          <code>value=&#123;range&#125; onChange=&#123;setRange&#125;</code>; takvim her zaman sizin verdiğiniz değeri gösterir.{' '}
          <strong>Uncontrolled</strong>: yalnızca bir başlangıç değeri (<code>defaultValue</code>) verirsiniz; seçimi takvim kendisi tutar ve her değişikliği
          yine <code>onChange</code> ile bildirir.
        </p>
        <PropsTable
          rows={[
            {
              name: 'value',
              type: 'CalendarDate | null · DateRange · readonly CalendarDate[]',
              description: 'Seçimi siz tuttuğunuzda (controlled) seçim. Tekli modda bir tarih veya null, aralık modunda bir DateRange, çoklu modda bir tarih dizisi.',
            },
            { name: 'defaultValue', type: <><code>value</code> ile aynı</>, description: 'Uncontrolled bir takvimin başlangıç seçimi; takvim ilk render edildiğinde bir kez okunur, sonraki değişiklikler yok sayılır.' },
            { name: 'onChange', type: '(value, event) => void', description: 'Seçimi kullanıcı veya controller (ref) değiştirdiğinde çağrılır. value’yu siz değiştirdiğinizde çağrılmaz.' },
            { name: 'activeEndpoint / defaultActiveEndpoint', type: "'start' | 'end'", description: 'Yalnızca aralık modu: sonraki tıklamanın hangi ucu belirleyeceği. Birden fazla takvimin aynı aralığa devam edebilmesi için bunu siz tutun.' },
          ]}
        />
      </Section>
    </Page>
  );
}

export function DateLimits() {
  return (
    <Page title="Tarih sınırları" lead="Bir tarihten önceki veya sonraki günleri ya da bugünden önceki veya sonraki günleri engelleyin; ay okları da sınırlarda dursun.">
      <Section title="En erken ve en geç tarih">
        <p>
          <code>minDate</code>’ten önceki ve <code>maxDate</code>’ten sonraki günler seçilemez; önceki/sonraki okları da bu tarihleri içeren aylarda durur.
          İki sınır da dahildir: <code>minDate</code>’in kendisi seçilebilir. Örnek, bugünü ve sonraki 30 günü seçilebilir bırakır.
        </p>
        <Example src="features/DateLimits" title="Önümüzdeki 30 gün" />
      </Section>
      <Section title="Geçmiş ve gelecek">
        <p>
          <code>disablePast</code> bugünden önceki, <code>disableFuture</code> bugünden sonraki tüm günleri engeller. <code>minDate</code>/
          <code>maxDate</code>’ten farklı olarak okları durdurmazlar: kullanıcı yine her aya gidebilir, ancak engellenen günleri seçemez.
        </p>
        <Example src="features/PastFuture" title="disablePast ve disableFuture" />
      </Section>
      <Section title="Geçmiş bir tarih seçtirmek: bu ay sonda iken disableFuture">
        <p>
          <code>disableFuture</code> ve iki ayla takvim bu ayı ve gelecek ayı gösterirdi; gelecek ayın tüm günleri de engellenmiş olurdu. Bunun yerine geçen
          ayı ve bu ayı göstermek için içinde bulunulan ayı <code>monthPosition=&#123;2&#125;</code> ile ikinci sıraya koyun. <code>disableFuture</code>{' '}
          yalnızca bugünden sonraki günleri engeller; gösterilen ayları kendiliğinden asla kaydırmaz.
        </p>
        <Example src="features/DisableFutureWindow" title="Geçen ay ve bu ay" />
      </Section>
      <Section title="Bugün">
        <p>
          Bugün ince bir daire ve “Bugün” tooltip’iyle işaretlenir. Tarih, verdiyseniz <code>today</code> prop’undan gelir; vermediyseniz{' '}
          <code>timeZone</code> içinde (varsayılan: tarayıcının saat dilimi) hesaplanır. Gece yarısından sonra, gösterilen ay değişmeden güncellenir.{' '}
          <code>disablePast</code>/<code>disableFuture</code> da aynı tarihi kullanır. <code>highlightToday=&#123;false&#125;</code> yalnızca daireyi ve
          tooltip’i kaldırır; “bugün” bilgisi günün erişilebilir etiketinde kalır.
        </p>
        <Example src="features/TodayMarker" title="Başka bir saat diliminde bugün ve işaretsiz bugün" />
      </Section>
      <PropsTable
        rows={[
          { name: 'minDate / maxDate', type: 'CalendarDate | null', description: 'Seçilebilen ilk ve son gün (ikisi de dahil); oklar bu ayların ötesine geçmez. rules içinde de verilebilir.' },
          { name: 'disablePast / disableFuture', type: 'boolean', default: 'false', description: 'Bugünden önceki / sonraki günleri engeller; okları sınırlamaz.' },
          { name: 'today', type: 'CalendarDate', description: 'Bugün olarak kullanılacak sabit bir tarih. Sunucu tarafı render ve testler için önerilir; böylece her çalıştırma aynı bugünü görür.' },
          { name: 'timeZone', type: 'string', description: 'today verilmediğinde bugünü hesaplamak için kullanılan IANA saat dilimi, ör. Europe/Istanbul. Varsayılan: tarayıcının saat dilimi.' },
        ]}
      />
    </Page>
  );
}

export function LengthRules() {
  return (
    <Page title="Uzunluk kuralları" lead="Bir aralığın en az ve en fazla ne kadar sürebileceğini belirleyin ya da her aralığa aynı uzunluğu verin. Konaklamalar gece, gün aralıkları gün olarak sayılır.">
      <Section title="En kısa ve en uzun süre">
        <p>
          Bir başlangıç seçildiğinde, aralığı fazla kısa veya fazla uzun yapacak bitişler devre dışı kalır; günün etiketi ve tooltip’i nedenini söyler
          (örneğin “Minimum 2 gece”). İki adaptör de, <code>stayRules</code> ve <code>dayRangeRules</code>, ayrıca <code>requireReachableEnd</code>’i açar:
          ardından geçerli bir bitiş gelemeyecek bir başlangıç hemen reddedilir — örneğin en az 2 gece kuralında sonraki gece zaten doluysa. Böylece
          kullanıcı hiçbir zaman tamamlanamayacak bir başlangıçla kalmaz.
        </p>
        <Example src="features/MinMaxLength" title="2 ila 7 gece" />
      </Section>
      <Section title="Sabit süre">
        <p>
          Sabit sürede tek tıklama aralığın tamamını seçer. <code>fixedDays: 3</code> ile bir cumaya tıklamak cuma, cumartesi ve pazarı seçer.
        </p>
        <Example src="features/FixedLength" title="3 günlük geçiş" />
      </Section>
      <PropsTable
        caption="Seçenekler"
        rows={[
          { name: 'stayRules({ minNights, maxNights, fixedNights })', type: 'number', description: 'Gecelik konaklamalar, gece olarak sayılır. Çıkış günü konaklamaya dahil değildir (hariç bitiş): 13 → 20 Kasım 7 gecedir.' },
          { name: 'dayRangeRules({ minDays, maxDays, fixedDays })', type: 'number', description: 'Gün aralıkları, gün olarak sayılır. Son gün dahildir (dahil bitiş): 13 → 20 Kasım 8 gündür.' },
          { name: 'rules.minLength / maxLength / fixedLength', type: 'number', description: 'Adaptörsüz aynısı; birimi rangeSemantics belirler (exclusive: gece, inclusive: gün).' },
          {
            name: 'relaxSchedule',
            type: 'boolean | { weekdays?, length? }',
            default: 'false',
            description: '“Özel tarihler”: süre ve hafta günü kurallarını yok sayar; rezervasyonlar, kapalı günler ve tarih sınırları yine geçerlidir. Süre kurallarını korumak için { length: false }, hafta günü kurallarını korumak için { weekdays: false } verin.',
          },
        ]}
      />
      <Note>
        <p>
          Takvim, bir başlangıcın geçerli bir bitişi olup olmadığına karar vermek için en fazla 63 olası bitiş gününü dener. Başlangıcı yalnızca hiçbir
          bitişin uymadığını kanıtladığında reddeder. Adaylar önce biterse başlangıç seçilebilir kalır ve kullanıcının seçtiği bitiş her zamanki gibi
          denetlenir.
        </p>
      </Note>
    </Page>
  );
}

export function DayRules() {
  return (
    <Page title="Başlangıç/bitiş günleri ve doğrulama" lead="Hangi günlerin bir aralığı başlatıp bitirebileceğini ve hangilerinin aralığın içinde kalabileceğini belirleyin, kendi kurallarınızı ekleyin.">
      <Section title="Başlangıç ve bitiş günleri">
        <p>
          Her gün için üç soru vardır: aralık burada başlayabilir mi (<code>canStart</code>), burada bitebilir mi (<code>canEnd</code>), bu günün içinden
          geçebilir mi (<code>canPassThrough</code>)? <code>stayRules</code> ile bunları hafta günü seçenekleri (<code>checkInWeekdays</code>,{' '}
          <code>checkOutWeekdays</code>, <code>availableWeekdays</code>) ve gün bazında bir durumla (<code>check-in-only</code>,{' '}
          <code>check-out-only</code>, <code>booked</code>, <code>closed</code>) belirlersiniz. Adaptör kullanmadan bunları{' '}
          <code>rules.getDayAvailability(date, ctx)</code>’ten döndürün; <code>ctx</code> kural bağlamıdır: mod, mevcut seçim, seçilmekte olan uç, bugün ve
          kendi <code>ruleContext</code> değeriniz.
        </p>
        <Example src="features/StartEndDays" title="Cuma/cumartesi giriş" />
      </Section>
      <Section title="Özel doğrulama">
        <p>
          Paketin bilmediği bir kural için <code>validateSelection(selection, ctx)</code> kullanın. Kullanıcının veya kodunuzun önerdiği her seçim için
          çalışır (tıklamalar, klavye ve <code>ref.select()</code>). Reddetmek için <code>message</code> içeren bir sorun döndürün: seçim değişmez, mesaj
          ekran okuyucuya bildirilir ve tooltip’te gösterilir. Kural uygulamanızın durumuna bağlıysa (örneğin misafir sayısı), bu durumu{' '}
          <code>ruleContext</code> olarak verin ve <code>ctx.context</code> olarak okuyun; değiştiğinde mevcut seçim yeniden denetlenir.
        </p>
        <Example src="features/CustomValidation" title="En fazla bir hafta sonu" />
      </Section>
      <PropsTable
        caption="DayAvailability (her gün için döndürülür)"
        rows={[
          { name: 'closed', type: 'boolean', description: 'Bu günde hiçbir şey yapılamaz: başlangıç, bitiş veya içinden geçen bir aralık olmaz.' },
          { name: 'canStart / canEnd / canPassThrough', type: 'boolean', default: '!closed', description: 'Başlangıç (veya tekli/çoklu seçim) / aralık bitişi / aralığın içindeki bir gün olabilir.' },
          { name: 'reason', type: 'string', description: 'Kendi etiketiniz, ör. check-out-only; metni messages.dayReasons’tan gelir.' },
          { name: 'message', type: 'string', description: 'Tooltip ve ekran okuyucu bildirimi için hazır metin.' },
          { name: 'schedule', type: 'boolean', description: 'Kısıtlamayı bir takvim düzeni (schedule) kuralı olarak işaretler; relaxSchedule onu yok sayar (rezervasyonlarda kullanılmamalıdır).' },
        ]}
      />
      <p>
        Birden fazla kural setini birleştirmek için <code>rules</code>’a bir dizi verin (<code>false</code>, <code>null</code> veya{' '}
        <code>undefined</code> öğeler atlanır, bu yüzden <code>cond &amp;&amp; rules</code> çalışır) ya da <code>combineRules(...)</code> kullanın.
      </p>
    </Page>
  );
}

export function Orientation() {
  return (
    <Page title="Yön ve ay sayısı" lead="Bir veya birden fazla ayı yan yana ya da alt alta gösterin. Yönü siz seçersiniz; takvim bunu ekran boyutuna göre kendiliğinden değiştirmez (aylar sığmadığında ne olduğu Responsive yerleşim sayfasında anlatılır).">
      <Section title="Birden fazla ay">
        <p>
          <code>numberOfMonths</code> kaç ay gösterileceğini belirler. Örnekte <code>stepMonths=&#123;3&#125;</code> sayesinde her ok tıklaması üç aylık
          bir sayfanın tamamını kaydırır.
        </p>
        <Example src="features/MultipleMonths" title="Üç ay" />
      </Section>
      <Section title="Dikey">
        <p>
          <code>orientation=&quot;vertical&quot;</code> ayları alt alta dizer. Bu diziyi bir kaydırma alanında tutmak için <code>maxBlockSize</code> ekleyin.
        </p>
        <Example src="features/Vertical" title="Dikey aylar" />
      </Section>
      <Section title="Sabit hafta satırı sayısı">
        <p>
          <code>fixedWeeks</code> ile takvim her ayı 6 hafta satırıyla çizer: yalnızca 5 (veya 4) satıra ihtiyaç duyan bir aya sonda boş satırlar eklenir.
          Böylece kullanıcı ay değiştirdiğinde hafta satırı sayısı aynı kalır ve bir ayın daha az satırı olduğu için alttaki yerleşim kaymaz. Gösterilen
          ay sayısı değişmez.
        </p>
        <p>
          Bu prop olmadan her ay yalnızca ihtiyaç duyduğu satırları alır: uzunluğuna ve haftanın hangi gününde başladığına göre dört, beş ya da altı. Örnek
          aynı beş satırlık ayı (haftalar pazartesi başlarken bu aydan itibaren ilk beş satırlık ay) iki kez gösterir:{' '}
          <code>fixedWeeks=&#123;false&#125;</code> ile beş satır vardır, <code>fixedWeeks=&#123;true&#125;</code> ile altıncı, boş bir satır eklenir.
          Görebilmeniz için satırlar çerçevelenmiştir.
        </p>
        <Example src="features/FixedWeeks" title="fixedWeeks ile ve fixedWeeks olmadan beş satırlık ay" />
      </Section>
      <Section title="Sayfalı veya sürekli gezinme">
        <p>
          <code>navigation=&quot;paged&quot;</code> (varsayılan) aynı anda <code>numberOfMonths</code> ay gösterir; oklar bu pencereyi{' '}
          <code>stepMonths</code> ay kaydırır. Yatay yerleşimlere uyar. <code>navigation=&quot;continuous&quot;</code> kullanıcının kaydırdığı ve istek
          üzerine büyüyen bir ay listesi gösterir; dikey ve mobil yerleşimlere uyar. Bkz. <a href="#/load-more">Daha fazla ay yükleme</a>.
        </p>
      </Section>
      <PropsTable
        rows={[
          { name: 'numberOfMonths', type: 'number', default: '1', description: 'Gösterilen ay sayısı (her iki yönde de).' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Aylar yan yana veya alt alta.' },
          { name: 'stepMonths', type: 'number', default: '1', description: 'Bir ok tıklamasının kaç ay kaydıracağı (sayfalı gezinme).' },
          { name: 'monthGap', type: 'number', default: '32', description: 'Aylar arasındaki boşluk (px).' },
          { name: 'fixedWeeks', type: 'boolean', default: 'false', description: 'Her ay 6 hafta satırıyla çizilir (sonda boş satırlar); ay değiştikçe satır sayısı değişmez.' },
        ]}
      />
    </Page>
  );
}

export function MonthPosition() {
  return (
    <Page title="Referans ayın konumu" lead="Birden fazla ay gösterildiğinde referans ayın başta, ortada mı yoksa sonda mı olacağını seçin.">
      <Section title="Başta veya ortada">
        <p>
          Referans ay, takvimin açıldığı ve gezinmenin başladığı aydır: seçili tarihin ayı, seçim yoksa içinde bulunulan ay; isterseniz{' '}
          <code>defaultVisibleMonth</code> veya <code>visibleMonth</code> ile siz belirlersiniz. <code>monthPosition</code> (1’den başlar) bu ayın
          gösterilen aylar arasındaki yerini belirler; referans ayı değil, pencereyi kaydırır. Referans ay kasım ve ay sayısı üç iken{' '}
          <code>monthPosition=&#123;1&#125;</code> kasım, aralık ve ocağı; <code>monthPosition=&#123;2&#125;</code> ekim, kasım ve aralığı gösterir.
        </p>
        <p>
          Örnek, ikisini de referans ay olarak bu ayla gösterir. Aylar her zaman tarih sırasındadır. Pencere <code>minDate</code>/<code>maxDate</code>’in
          ötesine geçecekse sınırların içinde kalacak şekilde kaydırılır.
        </p>
        <Example src="features/MonthPosition" title="monthPosition 1 ve 2 karşılaştırması" />
      </Section>
    </Page>
  );
}

export function Responsive() {
  return (
    <Page
      title="Responsive yerleşim"
      lead="Takvim pencereyi değil kendi kapsayıcısını ölçer; bu yüzden kenar çubuğunda, diyalogda veya tam sayfada aynı şekilde uyum sağlar."
    >
      <Section title="Aylar sığmadığında">
        <p>
          Bir ay genişlikte en az <code>7 × minDaySize</code> artı iç boşluk ister. İstenen aylar yan yana sığmadığında ne olacağına <code>overflow</code>{' '}
          karar verir: <code>wrap</code> (varsayılan) ayları yeni bir satıra taşır, <code>scroll</code> onları takvimin içinde yatay kayan tek bir satırda
          tutar, <code>reduce-months</code> daha az ay gösterir. Verdiğiniz <code>numberOfMonths</code> değişmez; gerçekte neyin gösterildiğini{' '}
          <code>onLayoutChange</code> bildirir. Boyut değişirken seçim ve klavye odağı korunur. Örnekte kutunun köşesini sürükleyerek boyutunu değiştirin.
        </p>
        <Example src="features/Responsive" title="Yerleşim kapsayıcıya uyar" />
      </Section>
      <Section title="wrap">
        <p>Varsayılan. Hiçbir şey gizlenmez: sığmayan aylar yeni satıra geçer ve takvim uzar. Dikeyde yeri olan sayfalar için uygundur.</p>
        <Example src="features/OverflowWrap" title="overflow: wrap" />
      </Section>
      <Section title="scroll">
        <p>Takvim tek satırın yüksekliğini korur; aylar onun içinde yatay kayar. Araç çubukları veya sabit yükseklikli paneller için uygundur.</p>
        <Example src="features/OverflowScroll" title="overflow: scroll" />
      </Section>
      <Section title="reduce-months">
        <p>
          Aylar sığmadığı sürece istenenden az ay gösterir, yer açılınca istenen sayıya döner. Referans ay her zaman görünür kalır. Kaç ay gösterildiğini{' '}
          <code>onLayoutChange</code> söyler; örnekte olduğu gibi bunu metin olarak gösterebilirsiniz.
        </p>
        <Example src="features/OverflowReduce" title="overflow: reduce-months" />
      </Section>
    </Page>
  );
}

export function DaySize() {
  return (
    <Page title="Gün boyutu ve iç kaydırma" lead="Günleri dokunmaya yetecek kadar büyük tutun; yer kalmadığında sayfa değil, takvimin içindeki aylar kaysın.">
      <Section title="En küçük gün boyutu">
        <p>
          <code>minDaySize</code> (varsayılan 40 px) bir gün düğmesinin en küçük boyutudur; <code>maxDaySize</code> (varsayılan 56) bir gün hücresinin en
          büyük yüksekliğidir. En küçük boyutta tek bir ay bile sığmazsa aylar takvimin içinde yatay kayar: sayfanın kendisi asla yatay kaydırma çubuğu
          almaz ve takvimin kaydırma çubuğu görünür kalır. Header ve footer slotları bu kaydırma alanının dışında kalır. <code>maxBlockSize</code> ay
          alanının yüksekliğini sınırlar ve onu dikeyde kaydırılabilir yapar.
        </p>
        <Example src="features/DaySize" title="Dar bir kutuda 48 px’lik günler" />
      </Section>
    </Page>
  );
}

export function LoadMore() {
  return (
    <Page
      title="Daha fazla ay yükleme"
      lead="Sürekli gezinmede takvim sayfalar yerine kaydırılan bir ay listesi gösterir ve istendiğinde listenin başına veya sonuna ay ekler."
    >
      <Section title="Sürekli gezinme nasıl çalışır">
        <p>
          <code>navigation=&quot;continuous&quot;</code> ile takvim önce referans aydan başlayarak <code>numberOfMonths</code> ay gösterir. Her yükleme,{' '}
          <code>loadDirections</code>’ın izin verdiği yönlerde listenin başına veya sonuna <code>monthsPerLoad</code> ay (varsayılan:{' '}
          <code>numberOfMonths</code>) ekler ve <code>minDate</code>/<code>maxDate</code>’i içeren aylarda durur. Önceki aylar eklendiğinde kaydırma konumu
          korunur; böylece kullanıcının parmağının altındaki tarihler zıplamaz.
        </p>
        <p>
          Sayfayı hafif tutmak için liste <code>maxRenderedMonths</code> (varsayılan 24) aya indirilir: her eklemeden sonra eklenen yere en uzak aylar
          kaldırılır; liste hiçbir zaman bundan fazla ay tutmaz. Klavye odağındaki gün kaldırılan bir aydaysa odak önce, kalan aylardan ekranda görünen
          ve kaldırılana en yakın aydaki aynı güne taşınır; böylece odak takvimde kalır ve sayfa kaymaz. Her ekleme — klavye odağı listenin sonunu geçtiğinde yapılanlar da —{' '}
          <code>onLoadMore</code> ve <code>onRenderedMonthsChange</code>’i çağırır (verinizi orada yükleyin). Referans ay değişmez, bu yüzden{' '}
          <code>onVisibleMonthChange</code> çağrılmaz. Sayfalı gezinme (varsayılan) farklı çalışır: oklar gösterilen ayları değiştirir — bkz.{' '}
          <a href="#/orientation">Yön ve ay sayısı</a>.
        </p>
        <p>
          <code>loadDirections</code> yalnızca yerleşik kontrollerin hangi uçlarda görüneceğini belirler: daha fazla yükle düğmeleri (veya sizin{' '}
          <code>renderLoadMore</code> kontrolleriniz) ve <code>loadMore=&quot;auto&quot;</code> ile görünür alana girince yükleme yapan görünmez işaretler.
          Kodu sınırlamaz: <code>ref.loadMore(direction)</code> (veya bir slotun içinde <code>ctx.actions.loadMore</code>) her iki yönde de ay ekler; yine
          yalnızca sürekli modda ve yine <code>minDate</code>/<code>maxDate</code>’te durarak. Klavye odağını listenin herhangi bir ucunun ötesine taşımak
          da ay ekler.
        </p>
        <p>
          Ayı kendi state’inizden controlled bir <code>visibleMonth</code> ile de belirleyebilirsiniz (ayı siz verir, siz güncellersiniz). Değiştirmek{' '}
          <code>goToMonth()</code> gibi çalışır: listede zaten olan bir aya kaydırılır ve liste korunur; başka bir ay için liste onun çevresinde yeniden
          kurulur (<code>maxRenderedMonths</code> sınırında; veri yüklemeniz takip edebilsin diye <code>onRenderedMonthsChange</code> ile bildirilir) ve o
          aya kaydırılır. Geçiş anlıktır, odak taşınmaz ve kendi değişikliğiniz için <code>onVisibleMonthChange</code> çağrılmaz. State’inizi{' '}
          <code>onVisibleMonthsChange</code>’ten değil, <code>onVisibleMonthChange</code>’ten güncelleyin: görünen aylar her kaydırmada değişir; onları geri
          yazmak takvimin kullanıcının kaydırmasının peşinden koşmasına yol açar. Ayrıntılar için bkz.{' '}
          <a href="#/api-events">Callback’ler ve olaylar → onVisibleMonthChange</a>.
        </p>
      </Section>
      <Section title="Varsayılan düğmeler">
        <p>
          Takvim listenin üstüne “Daha önceki tarihleri göster”, altına “Daha fazla tarih göster” düğmesi ekler (takvimin dilinde). Arayüzünüze uyuyorsa
          bunları kullanın. Örnekte iki yön de açıktır.
        </p>
        <Example src="features/LoadMoreDefault" title="Varsayılan daha fazla yükle düğmeleri" />
      </Section>
      <Section title="Kendi düğme metniniz: loadMoreLabels">
        <p>
          <code>loadMoreLabels=&#123;&#123; previous, next &#125;&#125;</code> yalnızca varsayılan düğmelerin içini değiştirir; herhangi bir{' '}
          <code>ReactNode</code> alır (metin, simge veya ikisi). Davranış, odak yönetimi ve erişilebilirlik paketin elinde kalır; yalnızca metin veya bir
          simge farklıysa bunu tercih edin. Örnek, iki yönde de yüklenecek ay olsun diye içinde bulunulan aydan iki ay sonra başlar.
        </p>
        <Example src="features/LoadMore" title="loadMoreLabels" />
      </Section>
      <Section title="Kendi kontrolünüz: renderLoadMore">
        <p>
          <code>renderLoadMore(&#123; direction, canLoad, loading, loadMore, label &#125;, ctx)</code> her varsayılan düğmenin yerine kendi kontrolünüzü,
          örneğin bir bağlantıyı render eder. <code>ctx</code> slot bağlamıdır (seçim, görünen aylar, eylemler, …). <code>loadDirections</code> ile açılan
          her yön için çağrılır (diğer uçlarda hiç kontrol olmaz); liste <code>minDate</code>/<code>maxDate</code>’e ulaştıktan sonra da: orada{' '}
          <code>canLoad</code> değeri <code>false</code>’tur ve <code>loadMore()</code> hiçbir şey yapmaz; böylece kontrolünüz devre dışı bir durum ya da
          “Başka tarih yok” gibi bir metin gösterebilir (veya <code>null</code> döndürebilir). Varsayılan düğme orada yalnızca kaybolurdu.
        </p>
        <p>
          Kontrolünüzün erişilebilirliği size aittir. Takvimin üstlendiği tek şey: sınıra ulaşıldığı anda klavye odağı kontroldeyse odak yeni eklenen ilk
          güne taşınır; böylece kullanıcı artık hiçbir şey yapmayan bir kontrolde kalmaz. Örnek, bitiş durumuna kolayca ulaşılsın diye iki ay ilerideki
          bir <code>maxDate</code>’te durur.
        </p>
        <Example src="features/LoadMoreRender" title="renderLoadMore" />
      </Section>
      <Section title="Liste dışındaki kontroller: loadMore=&quot;manual&quot;">
        <p>
          <code>loadMore=&quot;manual&quot;</code> ay alanında hiçbir kontrol göstermez; aylar yalnızca controller üzerinde{' '}
          <code>loadMore(&apos;previous&apos; | &apos;next&apos;)</code> çağırdığınızda eklenir — <code>ref</code> veya bir slotun içinde{' '}
          <code>ctx.actions</code>. Düğmeleri bir footer’a, araç çubuğuna veya yapışkan (sticky) bir çubuğa koymak için kullanın. Üçüncü seçenek olan{' '}
          <code>loadMore=&quot;auto&quot;</code>, listenin sonu görünür alana girdiğinde otomatik olarak yükler.
        </p>
        <Example src="features/LoadMoreManual" title="Footer’daki düğmelerle yükleme" />
      </Section>
      <PropsTable
        rows={[
          { name: 'navigation', type: "'paged' | 'continuous'", default: "'paged'", description: 'Oklarla değiştirilen ay sayfaları ya da büyüyen bir liste.' },
          { name: 'loadMore', type: "'button' | 'auto' | 'manual'", default: "'button'", description: 'Liste uçlarında düğmeler, bir uç görünür alana girince otomatik yükleme ya da yalnızca kodunuzdan.' },
          { name: 'loadDirections', type: "'next' | 'previous' | 'both'", default: "'next'", description: 'Yerleşik kontrol veya otomatik yükleme alan liste uçları. ref.loadMore(direction) her durumda iki yönde de çalışır.' },
          { name: 'monthsPerLoad', type: 'number', default: 'numberOfMonths', description: 'Her yüklemede eklenen ay sayısı.' },
          { name: 'maxRenderedMonths', type: 'number', default: '24', description: 'Render edilmiş tutulan en fazla ay sayısı (asla numberOfMonths’tan az değil); en uzaktakiler kaldırılır, kaldırılan aydaki odak kalan bir güne taşınır.' },
          { name: 'loadMoreLabels', type: '{ previous?, next?: ReactNode }', description: 'Varsayılan düğmelerin içeriği.' },
          { name: 'renderLoadMore', type: '(props, ctx) => ReactNode', description: 'Her yön için kendi kontrolünüz.' },
        ]}
      />
    </Page>
  );
}

export function GoToMonth() {
  return (
    <Page title="Ayı koddan değiştirme" lead="Kendi arayüzünüzden, örneğin bir “İlk müsait tarih” düğmesiyle, seçimi değiştirmeden belirli bir ayı gösterin.">
      <Section title="İlk müsait tarihe git">
        <p>
          Controller’ı bir <code>ref</code> ile alın (React ref’i: <code>useRef</code> size metotları takvim üzerinde çalışan bir nesne verir), ardından{' '}
          <code>ref.goToMonth(month, &#123; focus, behavior &#125;)</code> çağırın. <code>&#123; month, clamped &#125;</code> döndürür:{' '}
          <code>minDate</code>/<code>maxDate</code> dışındaki bir ay en yakın izin verilen ayla değiştirilir ve <code>clamped</code> değeri{' '}
          <code>true</code> olur. Takvim boş tarih aramaz: ilk müsait ayı uygulamanız bilir ve onu iletir.
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
    <Page title="Tooltip" lead="Tooltip, bir günün yanında açılan küçük kutudur: günün neden seçilemediğini söyleyebilir, bir fiyat gösterebilir ya da aralık seçilirken ipucu verebilir.">
      <Section title="Gün tooltip’leri">
        <p>
          <code>getDayTooltip(&#123; day, data &#125;)</code>’ten bir metin veya <code>&#123; content, persistent &#125;</code> döndürün; tooltip
          istemiyorsanız <code>null</code> döndürün. Tooltip’ler kullanıcı günün üzerine geldiğinde, ona klavyeyle odaklandığında veya dokunduğunda açılır;{' '}
          <code>persistent</code> olan, hiçbir etkileşim olmadan görünür. <code>getDayTooltip</code> olmadan seçilemeyen bir gün nedenini gösterir (geçmiş/
          gelecek günler, sınır dışındaki günler, geçersiz tarihler ve verisi yüklenmemiş günler hariç); bugün ise “Bugün” gösterir.
        </p>
        <Example src="features/Tooltip" title="Sebepler ve ipuçları" />
      </Section>
      <Section title="Tooltip nerede görünebilir">
        <p>
          Varsayılan <code>boundary=&quot;calendar&quot;</code> ile tooltip takvimin içinde, günün ayının başlığının ve hafta günü satırının altında kalır;
          böylece gezinmeyi asla örtmez. <code>boundary=&quot;viewport&quot;</code> ise tarayıcı penceresinin içinde kalmak koşuluyla takvimin dışına
          taşmasına izin verir; dar takvimlerde işe yarar. Önce tercih edilen <code>placement</code>, sonra karşı taraf, ardından kalan iki taraf denenir;
          uzun metin kesilmek yerine alt satıra geçer.
        </p>
        <Example src="features/TooltipViewport" title="Görüntü alanı sınırı, sağa yerleşim" />
      </Section>
      <PropsTable
        caption="tooltip prop’u"
        rows={[
          { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Tercih edilen taraf; sığmazsa karşı taraf, ardından diğer iki taraf denenir.' },
          { name: 'boundary', type: "'calendar' | 'viewport'", default: "'calendar'", description: 'calendar: takvimin içinde, ay başlığının ve hafta günü satırının altında kalır. viewport: takvimin dışına taşabilir.' },
          { name: 'offset', type: 'number', default: '8', description: 'Güne olan uzaklık (px).' },
          { name: 'container', type: 'HTMLElement | null', default: 'document.body', description: 'Tooltip’in içine render edildiği öğe, ör. açık bir <dialog>.' },
          { name: 'openDate', type: 'CalendarDate | null', description: 'Bu günün tooltip’ini kendi state’inizden açar (controlled); null kapatır.' },
          { name: 'className', type: 'string', description: 'Tooltip’e eklenen ek sınıf.' },
        ]}
      />
      <ul>
        <li>Tooltip varsayılan olarak <code>document.body</code> içine render edilir, bu yüzden takvimin kaydırma alanı onu asla kesmez; CSS değişkenleri ve yazı tipi takvimden kopyalanır.</li>
        <li>Escape odağı taşımadan kapatır; başka bir yere dokunmak, dokunmayla açılmış tooltip’i kapatır.</li>
        <li>Tarihleri yüklenirken boş yer tutucu olarak çizilen günler tooltip göstermez. Bir günün neden seçilemediği her zaman aria-label’ında da bulunur.</li>
        <li><code>renderDayTooltip(&#123; day, content, trigger, placement &#125;)</code> ile tooltip’in içeriğini kendiniz render edebilirsiniz.</li>
      </ul>
    </Page>
  );
}

export function DayContent() {
  return (
    <Page title="Günlerde etiket, badge ve simge" lead="Kendi verilerinizi — fiyatlar, badge’ler, simgeler ve renkli noktalar — bir günün seçilebilir olup olmamasından bağımsız olarak günlerde gösterin.">
      <Section title="Etiketler, badge’ler, simgeler ve işaretçiler">
        <p>
          <code>getDayData(date)</code>’ten <code>DefaultDayData</code> yapısında bir nesne döndürün; varsayılan gün içeriği onu çizer: sayının altında bir
          etiket, bir badge, bir simge ve işaretçi noktaları. Paket fiyat veya kapasite hesaplamaz; değerleri biçimlendirilmiş olarak verin. Hangi günlerin
          seçilebileceğine yine kurallar karar verir.
        </p>
        <Example src="features/DayContent" title="Fiyatlar, fırsatlar ve işaretçiler" />
      </Section>
      <PropsTable
        caption="DefaultDayData"
        rows={[
          { name: 'label', type: 'ReactNode', description: 'Sayının altında kısa metin, ör. bir fiyat.' },
          { name: 'badge', type: 'ReactNode', description: 'Üst bitiş köşesinde küçük bir badge.' },
          { name: 'icon', type: 'ReactNode', description: 'Üst başlangıç köşesinde küçük bir simge; sayıyı veya etiketi kaydırmaz.' },
          { name: 'markers', type: '{ color?, label?, className? }[]', description: 'Küçük renkli noktalar. Noktalar ekran okuyuculardan gizlenir; her label günün erişilebilir açıklamasına eklenir (description’dan sonra, tekrar etmeden).' },
          { name: 'description', type: 'string', description: 'Ekran okuyucuların günün etiketinden sonra okuduğu ek metin (aria-describedby).' },
        ]}
      />
      <p>
        Bunların dışındaki her şey için günün içeriğini (<code>renderDayContent</code>) veya günün tamamını (<code>renderDay</code>) değiştirin — bkz.{' '}
        <a href="#/styling">Stil ve özelleştirme</a>.
      </p>
    </Page>
  );
}

export function Loading() {
  return (
    <Page title="Yükleme ve hatalar" lead="Takvim hiçbir zaman veri çekmez. Verileri uygulamanız yükler ve takvime neyin yüklendiğini, yüklenmekte olduğunu veya başarısız olduğunu söyler.">
      <Section title="İlk yükleme">
        <p>
          Takvim ilk göründüğünde <code>loading</code> açıksa günler, gün numaraları olmadan boş yer tutucular olarak çizilir; ekran okuyucular bir durum mesajı alır ve
          takvim <code>aria-busy</code> ayarlar. Bu sırada bir günün seçilip seçilemeyeceği <code>unknownDataPolicy</code> kural seçeneğine bağlıdır:{' '}
          <code>&apos;block&apos;</code> (varsayılan) ile hiçbir şey seçilemez — ne fareyle ne klavyeyle ne de <code>ref.select()</code> ile;{' '}
          <code>&apos;allow&apos;</code> ile seçim her zamanki gibi çalışır.
        </p>
        <p>
          Örnekte “Yeniden yükle (ilk yükleme)” takvimi yeni bir <code>key</code> ile yeniden mount eder; böylece yer tutucular üç saniye boyunca yeniden
          görünür.
        </p>
        <Example src="features/InitialLoad" title="İlk yükleme ve arka planda yenileme" />
      </Section>
      <Section title="Arka planda yenileme">
        <p>
          Tarihler bir kez gösterildikten sonra <code>loading</code> yeniden açılırsa aylar, seçim ve odak korunur. Günler sayılarını korur ve seçilebilir
          kalır; yalnızca <code>aria-busy</code> ayarlanır. Yukarıdaki örnekte “Arka planda yenile” düğmesiyle deneyin.
        </p>
      </Section>
      <Section title="Ay bazında veri, hatalar ve yeniden deneme">
        <p>
          Veriler ay ay yükleniyorsa istekleri <code>onRenderedMonthsChange</code>’ten başlatın (hangi ayların eklendiğini söyler) ve her ayın durumunu{' '}
          <code>getDataStatus(month)</code>’tan döndürün: <code>unknown</code>, <code>loading</code>, <code>loaded</code> veya <code>error</code>. Verisi hâlâ yüklenen
          veya durumu bilinmeyen aylarda yer tutucular görünür ve varsayılan politikada bu ayların günleri seçilemez (
          <code>unknownDataPolicy: &apos;allow&apos;</code> bunu değiştirir). Hata alan bir ay, <code>onRetry(months)</code>’u çağıran bir yeniden dene
          düğmesi gösterir. Örnekte görünen iki aydan sonraki ay bir kez hata verir: görmek için sonraki okuna basın.
        </p>
        <Example src="features/MonthData" title="Ay ay yüklenen müsaitlik" />
      </Section>
      <Section title="Görünür bir yükleme göstergesi">
        <p>
          Varsayılan olarak yükleme yalnızca yer tutucularla ve ekran okuyucular için bir durum mesajıyla gösterilir. Kendi dönen göstergenizi veya
          metninizi göstermek için <code>renderLoading</code> kullanın. Şunları alır: <code>scope</code> — verisi hâlâ yüklenen bir ay için{' '}
          <code>&apos;month&apos;</code>, sürekli modda yeni eklenen aylar için <code>&apos;load-more&apos;</code>, takvim genelindeki{' '}
          <code>loading</code> için <code>&apos;initial&apos;</code> —, etkilenen <code>months</code> ve çevrilmiş “Yükleniyor” metni.
        </p>
        <Example src="features/LoadingIndicator" title="Aylar için renderLoading" />
      </Section>
      <PropsTable
        rows={[
          { name: 'loading', type: 'boolean', description: 'Tüm takvim için yükleme: ilk yükleme veya arka planda yenileme (yukarıya bakın).' },
          { name: 'getDataStatus', type: '(month) => DataStatus', description: 'Her ayın verisinin durumu: unknown, loading, loaded veya error.' },
          { name: 'onRetry', type: '(months) => void', description: 'Varsayılan yeniden dene düğmesi tarafından çağrılır.' },
          { name: 'renderLoading', type: '({ scope, months, status, messages }, ctx) => ReactNode', description: 'Ek, görünür bir gösterge; yer tutucular kalır.' },
          { name: 'renderError', type: '({ months, retry, messages }, ctx) => ReactNode', description: 'Kendi hata mesajınız ve yeniden deneme kontrolünüz.' },
          { name: 'onLoadingChange', type: '(event) => void', description: 'Yükleme durumu değiştiğinde çağrılır (initial, refreshing, loadingMonths, errorMonths, busy).' },
        ]}
      />
      <Note>
        <p>
          Kullanıcı sistemde azaltılmış hareketi seçtiyse yer tutucuların parıltısı ve dönen gösterge durur. Yükleyicinizde geç gelen yanıtlara karşı önlem
          alın: örnek, artık render edilmeyen aylar için yapılan istekleri iptal eder.
        </p>
      </Note>
    </Page>
  );
}

export function I18n() {
  return (
    <Page title="Yerel ayarlar, hafta başı ve RTL" lead="Ay ve hafta günü adları tarayıcının Intl API’sinden, takvimin kendi metinleri (düğmeler, sebepler, duyurular) mesaj paketlerinden gelir.">
      <Note>
        <p>
          Bir takvimin dili yalnızca kendi <code>locale</code> ve <code>messages</code> prop’larından gelir; bu dokümantasyonun dil seçimi onu değiştirmez.
          Tek tek metinleri değiştirmek veya hazır paketi olmayan bir dil eklemek için bkz. <a href="#/api-messages">Mesajlar ve biçimlendirme</a>.
        </p>
      </Note>
      <Section title="Türkçe">
        <p>
          <code>locale</code> ay ve hafta günü adlarını ve haftanın ilk gününü (tr-TR için pazartesi) belirler; <code>messages</code> takvimin kendi
          metinlerini çevirir.
        </p>
        <Example src="features/LocaleTurkish" title="Türkçe yerel ayar" />
      </Section>
      <Section title="Arapça, sağdan sola">
        <p>
          <code>direction</code> varsayılan olarak yerel ayara uyar (ar, he, fa, ur, … → sağdan sola). Sol ve sağ ok tuşları buna göre yer değiştirir;
          aylar tarih sırasında kalır.
        </p>
        <Example src="features/Rtl" title="Arapça (RTL)" />
      </Section>
      <Section title="Hafta başlangıcı">
        <p>
          <code>firstDayOfWeek</code> yerel ayarın haftanın ilk günü ayarını geçersiz kılar (0 = pazar … 6 = cumartesi). Örnek, haftası pazar başlayan
          en-US’i kullanır ve haftayı pazartesi başlatır.
        </p>
        <Example src="features/WeekStart" title="en-US’te pazartesi başlangıcı" />
      </Section>
      <Section title="Bir sayfada birden fazla dil">
        <p>
          Her takvimin kendi yerel ayarı ve mesajları vardır; hiçbir şey global değildir. Fransızca, İspanyolca, İtalyanca, Felemenkçe, Almanca ve Arapça
          paketleri İngilizce ve Türkçe gibi eksiksizdir: her metin ve ret sebebi çevrilmiştir (bkz. <a href="#/api-messages">Mesajlar ve biçimlendirme</a>).
          Tek tek metinleri değiştirmek için onları <code>messages</code> içinde verin; paketin geri kalanı korunur.
        </p>
        <Example src="features/MoreLocales" title="Fransızca, İspanyolca, İtalyanca ve Felemenkçe" />
      </Section>
      <PropsTable
        rows={[
          { name: 'locale', type: 'string', default: "'en-US'", description: 'Dil ve bölge (BCP 47), ör. tr-TR; adlar, sayı biçimleri ve haftanın ilk günü için kullanılır.' },
          { name: 'messages', type: 'Partial<CalendarMessages>', default: 'messagesEn', description: 'Hazır paketler: messagesEn, messagesTr, messagesDe, messagesFr, messagesEs, messagesIt, messagesNl, messagesAr. Verdiğiniz metinler yalnızca o metinlerin yerini alır.' },
          { name: 'direction', type: "'ltr' | 'rtl'", default: <>yerel ayardan</>, description: 'Soldan sağa veya sağdan sola.' },
          { name: 'firstDayOfWeek', type: '0–6', default: <>yerel ayardan</>, description: 'Haftanın ilk sütunu; 0 = pazar.' },
          { name: 'weekdayFormat', type: "'narrow' | 'short' | 'long'", default: "'short'", description: 'Başlıktaki hafta günü adlarının uzunluğu.' },
          { name: 'monthTitleFormat', type: 'Intl.DateTimeFormatOptions', description: 'Ay başlığının biçimi.' },
          { name: 'formatMonthTitle / formatWeekday / formatDayLabel', type: 'functions', description: 'Bu metinleri kendiniz oluşturun.' },
        ]}
      />
    </Page>
  );
}

export function Slots() {
  return (
    <Page title="Slotlar ve render prop’ları" lead="Takvimin üstüne, altına ve içine kendi arayüzünüzü ekleyin. Slot, JSX’inizi döndüren bir fonksiyon prop’udur (render prop) ve takvimin durumunu ve eylemlerini alır.">
      <Section title="Header ve footer">
        <p>
          <code>renderHeader</code> ve <code>renderFooter</code> slot bağlamını (<code>ctx</code>) alır: mevcut <code>selection</code>, aşaması{' '}
          <code>phase</code> (boş, başlangıç seçili, tamamlandı), <code>validation</code>, <code>activeEndpoint</code>, <code>visibleMonths</code>,{' '}
          <code>renderedMonths</code>, <code>focusedDate</code>, <code>today</code>, <code>layout</code>, <code>messages</code>, <code>locale</code>,{' '}
          <code>formatDate</code> ve <code>actions</code> (controller: <code>ref</code> ile aynı metotlar). Örnekte header, giriş mi çıkış mı isteneceğini
          aşamadan okur; footer’daki Temizle düğmesi <code>ctx.actions.clear()</code>’ı çağırır.
        </p>
        <Example src="features/Slots" title="Header ve footer slotları" />
      </Section>
      <Section title="Gezinme ve ay başlıkları">
        <p>
          <code>renderNavigation</code> önceki/sonraki oklarının yerini alır (burada tüm aylar için tek bir çubuk); <code>renderMonthHeader</code> her ayın
          başlık satırının yerini alır.
        </p>
        <Example src="features/CustomNavigation" title="Özel gezinme" />
      </Section>
      <PropsTable
        rows={[
          { name: 'renderHeader / renderFooter', type: '(ctx) => ReactNode', description: 'Ayların üstünde / altında, kaydırma alanlarının dışında.' },
          { name: 'renderNavigation', type: '({ canPrevious, canNext, previous, next, months, labels }, ctx)', description: 'Okların yerini alır (sayfalı gezinme).' },
          { name: 'renderMonthHeader', type: '({ month, title, index, navigation, status }, ctx)', description: 'Bir ayın başlık satırının yerini alır.' },
          { name: 'renderLoading / renderError / renderLoadMore', type: 'functions', description: 'Bkz. Yükleme ve hatalar ile Daha fazla ay yükleme.' },
          { name: 'renderDayTooltip / renderDayContent / renderDay', type: 'functions', description: 'Bkz. Tooltip ile Stil ve özelleştirme.' },
        ]}
      />
    </Page>
  );
}

export function Placement() {
  return (
    <Page
      title="Satır içinde, diyalogda veya popover’da"
      lead="Takvim her zaman sayfadaki sıradan bir içeriktir. Onu açmak, kapatmak ve odağı ona taşıyıp geri vermek uygulamanızın işidir."
    >
      <Section title="Satır içinde">
        <p>
          Diğer tüm örnekler satır içidir: takvim sayfanın bir parçasıdır ve kendini asla kapatmaz. Kullanıcının başka bir yere tıkladığını bilmeniz
          gerekiyorsa <code>onOutsideClick</code> takvimin dışındaki işaretçi basışlarını bildirir (takvimin kendi tooltip’i içeride sayılır).
        </p>
      </Section>
      <Section title="Diyalogda">
        <p>
          <code>showModal()</code> ile açılan yerel bir <code>&lt;dialog&gt;</code> odağı içinde tutar, Escape ile kapanır ve kapanınca odağı geri verir.
          Modal bir diyalog tarayıcının üst katmanında (top layer), her şeyin üstünde çizilir; bu yüzden sayfa gövdesine render edilen bir tooltip onun
          arkasında kalır: tooltip’i <code>tooltip.container</code> ile diyaloğun içine render edin.
        </p>
        <Example src="features/Modal" title="Diyalog içinde takvim" />
      </Section>
      <Section title="Portal ile render edilen bir popover’da">
        <p>
          Bir portal yalnızca takvimin HTML’ini sayfada başka bir yere taşır (burada <code>document.body</code> içine); hiçbir şeyi konumlandırmaz.
          Popover’ı konumlandırmak uygulamanızın işidir — takvim yalnızca kendi tooltip’ini konumlandırır. <code>position: fixed</code> ile bir kez
          yerleştirilen bir popover sayfa kaydırılırken olduğu yerde kalır; böylece düğmesinden uzaklaşır ve ekranın dışına çıkabilir. Bu yüzden örnek,
          konumu her kaydırmada ve yeniden boyutlandırmada (kare başına en fazla bir kez) düğmeye göre yeniden hesaplar, üstte daha fazla yer varsa düğmenin
          üstünde açılır, popover’ı yatayda pencerenin içinde tutar, yüksekliğini boş alanla sınırlar ve düğme görünümden çıkınca popover’ı kapatır.
        </p>
        <p>
          Kapatmak da uygulamanızın işidir. Escape’te (takvim Escape’i yalnızca tooltip’lerinden biri açıkken kullanır), <code>onOutsideClick</code> ile
          bildirilen bir dış tıklamada ve bir seçimden sonra <code>onSelectionComplete</code> içinde kapatın. <code>onChange</code> yerine bunu kullanın: zaten
          seçili tarihi yeniden seçmek hiçbir şeyi değiştirmez, bu yüzden <code>onChange</code> çağrılmaz, ama seçim yine tamamlanmıştır. Odak için{' '}
          <code>onReady</code> içinde <code>ref.focusDate()</code> çağırarak odağı ızgaraya taşıyın, kapanışta da{' '}
          <code>focus(&#123; preventScroll: true &#125;)</code> ile düğmeye geri verin. Takvim, sabit konumlu bir popover’ın içindeki bir güne odaklanmak
          için sayfayı asla kaydırmaz.
        </p>
        <Example src="features/Popover" title="Popover" />
        <Note>
          <p>
            Bunu birçok bileşen için mi istiyorsunuz? Bir konumlandırma kütüphanesi (örneğin Floating UI) aynı işi yapar; takvim konumlandırılmış her
            kapsayıcının içinde çalışır.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

export function Synced() {
  return (
    <Page title="Senkron takvimler" lead="Birden fazla takvim aynı seçimi gösterip düzenleyebilir. Gizli, ortak bir store yoktur: onlara aynı state’i prop’larla verin.">
      <Section title="Paylaşılan değer ve uç">
        <p>
          A ve B takvimleri aynı <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code> ve <code>onActiveEndpointChange</code> değerlerini
          alır; böylece A’da seçilen başlangıç B’de tamamlanabilir. B’de ayrıca <code>numberOfMonths=&#123;2&#125;</code> ve{' '}
          <code>orientation=&quot;vertical&quot;</code> vardır: B’nin iki ayı kendi içinde alt alta dizilir. <code>orientation</code> yalnızca bir takvimin
          kendi aylarını düzenler; A ile B’nin sayfadaki yeri sizin yerleşiminize bağlıdır (burada bir CSS grid).
        </p>
        <Example src="features/Synced" title="İki takvim, tek seçim" />
      </Section>
      <Section title="Satır içinde ve diyalogda">
        <p>
          Diyalogdaki bir takvim de sıradan bir takvimdir: ona aynı state’i verin. Açıldığında güncel değeri gösterir ve yaptığı değişiklikler satır içindeki
          takvimde hemen görünür. Tooltip’i diyaloğun içine (üst katman) render edilir.
        </p>
        <Example src="features/SyncedDialog" title="Satır içi ve diyalog senkronize" />
      </Section>
      <Section title="Satır içinde, diyalogda ve popover’da">
        <p>
          Takvim nerede render edilirse edilsin aynı şey çalışır. Burada tek bir aralığı üç takvim düzenler: sayfada satır içinde, modal bir{' '}
          <code>&lt;dialog&gt;</code> içinde ve <code>createPortal</code> ile <code>document.body</code> içine render edilen bir popover’da. Üçü de aynı{' '}
          <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code>, <code>onActiveEndpointChange</code> ve <code>rules</code> değerlerini
          alır. Satır içinde bir başlangıç seçin, diyalogda tamamlayın; popover ardından aralığın tamamıyla açılır.
        </p>
        <ul>
          <li>
            <strong>Paylaşılan</strong> (siz ilettiğiniz için): seçim, sıradaki belirlenecek uç ve kurallar.
          </li>
          <li>
            <strong>Takvime özgü</strong>: görünen ay, klavye odağı, fareyle üzerine gelme ve tooltip. Siz controlled olarak vermedikçe her takvim kendininkini
            tutar.
          </li>
          <li>
            Diyalog üst katmanda olduğu için takvimi <code>tooltip={'{{ container: dialogContentElement }}'}</code> alır;{' '}
            <code>document.body</code> içine render edilen bir tooltip diyaloğun arkasında kalırdı.
          </li>
          <li>
            Portal yalnızca HTML’i taşır. Popover’ı konumlandırmak (düğmeyi izlemek, yön değiştirmek, pencerede kalmak) ve kapatmak uygulamanın işidir; bkz.{' '}
            <a href="#/placement">Satır içinde, diyalogda veya popover’da</a>.
          </li>
          <li>Sonradan açılan bir takvim güncel değeri gösterir; birini kapatmak veya unmount etmek diğerlerini sıfırlamaz.</li>
        </ul>
        <Example src="features/SyncedEverywhere" title="Satır içi, diyalog ve popover senkronize" />
      </Section>
      <PropsTable
        caption="Neler paylaşılır"
        rows={[
          { name: <>Seçim</>, type: 'value', description: 'Aynı value’yu ilettiğinizde paylaşılır.' },
          { name: <>Kurallar ve müsaitlik</>, type: 'rules', description: 'Aynı veriden oluşturulduğunda paylaşılır.' },
          { name: <>Görünen ay</>, type: 'visibleMonth', description: 'Siz controlled olarak vermedikçe takvime özgüdür.' },
          { name: <>Sıradaki belirlenecek uç</>, type: 'activeEndpoint', description: 'Siz tuttuğunuzda paylaşılır; aksi halde her takvim onu değerden türetir, bu da aynı sonucu verir.' },
          { name: <>Odak, üzerine gelme, tooltip, render edilen aylar</>, type: '—', description: 'Her zaman takvime özgüdür.' },
        ]}
      />
      <p>
        Ayrıca bkz. <a href="#/recipe-three-calendars">Üç senkron takvim</a> uygulama örneği.
      </p>
    </Page>
  );
}

export function Accessibility() {
  return (
    <Page title="Klavye ve erişilebilirlik" lead="Her ay bir ARIA ızgarasıdır ve her gün, tam sesli etiketi olan bir düğmedir. Takvimin tamamı tek bir Tab durağıdır; günler arasında ok tuşlarıyla gezilir.">
      <Section title="Deneyin">
        <p>Izgaraya ulaşmak için Tab’a basın, ardından aşağıdaki tuşları kullanın. Seçilemeyen günlere de odaklanılabilir, böylece nedenleri okunabilir.</p>
        <Example src="features/Keyboard" title="Klavyeyle gezinme" />
      </Section>
      <PropsTable
        caption="Tuşlar"
        rows={[
          { name: '← → ↑ ↓', type: 'move', description: 'Önceki/sonraki gün ve hafta. Sağdan sola yerleşimlerde sol ve sağ yer değiştirir.' },
          { name: 'Home / End', type: 'move', description: 'Haftanın ilk / son günü.' },
          { name: 'PageUp / PageDown', type: 'move', description: 'Önceki / sonraki ayda aynı gün (Shift ile: yıl).' },
          { name: 'Enter / Space', type: 'select', description: 'Odaktaki günü bir tıklama gibi seçer.' },
          { name: 'Escape', type: 'dismiss', description: 'Açık bir tooltip’i odağı taşımadan kapatır. Açık tooltip yoksa tuş uygulamanıza bırakılır (ör. bir diyaloğu kapatmak için).' },
        ]}
      />
      <ul>
        <li>
          Aylar <code>role=&quot;grid&quot;</code>’dir; her gün bir <code>&lt;button&gt;</code> içeren bir <code>gridcell</code>’dir. Aynı anda yalnızca
          bir günün <code>tabIndex</code> değeri 0’dır (gezici sekme sırası, roving tab index); bu yüzden Tab takvime tek adımda girer ve çıkar.
        </li>
        <li>
          Bir günün etiketi tam tarihi, bugün, başlangıç, bitiş veya seçili olup olmadığını ve neden seçilemediğini içerir. Bu tür günler{' '}
          <code>aria-disabled</code> kullanır ve odaklanabilir kalır.
        </li>
        <li>Seçimler, reddedilen seçimler ve yükleme bir canlı bölgeye (live region: değiştiğinde ekran okuyucuların okuduğu, aria-live özellikli görünmez bir alan) yazılır.</li>
        <li>Odağı gösterilen ayların ötesine taşımak ayı değiştirir; ay eklemek veya kaldırmak odağı asla kaybettirmez.</li>
        <li>Odağı bir diyalogda tutmak ve kapanınca geri vermek uygulamanın işidir; takvim odağı yalnızca kendi ızgarasının içinde taşır.</li>
      </ul>
      <Note>
        <p>Gerçek ekran okuyucularla davranış (VoiceOver, NVDA, TalkBack) henüz test edilmedi; işaretleme ARIA ızgara (grid) desenini izler.</p>
      </Note>
    </Page>
  );
}
