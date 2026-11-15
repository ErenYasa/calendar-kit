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
          Kurallar hangi günlerin seçilebileceğini ve hangi seçimlerin geçerli olduğunu belirler. Bu sayfa bunların tam başvuru kaynağıdır:{' '}
          <code>SelectionRules</code> nesnesi, bu nesneyi gecelik konaklamalar ve gün bazlı rezervasyonlar için oluşturan adaptörler, kural setlerini
          birleştiren ve gevşeten fonksiyonlar ve bir tarihi ya da aralığı React olmadan kontrol eden motor. Buradaki her şey{' '}
          <code>calendar-kit/core</code>’dan (ve <code>calendar-kit</code>’ten) dışa aktarılır; böylece sunucunuz bir rezervasyon isteğini takvimle aynı
          kurallarla kontrol edebilir.
        </>
      }
    >
      <Section title="SelectionRules: kural nesnesi">
        <p>
          Kural seti düz bir nesnedir; her alanı isteğe bağlıdır ve boş bir nesneyle her gün seçilebilir. Takvimin <code>rules</code> prop’u tek bir kural
          seti veya bir kural seti dizisi alır, örneğin <code>{'rules={[stayRules({ minNights: 2 }), closedDates(holidays)]}'}</code>. Dizi{' '}
          <code>combineRules</code> ile birleştirilir; yani bir gün her setten geçmelidir. Takvimin <code>minDate</code>, <code>maxDate</code>,{' '}
          <code>disablePast</code>, <code>disableFuture</code> ve <code>getDataStatus</code> prop’ları bu listenin sonuna bir set daha olarak eklenir.
        </p>

        <h3>Sınırlar: en erken ve en geç gün</h3>
        <PropsTable
          caption="Sınırlar"
          rows={[
            {
              name: 'minDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Seçilebilen en erken gün (dahil). Daha erken günler seçilemez (sebep <code>before-min</code>) ve takvim bu günün ayından önceki aylara
                  gitmez.
                </>
              ),
            },
            {
              name: 'maxDate',
              type: 'CalendarDate | null',
              description: (
                <>
                  Seçilebilen en geç gün (dahil). Daha sonraki günler seçilemez (sebep <code>after-max</code>) ve gezinme bu günün ayında durur.
                </>
              ),
            },
            {
              name: 'disablePast',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  <em>Bugünden</em> önceki günler seçilemez (sebep <code>past</code>). Bugünün tarihi bilinmiyorsa (motorda <code>today: null</code>) etkisi yoktur.
                  Geçmiş aylara yine de gidilebilir.
                </>
              ),
            },
            {
              name: 'disableFuture',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bugünden sonraki günler seçilemez (sebep <code>future</code>). Bunun dışında <code>disablePast</code> gibi çalışır.
                </>
              ),
            },
          ]}
        />
        <p>
          Sınırlar seçimin kapsadığı her güne uygulanır: başlangıç, bitiş ve aradaki her gün. Aralığın içindeki bir gün sınırların dışındaysa aralık{' '}
          <code>blocked-in-range</code> sebebiyle reddedilir.
        </p>

        <h3>Aralık uzunluğu ve bitiş günü</h3>
        <PropsTable
          caption="Aralık uzunluğu ve bitiş günü"
          rows={[
            {
              name: 'rangeSemantics',
              type: "'inclusive' | 'exclusive'",
              default: "'inclusive'",
              description: (
                <>
                  Bitiş gününün rezervasyona dahil olup olmadığı. <code>inclusive</code> (dahil bitiş), <code>[start, end]</code>: bitiş günü de rezerve
                  edilir, yani 13 → 20 = 8 gün (tekne kiralama, etkinlik). <code>exclusive</code> (hariç bitiş), <code>[start, end)</code>: bitiş yalnızca bir
                  sınırdır, örneğin çıkış günü; yani 13 → 20 = 7 gece (otel konaklaması). Bu ayar uzunluk birimini (gün veya gece),{' '}
                  <code>allowSameDay</code>’in varsayılan değerini ve hangi günlerin dahil sayıldığını (<code>getIncludedDays</code>,{' '}
                  <code>DayState.included</code>) değiştirir. Kontroller aynıdır: başlangıç günü başlangıç, bitiş günü bitiş olabilmeli ve aradaki (uçlar hariç)
                  her günün içinden geçilebilmelidir.
                </>
              ),
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              default: 'inclusive: true · exclusive: false',
              description: (
                <>
                  Bir aralığın aynı gün başlayıp bitebilmesi (<code>start === end</code>). İzin verilmiyorsa, bitiş seçilmeden başlangıca yeniden tıklamak
                  seçimi temizler ve böyle bir aralık <code>same-day</code> sebebiyle geçersizdir. Aynı gün aralığı için gün hem başlangıç hem bitiş olabilmelidir{' '}
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
                  İzin verilen en kısa aralık. Hariç bitişli aralıklarda gece (<code>end − start</code>), dahil bitişli aralıklarda gün (<code>end − start + 1</code>) olarak
                  ölçülür. Daha kısa aralıklar geçersizdir (sebep <code>min-length</code>, parametreler <code>{'{ min, actual, unit }'}</code>).
                </>
              ),
            },
            {
              name: 'maxLength',
              type: 'number',
              description: (
                <>
                  İzin verilen en uzun aralık, aynı birimle. Daha uzun aralıklar geçersizdir (sebep <code>max-length</code>, parametreler{' '}
                  <code>{'{ max, actual, unit }'}</code>). Ulaşılabilir bitiş aramasının ne kadar ileriye bakacağını da belirler.
                </>
              ),
            },
            {
              name: 'fixedLength',
              type: 'number',
              description: (
                <>
                  Tam uzunluk, aynı birimle. Bir başlangıca tek tıklama aralığın tamamını oluşturur (hariç bitişte bitiş = başlangıç + N, dahil bitişte başlangıç +
                  N − 1) ve hemen doğrular; başka her uzunluk geçersizdir (sebep <code>fixed-length</code>). <code>minLength</code>/<code>maxLength</code>’ten önce
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
                  İlk tıklama o günü tek günlük, tamamlanmış bir aralık olarak seçer (<code>start === end</code>, sonraki uç <code>end</code>); böylece tek
                  günlük bir rezervasyon tek tıklamayla yapılır. Daha sonraki bir güne tıklamak aralığı genişletir; aynı güne yeniden tıklamak seçimi temizler;
                  daha önceki bir güne tıklamak seçime o günden yeniden başlar. Aynı gün aralıklarına izin verilmediğinde veya <code>fixedLength</code> ayarlandığında yok sayılır. Tek günlük aralık geçerli değilse
                  (örneğin <code>minLength: 2</code> ile veya bitiş olamayan bir günde) tıklama yalnızca başlangıcı seçer.
                </>
              ),
            },
          ]}
        />

        <h3>Takvim düzeni (schedule): izin verilen hafta günleri</h3>
        <PropsTable
          caption="Takvim düzeni (schedule) kuralları"
          rows={[
            {
              name: 'startWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Bir aralığın, tekli seçimin veya çoklu seçimin başlayabileceği hafta günleri (0 = pazar … 6 = cumartesi). Diğer günler başlangıç
                  olamaz (sebep{' '}
                  <code>weekday-start</code>, parametreler <code>{'{ weekday }'}</code>). Bu günler yine de bitiş olabilir veya
                  aralığın içinde kalabilir.
                </>
              ),
            },
            {
              name: 'endWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Bir aralığın bitebileceği hafta günleri; diğer günler bitiş olarak seçilemez (sebep <code>weekday-end</code>). Aynı gün aralıklarında
                  başlangıç günü bitiş de olduğu için bu kural onlara da uygulanır.
                </>
              ),
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Hizmetin çalıştığı hafta günleri. Diğer her gün tamamen kapalıdır (sebep <code>out-of-schedule</code>, takvim düzeni kuralı olarak işaretli):
                  başlangıç ya da bitiş olamaz ve hiçbir aralık bu günün üzerinden geçemez. O gün zaten kapalı değilse <code>getDayAvailability</code>’nin döndürdüğü sonucun
                  yerine geçer. Boş bir liste her günü kapatır.
                </>
              ),
            },
          ]}
        />
        <p>
          Bu üç alan, uzunluk alanları ve <code>schedule: true</code> ile işaretlenmiş müsaitlik sonuçları <em>takvim düzeni kurallarıdır</em> (schedule
          rules): dolu veya kapalı bir gün gibi gerçek bir engel değil, işletmenizin düzenli çalışma planıdır (yalnızca cumartesi giriş, en az 2 gece).
          Fark, personel bir istisna yaptığında önemlidir; örneğin telefonla alınan bir rezervasyonda takvimin <code>relaxSchedule</code> prop’u (veya
          aşağıda anlatılan <code>relaxRules</code>) takvim düzeni kurallarını kaldırır, gerçek kısıtlamaların hepsini korur. Yalnızca takvim düzeni
          kuralları yüzünden seçilemeyen günler üstü çizili değil, soluk görünür{' '}
          (<code>data-out-of-schedule</code>).
        </p>

        <h3>Gün müsaitliği ve yükleme durumu</h3>
        <PropsTable
          caption="Müsaitlik ve veri"
          rows={[
            {
              name: 'getDayAvailability',
              type: '(date, ctx: RuleContext) => DayAvailability | null | undefined',
              description: (
                <>
                  Bir günde neyin mümkün olduğunu (başlangıç, bitiş, içinden geçme) ve neden olmadığını söyler; aşağıdaki DayAvailability bölümüne bakın.
                  Tamamen müsait bir gün için hiçbir şey döndürmeyin. İkinci argüman <code>ctx</code> kural bağlamıdır (mevcut seçim, mod, bugün,{' '}
                  <code>ruleContext</code> değeriniz; aşağıdaki RuleContext bölümüne bakın); böylece müsaitlik seçilen başlangıca bağlı olabilir. Her motor
                  için her günde en fazla bir kez çağrılır; takvim kurallar, seçim, bugün veya <code>ruleContext</code> değiştiğinde yeni bir motor oluşturur.
                </>
              ),
            },
            {
              name: 'getDataStatus',
              type: "(month: CalendarMonth) => 'unknown' | 'loading' | 'loaded' | 'error'",
              default: <>her ay <code>'loaded'</code></>,
              description: (
                <>
                  Bir ayın müsaitlik verisinin yüklenip yüklenmediği. Hem kurallarda hem takvim prop’unda tanımlıysa daha kötü olan durum geçerli olur (bkz.{' '}
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
                  <code>block</code>: <code>loaded</code> olmayan bir aydaki günler seçilemez (sebep <code>data-unknown</code>, <code>data-loading</code> veya{' '}
                  <code>data-error</code>); ne başlangıç ne bitiş olabilir, aralığın içinde de kalamaz. <code>allow</code>: doğrulama veri durumunu yok sayar.
                </>
              ),
            },
          ]}
        />

        <h3>Özel doğrulama ve seçim sınırları</h3>
        <PropsTable
          caption="Doğrulama"
          rows={[
            {
              name: 'validateSelection',
              type: '(selection, ctx: RuleContext) => ValidationIssue | null | undefined',
              description: (
                <>
                  Yukarıdaki alanlarla ifade edilemeyen kurallar için kendi kuralınız (örn. “hafta sonları en fazla 4 misafir”). Önerilen seçimi ve kural
                  bağlamı <code>ctx</code>’i alır; seçimi reddetmek için bir sorun, kabul etmek için hiçbir şey döndürür. Yalnızca yerleşik kontrollerin hepsi
                  geçtikten sonra çalışır: tıklamalarda ve tuşlarda (aralık başlangıcı seçilirken de; bu yüzden <code>{'{ start, end: null }'}</code> de
                  görür), <code>ref.select()</code> çağrısında (seçimi koddan, takvimin ref’i üzerinden ayarlama) ve kurallar, veri veya{' '}
                  <code>ruleContext</code> değiştiğinde. Takvim, hangi günlerin devre dışı olacağına karar vermek için de onu render edilen her gün için çağırır;
                  bu yüzden hızlı ve yan etkisiz tutun. Seçimi azaltan eylemlerde (aralığı temizleme, çoklu modda bir tarihi kaldırma) çağrılmaz. <code>code</code> içermeyen bir sorun <code>custom</code> kodunu alır; <code>message</code> değeri olduğu gibi
                  gösterilir.
                </>
              ),
            },
            {
              name: 'maxSelections',
              type: 'number',
              description: (
                <>
                  Yalnızca çoklu mod: en fazla kaç farklı tarihin seçilebileceği. İki kez yer alan bir tarih bir kez sayılır. Sınıra ulaşıldıktan sonra yeni bir
                  tarih eklenemez (sebep <code>max-selections</code>, parametreler <code>{'{ max, actual }'}</code>).
                </>
              ),
            },
            {
              name: 'requireReachableEnd',
              type: 'boolean',
              default: <><code>false</code> (iki adaptörde de: <code>true</code>)</>,
              description: (
                <>
                  Yalnızca aralık modunda: ardından geçerli hiçbir bitiş gelemeyecek bir gün başlangıç olarak seçilemez; örneğin en az 2 gece gerekirken bir
                  sonraki gece doluysa. Böylece kullanıcı hiçbir bitişi mümkün olmayan bir başlangıçta takılı kalmaz. Aramanın nasıl çalıştığı aşağıda.
                </>
              ),
            },
          ]}
        />
        <h3>Ulaşılabilir bitiş araması nasıl karar verir</h3>
        <p>
          Başlangıç olarak denenen bir gün için motor, izin verilen en kısa uzunluktan başlayarak sırayla olası bitişleri dener (<code>minLength</code>{' '}
          ya da, aynı gün aralıklarına izin verilmiyorsa, 1 gece / 1 gün). En fazla 63 olası bitişe bakar ve <code>maxLength</code>’i hiç aşmaz. Tamamen
          geçerli ilk bitiş bulunduğunda başlangıç seçilebilir. Aralığın içindeki bir gün engelliyse ya da olası bitiş <code>maxDate</code>’i, gelecek
          sınırını veya verisi yüklenmemiş bir ayı aşıyorsa arama erken durur: bu durumda daha sonraki hiçbir bitiş işe yaramayacağı kesindir. Başlangıç
          yalnızca böyle kesin bir durumda veya <code>maxLength</code>’e kadar her olası bitiş geçersizse seçilemez. 63 deneme önce biterse başlangıç
          seçilebilir kalır ve doğrulama bitiş seçildiğinde yapılır.
        </p>
        <p>
          Reddedilen başlangıcın gösterdiği sebep: aramayı bir sınır veya veri sorunu durdurduysa o sorun. Aksi halde başlangıçta <code>min-length</code>{' '}
          (parametreler <code>{'{ min, unit }'}</code>, son başarısız denemenin <code>dayReason</code>’ıyla), ama yalnızca engel gerçekten minimum süreyse: doğal minimumun (1 gece / 1 gün) üstünde bir{' '}
          <code>minLength</code> vardır ve uzunluk kuralı olmasa daha kısa bir bitiş geçerli olurdu. Diğer her durumda son denenen bitişin sorunu
          bildirilir; böylece sonrasında hiç çıkış yapılamayan bir başlangıç günü “En az N” yerine örneğin <code>end-not-allowed</code> sebebini gösterir.{' '}
          <code>fixedLength</code> varsa arama yapılmaz (sabit aralık bütün olarak doğrulanır); arama <code>validate()</code>’in de parçası değildir.
        </p>
        <Snippet files={reachableEnd} label="requireReachableEnd" />

        <h3>DayAvailability: getDayAvailability’nin döndürdüğü değer</h3>
        <PropsTable
          caption="DayAvailability (getDayAvailability’nin döndürdüğü)"
          rows={[
            {
              name: 'closed',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Bu günde hiçbir şey mümkün değildir. Aşağıdaki üç bayraktan önce gelir: bayraklar ne derse desin kapalı bir gün başlangıç ya da bitiş olamaz ve
                  hiçbir aralık bu günün üzerinden geçemez. Sebep <code>closed</code>.
                </>
              ),
            },
            {
              name: 'canStart',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Aralık başlangıcı, tekli seçim veya çoklu seçimdeki bir tarih olabilir. <code>false</code> ise gün bunlar için seçilemez (sebep <code>start-not-allowed</code>).
                </>
              ),
            },
            {
              name: 'canEnd',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Aralık bitişi olabilir (aynı gün aralığı için de gerekir). <code>false</code> ise gün bitiş olarak seçilemez (sebep <code>end-not-allowed</code>).
                </>
              ),
            },
            {
              name: 'canPassThrough',
              type: 'boolean',
              default: '!closed',
              description: (
                <>
                  Başlangıç ile bitişin arasında (uçlar hariç) kalabilir. <code>false</code> ise bu günü kapsayan her aralık geçersizdir (sebep{' '}
                  <code>blocked-in-range</code>, bu tarihte).
                </>
              ),
            },
            {
              name: 'reason',
              type: 'string',
              description: (
                <>
                  Kısıtlama için kendi etiketiniz (örn. <code>check-out-only</code>). <code>ValidationIssue.dayReason</code>’a kopyalanır; günle ilgili
                  sorunlarda gösterilen metin, varsa <code>messages.dayReasons[reason]</code>’dan gelir.
                </>
              ),
            },
            {
              name: 'message',
              type: 'string',
              description: (
                <>
                  Hazır metin. Sorunun <code>message</code> alanına kopyalanır; tooltip’ler ve ekran okuyucu duyuruları çeviriler yerine bu metni gösterir.
                </>
              ),
            },
            {
              name: 'schedule',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  Kısıtlama gerçek bir doluluktan değil, işletmenizin düzenli çalışma planından gelir. <code>relaxSchedule</code> açıkken bu sonucun tamamı yok
                  sayılır; bu yüzden yalnızca tamamen çalışma planından kaynaklanan sonuçları işaretleyin.
                </>
              ),
            },
          ]}
        />

        <h3>RuleContext: ctx argümanının içeriği</h3>
        <PropsTable
          caption="RuleContext (getDayAvailability ve validateSelection’ın ctx’i)"
          rows={[
            { name: 'mode', type: "'single' | 'range' | 'multiple' | 'readonly'", description: 'Seçim modu.' },
            {
              name: 'selection',
              type: 'Selection',
              description: (
                <>
                  Motorun anlık durumundaki seçim (<code>{'{ mode, value }'}</code>); bir tıklama sırasında tıklamadan önceki seçimdir.{' '}
                  <code>validateSelection</code> içinde önerilen seçim için ilk argümanı kullanın.
                </>
              ),
            },
            { name: 'activeEndpoint', type: "'start' | 'end'", description: 'Sonraki tıklamanın aralığın hangi ucunu belirleyeceği.' },
            { name: 'today', type: 'CalendarDate | null', description: 'Takvimin bugün kabul ettiği tarih (veya motorun today girdisi).' },
            {
              name: 'context',
              type: 'TContext',
              description: (
                <>
                  Kendi veriniz: takvimin <code>ruleContext</code> prop’u (örn. kişi sayısı, seçilen saatler). Değiştiğinde yeni bir anlık durum oluşturulur ve
                  seçim yeniden doğrulanır.
                </>
              ),
            },
          ]}
        />

        <h3>Doğrulama sırası</h3>
        <p>Kontroller bu sırayla çalışır; bildirilen sorun, ilk geçemeyen kontroldür:</p>
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
            Uzunluk: uzunluk seçenekleri birbiriyle çelişiyorsa <code>conflicting-rules</code> (aşağıya bakın), ardından <code>fixed-length</code>,{' '}
            <code>min-length</code>, <code>max-length</code>.
          </li>
          <li>
            Aradaki günler (uçlar hariç), başlangıçtan ileriye doğru: engelli ilk gün <code>blocked-in-range</code> (veya kendi <code>data-*</code> kodunu) verir.
          </li>
          <li>
            Çoklu mod: <code>max-selections</code>.
          </li>
          <li>
            <code>validateSelection</code>.
          </li>
        </ol>
        <p>
          Geçerli tarih olmayan değerler <code>validate()</code> içinde <code>invalid-date</code> verir (aralıklarda parametreler <code>{'{ field, value }'}</code>).
          Her sorun <code>code</code>, sorunlu <code>date</code>, mesaj şablonları için <code>params</code>, günün <code>dayReason</code>’ı ve varsa{' '}
          <code>message</code> içerir.
        </p>
      </Section>

      <Section title="stayRules: gecelik konaklamalar">
        <p>
          <code>stayRules(options)</code>, gecelik konaklamalar (oteller, tatil evleri) için otelcilik terimleriyle (gece, giriş, çıkış) verilen
          seçeneklerden bir kural seti oluşturur. Bir konaklama <code>[check-in, check-out)</code> biçimindedir: misafirin seçtiği ikinci gün çıkış günüdür;
          aralığın parçası olarak çizilir ama gece sayılmaz. Konaklamanın her gecesi kontrol edilir; çıkış gününde yalnızca çıkış yapılabilmesi yeterlidir.
          Adaptör her zaman hariç bitişi kullanır ve <code>requireReachableEnd</code>’i açar.
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
                  Gece olarak en kısa konaklama; <code>minLength</code> olur. Mümkün olan bütün konaklamaları çok kısa kalan bir giriş günü (örn. ertesi gece
                  doluysa) seçilemez; sebep <code>min-length</code>.
                </>
              ),
            },
            { name: 'maxNights', type: 'number', description: <>Gece olarak en uzun konaklama; <code>maxLength</code> olur.</> },
            {
              name: 'fixedNights',
              type: 'number',
              description: (
                <>
                  Her konaklama tam olarak bu kadar gecedir; bir giriş gününe tıklamak konaklamanın tamamını seçer. <code>fixedLength</code> olur.
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
                  konaklama minimuma takılır. Saatleri uygulamanız yönetir.
                </>
              ),
            },
            {
              name: 'checkInWeekdays',
              type: 'readonly Weekday[]',
              description: <>Misafirlerin giriş yapabileceği hafta günleri (takvim düzeni kuralı, <code>weekday-start</code>).</>,
            },
            {
              name: 'checkOutWeekdays',
              type: 'readonly Weekday[]',
              description: <>Misafirlerin çıkış yapabileceği hafta günleri (takvim düzeni kuralı, <code>weekday-end</code>).</>,
            },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: (
                <>
                  Hizmet verilen hafta günleri (takvim düzeni kuralı). Diğer hafta günlerindeki geceler rezerve edilemez: o günlerde giriş yapılamaz (<code>start-not-allowed</code>) ve
                  konaklama o geceleri kapsayamaz (<code>blocked-in-range</code>); gün sebebi <code>out-of-schedule</code>. Son müsait geceden sonraki sabah
                  yine geçerli bir çıkış günüdür; bu yüzden <code>[5, 6]</code> cuma → pazar konaklamaya izin verir. Günün tamamını kapatan{' '}
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
                  bir gecenin sabahını belirlemek için önceki tarih için de çağrılır.
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
          Her durum kendi tarihinin müsaitliğine dönüştürülür. Bir tarih, bir gecenin başladığı akşamdır ama aynı zamanda önceki gecenin sabahıdır; bu
          yüzden art arda dolu gecelerin ilki yine de başka bir misafirin çıkış günü olabilir.
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
          dolu günün sabahı <code>booked</code> değil, <code>check-out-only</code> olarak etiketlenir. Aşağıda deneyin: ilk dolu günde çıkış yapın, dolu
          günleri kapsayan bir konaklama seçin veya “Yalnız giriş” gününde bitirmeyi deneyin.
        </p>
        <Example src="rules/StayStatuses" title="Konaklama durumları" />
        <Snippet files={stayStatuses} label="Konaklama durumlarını motorla denetleme" />
        <p>
          Burada <code>availableWeekdays</code> günleri değil geceleri kısıtlar. <code>availableWeekdays: [5, 6]</code> (cuma ve cumartesi geceleri) ile cuma → pazar
          konaklama geçerlidir, çünkü pazar yalnızca çıkış sabahıdır; pazar gecesini içeren veya pazar başlayan bir konaklama geçersizdir. Kısıtlama bir takvim
          düzeni kuralıdır; bu yüzden <code>relaxRules</code> ve <code>relaxSchedule</code> prop’u onu kaldırır.
        </p>
        <Snippet files={stayWeekdays} label="availableWeekdays ve çıkış günleri" />
      </Section>

      <Section title="dayRangeRules: gün olarak sayılan rezervasyonlar">
        <p>
          <code>dayRangeRules(options)</code>, gün olarak sayılan rezervasyonlar (tekne günleri, çok günlük etkinlikler, kiralamalar) için bir kural seti
          oluşturur: <code>[start, end]</code>;
          başlangıçtan bitişe her gün rezervasyona dahildir, yani 13 → 20 = 8 gün (<code>countDays</code>). Aynı güne iki kez tıklamak geçerli, 1 günlük bir
          aralık seçer; adaptör aynı gün aralıklarına her zaman izin verir, yasaklamak için <code>minDays: 2</code> kullanın. Dahil bitiş ve{' '}
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
                  Her rezervasyon tam olarak bu kadar gündür; tek tıklama tüm günleri seçer (bitiş = başlangıç + N − 1). <code>fixedLength</code> olur.
                </>
              ),
            },
            { name: 'startWeekdays', type: 'readonly Weekday[]', description: <>Rezervasyonun başlayabileceği hafta günleri (takvim düzeni kuralı).</> },
            { name: 'endWeekdays', type: 'readonly Weekday[]', description: <>Rezervasyonun bitebileceği hafta günleri (takvim düzeni kuralı).</> },
            {
              name: 'availableWeekdays',
              type: 'readonly Weekday[]',
              description: <>Hizmet verilen hafta günleri (takvim düzeni kuralı), örn. yalnızca hafta sonları <code>[6, 0]</code>. Diğer günler kapalıdır ve rezervasyonun içinde olamaz.</>,
            },
            {
              name: 'singleDayFirst',
              type: 'boolean',
              default: 'false',
              description: (
                <>
                  İlk tıklama yalnızca o günü rezerve eder; daha sonraki bir güne tıklamak rezervasyonu genişletir (bkz.{' '}
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
          Tek günlük aralık için gün hem başlangıç hem bitiş olabilmelidir; bu yüzden <code>start-only</code> ve <code>end-only</code> günleri tek başına
          rezerve edilemez. <code>singleDayFirst</code> açıkken bir start-only gününe ilk tıklama yalnızca başlangıcı seçer; bir end-only gününe ilk
          tıklama yapılamaz. Aşağıda deneyin: bir “Başlangıç” gününde başlayın, bir “Bitiş” gününde bitirin veya bunlardan birinin üzerinden geçmeyi deneyin.
        </p>
        <Example src="rules/DayRangeStatuses" title="Yalnızca başlangıç ve yalnızca bitiş günleri" />
        <Snippet files={dayStatuses} label="Gün durumlarını motorla denetleme" />
      </Section>

      <Section title="closedDates: belirli tarihleri kapatma">
        <p>
          <code>closedDates(dates, reason = &apos;closed&apos;)</code>, tatiller veya bakım günleri gibi sabit bir tarih listesini kapatır. Tek alanı{' '}
          <code>getDayAvailability</code> olan bir kural seti döndürür: listelenen her
          tarih verilen sebep etiketiyle kapatılır, diğer günlere dokunulmaz. <code>dates</code>, <code>CalendarDate</code> değerlerinden oluşan herhangi bir
          yinelenebilir (iterable) değerdir; <code>Set</code> olduğu gibi kullanılır, diğerleri bir kez kümeye kopyalanır. Tarihler metin olarak birebir
          karşılaştırılır; bu yüzden tam <code>YYYY-MM-DD</code> biçiminde verin. Bir adaptörün yanında <code>rules</code> dizisinde veya{' '}
          <code>combineRules</code> içinde kullanın; sebebe bir sonraki bölümdeki örnekte olduğu gibi <code>messages.dayReasons</code> üzerinden metin verin.
        </p>
      </Section>

      <Section title="combineRules: birden fazla kural setini birlikte kullanma">
        <p>
          <code>combineRules(...sets)</code> kural setlerini (örneğin ürün kuralları, kapalı tarihler ve bir satış penceresi) tek bir sette birleştirir;
          seçimin <em>her</em> kuraldan geçmesi gerekir. Takvimin bir <code>rules</code> dizisiyle yaptığı da budur; birleşik sete takvimin dışında
          (motor, sunucu, <code>relaxRules</code>) ihtiyacınız olduğunda kendiniz çağırın. Falsy girdiler (<code>null</code>, <code>undefined</code>, <code>false</code>) atlanır; böylece koşullu kuralları satır içinde
          yazabilirsiniz. Verilen setler hiçbir zaman değiştirilmez. Setler soldan sağa şu anlamlarla birleştirilir:
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
              'VEYA: herhangi bir set açarsa açıktır; sonraki bir setteki false onu kapatmaz.',
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
              'Listeyi tanımlayan setlerin kesişimi; listeyi yalnızca bir set tanımlıyorsa o liste olduğu gibi kalır.',
            ],
            [
              <>
                <code>rangeSemantics</code>, <code>allowSameDay</code>, <code>fixedLength</code>, <code>unknownDataPolicy</code>
              </>,
              'Değeri tanımlayan son setinki geçerli olur.',
            ],
            [
              <code key="f">getDayAvailability</code>,
              'Her gün için hepsi çağrılır ve sonuçlar VE ile birleştirilir: herhangi biri kapalıysa kapalıdır, herhangi biri false diyorsa canStart/canEnd/canPassThrough false olur. reason ve message, günü kısıtlayan ilk sonuçtan gelir. Birleşik sonuç yalnızca kısıtlayan her sonuç schedule olarak işaretliyse takvim düzeni kuralı sayılır.',
            ],
            [<code key="f">validateSelection</code>, 'Hepsi sırayla çalışır; ilk sorun bildirilir ve sonraki doğrulayıcılar çağrılmaz.'],
            [<code key="f">getDataStatus</code>, 'Hepsine sorulur; daha kötü olan durum geçerli olur: error > loading > unknown > loaded.'],
          ]}
        />
        <p>
          Değeri <code>undefined</code> olan bir anahtar “bu sette tanımlı değil” sayılır: prop verilmediğinde <code>{'{ validateSelection: props.validate }'}</code>{' '}
          önceki bir setteki doğrulayıcıyı silmez. Birleştirilmiş bir set yeniden birleştirilirken özgün parçalarına ayrılır; bu sayede <code>relaxRules</code>{' '}
          her parçayı ayrı ayrı gevşetebilir.
        </p>
        <Snippet files={combineFields} label="Alanları birleştirme" />
        <Snippet files={combineFunctions} label="Fonksiyonları birleştirme" />
        <Example src="rules/CombinedRules" title="Ürün kuralları + kapalı tarihler + satış penceresi" />
        <Note>
          <p>
            Uzunluklar birimsiz, düz sayı olarak birleştirilir. Hariç bitişli bir set ile dahil bitişli bir set birleştirilince sonuncunun sayma biçimi geçerli
            olur; bu yüzden <code>stayRules</code>’tan gelen <code>minNights: 3</code>, ardından <code>dayRangeRules</code> gelirse “en az 3 gün” olur.
          </p>
          <p>
            Bir <code>fixedLength</code> (son verilen geçerlidir) yine birleşik minimum ve maksimuma göre kontrol edilir; bunların dışında kalırsa hiçbir aralık geçerli
            olmaz. Ortak günü olmayan hafta günü listelerinin kesişimi boş listedir; bu durumda hiçbir gün başlangıç ya da bitiş olamaz,{' '}
            <code>availableWeekdays</code> için ise hiçbir gün seçilemez.
          </p>
        </Note>
      </Section>

      <Section title="relaxRules: takvim düzeni kurallarını kaldırma">
        <p>
          <code>relaxRules(rules, options)</code>, kuralların takvim düzeni kuralları (izin verilen hafta günleri, uzunluklar) çıkarılmış bir kopyasını
          döndürür; gerçek doluluğu tanımlayan her şey korunur. Takvimin <code>relaxSchedule</code> prop’u aynı işi sizin yerinize yapar, örneğin personel
          için bir “Özel tarihler” anahtarının arkasında; <code>relaxRules</code>’u doğrudan motorla veya sunucuda kullanın.
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
                <code>validateSelection</code>, <code>maxSelections</code>, bitişin sayılma biçimi (semantics), <code>allowSameDay</code>, <code>singleDayFirst</code>,{' '}
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
          verin. <code>combineRules</code> sonucunda her özgün set ayrı ayrı gevşetilir ve ardından yeniden birleştirilir. Bu, bir set bir günü takvim düzeni kuralıyla,
          başka bir set aynı günü gerçek bir sebeple kısıtladığında önemlidir: yalnızca takvim düzeninden gelen kısıtlama kalkar.
        </p>
        <Snippet files={relax} label="relaxRules" />
        <Note>
          <p>
            Set bazında gevşetme yalnızca <code>combineRules</code>’ın döndürdüğü nesnede çalışır. Onun bir kopyası (<code>{'{ ...combined, maxDate }'}</code>)
            parçalarını kaybetmiştir; gevşetildiğinde birleşik müsaitlik kullanılır ve bir gün ancak tüm kısıtlamaları takvim düzeninden geliyorsa
            gevşetilir. Hem takvim düzeninden hem gerçek bir sebepten kısıtlı bir gün bu durumda tamamen kısıtlı kalır. Ek alanları yayma (spread) yerine başka bir{' '}
            <code>combineRules</code> çağrısıyla ekleyin.
          </p>
        </Note>
      </Section>

      <Section title="createSelectionEngine: React olmadan tarih kontrolü">
        <p>
          <code>createSelectionEngine(input)</code>, hiçbir şey render etmeden tarihleri ve aralıkları kurallara göre kontrol eder. Takvim onu tıklamalarda,
          klavyede, fareyle üzerine gelme önizlemelerinde ve devre dışı günleri belirlerken kullanır; siz de testlerde veya sunucuda kullanabilirsiniz. Bir
          motor, tek bir girdi grubunun anlık durumudur (snapshot): sonuçlar motor yaşadığı sürece gün bazında önbelleğe alınır; bu yüzden kurallar, seçim,
          bugün veya bağlam değiştiğinde yeni bir motor oluşturun. Takvimin <code>minDate</code>/<code>disablePast</code>/…
          prop’larını kendisi eklemez; bunları kurallara koyun.
        </p>
        <PropsTable
          caption="SelectionEngineInput"
          rows={[
            { name: 'rules', type: 'SelectionRules', required: true, description: 'Tek bir kural seti; birden fazlasını combineRules ile birleştirin.' },
            {
              name: 'state',
              type: '{ selection: Selection; activeEndpoint: \'start\' | \'end\' }',
              required: true,
              description: (
                <>
                  Mevcut seçim ve sıradaki aralık ucu. Seçimin modu, <code>plan()</code>’ın nasıl davranacağını ve <code>checkStart()</code>’ın ulaşılabilir
                  bitiş aramasını yapıp yapmayacağını (yalnızca aralık modunda) belirler.
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
              description: <>Varsayılanı uygulanmış <code>rangeSemantics</code>.</>,
            },
            {
              name: 'allowSameDay',
              type: 'boolean',
              description: <>Bitişin sayılma biçimine göre varsayılanı uygulanmış <code>allowSameDay</code>.</>,
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
              description: <>Yalnızca her seçilebilir gün için ortak kontroller: sınırlar, geçmiş/gelecek ve (block politikasıyla) veri durumu.</>,
            },
            {
              name: 'checkStart(date)',
              type: 'ValidationIssue | null',
              description: (
                <>
                  Tarih tekli seçim, çoklu seçimdeki bir tarih veya aralık başlangıcı olabilir mi: <code>checkDay</code>, kapalılık, <code>canStart</code>,
                  başlangıç hafta günü ve aralık modundaysa ulaşılabilir bitiş araması. <code>validateSelection</code>’ı çalıştırmaz.
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
                  Herhangi bir moddaki tam bir seçimi doğrular; önce değerlerin gerçek tarih olup olmadığına bakar (değilse <code>invalid-date</code>), bu yüzden
                  dışarıdan gelen, güvenilmeyen girdi için de kullanılabilir. Yalnızca başlangıcı olan bir aralık, ulaşılabilir bitiş araması yapılmadan
                  başlangıç olarak kontrol edilir. Çoklu: tekrarlar yok sayılır, <code>maxSelections</code> farklı tarihleri sayar. Salt okunur ve boş
                  seçimler, <code>validateSelection</code> bir sorun döndürmedikçe geçerlidir.
                </>
              ),
            },
            {
              name: 'plan(date)',
              type: '{ kind, date, issue, next }',
              description: (
                <>
                  Tarihe tıklamanın (veya üzerindeyken Enter’a basmanın) ne yapacağı: aşağıdaki <code>kind</code>, <code>rejected</code> olduğunda <code>issue</code> ve aksi halde uygulanacak{' '}
                  <code>next</code> durumu (seçim ve etkin uç). Reddedilen bir plan durumu değiştirmeden döndürür.
                </>
              ),
            },
          ]}
        />
        <DataTable
          caption="ActivationPlan türleri"
          head={['Tür', 'Ne zaman']}
          rows={[
            [<code key="k">select</code>, 'Tekli mod: seçilebilir her tarih, zaten seçili olan da (değer aynı kalır, change gelmez ama selectionComplete gelir).'],
            [<code key="k">none</code>, 'Salt okunur mod.'],
            [<code key="k">start</code>, 'Aralık: yeni bir başlangıç (mevcut başlangıçtan önceki bir güne tıklama da).'],
            [<code key="k">complete</code>, 'Aralık: bitiş seçildi ya da sabit uzunluklu bir aralık / singleDayFirst günü tek tıklamayla oluşturuldu.'],
            [<code key="k">clear</code>, 'Aralık: aynı gün aralıklarına izin verilmezken bitişi olmayan başlangıca ya da singleDayFirst ile seçilmiş tek güne yeniden tıklandı.'],
            [<code key="k">toggle-on / toggle-off</code>, 'Çoklu mod: bir tarih ekleme veya çıkarma.'],
            [<code key="k">rejected</code>, 'Bir kontrol veya validateSelection geçmedi; gün seçilemez, sebebi issue’da.'],
          ]}
        />
        <Snippet files={enginePlan} label="Motor metotları" />
        <h3>Sunucu tarafında doğrulama</h3>
        <p>
          Tarayıcının gönderdiği bir tarih aralığına doğrudan güvenmeyin. Aynı kuralları sunucuda da oluşturun (veya aynı modülü içe aktarın) ve isteği,
          bugünü işletmenizin saat dilimindeki güncel tarih olan bir motorla doğrulayın (<code>getToday({'{ timeZone }'})</code>).
        </p>
        <Snippet files={serverValidation} label="Bir rezervasyon isteğini doğrulama" />
      </Section>

      <Section title="Çakışan kurallar ve sınırlamalar">
        <Note>
          <p>
            <strong>Hariç bitişte aynı gün + minimum.</strong> Aynı gün konaklama 0 gecedir. <code>stayRules({'{ allowSameDay: true, minNights: 1 }'})</code>{' '}
            ile günübirlik kullanım hiçbir zaman seçilemez; minimumu tanımsız veya 0 bırakın.
          </p>
        </Note>
        <Note>
          <p>
            <strong>63 olası bitiş.</strong> Ulaşılabilir bitiş araması 63 denemeden sonra durur. İlk geçerli bitişi daha uzakta olan bir başlangıç seçilebilir
            kalır ama önceden doğrulanmış olmaz; doğrulama bitiş seçildiğinde yapılır.
          </p>
        </Note>
        <Note>
          <p>
            <strong>Çelişen uzunluklar.</strong> <code>fixedLength</code>, <code>minLength</code>/<code>maxLength</code>’in yerine geçmez; üçü de uygulanır.
            Hiçbir uzunluk bunları sağlayamıyorsa (minimum maksimumdan büyükse ya da sabit uzunluk bu sınırların dışındaysa) hiçbir aralık seçilemez:{' '}
            <code>stayRules</code> ve <code>dayRangeRules</code> çakışan seçenekleri adıyla söyleyen bir <code>RangeError</code> fırlatır (örneğin
            “stayRules: minNights (5) is greater than maxNights (3), so no stay can be selected.”). Yalnızca <code>combineRules</code> ile birleşince
            çelişen kural setlerinde (biri minimumu, diğeri maksimumu belirliyorsa) hata fırlatılmaz; o zaman hiçbir gün aralık başlangıcı olarak seçilemez
            ve sebep <code>conflicting-rules</code> olur (“Bu kurallara uyan konaklama yok: en az 5 gece ve en fazla 3 gece”).
          </p>
        </Note>
        <Note>
          <p>
            <strong>Kısmi kısıtlamalar ve takvim düzeni kuralları.</strong> <code>schedule: true</code> müsaitlik sonucunun tamamına uygulanır. Bir günün hem takvim
            düzeninden hem gerçek bir sebepten gelen kısıtlaması varsa, gevşetince gerçek olanın korunması için bunları ayrı kural setlerinden döndürün (<code>combineRules</code>{' '}
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
            <strong>Yarım aralıklar da validateSelection’a gelir.</strong> Başlangıç seçilirken doğrulayıcınız <code>{'{ start, end: null }'}</code>{' '}
            alır; başlangıcın seçilebilmesi için bu durumda <code>null</code> döndürün.
          </p>
        </Note>
      </Section>
    </Page>
  );
}
