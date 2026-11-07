import combineFields from '../../../snippets/rules/combine-fields.tr.ts?code';
import combineFunctions from '../../../snippets/rules/combine-functions.tr.ts?code';
import counting from '../../../snippets/rules/counting.tr.ts?code';
import dayStatuses from '../../../snippets/rules/day-statuses.tr.ts?code';
import enginePlan from '../../../snippets/rules/engine-plan.tr.ts?code';
import reachableEnd from '../../../snippets/rules/reachable-end.tr.ts?code';
import relax from '../../../snippets/rules/relax.tr.ts?code';
import serverValidation from '../../../snippets/rules/server-validation.tr.ts?code';
import stayStatuses from '../../../snippets/rules/stay-statuses.tr.ts?code';
import stayWeekdays from '../../../snippets/rules/stay-weekdays.tr.ts?code';
import { Example, Snippet } from '../../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../../ui';

const yes = 'Evet';
const no = 'Hayır';

export function RulesReference() {
  return (
    <Page
      title="Kurallar ve adaptörler"
      lead={
        <>
          React’ten bağımsız seçim modeli: <code>SelectionRules</code> nesnesi, bu nesneyi konaklamalar ve gün aralıkları için oluşturan adaptörler, kural
          setlerini birleştiren ve gevşeten fonksiyonlar ve bunları değerlendiren arayüzsüz (headless) motor. Buradaki her şey <code>calendar-kit/core</code>’dan
          (ve <code>calendar-kit</code>’ten) dışa aktarılır; böylece aynı kurallar sunucuda da kontrol edilebilir.
        </>
      }
    >
      <Section title="SelectionRules">
        <p>
          Takvimin <code>rules</code> prop’u tek bir kural seti veya bir kural seti dizisi alır. Dizi <code>combineRules</code> ile birleştirilir;{' '}
          <code>minDate</code>, <code>maxDate</code>, <code>disablePast</code>, <code>disableFuture</code> ve <code>getDataStatus</code> prop’ları bu listenin
          sonuna bir set daha olarak eklenir. Her alan isteğe bağlıdır; boş bir nesne her güne izin verir.
        </p>

        <h3>Sınırlar</h3>
        <PropsTable
          caption="Sınırlar"
          rows={[
            {
              name: 'minDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Seçilebilen en erken gün (dahil). Daha erken bir gün <code>before-min</code> ile başarısız olur. Takvim ayrıca bu günü içeren aydan öncesine
                  gezinmez.
                </>
              ),
            },
            {
              name: 'maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Seçilebilen en geç gün (dahil); daha sonraki günler <code>after-max</code> ile başarısız olur. Gezinme bu günün ayında durur.
                </>
              ),
            },
            {
              name: 'disablePast',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  <em>Bugünden</em> önceki günler <code>past</code> ile başarısız olur. Bugün bilinmediği sürece (motorda <code>today: null</code>) etkisi yoktur.
                  Gezinmeyi sınırlamaz.
                </>
              ),
            },
            {
              name: 'disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bugünden sonraki günler <code>future</code> ile başarısız olur. Koşullar <code>disablePast</code> ile aynıdır.
                </>
              ),
            },
          ]}
        />
        <p>
          Sınır kontrolleri bir seçimin dokunduğu her güne uygulanır: başlangıç, bitiş ve aradaki her gün. Bir aralığın içindeki bir günde sınır ihlali{' '}
          <code>blocked-in-range</code> olarak bildirilir.
        </p>

        <h3>Aralık biçimi</h3>
        <PropsTable
          caption="Aralık biçimi"
          rows={[
            {
              name: 'rangeSemantics',
              type: "'inclusive' | 'exclusive'",
              default: "'inclusive'",
              description: (
                <>
                  Bitişin nasıl sayıldığı. <code>inclusive</code>: <code>[start, end]</code>, bitiş günü rezervasyona dahildir (13 → 20 = 8 gün).{' '}
                  <code>exclusive</code>: <code>[start, end)</code>, bitiş bir sınırdır, örneğin çıkış günü (13 → 20 = 7 gece). Her iki durumda da başlangıç
                  günü başlamaya, bitiş günü bitirmeye ve aradaki (uçlar hariç) her gün içinden geçilmeye izin vermelidir; anlam (semantics) uzunluk birimini,{' '}
                  <code>allowSameDay</code>’in varsayılan değerini ve hangi günlerin dahil olarak bildirildiğini (<code>getIncludedDays</code>,{' '}
                  <code>DayState.included</code>) değiştirir.
                </>
              ),
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              default: 'inclusive: true · exclusive: false',
              description: (
                <>
                  <code>start === end</code>’in geçerli bir aralık olup olmadığı. Değilse, tek başına duran başlangıca yeniden tıklamak onu temizler ve böyle bir
                  aralığın doğrulanması <code>same-day</code> verir. Aynı gün aralığı, hem başlangıç hem bitiş kontrollerinden geçen bir gün gerektirir{' '}
                  (<code>canStart</code>, <code>canEnd</code>, <code>startWeekdays</code>, <code>endWeekdays</code>). Hariç bitişte aynı gün aralığının uzunluğu
                  0’dır; bu yüzden yalnızca <code>minLength</code> tanımsız veya 0 olduğunda geçerlidir.
                </>
              ),
            },
            {
              name: 'minLength',
              type: 'number',
              description: (
                <>
                  En kısa aralık. Hariç bitişli aralıklarda gece (<code>end − start</code>), dahil bitişli aralıklarda gün (<code>end − start + 1</code>) olarak
                  ölçülür. Daha kısa aralıklar <code>min-length</code> ile başarısız olur, parametreler <code>{'{ min, actual, unit }'}</code>.
                </>
              ),
            },
            {
              name: 'maxLength',
              type: 'number',
              description: (
                <>
                  En uzun aralık, aynı birimle. Daha uzun aralıklar <code>max-length</code> ile başarısız olur, parametreler{' '}
                  <code>{'{ max, actual, unit }'}</code>. Ulaşılabilir bitiş aramasını da sınırlar.
                </>
              ),
            },
            {
              name: 'fixedLength',
              type: 'number',
              description: (
                <>
                  Tam uzunluk, aynı birimle. Bir başlangıca tek tıklama aralığın tamamını oluşturur (hariç bitişte bitiş = başlangıç + N, dahil bitişte başlangıç +
                  N − 1) ve hemen doğrular; başka her uzunluk <code>fixed-length</code> ile başarısız olur. <code>minLength</code>/<code>maxLength</code>’ten önce
                  kontrol edilir; onlar da geçerli kalır, bu yüzden bu sınırların dışındaki sabit bir uzunluk her aralığı geçersiz kılar.{' '}
                  <code>singleDayFirst</code>’ü ve ulaşılabilir bitiş aramasını kapatır.
                </>
              ),
            },
            {
              name: 'singleDayFirst',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  İlk tıklama o günü tek başına tamamlanmış bir aralık olarak seçer (<code>start === end</code>, sonraki uç <code>end</code>). Aynı güne veya
                  sonrasına yapılan bir sonraki tıklama aralığı genişletir; tek başına seçili güne yeniden tıklamak onu temizler; öncesine bir tıklama baştan
                  başlatır. Aynı gün aralıklarına izin verilmediğinde veya <code>fixedLength</code> ayarlandığında yok sayılır. Tek gün kendisi geçerli değilse
                  (örneğin <code>minLength: 2</code> ile veya bitiş olamayan bir günde) tıklama sıradan bir başlangıca döner.
                </>
              ),
            },
          ]}
        />

        <h3>Takvim (schedule)</h3>
        <PropsTable
          caption="Takvim (schedule) kuralları"
          rows={[
            {
              name: 'startWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Bir aralığın, tekli seçimin veya çoklu seçimin başlayabileceği hafta günleri (0 = pazar … 6 = cumartesi). Diğer günler{' '}
                  <code>weekday-start</code> ile başarısız olur, parametreler <code>{'{ weekday }'}</code>. Başlangıç olarak izin verilmeyen günler yine de bitiş
                  olabilir veya içinden geçilebilir.
                </>
              ),
            },
            {
              name: 'endWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Bir aralığın bitebileceği hafta günleri; diğerleri <code>weekday-end</code> ile başarısız olur. Bitişi başlangıç günü olan aynı gün aralıkları
                  için de kontrol edilir.
                </>
              ),
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Hizmetin çalıştığı hafta günleri. Diğer her gün bütünüyle kapalıdır (sebep <code>out-of-schedule</code>, takvim kuralı olarak işaretli):
                  başlangıç ya da bitiş olamaz, içinden geçilemez. O gün zaten kapalı değilse <code>getDayAvailability</code>’nin döndürdüğü sonucun yerine geçer.
                  Boş bir liste her günü kapatır.
                </>
              ),
            },
          ]}
        />
        <p>
          Bu üç alan, uzunluk alanları ve <code>schedule: true</code> ile işaretlenmiş müsaitlik sonuçları <em>takvim kurallarıdır</em> (schedule rules): gerçek
          bir müsait olmama durumu değil, düzenli çalışma çizelgesidir. Takvimin <code>relaxSchedule</code> prop’u (ve <code>relaxRules</code>) bunları kaldırır
          (aşağıdaki relaxRules bölümüne bakın). Yalnızca takvim kuralları yüzünden engellenen günler üstü çizili değil, soluk çizilir{' '}
          (<code>data-out-of-schedule</code>).
        </p>

        <h3>Müsaitlik ve veri</h3>
        <PropsTable
          caption="Müsaitlik ve veri"
          rows={[
            {
              name: 'getDayAvailability',
              type: '(date, ctx: RuleContext) => DayAvailability | null | undefined',
              description: (
                <>
                  Gün bazında seçilebilirlik. Tamamen müsait bir gün için hiçbir şey döndürmeyin. Her motor anlık durumu (snapshot) için günde en fazla bir kez
                  çağrılır (takvim her render’da bir tane oluşturur) ve <code>ctx</code> içinde mevcut seçimi alır; böylece müsaitlik seçilen başlangıca bağlı
                  olabilir.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: "(month: CalendarMonth) => 'unknown' | 'loading' | 'loaded' | 'error'",
              default: <>her ay <code>'loaded'</code></>,
              description: (
                <>
                  Müsaitlik verinizin ay bazında yükleme durumu. Hem kurallar hem takvim prop’u bunu tanımlıyorsa daha kötü durum kazanır (bkz.{' '}
                  <code>combineRules</code>).
                </>
              ),
            },
            {
              name: 'unknownDataPolicy',
              type: "'block' | 'allow'",
              default: "'block'",
              description: (
                <>
                  <code>block</code>: <code>loaded</code> olmayan bir aydaki gün <code>data-unknown</code>, <code>data-loading</code> veya{' '}
                  <code>data-error</code> ile başarısız olur — başlangıç, bitiş ve aralık içi olarak. <code>allow</code>: doğrulama veri durumunu yok sayar.
                </>
              ),
            },
          ]}
        />

        <h3>Doğrulama</h3>
        <PropsTable
          caption="Doğrulama"
          rows={[
            {
              name: 'validateSelection',
              type: '(selection, ctx: RuleContext) => ValidationIssue | null | undefined',
              description: (
                <>
                  Kendi kuralınız. Yalnızca tüm yerleşik kontroller geçtikten sonra, önerilen her seçim için çalışır: tıklamalar ve tuşlar (bir aralık başlangıcı
                  yerleştirilirken de; bu yüzden <code>{'{ start, end: null }'}</code> görür), <code>ref.select()</code> ve kurallar, veri veya{' '}
                  <code>ruleContext</code> değiştiğinde yeniden doğrulama. Seçimi kaldıran eylemlerde (aralığı temizleme, bir tarihi kapatma) çağrılmaz.{' '}
                  <code>code</code> içermeyen bir sorun <code>custom</code> alır; <code>message</code> değeri olduğu gibi gösterilir.
                </>
              ),
            },
            {
              name: 'maxSelections',
              type: 'number',
              description: (
                <>
                  Yalnızca çoklu mod: farklı tarihlerin en fazla sayısı. Değer bir küme olarak ele alınır, yani tekrarlanan bir tarih bir kez sayılır. Bir tane daha
                  eklemek <code>max-selections</code> ile başarısız olur, parametreler <code>{'{ max, actual }'}</code>.
                </>
              ),
            },
            {
              name: 'requireReachableEnd',
              type: 'boolean',
              default: <><code>false</code> (iki adaptörde de: <code>true</code>)</>,
              description: (
                <>
                  Yalnızca aralık modu: ardından geçerli bir bitiş gelemeyen başlangıç reddedilir; örneğin 2 gecelik minimumda bir sonraki gece doluysa. Arama
                  kuralları için aşağıya bakın.
                </>
              ),
            },
          ]}
        />
        <h3>Ulaşılabilir bitiş araması nasıl karar verir</h3>
        <p>
          Aday bir başlangıç için motor, izin verilen en kısa uzunluktan başlayarak yukarı doğru bitişleri dener: <code>minLength</code> veya aynı gün aralıklarına
          izin verilmiyorsa 1 gece / 1 gün. En fazla 63 bitiş adayına bakar ve asla <code>maxLength</code>’i aşmaz. Tamamen geçerli ilk bitiş, başlangıcı kabul
          edilebilir kılar. Aralığın içindeki bir gün engellendiğinde veya bir bitiş adayı <code>maxDate</code>’i, gelecek sınırını ya da verisi yüklenmemiş bir ayı
          aştığında arama erken durur; bu, sonraki hiçbir bitişin işe yaramayacağının kanıtıdır. Başlangıç yalnızca bu kanıt varsa veya <code>maxLength</code>’e
          kadar her aday başarısız olduysa reddedilir. 63 aday önce tükenirse başlangıç seçilebilir kalır ve bitişi seçildiğinde doğrulanır.
        </p>
        <p>
          Aramayı bir sınır veya veri sorunu bitirdiyse ret bu sorunu bildirir. Aksi halde başlangıçta <code>min-length</code> (son başarısızlığın{' '}
          <code>dayReason</code>’ı ile) yalnızca engelleyen şey minimum olduğunda bildirilir: doğal olanın (1 gece / 1 gün) üstünde bir <code>minLength</code>{' '}
          ayarlıdır ve uzunluk kuralı olmasa daha kısa bir bitiş geçerli olurdu. Diğer her durumda son adayın sorunu bildirilir; böylece ardından hiçbir çıkış
          mümkün olmayan bir başlangıç “En az N” değil, örneğin <code>end-not-allowed</code> alır. <code>fixedLength</code> ayarlıysa arama atlanır (sabit bir
          aralık bunun yerine bütün olarak doğrulanır) ve arama <code>validate()</code>’in parçası değildir.
        </p>
        <Snippet files={reachableEnd} label="requireReachableEnd" />

        <h3>DayAvailability</h3>
        <PropsTable
          caption="DayAvailability (getDayAvailability’nin döndürdüğü)"
          rows={[
            {
              name: 'closed',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bu günde hiçbir şey mümkün değildir. Aşağıdaki üç bayrağı geçersiz kılar: kapalı bir gün, bayraklar ne derse desin başlangıç ya da bitiş olamaz,
                  içinden geçilemez. <code>closed</code> ile başarısız olur.
                </>
              ),
            },
            {
              name: 'canStart',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Aralık başlangıcı, tekli seçim veya çoklu seçim olabilir. <code>false</code>, <code>start-not-allowed</code> ile başarısız olur.
                </>
              ),
            },
            {
              name: 'canEnd',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Aralık bitişi olabilir (aynı gün aralığı için de gerekir). <code>false</code>, <code>end-not-allowed</code> ile başarısız olur.
                </>
              ),
            },
            {
              name: 'canPassThrough',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Başlangıç ile bitişin arasında (uçlar hariç) yer alabilir. <code>false</code>, üzerinden geçen her aralığın bu tarihte{' '}
                  <code>blocked-in-range</code> ile başarısız olmasına yol açar.
                </>
              ),
            },
            {
              name: 'reason',
              type: 'string',
              description: (
                <>
                  Kısıtlama için kendi etiketiniz (örn. <code>check-out-only</code>). <code>ValidationIssue.dayReason</code>’a kopyalanır; günle ilgili
                  sorunlarda varsayılan metin, varsa <code>messages.dayReasons[reason]</code>’dan gelir.
                </>
              ),
            },
            {
              name: 'message',
              type: 'string',
              description: (
                <>
                  Hazır metin. Sorunun <code>message</code> alanına kopyalanır; araç ipuçları ve duyurular bunu her çeviriye tercih eder.
                </>
              ),
            },
            {
              name: 'schedule',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Kısıtlama gerçek bir müsait olmama durumundan değil, çalışma çizelgesinden gelir. Takvim kurallarını gevşetmek bu sonucun tamamını yok sayar;
                  bu yüzden yalnızca tamamen takvimden kaynaklanan sonuçları işaretleyin.
                </>
              ),
            },
          ]}
        />

        <h3>RuleContext</h3>
        <PropsTable
          caption="RuleContext (getDayAvailability ve validateSelection’ın ctx’i)"
          rows={[
            { name: 'mode', type: "'single' | 'range' | 'multiple' | 'readonly'", description: 'Seçim modu.' },
            {
              name: 'selection',
              type: 'Selection',
              description: (
                <>
                  Motor anlık durumunun seçimi (<code>{'{ mode, value }'}</code>); bir tıklama sırasında tıklamadan önceki durumdur.{' '}
                  <code>validateSelection</code> içinde önerilen seçim için ilk argümanı kullanın.
                </>
              ),
            },
            { name: 'activeEndpoint', type: "'start' | 'end'", description: 'Sonraki etkinleştirmenin aralığın hangi ucunu ayarlayacağı.' },
            { name: 'today', type: 'CalendarDate | null', description: 'Takvimin bugünü (veya motorun today girdisi).' },
            {
              name: 'context',
              type: 'TContext',
              description: (
                <>
                  Kendi veriniz: takvimin <code>ruleContext</code> prop’u (örn. kişi sayısı, seçilen saatler). Bir değişiklik yeni bir anlık durum oluşturur ve
                  seçimi yeniden doğrular.
                </>
              ),
            },
          ]}
        />

        <h3>Doğrulama sırası</h3>
        <p>Kontroller bu sırayla çalışır ve ilk başarısızlık bildirilen sorundur:</p>
        <ol>
          <li>
            Aralıklar: <code>end-before-start</code>.
          </li>
          <li>
            Başlangıç (veya tekli tarih / her çoklu tarih): <code>before-min</code>, <code>after-max</code>, <code>past</code>, <code>future</code>, veri durumu,
            ardından <code>closed</code>, <code>start-not-allowed</code>, <code>weekday-start</code>.
          </li>
          <li>
            Aynı gün aralıklarına izin verilmiyorsa <code>same-day</code>.
          </li>
          <li>
            Bitiş: aynı gün kontrolleri, ardından <code>closed</code>, <code>end-not-allowed</code>, <code>weekday-end</code>.
          </li>
          <li>
            Uzunluk: <code>fixed-length</code>, <code>min-length</code>, <code>max-length</code>.
          </li>
          <li>
            Aradaki günler (uçlar hariç), başlangıçtan ileriye: engellenen ilk gün <code>blocked-in-range</code> (veya kendi <code>data-*</code> kodunu) verir.
          </li>
          <li>
            Çoklu mod: <code>max-selections</code>.
          </li>
          <li>
            <code>validateSelection</code>.
          </li>
        </ol>
        <p>
          <code>validate()</code> içindeki ayrıştırılamayan değerler <code>invalid-date</code> verir (aralıklarda parametreler <code>{'{ field, value }'}</code>).
          Sorunlar <code>code</code>, sorunlu <code>date</code>, mesaj şablonları için <code>params</code>, günün <code>dayReason</code>’ı ve varsa{' '}
          <code>message</code> taşır.
        </p>
      </Section>

      <Section title="stayRules">
        <p>
          <code>stayRules(options)</code> gecelik konaklamaları tanımlar. Bir konaklama <code>[check-in, check-out)</code> biçimindedir: misafirin seçtiği bitiş
          çıkış günüdür; aralığın parçası olarak çizilir ama bir gece değildir. Konaklamanın her gecesi doğrulanır; çıkış gününün yalnızca ayrılışa izin vermesi
          yeterlidir. Adaptör her zaman hariç bitiş anlamını ayarlar ve <code>requireReachableEnd</code>’i açar.
        </p>
        <Snippet files={counting} label="Gece ve gün sayma" />
        <PropsTable
          caption="stayRules seçenekleri"
          rows={[
            {
              name: 'minNights',
              type: 'number',
              description: (
                <>
                  Gece olarak en kısa konaklama; <code>minLength</code> olur. Ulaşılabilir bitiş araması da bunu kullanır; bu yüzden olası tüm konaklamaları çok
                  kısa kalan bir giriş günü devre dışı bırakılır (<code>min-length</code> olarak bildirilir).
                </>
              ),
            },
            { name: 'maxNights', type: 'number', description: <>Gece olarak en uzun konaklama; <code>maxLength</code> olur.</> },
            {
              name: 'fixedNights',
              type: 'number',
              description: (
                <>
                  Her konaklama tam olarak bu uzunluktadır; bir giriş gününe tıklamak konaklamanın tamamını seçer. <code>fixedLength</code> olur.
                </>
              ),
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Aynı gün giriş ve çıkışa izin verir (günübirlik kullanım, 0 gece). <code>minNights</code>’ı tanımsız veya 0 bırakın, aksi halde 0 gecelik
                  konaklama minimuma takılır. Günün saatleri uygulamanızda kalır.
                </>
              ),
            },
            {
              name: 'checkInWeekdays',
              type: 'readonly Weekday[]',
              description: <>Misafirlerin gelebileceği hafta günleri (takvim kuralı, <code>weekday-start</code>).</>,
            },
            {
              name: 'checkOutWeekdays',
              type: 'readonly Weekday[]',
              description: <>Misafirlerin ayrılabileceği hafta günleri (takvim kuralı, <code>weekday-end</code>).</>,
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Hizmet verilen hafta günleri (takvim kuralı). Diğer hafta günlerindeki geceler rezerve edilemez: giriş yok (<code>start-not-allowed</code>) ve
                  konaklama içinde gece yok (<code>blocked-in-range</code>), sebep <code>out-of-schedule</code>. Son müsait geceden sonraki sabah yine geçerli bir
                  çıkıştır; bu yüzden <code>[5, 6]</code> cuma → pazar konaklamaya izin verir. Günün tamamını kapatan{' '}
                  <code>SelectionRules.availableWeekdays</code>’tan farklıdır.
                </>
              ),
            },
            {
              name: 'getDayStatus',
              type: '(date, ctx) => StayDayStatus | null | undefined',
              description: (
                <>
                  <code>date</code> tarihinde <em>başlayan gecenin</em> durumu (tarih → tarih + 1); hiçbir şey döndürmemek <code>available</code> demektir. Dolu
                  bir gece için önceki tarih için de çağrılır.
                </>
              ),
            },
            {
              name: 'minDate, maxDate, disablePast, disableFuture',
              type: <><code>SelectionRules</code>’a bakın</>,
              description: 'Değiştirilmeden aktarılır.',
            },
            {
              name: 'getDataStatus, unknownDataPolicy, validateSelection',
              type: <><code>SelectionRules</code>’a bakın</>,
              description: (
                <>
                  Değiştirilmeden aktarılır. Diğer <code>SelectionRules</code> alanları (<code>getDayAvailability</code>, <code>maxSelections</code>, …) seçenek
                  değildir; bunları <code>combineRules</code> ile ekleyin.
                </>
              ),
            },
          ]}
        />
        <h3>Konaklama durumları</h3>
        <p>
          Bir durum, o tarih için müsaitliğe dönüştürülür. Tarih gecenin başlangıcı olduğundan aynı gün önceki gecenin sabahıdır: art arda dolu gecelerin ilki
          yine de birinin çıkış günü olabilir.
        </p>
        <DataTable
          caption="Her StayDayStatus’un kendi tarihine etkisi"
          head={['Durum', 'Giriş', 'Çıkış', 'Konaklama içindeki gece', 'Sebep etiketi']}
          rows={[
            [<code key="s">available</code>, yes, yes, yes, '—'],
            [<code key="s">check-in-only</code>, yes, no, yes, <code key="r">check-in-only</code>],
            [<code key="s">check-out-only</code>, no, yes, no, <code key="r">check-out-only</code>],
            [
              <>
                <code>booked</code>, önceki gece <code>available</code> veya <code>check-in-only</code>
              </>,
              no,
              yes,
              no,
              <code key="r">check-out-only</code>,
            ],
            [
              <>
                <code>booked</code>, önceki gece <code>booked</code>, <code>closed</code> veya <code>check-out-only</code>
              </>,
              no,
              no,
              no,
              <code key="r">booked</code>,
            ],
            [<code key="s">closed</code>, no, no, no, <code key="r">closed</code>],
          ]}
        />
        <p>
          Etiketler (tip <code>StayReason</code>) <code>ValidationIssue.dayReason</code>’a yazılır ve <code>messages.dayReasons</code> ile çevrilir. Dikkat: ilk
          dolu sabah <code>booked</code> değil, <code>check-out-only</code> olarak etiketlenir. Aşağıda deneyin: ilk dolu sabahta çıkış yapın, onu kapsayan bir
          konaklama seçin veya “Yalnız giriş” gününde bitirin.
        </p>
        <Example src="rules/StayStatuses" title="Konaklama durumları" />
        <Snippet files={stayStatuses} label="Konaklama durumları, motor tarafından kontrol edilir" />
        <p>
          <code>availableWeekdays</code> günleri değil geceleri kısıtlar. <code>availableWeekdays: [5, 6]</code> (cuma ve cumartesi geceleri) ile cuma → pazar
          konaklama geçerlidir, çünkü pazar yalnızca çıkış sabahıdır; pazar gecesini içeren veya onunla başlayan bir konaklama reddedilir. Kısıtlama bir takvim
          kuralıdır; bu yüzden <code>relaxRules</code> ve <code>relaxSchedule</code> prop’u onu kaldırır.
        </p>
        <Snippet files={stayWeekdays} label="availableWeekdays ve çıkış günleri" />
      </Section>

      <Section title="dayRangeRules">
        <p>
          <code>dayRangeRules(options)</code> gün bazlı rezervasyonları tanımlar (tekne günleri, çok günlük etkinlikler, kiralamalar): <code>[start, end]</code>,
          başlangıçtan bitişe her gün rezervasyona dahildir; yani 13 → 20, 8 gündür (<code>countDays</code>). Aynı günü iki kez seçmek geçerli bir 1 günlük
          aralıktır — adaptör aynı gün aralıklarına her zaman izin verir; bunları yasaklamak için <code>minDays: 2</code> kullanın. Dahil bitiş anlamı ve{' '}
          <code>requireReachableEnd</code> her zaman açıktır.
        </p>
        <PropsTable
          caption="dayRangeRules seçenekleri"
          rows={[
            { name: 'minDays', type: 'number', description: <>En az gün sayısı, iki uç da sayılır; <code>minLength</code> olur.</> },
            { name: 'maxDays', type: 'number', description: <>En fazla gün sayısı; <code>maxLength</code> olur.</> },
            {
              name: 'fixedDays',
              type: 'number',
              description: (
                <>
                  Her rezervasyon tam olarak bu kadar gündür; tek tıklama hepsini seçer (bitiş = başlangıç + N − 1). <code>fixedLength</code> olur.
                </>
              ),
            },
            { name: 'startWeekdays', type: 'readonly Weekday[]', description: <>Rezervasyonun başlayabileceği hafta günleri (takvim kuralı).</> },
            { name: 'endWeekdays', type: 'readonly Weekday[]', description: <>Rezervasyonun bitebileceği hafta günleri (takvim kuralı).</> },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: <>Çalışılan hafta günleri, örn. yalnızca hafta sonları <code>[6, 0]</code>. Diğer günler kapalıdır ve rezervasyonun içinde olamaz.</>,
            },
            {
              name: 'singleDayFirst',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  İlk tıklama o tek günü rezerve eder, aynı güne veya sonrasına yapılan sonraki tıklama rezervasyonu genişletir (bkz.{' '}
                  <code>SelectionRules.singleDayFirst</code>).
                </>
              ),
            },
            {
              name: 'getDayStatus',
              type: '(date, ctx) => DayRangeStatus | null | undefined',
              description: <>Günün tamamının durumu; hiçbir şey döndürmemek <code>available</code> demektir.</>,
            },
            {
              name: 'minDate, maxDate, disablePast, disableFuture, getDataStatus, unknownDataPolicy, validateSelection',
              type: <><code>SelectionRules</code>’a bakın</>,
              description: 'Değiştirilmeden aktarılır.',
            },
          ]}
        />
        <DataTable
          caption="Her DayRangeStatus’un etkisi"
          head={['Durum', 'Başlangıç', 'Bitiş', 'Aralığın içinde', 'Tek günlük aralık', 'Sebep etiketi']}
          rows={[
            [<code key="s">available</code>, yes, yes, yes, yes, '—'],
            [<code key="s">start-only</code>, yes, no, no, no, <code key="r">start-only</code>],
            [<code key="s">end-only</code>, no, yes, no, no, <code key="r">end-only</code>],
            [<code key="s">closed</code>, no, no, no, no, <code key="r">closed</code>],
          ]}
        />
        <p>
          Tek günlük bir aralık hem başlayabilen hem bitebilen bir gün gerektirir; bu yüzden <code>start-only</code> ve <code>end-only</code> günleri tek başına
          rezerve edilemez (<code>singleDayFirst</code> ile böyle bir güne tıklamak yalnızca bir başlangıç yerleştirir).
        </p>
        <Example src="rules/DayRangeStatuses" title="Yalnızca başlangıç ve yalnızca bitiş günleri" />
        <Snippet files={dayStatuses} label="Gün durumları, motor tarafından kontrol edilir" />
      </Section>

      <Section title="closedDates">
        <p>
          <code>closedDates(dates, reason = &apos;closed&apos;)</code>, tek alanı <code>getDayAvailability</code> olan bir kural seti döndürür: listelenen her
          tarih verilen sebep etiketiyle kapatılır, diğer günlere dokunulmaz. <code>dates</code>, <code>CalendarDate</code> metinlerinden oluşan herhangi bir
          yinelenebilir (iterable) değerdir; bir <code>Set</code> olduğu gibi kullanılır, diğer yinelenebilirler bir kez kümeye kopyalanır. Arama tam metin
          eşleşmesiyle yapılır; bu yüzden normalleştirilmiş <code>YYYY-MM-DD</code> tarihleri verin. Bir adaptörün yanında <code>rules</code> dizisinde veya{' '}
          <code>combineRules</code> içinde kullanın; sebebe bir sonraki bölümdeki örnekte olduğu gibi <code>messages.dayReasons</code> üzerinden metin verin.
        </p>
      </Section>

      <Section title="combineRules">
        <p>
          <code>combineRules(...sets)</code> kural setlerini, <em>her</em> kuralın geçmesi gereken tek bir sette birleştirir. Takvimin bir <code>rules</code>{' '}
          dizisiyle yaptığı da budur. Falsy girdiler (<code>null</code>, <code>undefined</code>, <code>false</code>) atlanır; böylece koşullu kurallar satır içinde
          yazılabilir; girdiler hiçbir zaman değiştirilmez. Setler soldan sağa şu anlamlarla birleştirilir:
        </p>
        <DataTable
          caption="combineRules her alanı nasıl birleştirir"
          head={['Alanlar', 'Birleştirme']}
          rows={[
            [<code key="f">minDate</code>, 'En geç olanı (sınırlar kesişir).'],
            [<code key="f">maxDate</code>, 'En erken olanı.'],
            [
              <>
                <code>disablePast</code>, <code>disableFuture</code>, <code>requireReachableEnd</code>, <code>singleDayFirst</code>
              </>,
              'VEYA: herhangi bir set açarsa açıktır. Sonraki bir false onu kapatmaz.',
            ],
            [<code key="f">minLength</code>, 'En büyüğü.'],
            [
              <>
                <code>maxLength</code>, <code>maxSelections</code>
              </>,
              'En küçüğü.',
            ],
            [
              <>
                <code>startWeekdays</code>, <code>endWeekdays</code>, <code>availableWeekdays</code>
              </>,
              'Listeyi tanımlayan setlerin kesişimi; yalnızca tek bir setin tanımladığı liste olduğu gibi kalır.',
            ],
            [
              <>
                <code>rangeSemantics</code>, <code>allowSameDay</code>, <code>fixedLength</code>, <code>unknownDataPolicy</code>
              </>,
              'Bir değer tanımlayan son set kazanır.',
            ],
            [
              <code key="f">getDayAvailability</code>,
              'Gün için hepsi çağrılır ve sonuçlar VE ile birleştirilir: herhangi biri kapalıysa kapalıdır, herhangi biri false diyorsa canStart/canEnd/canPassThrough false olur. reason ve message, günü kısıtlayan ilk sonuçtan gelir. Birleşik sonuç yalnızca kısıtlayan her sonuç schedule olarak işaretliyse takvim kuralı sayılır.',
            ],
            [<code key="f">validateSelection</code>, 'Hepsi sırayla çalışır; ilk sorun kazanır ve ondan sonraki doğrulayıcılar çağrılmaz.'],
            [<code key="f">getDataStatus</code>, 'İkisine de sorulur; daha kötü durum kazanır: error > loading > unknown > loaded.'],
          ]}
        />
        <p>
          Değeri <code>undefined</code> olan bir anahtar “burada tanımlı değil” sayılır: prop verilmediğinde <code>{'{ validateSelection: props.validate }'}</code>{' '}
          önceki bir setteki doğrulayıcıyı silmez. Zaten birleştirilmiş bir seti yeniden birleştirmek onu özgün parçalarına açar; bu da <code>relaxRules</code>’ın
          her parçayı ayrı ayrı gevşetmesini sağlar.
        </p>
        <Snippet files={combineFields} label="Alanları birleştirme" />
        <Snippet files={combineFunctions} label="Fonksiyonları birleştirme" />
        <Example src="rules/CombinedRules" title="Ürün kuralları + kapalı tarihler + satış penceresi" />
        <Note>
          <p>
            Uzunluklar birimleri olmadan, sayı olarak birleştirilir. Hariç bitişli bir set ile dahil bitişli bir seti birleştirmek sonuncunun anlamını korur; bu
            yüzden <code>stayRules</code>’tan gelen bir <code>minNights: 3</code>, ardından <code>dayRangeRules</code> gelince “en az 3 gün” olur.
          </p>
          <p>
            Bir <code>fixedLength</code> (son olan kazanır) yine birleşik minimum ve maksimuma göre kontrol edilir; bunların dışında kalırsa hiçbir aralık geçerli
            olmaz. Örtüşmeyen hafta günü listeleri boş bir listeye kesişir; bu da hiçbir başlangıca, hiçbir bitişe veya — <code>availableWeekdays</code> için —
            hiçbir güne izin vermez.
          </p>
        </Note>
      </Section>

      <Section title="relaxRules">
        <p>
          <code>relaxRules(rules, options)</code>, takvimin <code>relaxSchedule</code> prop’unun (“özel tarihler”) saf (pure) fonksiyon halidir. Takvim kuralları
          çıkarılmış bir kopya döndürür ve gerçek müsait olmama durumunu tanımlayan her şeyi korur.
        </p>
        <DataTable
          caption="relaxRules neyi kaldırır, neyi korur"
          head={['Seçenek (varsayılan)', 'Açıkken kaldırılan', 'Her zaman korunan']}
          rows={[
            [
              <code key="o">weekdays (true)</code>,
              <>
                <code>startWeekdays</code>, <code>endWeekdays</code>, <code>availableWeekdays</code> ve <code>schedule: true</code> ile işaretli her{' '}
                <code>getDayAvailability</code> sonucu (sonucun tamamı yok sayılır)
              </>,
              <>
                Sınırlar, geçmiş/gelecek, diğer müsaitlik sonuçları (rezervasyonlar, kapalı günler), veri durumu ve <code>unknownDataPolicy</code>,{' '}
                <code>validateSelection</code>, <code>maxSelections</code>, anlam (semantics), <code>allowSameDay</code>, <code>singleDayFirst</code>,{' '}
                <code>requireReachableEnd</code>
              </>,
            ],
            [
              <code key="o">length (true)</code>,
              <>
                <code>minLength</code>, <code>maxLength</code>, <code>fixedLength</code> (dolayısıyla adaptörlerin <code>minNights</code>/<code>maxDays</code>/…
                seçenekleri de)
              </>,
              '',
            ],
          ]}
        />
        <p>
          Yalnızca uzunlukları gevşetmek için <code>{'{ weekdays: false }'}</code>, yalnızca hafta günlerini gevşetmek için <code>{'{ length: false }'}</code>{' '}
          verin. <code>combineRules</code> sonucunda her özgün set ayrı ayrı gevşetilir ve ardından yeniden birleştirilir. Bu, bir set bir günü takvim kuralıyla,
          bir diğeri aynı günü gerçek bir sebeple kısıtladığında önemlidir: yalnızca takvim kısmı kalkar.
        </p>
        <Snippet files={relax} label="relaxRules" />
        <Note>
          <p>
            Set bazında gevşetme yalnızca <code>combineRules</code>’ın döndürdüğü nesnede çalışır. Onun bir kopyası (<code>{'{ ...combined, maxDate }'}</code>)
            parçalarını kaybetmiştir; gevşetildiğinde birleşik müsaitliği kullanır ve bu müsaitlik yalnızca tüm kısıtlamaları takvim kuralıysa takvim kuralı
            sayılır — hem takvim hem gerçek kısıtlaması olan bir gün o zaman tamamen kısıtlı kalır. Ek alanları yayma (spread) yerine başka bir{' '}
            <code>combineRules</code> çağrısıyla ekleyin.
          </p>
        </Note>
      </Section>

      <Section title="createSelectionEngine">
        <p>
          <code>createSelectionEngine(input)</code>, takvimin tıklamalar, klavye, üzerine gelme önizlemeleri ve devre dışı durumlar için kullandığı arayüzsüz
          değerlendiricidir. Tek bir girdi setinin anlık durumudur: sonuçlar motorun ömrü boyunca gün bazında önbelleğe alınır; bu yüzden kurallar, seçim, bugün
          veya bağlam değiştiğinde yeni bir motor oluşturun. Takvimin <code>minDate</code>/<code>disablePast</code>/… prop’larını eklemez — bunları kurallara
          koyun.
        </p>
        <PropsTable
          caption="SelectionEngineInput"
          rows={[
            { name: 'rules', type: 'SelectionRules', required: true, description: 'Tek bir kural seti; birden fazlası için combineRules kullanın.' },
            {
              name: 'state',
              type: '{ selection: Selection; activeEndpoint: \'start\' | \'end\' }',
              required: true,
              description: (
                <>
                  Mevcut seçim ve sıradaki aralık ucu. Modu, <code>plan()</code>’ın nasıl davranacağını ve <code>checkStart()</code>’ın ulaşılabilir bitiş
                  aramasını çalıştırıp çalıştırmayacağını (yalnızca aralık) belirler.
                </>
              ),
            },
            {
              name: 'today',
              type: 'CalendarDate | null',
              required: true,
              description: (
                <>
                  <code>disablePast</code>/<code>disableFuture</code> için referans; <code>null</code> iki kontrolü de devre dışı bırakır.
                </>
              ),
            },
            { name: 'context', type: 'TContext', description: <>Kural callback’lerine <code>ctx.context</code> olarak verilir.</> },
          ]}
        />
        <PropsTable
          caption="SelectionEngine"
          rows={[
            {
              name: 'semantics',
              type: "'inclusive' | 'exclusive'",
              description: <>Çözümlenmiş <code>rangeSemantics</code>.</>,
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              description: <>Anlama göre varsayılanı uygulanmış, çözümlenmiş <code>allowSameDay</code>.</>,
            },
            {
              name: 'availability(date)',
              type: '{ closed, canStart, canEnd, canPassThrough, schedule, reason?, message? }',
              description: (
                <>
                  Varsayılanları uygulanmış ve <code>availableWeekdays</code> dahil edilmiş gün müsaitliği; tüm bayraklar boolean’dır. Tip adıyla dışa
                  aktarılmaz: <code>ReturnType&lt;SelectionEngine[&apos;availability&apos;]&gt;</code> kullanın.
                </>
              ),
            },
            {
              name: 'dataStatus(date)',
              type: 'DataStatus',
              description: <>Tarihin ayının durumu; <code>getDataStatus</code> yoksa <code>loaded</code>.</>,
            },
            {
              name: 'checkDay(date)',
              type: 'ValidationIssue | null',
              description: <>Yalnızca seçilebilir her günün ortak kontrolleri: sınırlar, geçmiş/gelecek ve (engelleme politikasıyla) veri durumu.</>,
            },
            {
              name: 'checkStart(date)',
              type: 'ValidationIssue | null',
              description: (
                <>
                  Tarih tekli seçim, çoklu seçim veya aralık başlangıcı olabilir mi: <code>checkDay</code>, kapalılık, <code>canStart</code>, başlangıç hafta günü
                  ve durum aralık modundaysa ulaşılabilir bitiş araması. <code>validateSelection</code>’ı çalıştırmaz.
                </>
              ),
            },
            {
              name: 'validateRange(start, end)',
              type: '{ valid: boolean; issue: ValidationIssue | null }',
              description: <>Tek bir aralığın tam doğrulaması: önce yerleşik kontroller, sonra <code>validateSelection</code>.</>,
            },
            {
              name: 'validate(selection)',
              type: '{ valid: boolean; issue: ValidationIssue | null }',
              description: (
                <>
                  Herhangi bir moddaki tam bir seçimi, önce değerlerini ayrıştırarak doğrular (hatalı metinler için <code>invalid-date</code>); bu yüzden
                  güvenilmeyen girdi için güvenlidir. Yalnızca başlangıcı olan bir aralık, ulaşılabilir bitiş araması olmadan başlangıç olarak kontrol edilir.
                  Çoklu: tekrarlar yok sayılır, <code>maxSelections</code> farklı tarihleri sayar. Salt okunur ve boş seçimler, <code>validateSelection</code>{' '}
                  itiraz etmedikçe geçerlidir.
                </>
              ),
            },
            {
              name: 'plan(date)',
              type: '{ kind, date, issue, next }',
              description: (
                <>
                  Tarihi etkinleştirmenin ne yapacağı: aşağıdaki <code>kind</code>, <code>rejected</code> olduğunda <code>issue</code> ve aksi halde uygulanacak{' '}
                  <code>next</code> durumu (seçim ve aktif uç). Reddedilen bir plan değişmemiş durumu döndürür.
                </>
              ),
            },
          ]}
        />
        <DataTable
          caption="ActivationPlan türleri"
          head={['Tür', 'Ne zaman']}
          rows={[
            [<code key="k">select</code>, 'Tekli mod: seçilebilir her tarih, zaten seçili olan da (aynı değer: değişiklik yok, ama selectionComplete).'],
            [<code key="k">none</code>, 'Salt okunur mod.'],
            [<code key="k">start</code>, 'Aralık: yeni bir başlangıç (mevcut başlangıçtan önceye tıklama da).'],
            [<code key="k">complete</code>, 'Aralık: bitiş seçildi ya da sabit uzunluklu bir aralık / singleDayFirst günü tek tıklamayla oluşturuldu.'],
            [<code key="k">clear</code>, 'Aralık: aynı gün aralıklarına izin verilmezken tek başına duran başlangıca veya tek başına duran singleDayFirst gününe yeniden tıklandı.'],
            [<code key="k">toggle-on / toggle-off</code>, 'Çoklu mod: bir tarih ekleme veya çıkarma.'],
            [<code key="k">rejected</code>, 'Bir kontrol veya validateSelection başarısız oldu; sebebini issue söyler.'],
          ]}
        />
        <Snippet files={enginePlan} label="Motor metotları" />
        <h3>Sunucu tarafında doğrulama</h3>
        <p>
          Tarayıcının gönderdiği bir tarih aralığına asla güvenmeyin. Aynı kuralları sunucuda oluşturun (veya modülü paylaşın) ve isteği, bugünü işletmenizin saat
          dilimindeki sunucu tarihi olan bir motorla doğrulayın (<code>getToday({'{ timeZone }'})</code>).
        </p>
        <Snippet files={serverValidation} label="Bir rezervasyon isteğini doğrulama" />
      </Section>

      <Section title="Çakışmalar ve sınırlamalar">
        <Note>
          <p>
            <strong>Hariç bitişte aynı gün + minimum.</strong> Aynı gün konaklama 0 gecedir. <code>stayRules({'{ allowSameDay: true, minNights: 1 }'})</code>{' '}
            günübirlik kullanıma asla izin vermez; minimumu tanımsız veya 0 bırakın.
          </p>
        </Note>
        <Note>
          <p>
            <strong>63 bitiş adayı.</strong> Ulaşılabilir bitiş araması 63 adaydan sonra durur. İlk geçerli bitişi daha uzakta olan bir başlangıç reddedilmez,
            ama önceden de doğrulanmaz; bitiş seçildiğinde doğrulanır.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Sabit uzunluk ve minimum/maksimum.</strong> <code>fixedLength</code>, <code>minLength</code>/<code>maxLength</code>’in yerini almaz; üçü de
            uygulanır. Sabit uzunluğu bu sınırların içinde tutun.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Kısmi kısıtlamalar ve takvim kuralları.</strong> <code>schedule: true</code> müsaitlik sonucunun tamamına uygulanır. Bir günün hem takvim
            kaynaklı hem gerçek bir kısıtlaması varsa, gevşetmenin gerçek olanı koruması için bunları ayrı kural setlerinden döndürün (<code>combineRules</code>{' '}
            ile birleştirilmiş).
          </p>
        </Note>
        <Note>
          <p>
            <strong>Birleştirme sonrası sebepler.</strong> Birleşik müsaitlik <code>reason</code> ve <code>message</code> değerlerini günü kısıtlayan ilk sonuçtan
            alır. O sonucun sebebi yoksa, sonraki bir sonucun sebebi kullanılmaz.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Yarım aralıklar validateSelection’a ulaşır.</strong> Bir başlangıç yerleştirilirken doğrulayıcınız <code>{'{ start, end: null }'}</code>{' '}
            alır; başlangıcı reddetmek istemiyorsanız bunun için <code>null</code> döndürün.
          </p>
        </Note>
      </Section>
    </Page>
  );
}
