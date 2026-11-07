import type { ReactNode } from 'react';
import { Example, Snippet } from '../../Code';
import { DataTable, Note, Page, Section } from '../../ui';
import controllerCode from '../../../snippets/events/controller.tr.tsx?code';
import dataLayoutCode from '../../../snippets/events/data-layout.tr.tsx?code';
import miscCode from '../../../snippets/events/misc.tr.tsx?code';
import navigationCode from '../../../snippets/events/navigation.tr.tsx?code';
import selectionCode from '../../../snippets/events/selection.tr.tsx?code';

const FIELD_HEAD = ['Alan', 'Tür', 'Anlamı'] as const;

/** Payload tablosu: her alan için bir satır. Her olayda ayrıca `type` ve `instanceId` vardır. */
function Payload({ caption, rows }: { caption: string; rows: readonly (readonly [string, string, ReactNode])[] }) {
  return <DataTable caption={caption} head={FIELD_HEAD} rows={rows.map(([name, type, meaning]) => [<code key="n">{name}</code>, <code key="t">{type}</code>, meaning])} />;
}

function Signature({ children }: { children: string }) {
  return (
    <p>
      İmza: <code>{children}</code>
    </p>
  );
}

const c = (s: string) => <code>{s}</code>;

export function EventsReference() {
  return (
    <Page
      title="Callback’ler ve olaylar"
      lead={
        <>
          Her callback türü belirli bir olay nesnesi alır. Uygulama mantığı için özel callback’leri (<code>onChange</code>, <code>onVisibleMonthChange</code>, …)
          kullanın; hepsini tek bir ayrımlı birleşim (discriminated union) olarak almak için <code>onEvent</code>’i kullanın.
        </>
      }
    >
      <Section title="Callback’ler nasıl çağrılır">
        <ul>
          <li>
            Çoğu callback yalnızca olayı alır: <code>onDateClick(event)</code>. Üçü önce yeni değeri alır:{' '}
            <code>onChange(value, event)</code>, <code>onVisibleMonthChange(month, event)</code> ve <code>onActiveEndpointChange(endpoint, event)</code>.
          </li>
          <li>
            Her olayda <code>type</code> (<code>onEvent</code> içindeki adı) ve <code>instanceId</code> (takvimin kök <code>id</code>’si) bulunur; böylece tek
            bir işleyici birden çok takvime hizmet edebilir.
          </li>
          <li>
            <code>onEvent</code>, özel callback’ten sonra aynı olay nesnesiyle çağrılır. Her şeyi almak için yalnızca <code>onEvent</code> vermek yeterlidir.
          </li>
          <li>
            Callback’ler render sırasında asla çağrılmaz. Takvim her zaman en son render’daki callback’i çağırır; bu yüzden <code>useCallback</code>’e gerek
            yoktur ve yeni bir fonksiyon kimliği bir olayı asla yeniden yaymaz.
          </li>
          <li>
            <strong>Eylemler</strong> (bir tıklama, bir tuş, bir controller çağrısı) olaylarını senkron olarak, tarayıcı olayının ya da controller çağrısının
            içinde yayar. <strong>Türetilmiş olaylar</strong> (<code>validationChange</code>, <code>visibleMonthsChange</code>,{' '}
            <code>renderedMonthsChange</code>, <code>loadingChange</code>, <code>layoutChange</code>, <code>tooltipOpenChange</code>, <code>ready</code> ve
            kontrolsüz <code>activeEndpointChange</code>) commit edilen durumu son bildirilenle karşılaştırır ve React render ettikten sonra gelir.
          </li>
          <li>
            Bir prop’u değiştirmek, o değişikliği isteyecek callback’i asla çağırmaz: yeni bir <code>value</code> <code>onChange</code>’i, yeni bir{' '}
            <code>visibleMonth</code> <code>onVisibleMonthChange</code>’i, yeni bir <code>activeEndpoint</code> <code>onActiveEndpointChange</code>’i çağırmaz.
            Türetilmiş olaylar ise prop’un değiştirdiğini yine bildirir (örneğin <code>validationChange</code> veya <code>renderedMonthsChange</code>).
          </li>
          <li>
            Geliştirme ortamında React StrictMode altında efektler mount sırasında iki kez çalışır, bu yüzden <code>onReady</code> iki kez tetiklenebilir. Eylem
            olayları (<code>onChange</code> gibi) asla ikilenmez. Gerçek bir yeniden mount (örneğin yeni bir <code>key</code>) mount olaylarını yeniden yayar.
          </li>
        </ul>
      </Section>

      <Section title="Olay kaynakları">
        <p>
          Birden çok kaynaktan gelebilen olaylar <code>source: EventSource</code> taşır:
        </p>
        <DataTable
          caption="EventSource değerleri"
          head={['Değer', 'Üreten', 'Görüldüğü olaylar']}
          rows={[
            [
              c('pointer'),
              'Bir günün fare, kalem veya dokunmayla etkinleştirilmesi; işaretçiyle gelen odak.',
              'dateClick, change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange ve dayFocusChange',
            ],
            [
              c('keyboard'),
              <>
                Bir günde Enter veya Space; ok, Home/End ve Page tuşları; Tab ile gelen odak.
              </>,
              'pointer ile aynıları, ayrıca visibleMonthChange (odağı gösterilmeyen bir aya taşımak) ve loadMore (trigger keyboard: odağı sürekli listenin sonunun ötesine taşımak)',
            ],
            [c('navigation'), 'Varsayılan önceki/sonraki düğmeleri veya renderNavigation’dan previous()/next().', 'visibleMonthChange'],
            [
              c('programmatic'),
              'Bir controller metodu (ref veya ctx.actions).',
              'change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange, visibleMonthChange, dayFocusChange ve loadMore (trigger keyboard: sürekli listenin sonunun ötesine focusDate(); ref.loadMore() ise load-more bildirir)',
            ],
            [
              c('load-more'),
              'Sürekli modda ay eklemek (varsayılan düğme, renderLoadMore’un loadMore()’u, otomatik gözcü (sentinel), ref.loadMore()); daha fazla ay yükleme sınırına ulaşıldığında ızgaraya taşınan odak.',
              'loadMore ve dayFocusChange',
            ],
            [
              c('prop'),
              <>
                Üst bileşen kontrollü bir <code>value</code>’yu değiştirdi ve bu, türetilen aralık ucunu taşıdı.
              </>,
              'activeEndpointChange (yalnızca kontrolsüz uç nokta)',
            ],
            [c('resize'), <>Ayrılmış: <code>EventSource</code> birleşiminde tanımlıdır ama mevcut sürüm hiç yaymaz (<code>resize</code> olayının kendisinin kaynağı yoktur).</>, '—'],
            [c('scroll'), <>Ayrılmış: <code>EventSource</code> birleşiminde tanımlıdır ama mevcut sürüm hiç yaymaz (<code>scroll</code> olayının kendisinin kaynağı yoktur).</>, '—'],
          ]}
        />
      </Section>

      <Section title="Olay sırası">
        <p>
          Aşağıdaki sıra paket testleriyle sabitlenmiştir (aralık modu, kontrolsüz değer). Parantez içindeki adımlar yalnızca geçerli olduklarında gerçekleşir;
          değişmeyen türetilmiş olaylar hiç yayılmaz.
        </p>
        <DataTable
          caption="Eylem başına olay sırası"
          head={['Eylem', 'Olaylar, sırasıyla']}
          rows={[
            ['Mount', 'validationChange (cause initial) → visibleMonthsChange → renderedMonthsChange → ready; ResizeObserver bildirdiğinde resize'],
            ['Aralık başlangıcı tıklaması', 'dateClick → dayFocusChange → change → activeEndpointChange (start’tan end’e)'],
            ['Aralık bitişi tıklaması', 'dateClick → (dayFocusChange) → change → selectionComplete → activeEndpointChange (end’den start’a) → (validationChange)'],
            [
              <>
                Kontrollü <code>activeEndpoint</code> ile bitiş tıklaması
              </>,
              'dateClick → (dayFocusChange) → change → activeEndpointChange (istek) → selectionComplete',
            ],
            ['Reddedilen tıklama', 'dateClick → (dayFocusChange) → invalidSelection; change yok'],
            ['Salt okunur modda tıklama', 'dateClick (accepted: false, kind: none) → (dayFocusChange); change yok'],
            ['Zaten seçili tekli tarihe tıklama', 'dateClick (accepted: true, kind: select) → (dayFocusChange) → selectionComplete; change yok'],
            ['ref.select(geçerli değer)', 'change (reason set) → (selectionComplete) → (selectionClear) → (activeEndpointChange) → (validationChange); değer mevcut değere eşitse hiçbir şey'],
            ['ref.select(geçersiz değer)', 'invalidSelection; başka hiçbir şey'],
            ['ref.clear()', 'change (reason clear) → selectionClear → (activeEndpointChange); seçim zaten boşsa hiçbir şey'],
            ['Sayfa değiştirme veya atlama', 'visibleMonthChange → visibleMonthsChange → renderedMonthsChange → (loadingChange); ay aynı kalırsa hiçbir şey'],
            ['Daha fazla ay yükleme', 'loadMore → (visibleMonthsChange) → renderedMonthsChange → (loadingChange); eklenecek ay yoksa hiçbir şey'],
          ]}
        />
        <Note>
          <code>dayFocusChange</code> yeni odaklanan her gün için bir kez görünür. Testlerde tıklama odak olmadan gelir, bu yüzden <code>dateClick</code>’ten
          sonra gelir. İşaretçi basıldığında (pointer down) düğmeye odaklanan tarayıcılarda (Chrome, Firefox, Edge) gün önce odaklanır, bu yüzden{' '}
          <code>dayFocusChange</code>, <code>dateClick</code>’ten önce gelir. Bu ikisinin göreli sırasına güvenmeyin.
        </Note>
      </Section>

      {/* ------------------------------------------------------------ seçim */}

      <Section title="onDateClick">
        <p>
          Bir günün işaretçiyle ya da Enter/Space ile her etkinleştirilmesinde, başka hiçbir şey olmadan önce tetiklenir: kabul edilen ve reddedilen
          etkinleştirmeler, zaten seçili tarihin yeniden seçilmesi ve salt okunur moddaki tıklamalar dahil. Değer değişmese bile asla bastırılmaz. Analitik
          veya özel geri bildirim için kullanın; değer için <code>onChange</code>’i kullanın.
        </p>
        <p>
          Controller çağrılarında (<code>ref.select()</code> ve benzerleri), odak veya üzerine gelmede (hover) ya da ok tuşlarında tetiklenmez.
        </p>
        <Signature>{'onDateClick?: (e: DateClickEvent) => void'}</Signature>
        <Payload
          caption="DateClickEvent"
          rows={[
            ['date', 'CalendarDate', 'Etkinleştirilen gün.'],
            ['source', "'pointer' | 'keyboard'", 'Tıklama Enter/Space’ten (detail değeri 0 olan bir tıklama) veya özel bir öğenin tuş işleyicisinden geldiyse keyboard.'],
            ['accepted', 'boolean', <>Etkinleştirmenin kabul edilip edilmediği: <code>kind</code> rejected veya none (salt okunur mod) olduğunda false. Seçili tekli tarihi yeniden seçmek, değer aynı kalsa da kabul edilir.</>],
            [
              'kind',
              'ActivationKind',
              <>
                Etkinleştirmenin ne yaptığı: <code>select</code> (tekli, zaten seçili tarih için de), <code>start</code>, <code>complete</code>,{' '}
                <code>clear</code> (aralık), <code>toggle-on</code>, <code>toggle-off</code> (çoklu), <code>none</code> (salt okunur mod) veya{' '}
                <code>rejected</code>.
              </>,
            ],
            ['issue', 'ValidationIssue | null', <>Neden reddedildiği (bkz. <code>onInvalidSelection</code>); aksi halde null.</>],
            ['day', 'DayState', 'Tıklama anında günün tam durumu (devre dışı, sebep, modifier’lar, …).'],
          ]}
        />
      </Section>

      <Section title="onChange">
        <p>
          Bir eylem seçimi değiştirdiğinde tetiklenir: bir günde tıklama veya Enter/Space ya da <code>select()</code>, <code>clear()</code> ve{' '}
          <code>reset()</code> controller metotları. İlk argüman yeni değerdir ve türü <code>mode</code>’a göre belirlenir: <code>CalendarDate | null</code>,{' '}
          <code>DateRange</code> veya <code>readonly CalendarDate[]</code>.
        </p>
        <p>Şu durumlarda tetiklenmez:</p>
        <ul>
          <li>
            bir prop değiştiğinde: <code>value</code>, <code>mode</code>, kurallar veya sonradan verilen bir <code>defaultValue</code> (yok sayılır);
          </li>
          <li>reddedilen etkinleştirmelerde (bkz. onInvalidSelection);</li>
          <li>
            değer aynı kaldığında: seçili tekli tarihi yeniden seçmek (yine de <code>dateClick</code> ve <code>selectionComplete</code> yayar), mevcut değere eşit
            bir değerle <code>ref.select()</code> veya <code>ref.reset()</code> (hiçbir şey yayılmaz), seçim zaten boşken <code>ref.clear()</code>;
          </li>
          <li>
            geçersiz bir değerle <code>ref.select()</code> çağrıldığında veya <code>readonly</code> modda herhangi bir eylemde.
          </li>
        </ul>
        <p>
          Reddedilen denemeler asla bastırılmaz: aynı reddedilen değer iki kez denense bile <code>invalidSelection</code> (tıklamada ayrıca{' '}
          <code>dateClick</code>) her seferinde yayılır.
        </p>
        <p>
          <strong>Kontrollü</strong> (<code>value</code> verilmiş): olay bir istektir. Takvim, siz yenisini verene kadar <code>value</code>’yu göstermeye devam
          eder; reddetmek için çağrıyı yok sayın. <strong>Kontrolsüz</strong>: takvim değeri zaten saklamıştır; callback yalnızca bilgi verir.
        </p>
        <Signature>{'onChange?: (value: V, e: ChangeEvent<V>) => void'}</Signature>
        <Payload
          caption="ChangeEvent"
          rows={[
            ['mode', 'SelectionMode', "'single', 'range' veya 'multiple'."],
            ['value', 'V', 'Yeni değer (ilk argümanla aynı).'],
            ['previous', 'V', 'Eylemden önceki, takvimin gösterdiği değer.'],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
            [
              'reason',
              "ActivationKind | 'clear' | 'reset' | 'set'",
              <>
                Etkinleştirmeler için <code>select</code>, <code>start</code>, <code>complete</code>, <code>toggle-on</code>, <code>toggle-off</code>; tek
                başına duran bir başlangıca (veya <code>singleDayFirst</code> ile tek başına duran tek günlük bir aralığa) aralık tıklaması ve{' '}
                <code>ref.clear()</code> için <code>clear</code>; <code>ref.reset()</code> için <code>reset</code>; <code>ref.select()</code> için{' '}
                <code>set</code>.
              </>,
            ],
            ['date', 'CalendarDate | null', 'Etkinleştirilen gün; controller çağrılarında null.'],
            ['phase', 'SelectionPhase', "Yeni değerin aşaması: 'empty', 'start-selected' (yalnızca başlangıcı olan aralık) veya 'complete'."],
            ['validation', 'ValidationResult', <>Yeni değerin mevcut kurallara göre doğrulaması: <code>{'{ valid, issue }'}</code>.</>],
          ]}
        />
      </Section>

      <Section title="onSelectionComplete">
        <p>Seçimi tamamlayan bir değişiklikten hemen sonra, yeni değer geçerliyse tetiklenir:</p>
        <ul>
          <li>
            tekli: bir tarih seçildi (tıklama veya <code>ref.select(date)</code>), zaten seçili tarihe tıklama dahil;
          </li>
          <li>
            aralık: bitiş seçildi, tek tıklamayla sabit uzunlukta bir aralık oluşturuldu, <code>singleDayFirst</code> ile tek bir gün seçildi veya{' '}
            <code>ref.select()</code> iki ucu da olan bir aralık atadı;
          </li>
          <li>
            çoklu: bir tıklama tam olarak <code>rules.maxSelections</code> sayısına ulaştı veya <code>ref.select()</code> boş olmayan bir liste atadı.
          </li>
        </ul>
        <p>
          Aynı değeri yeniden tamamlayan kullanıcı (seçili tekli tarihi yeniden seçerek veya aynı aralığı yeniden seçerek) <code>selectionComplete</code>’i
          tekrar alır; değer değişmediyse <code>change</code> olmadan. Bu da onu bir popover’ı kapatmak için doğru yer yapar. Zaten seçili değerin
          programatik olarak <code>ref.select()</code> ile verilmesi hiçbir şey yaymaz. <code>ref.reset()</code> için (varsayılan değer tamamlanmış olsa bile),
          prop değişikliklerinde veya sonraki render’larda tekrar tetiklenmez. Kontrollü bir <code>activeEndpoint</code> ile uç nokta isteğinden sonra gelir;
          aksi halde <code>change</code>’in hemen ardından. Tipik kullanım, bir popover’ı kapatmak veya odağı formun sonraki alanına taşımaktır.
        </p>
        <Signature>{'onSelectionComplete?: (e: SelectionCompleteEvent) => void'}</Signature>
        <Payload
          caption="SelectionCompleteEvent"
          rows={[
            ['mode', 'SelectionMode', 'Seçim modu.'],
            ['value', 'unknown', <>Tamamlanan değer. Moda göre daraltılmaz: dönüştürün (<code>e.value as DateRange</code>) veya kendi durumunuzu okuyun.</>],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onSelectionClear">
        <p>
          Boş olmayan bir seçimi boşaltan bir değişiklikten sonra tetiklenir: <code>ref.clear()</code>, boş bir varsayılana <code>ref.reset()</code>,{' '}
          <code>ref.select(null)</code>, tek başına duran başlangıç tarihine aralık tıklaması veya çoklu modda son tarihin seçiminin kaldırılması. Kontrollü
          bir <code>value</code>’yu kendiniz temizlediğinizde tetiklenmez.
        </p>
        <Signature>{'onSelectionClear?: (e: SelectionClearEvent) => void'}</Signature>
        <Payload
          caption="SelectionClearEvent"
          rows={[
            ['previous', 'unknown', 'Temizlenmeden önceki değer (moda göre daraltılmaz).'],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onInvalidSelection">
        <p>
          Bir seçim denemesi reddedildiğinde tetiklenir: reddedilen bir tıklama veya Enter/Space (<code>dateClick</code>’ten sonra) ya da doğrulamadan geçemeyen
          bir değerle <code>ref.select()</code>. Seçim değişmez ve <code>onChange</code> çağrılmaz. Aynı yerelleştirilmiş mesaj ekran okuyuculara duyurulur
          ve günün erişilebilir etiketinin bir parçasıdır.
        </p>
        <p>
          <code>clear()</code> ve <code>reset()</code> için (doğrulanmazlar), salt okunur moddaki tıklamalar için veya salt okunur modda yalnızca bir sorun
          döndüren <code>ref.select()</code> için yayılmaz. Tekrar olarak asla bastırılmaz: aynı reddedilen deneme iki kez yapılırsa iki kez yayılır.
        </p>
        <Signature>{'onInvalidSelection?: (e: InvalidSelectionEvent) => void'}</Signature>
        <Payload
          caption="InvalidSelectionEvent"
          rows={[
            [
              'date',
              'CalendarDate | null',
              <>
                İlgili gün. Reddedilen bir tıklama veya Enter/Space her zaman etkinleştirilen günü taşır. <code>ref.select()</code> için bu{' '}
                <code>issue.date</code>’tir; sorunun bir günü yoksa <code>null</code> olur (örneğin <code>maxSelections</code> için fazla tarih, geçersiz bir
                değer veya tarih vermeyen özel bir doğrulayıcı). Tarih olarak kullanmadan önce <code>null</code> olup olmadığını kontrol edin.
              </>,
            ],
            ['issue', 'ValidationIssue', 'Sebep, aşağıya bakın.'],
            ['message', 'string', <>Sorunun metni; <code>issue.message</code>’dan veya takvimin <code>messages</code>’ından.</>],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
          ]}
        />
        <Payload
          caption="ValidationIssue"
          rows={[
            [
              'code',
              'ReasonCode',
              <>
                <code>invalid-date</code>, <code>before-min</code>, <code>after-max</code>, <code>past</code>, <code>future</code>, <code>closed</code>,{' '}
                <code>start-not-allowed</code>, <code>end-not-allowed</code>, <code>blocked-in-range</code>, <code>weekday-start</code>,{' '}
                <code>weekday-end</code>, <code>min-length</code>, <code>max-length</code>, <code>fixed-length</code>, <code>same-day</code>,{' '}
                <code>end-before-start</code>, <code>max-selections</code>, <code>data-unknown</code>, <code>data-loading</code>, <code>data-error</code>,{' '}
                <code>custom</code>.
              </>,
            ],
            ['date', 'CalendarDate?', 'Varsa, soruna yol açan gün.'],
            ['params', 'IssueParams?', <>Mesaj için değerler, örn. <code>{'{ min: 2, actual: 1, unit: "nights" }'}</code>.</>],
            ['dayReason', 'string?', <>Müsaitlik kuralınızın o gün için verdiği <code>reason</code> (örn. <code>booked</code>).</>],
            ['message', 'string?', 'Müsaitlik kuralınızdan veya validateSelection’dan gelen hazır bir mesaj.'],
          ]}
        />
      </Section>

      <Section title="onValidationChange">
        <p>
          <em>Mevcut</em> değerin geçerliliğini bildirir. Mount sırasında bir kez tetiklenir (<code>cause: &apos;initial&apos;</code>,{' '}
          <code>previous: null</code>), sonrasında yalnızca sonuç değiştiğinde: <code>valid</code> tersine döndüğünde veya sorun değiştiğinde (kod, tarih, gün
          sebebi, mesaj veya parametreler). Geçerli kalan bir değer değişikliği hiçbir şey yaymaz.
        </p>
        <p>
          Değerin tıklama olmadan geçersiz hale gelebildiği durumlarda kullanın: durumunuzdan gelen kontrollü bir <code>value</code>, değişen kurallar veya{' '}
          <code>ruleContext</code>, yüklenen veriler ya da yeni bir gün (<code>today</code>). Takvim değeri asla kendisi değiştirmez; yalnızca bildirir. Tipik
          kullanım: gönder düğmesini devre dışı bırakmak.
        </p>
        <Signature>{'onValidationChange?: (e: ValidationChangeEvent) => void'}</Signature>
        <Payload
          caption="ValidationChangeEvent"
          rows={[
            ['previous', 'ValidationResult | null', 'Son bildirilen sonuç; mount sırasında null.'],
            ['current', 'ValidationResult', <>Mevcut değer için <code>{'{ valid: boolean, issue: ValidationIssue | null }'}</code>.</>],
            ['selection', 'Selection', <>Doğrulanan değer, <code>{'{ mode, value }'}</code> olarak.</>],
            [
              'cause',
              "'initial' | 'selection' | 'rules'",
              <>
                <code>initial</code>: mount sonrası ilk değerlendirme. <code>selection</code>: değer son değerlendirmeden bu yana değişti (bir eylemle veya{' '}
                <code>value</code> prop’uyla). <code>rules</code>: değer aynı, ama kurallar, kural bağlamı, veri durumu, yükleme veya bugün değişti.
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onActiveEndpointChange">
        <p>
          Yalnızca aralık modunda. Etkin uç nokta, sonraki tıklamanın belirleyeceği uçtur (<code>&apos;start&apos;</code> veya <code>&apos;end&apos;</code>).
          Olayın davranışı onu kontrol edip etmediğinize bağlıdır:
        </p>
        <ul>
          <li>
            <strong>Kontrolsüz</strong> (<code>activeEndpoint</code> prop’u yok): gerçek bir geçişi render edildikten sonra, eylemin kaynağıyla birlikte
            bildirir. <code>value</code>’yu kontrol ediyor ve bir değişikliği reddediyorsanız uç nokta kımıldamaz ve hiçbir şey yayılmaz. <code>value</code>’yu
            kendiniz değiştirir ve türetilen uç nokta yer değiştirirse (örneğin aralığı temizlerseniz) bu, <code>source: &apos;prop&apos;</code> ile
            bildirilir.
          </li>
          <li>
            <strong>Kontrollü</strong> (<code>activeEndpoint</code> verilmiş): olay, eylem anında yayılan bir istektir; <code>change</code>’in hemen ardından
            ve <code>selectionComplete</code>’ten önce gelir, ayrıca <code>ref.setActiveEndpoint()</code> için de yayılır. Uygulamak için saklayın. Prop’u
            kendiniz değiştirmek hiçbir şey yaymaz.
          </li>
        </ul>
        <p>Mount sırasında, diğer modlarda veya uç nokta aynı kaldığında yayılmaz.</p>
        <Signature>{'onActiveEndpointChange?: (endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void'}</Signature>
        <Payload
          caption="ActiveEndpointChangeEvent"
          rows={[
            ['previous', 'RangeEndpoint', 'Önceki uç nokta.'],
            ['current', 'RangeEndpoint', 'Yeni uç nokta (ilk argümanla aynı).'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic' veya 'prop' (kontrolsüz uç nokta, üst bileşen değeri değiştirdi)."],
          ]}
        />
      </Section>

      <Section title="Örnek: bir formda seçim olayları">
        <p>
          İlk bileşen her değişiklikte bir taslak kaydeder, tamamlanmayı izler, bir tıklamanın neden reddedildiğini gösterir ve değer geçersizken Devam
          düğmesini devre dışı bırakır. İkincisi <code>activeEndpoint</code>’i iki alandan kontrol eder.
        </p>
        <Snippet files={selectionCode} label="Seçim olayları" />
      </Section>

      {/* ----------------------------------------------------------- gezinme */}

      <Section title="onVisibleMonthChange">
        <p>
          <strong>Referans ayın</strong> değişmesi istendiğinde tetiklenir (pencerede <code>monthPosition</code> konumuna yerleştirilen ve{' '}
          <code>visibleMonth</code>’un kontrol ettiği ay):
        </p>
        <DataTable
          caption="visibleMonthChange’i neler yayar"
          head={['Eylem', 'source', 'reason']}
          rows={[
            ['Varsayılan önceki/sonraki düğmeleri, renderNavigation’ın previous()/next()’i', 'navigation', 'previous / next'],
            ['ref.previous() ya da ref.next()', 'programmatic', 'previous / next'],
            ['ref.goToMonth()', 'programmatic', 'jump'],
            ['Odağı gösterilmeyen bir aya taşıyan ok veya Page tuşları', 'keyboard', 'keyboard'],
            ['Gösterilmeyen bir aydaki bir güne ref.focusDate()', 'programmatic', 'keyboard'],
          ]}
        />
        <p>Şu durumlarda tetiklenmez:</p>
        <ul>
          <li>mount sırasında veya <code>visibleMonth</code> prop’unu değiştirdiğinizde;</li>
          <li>
            sürekli modda daha fazla ay yüklemede veya kaydırmada: referans ay değişmez (<code>onVisibleMonthsChange</code> veya{' '}
            <code>onRenderedMonthsChange</code> kullanın);
          </li>
          <li>
            ay aynı kaldığında: mevcut referans aya atlama veya <code>minDate</code>/<code>maxDate</code> dışındaki ve mevcut aya geri çekilen bir istek
            (örneğin izin verilen son veya ilk ayda <code>ref.next()</code> ya da <code>ref.previous()</code>). <em>Farklı</em> bir aya çekilen istek{' '}
            <code>clamped: true</code> ile tetiklenir; <code>goToMonth()</code> her iki durumda da <code>clamped: true</code> döndürür.
          </li>
        </ul>
        <p>
          <strong>Kontrollü</strong> (<code>visibleMonth</code> verilmiş): olay bir istektir; ilerlemek için <code>month</code>’u saklayın. Yok sayarsanız
          takvim olduğu yerde kalır. <strong>Kontrolsüz</strong>: takvim zaten ilerlemiştir.
        </p>
        <p>
          <strong>Sürekli modda kontrollü kullanım.</strong> <code>visibleMonth</code> prop’unu değiştirmek <code>goToMonth()</code> ile aynı yolu izler: zaten
          render edilmiş bir aya kaydırılır ve yüklenen liste korunur; render edilmemiş bir ay için liste onun etrafında yeniden kurulur (
          <code>maxRenderedMonths</code> ile sınırlıdır ve veri yüklemeniz takip edebilsin diye <code>renderedMonthsChange</code> /{' '}
          <code>onRenderedMonthsChange</code> ile bildirilir) ve render edilince o aya kaydırılır. Değer <code>minDate</code>/<code>maxDate</code> sınırına
          çekilir. Kaydırma <code>behavior: &apos;auto&apos;</code> kullanır (yumuşak animasyon yok), klavye odağı taşınmaz ve prop değişikliği{' '}
          <code>visibleMonthChange</code> yaymaz. Prop yalnızca takvimin kendi başlattığı bir gezinmeyi yansıtıyorsa (<code>goToMonth()</code> veya bir ok
          tuşundan sonra ayı <code>onVisibleMonthChange</code>’den sakladıysanız) ikinci kez kaydırmaz.
        </p>
        <p>
          Prop’u <code>onVisibleMonthChange</code>’den besleyin. <code>onVisibleMonthsChange</code>’den veya kaydırma konumundan beslemeyin: sürekli modda
          bunlar kullanıcının kaydırmasını takip eder; onları <code>visibleMonth</code>’a geri yazmak takvimi yeniden kaydırır ve kullanıcıyı kovalamasına yol
          açar.
        </p>
        <Signature>{'onVisibleMonthChange?: (month: CalendarMonth, e: VisibleMonthChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthChangeEvent"
          rows={[
            ['previous', 'CalendarMonth | null', 'Önceki referans ay; henüz bilinmiyorsa null (sunucuda today yoksa).'],
            ['month', 'CalendarMonth', 'Yeni referans ay, sınıra çekilmiş haliyle (ilk argümanla aynı).'],
            ['source', 'EventSource', "'navigation', 'programmatic' veya 'keyboard'."],
            ['reason', "'previous' | 'next' | 'jump' | 'keyboard'", 'Yukarıdaki tabloya bakın.'],
            ['clamped', 'boolean', 'İstek min/max dışındaydı ve izin verilen en yakın aya taşındı.'],
          ]}
        />
        <Example src="events/ControlledMonth" title="Kontrollü visibleMonth" />
      </Section>

      <Section title="onVisibleMonthsChange">
        <p>
          Ekrandaki ayların listesi değiştiğinde tetiklenir; mount sırasında da bir kez (<code>previous: []</code> ile). Sayfalı modda bunlar penceredeki
          aylardır (<code>overflow=&quot;reduce-months&quot;</code> bazılarını düşürdüğünde daha az). Sürekli modda kaydırmayı takip ederler: kaydırma alanıyla
          (sayfa veya <code>maxBlockSize</code> verilmiş takvim) kesişen render edilmiş aylar, kare başına bir kez IntersectionObserver ile ölçülür.
        </p>
        <p>Kaynağı yoktur: sayfa değiştirme, atlama, kaydırma, yükleme ve yerleşim değişikliklerinin sonucunu aynı şekilde bildirir.</p>
        <Signature>{'onVisibleMonthsChange?: (e: VisibleMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'Geçen sefer bildirilen aylar (mount sırasında []).'],
            ['months', 'readonly CalendarMonth[]', 'Şu an ekrandaki aylar, kronolojik sırayla.'],
          ]}
        />
      </Section>

      <Section title="Örnek: gezinme olayları">
        <p>Kontrollü bir visibleMonth ile ayı URL’de tutun ve görünen ayları kendi başlığınızda gösterin.</p>
        <Snippet files={navigationCode} label="Gezinme olayları" />
      </Section>

      {/* ------------------------------------------------------- veri ve yerleşim */}

      <Section title="onRenderedMonthsChange">
        <p>
          DOM’daki aylar değiştiğinde ve mount sırasında, render edilen her ay <code>added</code> içinde olacak şekilde bir kez tetiklenir. Veri isteklerini
          başlatmanın yeri burasıdır: sayfa değiştirme, atlamalar, daha fazla ay yükleme, son ayın ötesine klavyeyle gezinme ve{' '}
          <code>maxRenderedMonths</code> sınırında kırpma hep buraya varır. <code>removed</code> aylarının isteklerini iptal edin.
        </p>
        <p>
          Sayfalı modda render edilen aylar görünen aylara eşittir. Sürekli modda daha fazla ay yüklemeyle büyür, <code>maxRenderedMonths</code> aşıldığında
          karşı uçtan ay kaybeder ve uzak bir aya atladığınızda hedefin etrafında yeniden kurulur (aradaki aylar render edilmeden).
        </p>
        <Signature>{'onRenderedMonthsChange?: (e: RenderedMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="RenderedMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'Önceden render edilen aylar (mount sırasında []).'],
            ['months', 'readonly CalendarMonth[]', 'Şu an render edilen aylar, sırayla.'],
            ['added', 'readonly CalendarMonth[]', 'months içinde olup previous içinde olmayan aylar.'],
            ['removed', 'readonly CalendarMonth[]', 'previous içinde olup months içinde olmayan aylar.'],
          ]}
        />
      </Section>

      <Section title="onLoadMore">
        <p>
          Yalnızca sürekli modda. Aylar varsayılan düğmeyle (veya özel bir <code>renderLoadMore</code>’un <code>loadMore()</code>’uyla), otomatik gözcüyle (
          <code>loadMore=&quot;auto&quot;</code>), <code>ref.loadMore()</code> ile ya da odağı render edilen ilk veya son ayın ötesine taşımak listeyi
          genişlettiğinde (hedef en fazla <code>monthsPerLoad</code> ay uzaktaysa; daha uzak hedeflere atlanır) eklendiğinde tetiklenir. Eylem anında yayılır;{' '}
          <code>renderedMonthsChange</code> render’dan sonra gelir.
        </p>
        <p>
          Sayfalı modda, hiçbir şey eklenemeyen <code>minDate</code>/<code>maxDate</code> sınırında veya <code>goToMonth</code> için tetiklenmez. Ay eklemek
          asla <code>visibleMonthChange</code> yaymaz.
        </p>
        <Signature>{'onLoadMore?: (e: LoadMoreEvent) => void'}</Signature>
        <Payload
          caption="LoadMoreEvent"
          rows={[
            ['direction', "'next' | 'previous'", 'Ayların eklendiği yön.'],
            ['months', 'readonly CalendarMonth[]', <>Eklenen aylar (en fazla <code>monthsPerLoad</code>, min/max’ta daha az). Diğer uçtan düşürülen aylar <code>renderedMonthsChange.removed</code> içindedir.</>],
            ['source', 'EventSource', <>
              <code>load-more</code>; yalnızca trigger <code>keyboard</code> olduğunda odak hareketinin kaynağını taşır: <code>keyboard</code> (ok veya Page
              tuşları) ya da <code>programmatic</code> (<code>ref.focusDate()</code>).
            </>],
            [
              'trigger',
              "'button' | 'auto' | 'manual' | 'keyboard'",
              <>
                <code>button</code>: varsayılan veya özel kontrol. <code>auto</code>: gözcü görünür alana kaydırıldı. <code>manual</code>:{' '}
                <code>ref.loadMore()</code>. <code>keyboard</code>: odak listenin sonunun ötesine taşındı (ok veya Page tuşları ya da <code>ref.focusDate()</code>).
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onLoadingChange">
        <p>
          Yükleme anlık durumu değiştiğinde tetiklenir: <code>loading</code> prop’u açılıp kapandığında veya render edilmiş bir ayın <code>getDataStatus</code>{' '}
          sonucu <code>loading</code> ya da <code>error</code> olduğunda veya olmaktan çıktığında (böyle bir ay render edildiğinde ya da kaldırıldığında da).
          Mount sırasında yayılmaz: başlangıç durumunu kendi prop’larınızdan okuyun.
        </p>
        <Signature>{'onLoadingChange?: (e: LoadingChangeEvent) => void'}</Signature>
        <Payload
          caption="LoadingChangeEvent"
          rows={[
            ['previous', 'LoadingSnapshot', 'Önceki anlık durum.'],
            ['current', 'LoadingSnapshot', 'Şimdiki anlık durum.'],
          ]}
        />
        <Payload
          caption="LoadingSnapshot"
          rows={[
            ['initial', 'boolean', <><code>loading</code> açık ve takvim hiç onsuz gösterilmedi: günler iskelet (skeleton) halindedir ve seçilemez.</>],
            ['refreshing', 'boolean', <><code>loading</code>, veriler gösterildikten sonra açık: arka planda yenileme; görünüm, seçim ve odak korunur.</>],
            ['loadingMonths', 'readonly CalendarMonth[]', <>Durumu <code>loading</code> olan render edilmiş aylar.</>],
            ['errorMonths', 'readonly CalendarMonth[]', <>Durumu <code>error</code> olan render edilmiş aylar.</>],
            ['busy', 'boolean', <><code>loading</code> açık veya bir ay yükleniyor (kökte <code>aria-busy</code> vardır).</>],
          ]}
        />
      </Section>

      <Section title="onReady">
        <p>
          Her mount’ta bir kez, kapsayıcı ilk kez ölçüldükten sonra tetiklenir. Mount sırasında ilk <code>validationChange</code>,{' '}
          <code>visibleMonthsChange</code> ve <code>renderedMonthsChange</code>’ten sonra gelir. Ref zaten bağlıdır, bu yüzden controller burada kullanılabilir.
          Verilerinizin yüklendiği anlamına gelmez ve sunucu tarafı render sırasında asla tetiklenmez.
        </p>
        <Signature>{'onReady?: (e: ReadyEvent) => void'}</Signature>
        <Payload caption="ReadyEvent" rows={[['layout', 'CalendarLayout', 'İlk ölçülen yerleşim (bkz. onLayoutChange).']]} />
      </Section>

      <Section title="onResize">
        <p>
          Takvimin kök öğesinin boyutunu bildirir. İlk bildirimde <code>previous: null</code> vardır; sonrasında genişlik veya yükseklik <em>son bildirilen</em>{' '}
          boyuttan bu yana <code>resizeThreshold</code> pikselden (varsayılan 0) fazla değiştiğinde tetiklenir. ResizeObserver callback’leri animasyon karesi
          başına bire indirilir ve aynı boyut asla iki kez bildirilmez. ResizeObserver yoksa mount sırasında bir kez bildirir.
        </p>
        <p>
          <code>resizeThreshold</code> yalnızca bu bildirimleri seyreltir; yerleşimin kendisi her değişikliğe uyum sağlamaya devam eder. Yapısal değişiklikler
          (sütunlar, ay sayısı) için <code>onLayoutChange</code> kullanın.
        </p>
        <Signature>{'onResize?: (e: ResizeEvent) => void'}</Signature>
        <Payload
          caption="ResizeEvent"
          rows={[
            ['previous', '{ width: number; height: number } | null', 'Son bildirilen boyut; ilk seferde null.'],
            ['current', '{ width: number; height: number }', 'CSS pikseli cinsinden border-box boyutu, iki ondalığa yuvarlanmış.'],
          ]}
        />
      </Section>

      <Section title="onLayoutChange">
        <p>
          Etkin yerleşim yapısal olarak değiştiğinde tetiklenir: yön, gezinme, istenen veya etkin ay sayısı, sütunlar, etkin ay konumu, etkin taşma, minimum
          gün boyutuna ulaşılması, yazı yönü veya minimum ay genişliği. Yapıyı koruyan genişlik değişiklikleri onu tetiklemez. Sebep bir yeniden boyutlanma
          veya bir prop değişikliği olabilir. Mount sırasında yayılmaz (<code>onReady</code> kullanın).
        </p>
        <Signature>{'onLayoutChange?: (e: LayoutChangeEvent) => void'}</Signature>
        <Payload
          caption="LayoutChangeEvent"
          rows={[
            ['previous', 'CalendarLayout | null', 'Önceki yerleşim.'],
            ['current', 'CalendarLayout', 'Şimdiki yerleşim.'],
          ]}
        />
        <Payload
          caption="CalendarLayout"
          rows={[
            ['orientation', "'horizontal' | 'vertical'", 'orientation prop’undan.'],
            ['navigation', "'paged' | 'continuous'", 'navigation prop’undan.'],
            ['requestedMonths', 'number', 'numberOfMonths değeri.'],
            ['effectiveMonths', 'number', <>Gerçekten gösterilen aylar; yalnızca <code>overflow=&quot;reduce-months&quot;</code> ile istenenden az olur.</>],
            ['columns', 'number', 'Ay sütunları (dikeyde 1).'],
            ['requestedMonthPosition', 'number', 'Verildiği haliyle monthPosition.'],
            ['effectiveMonthPosition', 'number', 'Gerçekten kullanılan konum (etkin ay sayısının sınırına çekilmiş).'],
            ['overflow', "'scroll' | 'wrap' | 'reduce-months'", 'overflow prop’u.'],
            ['activeOverflow', "'none' | 'scroll' | 'wrap' | 'reduce-months'", <>Şu an olan: her şey sığıyorsa <code>none</code>, son çare olarak <code>scroll</code>.</>],
            ['atMinDaySize', 'boolean', 'Gün hücreleri minDaySize boyutunda ve daha fazla küçülemez.'],
            ['containerWidth', 'number | null', 'Ölçülen içerik genişliği; ölçümden önce null.'],
            ['minMonthWidth', 'number', 'Bir ayın alabileceği en dar genişlik (7 × minimum gün genişliği + iç boşluk).'],
            ['direction', "'ltr' | 'rtl'", 'Yazı yönü.'],
          ]}
        />
      </Section>

      <Section title="Örnek: veri ve yerleşim olayları">
        <p>
          Fiyatları ay ay <code>onRenderedMonthsChange</code>’den yükleyin (kaldırılan ayların isteklerini iptal ederek), hataları{' '}
          <code>onLoadingChange</code>’den bildirin ve bir footer’ı gerçek sütun sayısına uyarlayın.
        </p>
        <Snippet files={dataLayoutCode} label="Veri ve yerleşim olayları" />
      </Section>

      {/* ------------------------------------------------------- etkileşim */}

      <Section title="onDayFocusChange">
        <p>
          Klavye (DOM) odağı son odaklanandan farklı bir güne geldiğinde tetiklenir: ok ve Page tuşları, takvime Tab ile girmek, bir tıklama,{' '}
          <code>ref.focusDate()</code>, <code>goToMonth(…, {'{ focus: true }'})</code> veya bir daha fazla ay yükleme kontrolü kaybolduğunda takvimin odağı
          ızgarada tutması. Takvimden çıkmak onu tetiklemez (son odaklanan gün korunur); aynı güne yeniden odaklanmak da tetiklemez.
        </p>
        <Signature>{'onDayFocusChange?: (e: DayFocusChangeEvent) => void'}</Signature>
        <Payload
          caption="DayFocusChangeEvent"
          rows={[
            ['previous', 'CalendarDate | null', 'Önceden odaklanan gün; ilk odakta null.'],
            ['date', 'CalendarDate | null', 'Odaklanan gün. Türü null olabilir, ama mevcut sürüm her zaman bir tarih gönderir.'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic' veya 'load-more'."],
          ]}
        />
      </Section>

      <Section title="onTooltipOpenChange">
        <p>
          Açık araç ipucu (tooltip) başka bir güne geçtiğinde, açıldığında veya kapandığında, tetikleyici ne olursa olsun tetiklenir: üzerine gelme, klavye
          odağı, dokunma, kalıcı bir araç ipucu veya kontrollü <code>tooltip.openDate</code>. Aynı günde tetikleyicinin değişmesi (önce üzerine gelme, sonra
          odak) onu tetiklemez. Mount sırasında yalnızca bir araç ipucu zaten açıksa tetiklenir. Escape araç ipucunu kapatır ve bunu bildirir.
        </p>
        <Signature>{'onTooltipOpenChange?: (e: TooltipOpenChangeEvent) => void'}</Signature>
        <Payload
          caption="TooltipOpenChangeEvent"
          rows={[
            ['date', 'CalendarDate | null', 'Araç ipucu şu an açık olan gün; kapalıyken null.'],
            ['previous', 'CalendarDate | null', 'Araç ipucu önceden açık olan gün.'],
            ['open', 'boolean', 'Şu an bir araç ipucunun açık olup olmadığı.'],
            ['trigger', "'hover' | 'focus' | 'touch' | 'persistent' | 'controlled' | null", 'Onu neyin açtığı; kapalıyken null.'],
          ]}
        />
      </Section>

      <Section title="onOutsideClick">
        <p>
          Belgede takvimin dışında gerçekleşen her <code>pointerdown</code>’da (fare, dokunma veya kalem, herhangi bir tuş) tetiklenir. &quot;İçerisi&quot;
          takvimin React ağacıdır: DOM’u, portal ile render edilen araç ipucu ve slotlarınızın render ettiği her şey, portal üzerinden olsa bile. Takvimin
          etrafındaki kendi sarmalayıcınız ve onu açan düğme dışarıda sayılır; bunları kendiniz kontrol edin (aşağıdaki örneğe bakın).
        </p>
        <p>
          Takvim yalnızca <code>onOutsideClick</code> veya <code>onEvent</code> verildiğinde dinler. Kendisi hiçbir şeyi kapatmaz: satır içi bir takvimin
          açık/kapalı durumu yoktur.
        </p>
        <Signature>{'onOutsideClick?: (e: OutsideClickEvent) => void'}</Signature>
        <Payload caption="OutsideClickEvent" rows={[['nativeEvent', 'PointerEvent', <>Belge olayı; kendi öğelerinizi yok saymak için <code>nativeEvent.target</code> kullanın.</>]]} />
      </Section>

      <Section title="onScroll">
        <p>
          Takvimin aylar alanı kaydırıldığında tetiklenir: <code>overflow=&quot;scroll&quot;</code> ile yatay olarak veya <code>maxBlockSize</code> ile dikey
          olarak. Çağrılar, en son konumla animasyon karesi başına bire indirilir. Sayfayı kaydırmak onu tetiklemez; takvim yalnızca <code>onScroll</code>{' '}
          veya <code>onEvent</code> verildiğinde dinler.
        </p>
        <Signature>{'onScroll?: (e: ScrollEvent) => void'}</Signature>
        <Payload
          caption="ScrollEvent"
          rows={[
            ['scrollLeft', 'number', 'Aylar alanının scrollLeft değeri.'],
            ['scrollTop', 'number', 'Aylar alanının scrollTop değeri.'],
          ]}
        />
      </Section>

      <Section title="onEvent">
        <p>
          Yukarıdaki her olayı, özel callback’ten sonra, <code>type</code> ile ayrılan bir birleşim olan <code>CalendarEvent</code> olarak alır. Analitik,
          hata ayıklama veya bir durum makinesine iletmek için kullanın. <code>CalendarEventType</code>, <code>type</code> dizelerinin birleşimidir.
        </p>
        <Signature>{'onEvent?: (e: CalendarEvent) => void'}</Signature>
        <DataTable
          caption="type → callback eşlemesi"
          head={['type', 'Callback']}
          rows={[
            ['ready', 'onReady'],
            ['dateClick', 'onDateClick'],
            ['change', 'onChange'],
            ['selectionComplete', 'onSelectionComplete'],
            ['selectionClear', 'onSelectionClear'],
            ['invalidSelection', 'onInvalidSelection'],
            ['validationChange', 'onValidationChange'],
            ['activeEndpointChange', 'onActiveEndpointChange'],
            ['visibleMonthChange', 'onVisibleMonthChange'],
            ['visibleMonthsChange', 'onVisibleMonthsChange'],
            ['renderedMonthsChange', 'onRenderedMonthsChange'],
            ['loadMore', 'onLoadMore'],
            ['loadingChange', 'onLoadingChange'],
            ['resize', 'onResize'],
            ['layoutChange', 'onLayoutChange'],
            ['dayFocusChange', 'onDayFocusChange'],
            ['tooltipOpenChange', 'onTooltipOpenChange'],
            ['outsideClick', 'onOutsideClick'],
            ['scroll', 'onScroll'],
          ].map(([t, cb]) => [c(t!), c(cb!)])}
        />
      </Section>

      <Section title="Örnek: odak, popover’lar ve analitik">
        <p>
          Seçimde veya dışarı tıklamada popover’ını kapatan bir tarih alanı, <code>onDayFocusChange</code> ile beslenen bir ayrıntı paneli,{' '}
          <code>onScroll</code>’dan gelen bir başlık gölgesi ve analitik için tek bir <code>onEvent</code> işleyicisi.
        </p>
        <Snippet files={miscCode} label="Odak, popover ve onEvent" />
      </Section>
    </Page>
  );
}

export function ControllerReference() {
  return (
    <Page
      title="Controller (ref)"
      lead={
        <>
          Takvimi kendi arayüzünüzden yönetmek için bir ref verin: gezinin, seçin, temizleyin, odağı taşıyın ve durumunu okuyun. Slotların içinde aynı nesne{' '}
          <code>ctx.actions</code>’tır.
        </>
      }
    >
      <Section title="Controller’ı edinmek">
        <p>
          Türü <code>CalendarController</code> olan bir ref oluşturun ve <code>Calendar</code>’a verin. Mount’tan önce ve sunucuda <code>null</code>’dır; bu
          yüzden onu olay işleyicilerinden veya efektlerden <code>?.</code> ile çağırın. Nesne takvimin ömrü boyunca aynı kimliği korur ve her zaman en son
          durumla çalışır; saklamak veya alt bileşenlere aktarmak güvenlidir.
        </p>
        <p>
          Slotlar (<code>renderHeader</code>, <code>renderFooter</code>, <code>renderMonthHeader</code>, <code>renderNavigation</code>,{' '}
          <code>renderLoading</code>, <code>renderError</code>, <code>renderLoadMore</code>) aynı controller’ı <code>ctx.actions</code> olarak, anlık durum
          alanlarının (<code>ctx.phase</code>, <code>ctx.visibleMonths</code>, …) yanında alır; böylece takvimin içindeki kontrollerin ref’e ihtiyacı olmaz.
        </p>
        <p>
          Metotlar, kullanıcı eylemleriyle aynı olayları <code>source: &apos;programmatic&apos;</code> ile yayar. Kontrollü prop’larla (<code>value</code>,{' '}
          <code>visibleMonth</code>, <code>activeEndpoint</code>) bir metot, tıpkı bir tıklama gibi, değişikliği callback üzerinden yalnızca <em>ister</em>.
        </p>
        <Example src="events/ControllerButtons" title="Takvimin dışındaki düğmeler" />
        <Snippet files={controllerCode} label="Ref’ten ve slottan controller" />
      </Section>

      <Section title="instanceId">
        <p>
          <code>readonly instanceId: string</code>. Takvimin kök öğesinin <code>id</code>’si: <code>id</code> prop’u veya üretilmiş benzersiz bir id. Her
          olay aynı değeri taşır; böylece ortak bir işleyicide takvimleri birbirinden ayırabilir veya <code>aria-controls</code>’u takvime yöneltebilirsiniz.
        </p>
      </Section>

      <Section title="goToMonth()">
        <p>
          <code>{'goToMonth(month: CalendarMonth | CalendarDate | string, options?: GoToMonthOptions): GoToMonthResult | null'}</code>
        </p>
        <p>Verilen ayı referans ay yapar. Seçimi asla değiştirmez.</p>
        <ul>
          <li>
            <code>YYYY-MM</code> veya geçerli bir <code>YYYY-MM-DD</code> kabul eder (ayı kullanılır). Başka her şey (geçersiz bir tarih, başka bir biçim, dize
            olmayan bir değer) <code>null</code> döndürür ve hiçbir şey yapmaz.
          </li>
          <li>
            <code>minDate</code>’ten önceki veya <code>maxDate</code>’ten sonraki bir ay, izin verilen en yakın aya çekilir; bu durumda sonuçta{' '}
            <code>clamped: true</code> olur. <code>disablePast</code>/<code>disableFuture</code> gezinmeyi sınırlamaz.
          </li>
          <li>
            Hedef, sınıra çekildikten sonra zaten referans ay değilse <code>visibleMonthChange</code> (<code>source: &apos;programmatic&apos;</code>,{' '}
            <code>reason: &apos;jump&apos;</code>) yayar; zaten referans aysa hiçbir şey yayılmaz, ama istek sınırların dışındaysa sonuç yine{' '}
            <code>clamped: true</code> der. Türetilmiş olaylar (<code>visibleMonthsChange</code>, <code>renderedMonthsChange</code>) ardından gelir.
          </li>
          <li>
            Sayfalı mod: pencere, <code>monthPosition</code>’a göre hedefin etrafında yeniden kurulur. Sürekli mod: render edilmiş bir ay görünür alana
            kaydırılır (aynı ay için bile her çağrıda yeniden); render edilmemiş bir ay için liste, aradaki aylar render edilmeden onun etrafında yeniden
            kurulur.
          </li>
          <li>
            Kontrollü <code>visibleMonth</code>: çağrı yalnızca isteği yayar. Sonuç yine istenen ayı tanımlar, ama siz prop’u güncelleyene kadar referans ay
            değişmez (sürekli modda zaten render edilmiş bir aya hemen kaydırılır; ayı sonradan prop’ta saklamak ikinci bir kaydırmaya yol açmaz).
          </li>
        </ul>
        <Payload
          caption="GoToMonthOptions"
          rows={[
            [
              'focus',
              'boolean?',
              <>
                Klavye odağını, render edilir edilmez hedef ayın ilk gününe (<code>minDate</code>/<code>maxDate</code> içine çekilmiş) taşır. Kullanıcı bu
                arada odağı başka yere taşıdıysa istek düşürülür. Odaklanan gün değişirse <code>dayFocusChange</code> yayar.
              </>,
            ],
            [
              'behavior',
              "'auto' | 'smooth' | 'instant'",
              <>
                Yalnızca sürekli modda. <code>smooth</code>, kullanıcı azaltılmış hareket tercih etmiyorsa kaydırmayı canlandırır; <code>auto</code>,{' '}
                <code>instant</code> ve hiç verilmemesi hemen atlar.
              </>,
            ],
          ]}
        />
        <Payload
          caption="GoToMonthResult"
          rows={[
            ['month', 'CalendarMonth', 'Gerçekten kullanılan ay (sınıra çekildikten sonra).'],
            ['clamped', 'boolean', 'Hedef min/max dışındaydı.'],
          ]}
        />
      </Section>

      <Section title="next() ve previous()">
        <p>
          <code>next(): void</code>, <code>previous(): void</code>. Referans ayı, varsayılan oklar gibi <code>stepMonths</code> kadar (varsayılan 1) kaydırır;
          ancak <code>source: &apos;programmatic&apos;</code> ve <code>reason: &apos;next&apos;</code> / <code>&apos;previous&apos;</code> ile. Sürekli modda
          takvim yeni referans aya kaydırır; ay yüklenmez ve <code>loadMore</code> yayılmaz.
        </p>
        <p>
          Varsayılan düğmelerin aksine asla devre dışı değildir: <code>minDate</code>/<code>maxDate</code> sınırında istek mevcut aya geri çekilir, bu yüzden
          hiçbir şey kımıldamaz ve <code>visibleMonthChange</code> yayılmaz. Kendi düğmelerinizi devre dışı bırakmak için <code>renderNavigation</code>’daki{' '}
          <code>canPrevious</code>/<code>canNext</code> değerlerini kullanın. Referans ay bilinmeden önce (<code>today</code> olmadan sunucu render’ı) hiçbir
          şey yapmazlar.
        </p>
      </Section>

      <Section title="loadMore()">
        <p>
          <code>{"loadMore(direction?: 'next' | 'previous'): void"}</code>, varsayılan <code>&apos;next&apos;</code>. Yalnızca sürekli modda; sayfalı modda
          hiçbir şey yapmaz. O yöne <code>monthsPerLoad</code> ay ekler, <code>minDate</code>/<code>maxDate</code>’te durur ve <code>maxRenderedMonths</code>{' '}
          aşıldığında karşı uçtan ay düşürür (odağı tutan ayı asla). Aylar öne eklendiğinde kaydırma konumu korunur.
        </p>
        <p>
          <code>loadDirections</code> ne derse desin, her <code>loadMore</code> moduyla ve her iki yönde çalışır: <code>loadDirections</code> yalnızca hangi
          yerleşik kontrollerin ve otomatik yükleme gözcülerinin var olacağına karar verir, controller’ın nereye yükleyebileceğine değil.{' '}
          <code>loadMore=&quot;manual&quot;</code> yerleşik kontrolü gizler; böylece tek kontrol sizin düğmeniz olur (örneğin <code>renderFooter</code> içinde).{' '}
          <code>trigger: &apos;manual&apos;</code> ile <code>loadMore</code>, ardından <code>renderedMonthsChange</code> yayar. Sınırda hiçbir şey olmaz ve
          hiçbir şey yayılmaz.
        </p>
      </Section>

      <Section title="clear()">
        <p>
          <code>clear(): void</code>. Seçimi boşaltır: <code>change</code> (<code>reason: &apos;clear&apos;</code>, <code>date: null</code>), ardından{' '}
          <code>selectionClear</code> yayar; aralık modunda sonraki tıklama yeniden başlangıcı belirler (<code>end</code> idiyse{' '}
          <code>activeEndpointChange</code>). Doğrulanmaz. Seçim zaten boşsa veya salt okunur modda hiçbir şey yapmaz ve hiçbir şey yaymaz. Kontrollü bir{' '}
          <code>value</code> ile değişiklik bir istektir.
        </p>
      </Section>

      <Section title="reset()">
        <p>
          <code>reset(): void</code>. <code>defaultValue</code>’yu mount anındaki haliyle geri yükler (o prop’taki sonraki değişiklikler yok sayılır); yoksa veya
          mod o zamandan beri değiştiyse boş değeri. <code>reason: &apos;reset&apos;</code> ile <code>change</code> yayar ya da değer zaten varsayılana eşitse
          hiçbir şey yaymaz; sonuç boşsa ve seçim boş değilse <code>selectionClear</code> yayar; <code>selectionComplete</code>’i asla yaymaz. Varsayılan değer
          yeniden doğrulanmaz (geçersiz hale gelmiş olabilirse <code>onValidationChange</code>’i izleyin). Salt okunur modda hiçbir şey yapmaz.
        </p>
        <p>
          Kontrollü bir <code>value</code> ile normalde <code>defaultValue</code> vermezsiniz; bu yüzden <code>reset()</code> boş bir değer ister.
        </p>
      </Section>

      <Section title="select()">
        <p>
          <code>{'select(value: CalendarDate | DateRange | readonly CalendarDate[] | null): ValidationResult'}</code>
        </p>
        <p>
          Mevcut mod için bütün bir değer önerir (<code>null</code> boş demektir) ve onu bir tıklamayla aynı kurallarla doğrular: sınırlar, geçmiş/gelecek,
          müsaitlik, uzunluklar, <code>validateSelection</code>, <code>maxSelections</code> ve veri durumu.
        </p>
        <ul>
          <li>
            <strong>Geçerli</strong>: değer <code>reason: &apos;set&apos;</code> ve <code>date: null</code> ile uygulanır. <code>change</code> yayar; ardından
            değer tamamlanmışsa (tekli tarih, iki ucu da olan aralık, boş olmayan liste) <code>selectionComplete</code> veya seçimi boşaltıyorsa{' '}
            <code>selectionClear</code> gelir. Aralığın uç noktası değeri takip eder (tek başına bir başlangıç, sonraki tıklamanın bitişi belirlemesini
            sağlar). Değer mevcut değere eşitse hiçbir şey yayılmaz (<code>change</code> de, <code>selectionComplete</code> de).
          </li>
          <li>
            <strong>Geçersiz</strong>: hiçbir şey değişmez. Yalnızca <code>invalidSelection</code> (<code>source: &apos;programmatic&apos;</code>) yayar ve{' '}
            <code>{'{ valid: false, issue }'}</code> döndürür.
          </li>
          <li>
            Takvim <strong>ilk</strong> <code>loading</code> durumundayken henüz hiçbir veri bilinmez; bu yüzden boş olmayan her değer bir{' '}
            <code>data-loading</code> sorunu döndürür (<code>unknownDataPolicy: &apos;allow&apos;</code> değilse). Arka plandaki bir yenileme, zaten gösterilen
            verilere göre doğrular.
          </li>
          <li>
            Salt okunur modda <code>{"{ valid: false, issue: { code: 'custom', message: 'read-only' } }"}</code> döndürür ve hiçbir şey yaymaz.
          </li>
          <li>Gezinmez: yeni değeri göstermek için <code>goToMonth()</code>’u çağırın.</li>
        </ul>
        <Payload
          caption="ValidationResult"
          rows={[
            ['valid', 'boolean', 'Değerin her kuralı geçip geçmediği.'],
            ['issue', 'ValidationIssue | null', <>Bulunan ilk sorun (bkz. <a href="#/api-events">ValidationIssue</a>); geçerliyse null.</>],
          ]}
        />
      </Section>

      <Section title="setActiveEndpoint()">
        <p>
          <code>{"setActiveEndpoint(endpoint: 'start' | 'end'): void"}</code>. Yalnızca aralık modunda. Sonraki tıklamanın hangi ucu belirleyeceğini seçer;
          örneğin &quot;Giriş&quot; / &quot;Çıkış&quot; alanlarından. Başlangıç yokken <code>end</code> ayarlamanın sonraki tıklamaya etkisi yoktur: tıklama
          yine bir aralık başlatır. Diğer modlarda veya uç nokta zaten verilen değerse hiçbir şey yapmaz.
        </p>
        <p>
          Kontrolsüz: <code>activeEndpointChange</code> (<code>source: &apos;programmatic&apos;</code>) render’dan sonra bildirilir. Kontrollü{' '}
          <code>activeEndpoint</code>: çağrı yalnızca isteği yayar; uygulamak için prop’u güncelleyin. Kontrolsüz bir uç nokta, sonraki değişiklikten sonra
          yeniden değeri takip eder (örneğin bir aralığı tamamlamak onu <code>start</code>’a geri döndürür).
        </p>
      </Section>

      <Section title="focusDate()">
        <p>
          <code>focusDate(date: CalendarDate): void</code>. Klavye (DOM) odağını, önce <code>minDate</code>/<code>maxDate</code> içine çekilmiş güne taşır ve
          onu görünür alana kaydırır. O gün zaten odaklanmış olsa bile odaklar. Odaklanan gün değişirse <code>source: &apos;programmatic&apos;</code> ile{' '}
          <code>dayFocusChange</code> yayar.
        </p>
        <p>
          Gün render edilmemişse takvim önce gezinir: sayfalı mod pencereyi taşır (<code>source: &apos;programmatic&apos;</code> ve{' '}
          <code>reason: &apos;keyboard&apos;</code> ile <code>visibleMonthChange</code>); sürekli mod, ay bir uca <code>monthsPerLoad</code> mesafedeyse listeyi
          genişletir (trigger <code>keyboard</code>, source <code>programmatic</code> ile <code>onLoadMore</code>), değilse listeyi onun etrafında yeniden
          kurar. Kullanıcı bu arada odağı başka yere taşımadıysa, gün render edilince odak oraya geçer. Hiçbir şey seçmez.
        </p>
      </Section>

      <Section title="getSnapshot()">
        <p>
          <code>getSnapshot(): CalendarSnapshot</code>. Mevcut durumun yan etkisiz, düz bir kopyasını döndürür. Değerler son render’a aittir: aynı işleyicide
          bir eylemin hemen ardından (örneğin <code>select()</code> sonra <code>getSnapshot()</code>) hâlâ eylemden önceki durumu görürsünüz. Daha sonra okuyun
          veya eylemin dönüş değerini ve olaylarını kullanın.
        </p>
        <Payload
          caption="CalendarSnapshot"
          rows={[
            ['selection', 'Selection', <><code>{'{ mode, value }'}</code>; <code>value</code>’yu daraltmak için <code>mode</code>’u kontrol edin.</>],
            ['activeEndpoint', "'start' | 'end'", <>Sonraki tıklamanın belirleyeceği uç (aralık modu dışında her zaman <code>start</code>).</>],
            ['phase', 'SelectionPhase', "'empty', 'start-selected' veya 'complete'."],
            ['validation', 'ValidationResult', 'Mevcut değerin doğrulaması.'],
            ['referenceMonth', 'CalendarMonth | null', 'monthPosition konumundaki ay; today bilinene kadar null (today olmadan sunucu render’ı).'],
            ['visibleMonths', 'readonly CalendarMonth[]', 'Ekrandaki aylar (bkz. onVisibleMonthsChange).'],
            ['renderedMonths', 'readonly CalendarMonth[]', 'DOM’daki aylar (bkz. onRenderedMonthsChange).'],
            ['layout', 'CalendarLayout', <>Etkin yerleşim; <code>containerWidth</code> en son ölçülen genişliktir.</>],
            ['focusedDate', 'CalendarDate | null', 'Son odaklanan gün; odak takvimden çıktıktan sonra da korunur; hiç odak olmadıysa null.'],
            ['today', 'CalendarDate | null', <><code>today</code> prop’u veya hesaplanan tarih; prop olmadan sunucuda null.</>],
          ]}
        />
      </Section>
    </Page>
  );
}
