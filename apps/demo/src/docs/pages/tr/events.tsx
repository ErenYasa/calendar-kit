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
          Takvim, olup biteni uygulamanıza callback prop’larıyla bildirir: kullanıcı bir tarih seçti, başka bir aya geçti, bir güne odaklandı gibi.
          Her callback kendi türünde bir olay nesnesi alır. Uygulama mantığı için ilgili callback’i (<code>onChange</code>, <code>onVisibleMonthChange</code>,
          …) kullanın; tüm olayları tek bir fonksiyonda almak için <code>onEvent</code>’i kullanın. Bu fonksiyon olayları ayrımlı bir birleşim
          (discriminated union) olarak alır: hangi olay olduğunu <code>type</code> alanından anlarsınız.
        </>
      }
    >
      <Section title="Callback’ler nasıl çağrılır">
        <ul>
          <li>
            <strong>controlled</strong>, değeri uygulamanızın tutması ve prop olarak geri vermesi demektir; örneğin{' '}
            <code>{'value={range} onChange={setRange}'}</code>. Bu durumda callback bir istektir ve takvim yeni değeri ancak siz onu sakladığınızda
            gösterir. <strong>uncontrolled</strong>, değeri takvimin kendisinin tutması demektir (en fazla bir <code>defaultValue</code> verirsiniz);
            callback yalnızca zaten değişmiş olanı bildirir. Aynısı <code>visibleMonth</code> ve <code>activeEndpoint</code> için de geçerlidir.
          </li>
          <li>
            Çoğu callback yalnızca olayı alır: <code>onDateClick(event)</code>. Üç tanesi önce yeni değeri, sonra olayı alır:{' '}
            <code>onChange(value, event)</code>, <code>onVisibleMonthChange(month, event)</code> ve <code>onActiveEndpointChange(endpoint, event)</code>.
          </li>
          <li>
            Her olayda <code>type</code> (<code>onEvent</code> içindeki adı) ve <code>instanceId</code> (takvimin kök <code>id</code>’si) bulunur; böylece tek
            bir işleyici birden çok takvimin olaylarını ayırt edebilir.
          </li>
          <li>
            <code>onEvent</code>, ilgili callback’ten sonra aynı olay nesnesiyle çağrılır. Tüm olayları almak için yalnızca <code>onEvent</code> vermeniz yeterlidir.
          </li>
          <li>
            Callback’ler hiçbir zaman render sırasında çağrılmaz. Takvim her zaman son render’da verilen callback’i çağırır; bu yüzden <code>useCallback</code>’e
            gerek yoktur ve her render’da yeni bir fonksiyon vermek bir olayın yeniden yayılmasına yol açmaz.
          </li>
          <li>
            <strong>Eylem olayları</strong>, kullanıcının veya kodunuzun yaptığı bir şeyden (tıklama, tuş, controller çağrısı) doğar ve hemen, o tarayıcı
            olayı ya da controller çağrısı daha sürerken yayılır. <strong>Türetilmiş olaylar</strong> (<code>validationChange</code>,{' '}
            <code>visibleMonthsChange</code>, <code>renderedMonthsChange</code>, <code>loadingChange</code>, <code>layoutChange</code>,{' '}
            <code>tooltipOpenChange</code>, <code>ready</code> ve uncontrolled <code>activeEndpointChange</code>) ise ortaya çıkan durumu anlatır: React bu
            durumu render ettikten sonra ve yalnızca son bildirilenden farklıysa gelir.
          </li>
          <li>
            Bir prop’u siz değiştirdiğinizde, o değişikliği isteyen callback çağrılmaz: yeni bir <code>value</code> <code>onChange</code>’i, yeni bir{' '}
            <code>visibleMonth</code> <code>onVisibleMonthChange</code>’i, yeni bir <code>activeEndpoint</code> <code>onActiveEndpointChange</code>’i çağırmaz.
            Türetilmiş olaylar ise prop değişikliğinin sonuçlarını yine bildirir (örneğin <code>validationChange</code> veya <code>renderedMonthsChange</code>).
          </li>
          <li>
            Geliştirme ortamında React StrictMode altında effect’ler ilk render’da iki kez çalışır, bu yüzden <code>onReady</code> iki kez tetiklenebilir.
            Eylem olayları (<code>onChange</code> gibi) hiçbir zaman iki kez gelmez. Gerçek bir yeniden mount (örneğin yeni bir <code>key</code>) mount
            olaylarını yeniden yayar.
          </li>
        </ul>
      </Section>

      <Section title="Olay kaynakları">
        <p>
          Birden çok sebepten doğabilen olaylar, olayı neyin başlattığını söyleyen <code>source: EventSource</code> alanını taşır. Uygulamanız kullanıcıya
          ve kendi koduna farklı tepki verecekse buna bakın; örneğin analitikte yalnızca tıklamaları ve tuş basışlarını saymak için.
        </p>
        <DataTable
          caption="EventSource değerleri"
          head={['Değer', 'Üreten', 'Görüldüğü olaylar']}
          rows={[
            [
              c('pointer'),
              'Bir güne fare, kalem veya dokunmayla tıklanması; işaretçiyle gelen odak.',
              'dateClick, change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange ve dayFocusChange',
            ],
            [
              c('keyboard'),
              <>
                Bir günde Enter veya Space; ok, Home/End ve Page tuşları; Tab ile gelen odak.
              </>,
              'pointer ile aynıları; ayrıca visibleMonthChange (odak gösterilmeyen bir aya geçtiğinde) ve trigger değeri keyboard olan loadMore (odak sürekli listenin sonunun ötesine geçtiğinde)',
            ],
            [c('navigation'), 'Varsayılan önceki/sonraki düğmeleri veya renderNavigation’dan previous()/next().', 'visibleMonthChange'],
            [
              c('programmatic'),
              'Ref üzerinden ya da bir slotun içinde ctx.actions üzerinden çağrılan bir controller metodu (bkz. Controller (ref)).',
              'change, selectionComplete, selectionClear, invalidSelection, activeEndpointChange, visibleMonthChange, dayFocusChange ve trigger değeri keyboard olan loadMore (sürekli listenin sonunun ötesindeki bir güne focusDate(); ref.loadMore() ise source olarak load-more bildirir)',
            ],
            [
              c('load-more'),
              'Sürekli modda ay eklenmesi (varsayılan düğme, renderLoadMore’un loadMore()’u, otomatik gözcü öğe (sentinel), ref.loadMore()); yüklenebilecek son aya gelinip yükleme düğmesi kaybolduğunda takvimin ızgaraya taşıdığı odak.',
              'loadMore ve dayFocusChange',
            ],
            [
              c('prop'),
              <>
                Uygulamanız controlled bir <code>value</code>’yu değiştirdi ve bu yüzden sonraki tıklamanın belirleyeceği uç da değişti (örneğin aralığı
                temizlediniz).
              </>,
              'activeEndpointChange (yalnızca uncontrolled uç noktada)',
            ],
            [c('resize'), <>İleride kullanılmak üzere ayrılmış: <code>EventSource</code> birleşiminde tanımlıdır ama mevcut sürüm bu değeri hiç göndermez (<code>resize</code> olayının kaynak alanı yoktur).</>, '—'],
            [c('scroll'), <>İleride kullanılmak üzere ayrılmış: <code>EventSource</code> birleşiminde tanımlıdır ama mevcut sürüm bu değeri hiç göndermez (<code>scroll</code> olayının kaynak alanı yoktur).</>, '—'],
          ]}
        />
      </Section>

      <Section title="Olay sırası">
        <p>
          Değeri uncontrolled olan bir aralık takviminde tek bir eylemin hangi olayları hangi sırayla yaydığı. Bir işleyici diğerinin önce çalışmış
          olmasına dayanıyorsa buna bakın; örneğin <code>onSelectionComplete</code>, <code>onChange</code>’in sakladığı state’i okuyorsa. Parantez
          içindeki adımlar yalnızca ilgili durum oluştuğunda gelir (örneğin <code>validationChange</code> yalnızca geçerlilik değiştiğinde).
        </p>
        <DataTable
          caption="Eylem başına olay sırası"
          head={['Eylem', 'Olaylar, sırasıyla']}
          rows={[
            ['Mount', 'validationChange (cause initial) → visibleMonthsChange → renderedMonthsChange → ready; ResizeObserver bildirdiğinde resize'],
            ['Aralık başlangıcına tıklama', 'dateClick → (dayFocusChange) → change → activeEndpointChange (start’tan end’e) → (validationChange)'],
            ['Aralık bitişine tıklama', 'dateClick → (dayFocusChange) → change → selectionComplete → activeEndpointChange (end’den start’a) → (validationChange)'],
            [
              <>
                controlled <code>activeEndpoint</code> ile bitişe tıklama
              </>,
              'dateClick → (dayFocusChange) → change → activeEndpointChange (istek) → selectionComplete',
            ],
            ['Seçilemeyen bir güne tıklama', 'dateClick → (dayFocusChange) → invalidSelection; change yok, seçim değişmez'],
            ['Salt okunur modda tıklama', 'dateClick (accepted: false, kind: none) → (dayFocusChange); change yok'],
            ['Zaten seçili tekli tarihe tıklama', 'dateClick (accepted: true, kind: select) → (dayFocusChange) → selectionComplete; change yok'],
            ['ref.select(geçerli değer)', 'change (reason set) → (selectionComplete) → (selectionClear) → (activeEndpointChange) → (validationChange); değer mevcut değere eşitse hiçbir olay yok'],
            ['ref.select(geçersiz değer)', 'yalnızca invalidSelection'],
            ['ref.clear()', 'change (reason clear) → selectionClear → (activeEndpointChange) → (validationChange); seçim zaten boşsa hiçbir olay yok'],
            ['Sayfa değiştirme veya aya atlama (sayfalı mod)','visibleMonthChange → visibleMonthsChange → renderedMonthsChange → (loadingChange); ay aynı kalırsa hiçbir olay yok'],
            ['Daha fazla ay yükleme', 'loadMore → (visibleMonthsChange) → renderedMonthsChange → (loadingChange); eklenecek ay yoksa hiçbir olay yok'],
          ]}
        />
        <Note>
          <code>dayFocusChange</code> yeni odaklanan her gün için bir kez gelir. Testlerde tıklama odak değişmeden gerçekleştiği için <code>dateClick</code>’ten
          sonra gelir. Fareye basıldığı anda (pointer down) düğmeye odaklanan tarayıcılarda (Chrome, Firefox, Edge) ise gün önce odak alır, bu yüzden{' '}
          <code>dayFocusChange</code>, <code>dateClick</code>’ten önce gelir. Bu ikisinin birbirine göre sırasına güvenmeyin. Benzer şekilde sürekli modda{' '}
          <code>visibleMonthsChange</code> genellikle bir kare sonra, tarayıcı ekrandaki ayları bildirdiğinde gelir.
        </Note>
      </Section>

      {/* ------------------------------------------------------------ seçim */}

      <Section title="onDateClick">
        <p>
          Bir güne her tıklandığında ya da odaktaki günde Enter/Space’e her basıldığında, başka her şeyden önce tetiklenir: seçilebilen ve seçilemeyen
          günler, zaten seçili tarihin yeniden seçilmesi ve salt okunur moddaki tıklamalar da dahil. Değer değişmese bile her seferinde gelir. Analitik
          veya özel geri bildirim için kullanın; seçilen değer için <code>onChange</code>’i kullanın.
        </p>
        <p>
          Controller çağrılarında (<code>ref.select()</code> ve benzerleri), odaklanma veya fareyle üzerine gelme (hover) sırasında ya da ok tuşlarında
          tetiklenmez.
        </p>
        <Signature>{'onDateClick?: (e: DateClickEvent) => void'}</Signature>
        <Payload
          caption="DateClickEvent"
          rows={[
            ['date', 'CalendarDate', 'Tıklanan (ya da Enter/Space ile seçilmeye çalışılan) gün.'],
            ['source', "'pointer' | 'keyboard'", 'Tıklama Enter/Space’ten (detail değeri 0 olan bir tıklama) ya da özel bir gün öğesinin tuş işleyicisinden geldiyse keyboard.'],
            ['accepted', 'boolean', <>Tıklamanın kabul edilip edilmediği: <code>kind</code> rejected veya none (salt okunur mod) olduğunda false. Seçili tekli tarihi yeniden seçmek, değer aynı kalsa da kabul sayılır.</>],
            [
              'kind',
              'ActivationKind',
              <>
                Tıklamanın ne yaptığı: <code>select</code> (tekli, zaten seçili tarih için de), <code>start</code>, <code>complete</code>,{' '}
                <code>clear</code> (aralık), <code>toggle-on</code>, <code>toggle-off</code> (çoklu), <code>none</code> (salt okunur mod) veya{' '}
                <code>rejected</code>.
              </>,
            ],
            ['issue', 'ValidationIssue | null', <>Neden reddedildiği (bkz. <code>onInvalidSelection</code>); aksi halde null.</>],
            ['day', 'DayState', 'Tıklama anında günün tüm durumu (devre dışı, sebep, modifier’lar, …).'],
          ]}
        />
      </Section>

      <Section title="onChange">
        <p>
          Bir eylem seçimi değiştirdiğinde tetiklenir: bir güne tıklama, odaktaki günde Enter/Space ya da <code>select()</code>, <code>clear()</code> ve{' '}
          <code>reset()</code> controller metotları. İlk argüman yeni değerdir ve türü <code>mode</code>’a göre belirlenir: <code>CalendarDate | null</code>,{' '}
          <code>DateRange</code> veya <code>readonly CalendarDate[]</code>.
        </p>
        <p>Şu durumlarda tetiklenmez:</p>
        <ul>
          <li>
            bir prop değiştiğinde: <code>value</code>, <code>mode</code>, kurallar veya sonradan verilen bir <code>defaultValue</code> (yok sayılır);
          </li>
          <li>seçilemeyen bir güne tıklandığında: seçim değişmez (bkz. onInvalidSelection);</li>
          <li>
            değer aynı kaldığında: seçili tekli tarihi yeniden seçmek (yine de <code>dateClick</code> ve <code>selectionComplete</code> gelir), mevcut değere eşit
            bir değerle <code>ref.select()</code> veya <code>ref.reset()</code> (hiçbir olay gelmez), seçim zaten boşken <code>ref.clear()</code>;
          </li>
          <li>
            geçersiz bir değerle <code>ref.select()</code> çağrıldığında veya <code>readonly</code> modda herhangi bir eylemde.
          </li>
        </ul>
        <p>
          Reddedilen denemeler her seferinde bildirilir: kullanıcı aynı seçilemeyen güne iki kez tıklasa bile <code>invalidSelection</code> (tıklamada ayrıca{' '}
          <code>dateClick</code>) iki kez gelir.
        </p>
        <p>
          <strong>controlled</strong> (<code>value</code> verilmiş; değeri siz tutarsınız, örneğin bir React state’inde): olay bir istektir. Takvim, siz yeni bir
          değer verene kadar mevcut <code>value</code>’yu göstermeye devam eder; değişikliği kabul etmemek için çağrıyı yok sayın. <strong>uncontrolled</strong>{' '}
          (değeri takvim kendisi tutar): değer zaten güncellenmiştir; callback yalnızca bilgi verir.
        </p>
        <Signature>{'onChange?: (value: V, e: ChangeEvent<V>) => void'}</Signature>
        <Payload
          caption="ChangeEvent"
          rows={[
            ['mode', 'SelectionMode', "'single', 'range' veya 'multiple'."],
            ['value', 'V', 'Yeni değer (ilk argümanla aynı).'],
            ['previous', 'V', 'Eylemden önce takvimin gösterdiği değer.'],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
            [
              'reason',
              "ActivationKind | 'clear' | 'reset' | 'set'",
              <>
                Tıklamalar için <code>select</code>, <code>start</code>, <code>complete</code>, <code>toggle-on</code>, <code>toggle-off</code>; aralık modunda
                bitişi olmayan başlangıca (veya <code>singleDayFirst</code> ile seçilmiş tek günlük aralığa) yeniden tıklama ve{' '}
                <code>ref.clear()</code> için <code>clear</code>; <code>ref.reset()</code> için <code>reset</code>; <code>ref.select()</code> için{' '}
                <code>set</code>.
              </>,
            ],
            ['date', 'CalendarDate | null', 'Tıklanan gün; controller çağrılarında null.'],
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
          Kullanıcı aynı değeri yeniden tamamlarsa (seçili tekli tarihi ya da aynı aralığı yeniden seçerek) <code>selectionComplete</code> yine gelir; değer
          değişmediyse <code>change</code> gelmez. Bu yüzden bir popover’ı kapatmak için doğru yer burasıdır. Zaten seçili değeri{' '}
          <code>ref.select()</code> ile yeniden vermek hiçbir olay yaymaz. <code>ref.reset()</code> için (varsayılan değer tamamlanmış olsa bile), prop
          değişikliklerinde veya sonraki render’larda tetiklenmez. Controlled bir <code>activeEndpoint</code> ile uç nokta isteğinden sonra, aksi halde{' '}
          <code>change</code>’in hemen ardından gelir. Tipik kullanım, bir popover’ı kapatmak veya odağı formun sonraki alanına taşımaktır.
        </p>
        <Signature>{'onSelectionComplete?: (e: SelectionCompleteEvent) => void'}</Signature>
        <Payload
          caption="SelectionCompleteEvent"
          rows={[
            ['mode', 'SelectionMode', 'Seçim modu.'],
            ['value', 'unknown', <>Tamamlanan değer. Tipi moda göre daraltılmaz: tip dönüştürün (<code>e.value as DateRange</code>) ya da kendi state’inizi okuyun.</>],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onSelectionClear">
        <p>
          Boş olmayan bir seçimi boşaltan bir değişiklikten sonra tetiklenir: <code>ref.clear()</code>, boş bir varsayılana <code>ref.reset()</code>,{' '}
          <code>ref.select(null)</code>, aralık modunda bitişi olmayan başlangıca yeniden tıklama veya çoklu modda son seçili tarihin kaldırılması. Controlled
          bir <code>value</code>’yu kendiniz temizlediğinizde tetiklenmez.
        </p>
        <Signature>{'onSelectionClear?: (e: SelectionClearEvent) => void'}</Signature>
        <Payload
          caption="SelectionClearEvent"
          rows={[
            ['previous', 'unknown', 'Temizlenmeden önceki değer (tipi moda göre daraltılmaz).'],
            ['source', 'EventSource', "'pointer', 'keyboard' veya 'programmatic'."],
          ]}
        />
      </Section>

      <Section title="onInvalidSelection">
        <p>
          Bir seçim denemesi kabul edilmediğinde tetiklenir: kullanıcı seçilemeyen bir güne tıkladığında veya Enter/Space’e bastığında (<code>dateClick</code>’ten
          sonra) ya da doğrulamadan geçemeyen bir değerle <code>ref.select()</code> çağrıldığında. Seçim değişmez ve <code>onChange</code> çağrılmaz.
          Takvim aynı yerelleştirilmiş mesajı “tarih: sebep” biçiminde ekran okuyucuya bildirir; sebep, günün ekran okuyucunun okuduğu etiketinde de yer
          alır.
        </p>
        <p>
          <code>clear()</code> ve <code>reset()</code> için (bunlar doğrulanmaz), salt okunur moddaki tıklamalarda ve salt okunur modda yalnızca bir sorun
          döndüren <code>ref.select()</code> için yayılmaz. Tekrarlar da bildirilir: aynı deneme iki kez yapılırsa olay iki kez gelir.
        </p>
        <Signature>{'onInvalidSelection?: (e: InvalidSelectionEvent) => void'}</Signature>
        <Payload
          caption="InvalidSelectionEvent"
          rows={[
            [
              'date',
              'CalendarDate | null',
              <>
                İlgili gün. Tıklama veya Enter/Space’te bu her zaman denenen gündür. <code>ref.select()</code> için bu{' '}
                <code>issue.date</code>’tir; sorunun bir günü yoksa <code>null</code> olur (örneğin <code>maxSelections</code> için fazla tarih, geçersiz bir
                değer veya tarih vermeyen özel bir doğrulayıcı). Tarih olarak kullanmadan önce <code>null</code> olup olmadığına bakın.
              </>,
            ],
            ['issue', 'ValidationIssue', 'Sebep; aşağıdaki tabloya bakın.'],
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
          <em>Mevcut</em> değerin geçerli olup olmadığını bildirir. İlk render’da bir kez tetiklenir (<code>cause: &apos;initial&apos;</code>,{' '}
          <code>previous: null</code>); sonra yalnızca sonuç değiştiğinde gelir: <code>valid</code> değiştiğinde veya sorun değiştiğinde (kod, tarih, gün
          sebebi, mesaj veya parametreler). Değer değişip geçerli kalıyorsa olay gelmez.
        </p>
        <p>
          Değerin tıklama olmadan geçersiz hale gelebildiği durumlarda kullanın: state’inizden gelen controlled bir <code>value</code>, değişen kurallar veya{' '}
          <code>ruleContext</code>, yüklenen veriler ya da gün dönümü (<code>today</code>). Takvim değeri hiçbir zaman kendisi değiştirmez; yalnızca
          bildirir. Tipik kullanım: gönder düğmesini devre dışı bırakmak.
        </p>
        <Signature>{'onValidationChange?: (e: ValidationChangeEvent) => void'}</Signature>
        <Payload
          caption="ValidationChangeEvent"
          rows={[
            ['previous', 'ValidationResult | null', 'Son bildirilen sonuç; ilk render’da null.'],
            ['current', 'ValidationResult', <>Mevcut değer için <code>{'{ valid: boolean, issue: ValidationIssue | null }'}</code>.</>],
            ['selection', 'Selection', <>Doğrulanan değer, <code>{'{ mode, value }'}</code> olarak.</>],
            [
              'cause',
              "'initial' | 'selection' | 'rules'",
              <>
                <code>initial</code>: mount sonrası ilk değerlendirme. <code>selection</code>: değer son değerlendirmeden bu yana değişti (bir eylemle veya{' '}
                <code>value</code> prop’uyla). <code>rules</code>: değer aynı, ama kurallar, kural bağlamı, veri durumu, yükleme durumu veya bugünün tarihi değişti.
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onActiveEndpointChange">
        <p>
          Yalnızca aralık modunda. Etkin uç nokta, sonraki tıklamanın belirleyeceği uçtur (<code>&apos;start&apos;</code> veya <code>&apos;end&apos;</code>).
          Olayın davranışı, uç noktayı sizin tutup tutmadığınıza (controlled / uncontrolled) bağlıdır:
        </p>
        <ul>
          <li>
            <strong>uncontrolled</strong> (<code>activeEndpoint</code> prop’u yok; uç noktayı takvim tutar): uç nokta gerçekten değiştiğinde, render’dan sonra ve
            eylemin kaynağıyla birlikte bildirir. <code>value</code>’yu siz tutuyor ve bir değişikliği kabul etmiyorsanız uç nokta değişmez ve olay gelmez.{' '}
            <code>value</code>’yu kendiniz değiştirdiğinizde uç nokta da değişirse (örneğin aralığı temizlerseniz) bu, <code>source: &apos;prop&apos;</code>{' '}
            ile bildirilir.
          </li>
          <li>
            <strong>controlled</strong> (<code>activeEndpoint</code> verilmiş; uç noktayı siz tutarsınız): olay, eylem anında yayılan bir istektir;{' '}
            <code>change</code>’in hemen ardından ve <code>selectionComplete</code>’ten önce gelir, <code>ref.setActiveEndpoint()</code> için de yayılır.
            Değişikliğin uygulanması için yeni değeri state’inize yazın. Prop’u kendiniz değiştirmek olay yaymaz.
          </li>
        </ul>
        <p>İlk render’da, diğer modlarda ve uç nokta aynı kaldığında yayılmaz.</p>
        <Signature>{'onActiveEndpointChange?: (endpoint: RangeEndpoint, e: ActiveEndpointChangeEvent) => void'}</Signature>
        <Payload
          caption="ActiveEndpointChangeEvent"
          rows={[
            ['previous', 'RangeEndpoint', 'Önceki uç nokta.'],
            ['current', 'RangeEndpoint', 'Yeni uç nokta (ilk argümanla aynı).'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic' veya 'prop' (uncontrolled uç nokta; üst bileşen değeri değiştirdi)."],
          ]}
        />
      </Section>

      <Section title="Örnek: bir formda seçim olayları">
        <p>
          İlk bileşen her değişiklikte bir taslak kaydeder, seçimin tamamlanmasını izler, bir günün neden seçilemediğini gösterir ve değer geçersizken Devam
          düğmesini devre dışı bırakır. İkincisi <code>activeEndpoint</code>’i iki alandan (Giriş / Çıkış) yönetir.
        </p>
        <Snippet files={selectionCode} label="Seçim olayları" />
      </Section>

      {/* ----------------------------------------------------------- gezinme */}

      <Section title="onVisibleMonthChange">
        <p>
          Kullanıcı veya kodunuz takvimden başka bir ayı göstermesini istediğinde tetiklenir: önceki/sonraki okları, klavyeyle sayfa değiştirme ya da bir
          controller metodu. Bildirdiği ay <strong>referans ay</strong>dır, yani takvimin konumlandığı ay. Ekranda birden çok ay varsa{' '}
          <code>monthPosition</code> sırasındaki aydır (varsayılan olarak ilki); <code>visibleMonth</code>’in belirlediği ay da budur.
        </p>
        <DataTable
          caption="visibleMonthChange’i neler yayar"
          head={['Eylem', 'source', 'reason']}
          rows={[
            ['Varsayılan önceki/sonraki düğmeleri, renderNavigation’ın previous()/next()’i', 'navigation', 'previous / next'],
            ['ref.previous() ya da ref.next()', 'programmatic', 'previous / next'],
            ['ref.goToMonth()', 'programmatic', 'jump'],
            ['Odağı gösterilmeyen bir aya taşıyan ok veya Page tuşu', 'keyboard', 'keyboard'],
            ['Gösterilmeyen bir aydaki güne ref.focusDate()', 'programmatic', 'keyboard'],
          ]}
        />
        <p>Şu durumlarda tetiklenmez:</p>
        <ul>
          <li>ilk render’da veya <code>visibleMonth</code> prop’unu değiştirdiğinizde;</li>
          <li>
            sürekli modda yeni ay yüklenirken veya kaydırılırken: referans ay değişmez (<code>onVisibleMonthsChange</code> veya{' '}
            <code>onRenderedMonthsChange</code> kullanın);
          </li>
          <li>
            ay aynı kaldığında: mevcut referans aya atlama veya <code>minDate</code>/<code>maxDate</code> dışında kalıp mevcut aya geri çekilen bir istek
            (örneğin izin verilen son ayda <code>ref.next()</code> ya da ilk ayda <code>ref.previous()</code>). Sınıra çekilip <em>farklı</em> bir aya
            varan istek ise <code>clamped: true</code> ile tetiklenir; <code>goToMonth()</code> her iki durumda da <code>clamped: true</code> döndürür.
          </li>
        </ul>
        <p>
          <strong>controlled</strong> (<code>visibleMonth</code> verilmiş; ayı siz tutarsınız): olay bir istektir; ayın değişmesi için <code>month</code>’u
          state’inize yazın. Yok sayarsanız takvim olduğu ayda kalır. <strong>uncontrolled</strong>: takvim ayı zaten değiştirmiştir.
        </p>
        <p>
          <strong>Sürekli modda controlled kullanım.</strong> <code>visibleMonth</code> prop’unu değiştirmek <code>goToMonth()</code> ile aynı şekilde
          çalışır: zaten render edilmiş bir aya kaydırılır ve yüklenen liste korunur; render edilmemiş bir ay için liste o ayın etrafında yeniden kurulur (
          <code>maxRenderedMonths</code> ile sınırlıdır ve veri yüklemeniz takip edebilsin diye <code>renderedMonthsChange</code> /{' '}
          <code>onRenderedMonthsChange</code> ile bildirilir), ay render edilince oraya kaydırılır. Değer <code>minDate</code>/<code>maxDate</code>{' '}
          sınırına çekilir. Kaydırma <code>behavior: &apos;auto&apos;</code> kullanır (yumuşak animasyon yok), klavye odağı taşınmaz ve prop değişikliği{' '}
          <code>visibleMonthChange</code> yaymaz. Prop yalnızca takvimin kendi başlattığı bir gezinmeyi yansıtıyorsa (<code>goToMonth()</code> veya bir ok
          tuşundan sonra ayı <code>onVisibleMonthChange</code>’den alıp sakladıysanız) takvim ikinci kez kaydırmaz.
        </p>
        <p>
          Prop’u <code>onVisibleMonthChange</code>’den besleyin. <code>onVisibleMonthsChange</code>’den veya kaydırma konumundan beslemeyin: sürekli modda
          bunlar kullanıcının kaydırmasını izler; onları <code>visibleMonth</code>’a geri yazarsanız takvim kendini yeniden kaydırır ve kullanıcının
          kaydırmasıyla çekişir.
        </p>
        <Signature>{'onVisibleMonthChange?: (month: CalendarMonth, e: VisibleMonthChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthChangeEvent"
          rows={[
            ['previous', 'CalendarMonth | null', 'Önceki referans ay; henüz bilinmiyorsa null (today verilmeden sunucuda render edildiyse).'],
            ['month', 'CalendarMonth', 'Yeni referans ay, sınıra çekilmiş haliyle (ilk argümanla aynı).'],
            ['source', 'EventSource', "'navigation', 'programmatic' veya 'keyboard'."],
            ['reason', "'previous' | 'next' | 'jump' | 'keyboard'", 'Yukarıdaki tabloya bakın.'],
            ['clamped', 'boolean', 'İstek min/max dışındaydı ve izin verilen en yakın aya taşındı.'],
          ]}
        />
        <p>
          Aşağıdaki örnekte ay controlled’dır. Oklara tıklayın: takvimin altındaki satır her isteği <code>reason</code> ve <code>source</code> değerleriyle
          gösterir. &quot;Okları takip et&quot; işaretini kaldırırsanız istekler yok sayılır ve takvim olduğu ayda kalır. Listeden bir ay seçmek prop’u
          doğrudan değiştirir ve olay yaymaz.
        </p>
        <Example src="events/ControlledMonth" title="Controlled visibleMonth" />
      </Section>

      <Section title="onVisibleMonthsChange">
        <p>
          Ekranda görünen ayların listesi değiştiğinde tetiklenir; ilk render’da da bir kez (<code>previous: []</code> ile). Sayfalı modda bunlar o an
          gösterilen aylardır (<code>overflow=&quot;reduce-months&quot;</code> bazılarını gizlediğinde daha az). Sürekli modda kaydırmayı izlerler: kaydırma
          alanına (sayfa ya da <code>maxBlockSize</code> verilmiş takvim) giren render edilmiş aylardır; IntersectionObserver ile her karede en fazla bir
          kez ölçülür.
        </p>
        <p>Kaynak alanı yoktur: sayfa değiştirme, aya atlama, kaydırma, yükleme ve yerleşim değişikliklerinin sonucunu aynı şekilde bildirir.</p>
        <Signature>{'onVisibleMonthsChange?: (e: VisibleMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="VisibleMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'Geçen sefer bildirilen aylar (ilk render’da []).'],
            ['months', 'readonly CalendarMonth[]', 'Şu an ekrandaki aylar, kronolojik sırayla.'],
          ]}
        />
      </Section>

      <Section title="Örnek: gezinme olayları">
        <p>Controlled bir visibleMonth ile ayı URL’de tutun ve görünen ayları kendi başlığınızda gösterin.</p>
        <Snippet files={navigationCode} label="Gezinme olayları" />
      </Section>

      {/* ------------------------------------------------------- veri ve yerleşim */}

      <Section title="onRenderedMonthsChange">
        <p>
          DOM’daki aylar değiştiğinde tetiklenir; ilk render’da da bir kez, render edilen tüm aylar <code>added</code> içinde olacak şekilde. Veri
          isteklerini başlatmanın yeri burasıdır: sayfa değiştirme, aya atlama, daha fazla ay yükleme, son ayın ötesine klavyeyle gezinme ve{' '}
          <code>maxRenderedMonths</code> sınırında ay kaldırma hep bu olayla bildirilir. <code>removed</code> içindeki ayların isteklerini iptal edin.
        </p>
        <p>
          Sayfalı modda render edilen aylar görünen aylara eşittir. Sürekli modda yeni ay yüklendikçe büyür, <code>maxRenderedMonths</code> aşıldığında
          karşı uçtan ay kaldırılır ve uzak bir aya atladığınızda liste hedefin etrafında yeniden kurulur (aradaki aylar render edilmez).
        </p>
        <Signature>{'onRenderedMonthsChange?: (e: RenderedMonthsChangeEvent) => void'}</Signature>
        <Payload
          caption="RenderedMonthsChangeEvent"
          rows={[
            ['previous', 'readonly CalendarMonth[]', 'Önceden render edilen aylar (ilk render’da []).'],
            ['months', 'readonly CalendarMonth[]', 'Şu an render edilen aylar, sırayla.'],
            ['added', 'readonly CalendarMonth[]', 'months içinde olup previous içinde olmayan aylar.'],
            ['removed', 'readonly CalendarMonth[]', 'previous içinde olup months içinde olmayan aylar.'],
          ]}
        />
      </Section>

      <Section title="onLoadMore">
        <p>
          Yalnızca sürekli modda. Aylar şu yollarla eklendiğinde tetiklenir: varsayılan düğme (veya özel bir <code>renderLoadMore</code>’un{' '}
          <code>loadMore()</code>’u), otomatik gözcü öğe (<code>loadMore=&quot;auto&quot;</code>), <code>ref.loadMore()</code> ya da odağın render edilen
          ilk veya son ayın ötesine taşınması (hedef en fazla <code>monthsPerLoad</code> ay uzaktaysa liste genişletilir; daha uzaksa doğrudan oraya
          atlanır). Eylem anında yayılır; <code>renderedMonthsChange</code> ise render’dan sonra gelir.
        </p>
        <p>
          Sayfalı modda, hiçbir şey eklenemeyen <code>minDate</code>/<code>maxDate</code> sınırında veya <code>goToMonth</code> için tetiklenmez. Ay eklemek
          hiçbir zaman <code>visibleMonthChange</code> yaymaz.
        </p>
        <Signature>{'onLoadMore?: (e: LoadMoreEvent) => void'}</Signature>
        <Payload
          caption="LoadMoreEvent"
          rows={[
            ['direction', "'next' | 'previous'", 'Ayların eklendiği yön.'],
            ['months', 'readonly CalendarMonth[]', <>Eklenen aylar (en fazla <code>monthsPerLoad</code>; min/max sınırında daha az). Diğer uçtan kaldırılan aylar <code>renderedMonthsChange.removed</code> içindedir.</>],
            ['source', 'EventSource', <>
              <code>load-more</code>; yalnızca trigger <code>keyboard</code> olduğunda odağı taşıyan şeyin kaynağıdır: <code>keyboard</code> (ok veya Page
              tuşları) ya da <code>programmatic</code> (<code>ref.focusDate()</code>).
            </>],
            [
              'trigger',
              "'button' | 'auto' | 'manual' | 'keyboard'",
              <>
                <code>button</code>: varsayılan veya özel düğme. <code>auto</code>: gözcü öğe görünür alana girdi. <code>manual</code>:{' '}
                <code>ref.loadMore()</code>. <code>keyboard</code>: odak listenin sonunun ötesine taşındı (ok veya Page tuşları ya da <code>ref.focusDate()</code>).
              </>,
            ],
          ]}
        />
      </Section>

      <Section title="onLoadingChange">
        <p>
          Yükleme durumu değiştiğinde tetiklenir: <code>loading</code> prop’u açılıp kapandığında ya da render edilmiş bir ayın <code>getDataStatus</code>{' '}
          sonucu <code>loading</code> veya <code>error</code> olduğunda ya da bu durumdan çıktığında (böyle bir ay render edildiğinde veya kaldırıldığında
          da). İlk render’da yayılmaz: başlangıç durumunu kendi prop’larınızdan okuyun.
        </p>
        <Signature>{'onLoadingChange?: (e: LoadingChangeEvent) => void'}</Signature>
        <Payload
          caption="LoadingChangeEvent"
          rows={[
            ['previous', 'LoadingSnapshot', 'Önceki durum.'],
            ['current', 'LoadingSnapshot', 'Şimdiki durum.'],
          ]}
        />
        <Payload
          caption="LoadingSnapshot"
          rows={[
            ['initial', 'boolean', <><code>loading</code> açık ve takvim ilk render’ından beri yükleniyor: gün numaraları yerine tarihler yüklenirken gösterilen boş yer tutucular görünür; varsayılan <code>unknownDataPolicy</code> değeri <code>&apos;block&apos;</code> iken hiçbir gün seçilemez.</>],
            ['refreshing', 'boolean', <><code>loading</code>, takvim bir kez yüklemesiz gösterildikten sonra açıldı: arka planda yenileme. Görünüm, seçim ve odak korunur, günler numaralarıyla görünmeye ve seçilebilmeye devam eder.</>],
            ['loadingMonths', 'readonly CalendarMonth[]', <>Durumu <code>loading</code> olan render edilmiş aylar.</>],
            ['errorMonths', 'readonly CalendarMonth[]', <>Durumu <code>error</code> olan render edilmiş aylar.</>],
            ['busy', 'boolean', <><code>loading</code> açık ya da bir ay yükleniyor (kökte <code>aria-busy</code> bulunur).</>],
          ]}
        />
      </Section>

      <Section title="onReady">
        <p>
          Her mount’ta bir kez, kapsayıcı ilk kez ölçüldükten sonra tetiklenir; ilk <code>validationChange</code>,{' '}
          <code>visibleMonthsChange</code> ve <code>renderedMonthsChange</code>’ten sonra gelir. Ref bu noktada bağlıdır, yani controller’ı burada
          kullanabilirsiniz. Verilerinizin yüklendiği anlamına gelmez ve sunucu tarafı render sırasında hiç tetiklenmez.
        </p>
        <Signature>{'onReady?: (e: ReadyEvent) => void'}</Signature>
        <Payload caption="ReadyEvent" rows={[['layout', 'CalendarLayout', 'İlk ölçülen yerleşim (bkz. onLayoutChange).']]} />
      </Section>

      <Section title="onResize">
        <p>
          Takvimin kök öğesinin boyutunu bildirir. İlk bildirimde <code>previous: null</code> olur; sonra genişlik veya yükseklik <em>son bildirilen</em>{' '}
          boyuta göre <code>resizeThreshold</code> pikselden (varsayılan 0) fazla değiştiğinde tetiklenir. ResizeObserver callback’leri animasyon karesi
          başına bire indirilir ve aynı boyut iki kez bildirilmez. ResizeObserver yoksa yalnızca ilk render’da bir kez bildirir.
        </p>
        <p>
          <code>resizeThreshold</code> yalnızca bu bildirimlerin sıklığını azaltır; yerleşim yine her boyut değişikliğine uyar. Yapısal değişiklikler
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
          gün boyutuna ulaşılması, yazı yönü veya minimum ay genişliği. Yapıyı değiştirmeyen genişlik değişiklikleri onu tetiklemez. Sebep bir boyut
          değişikliği ya da bir prop değişikliği olabilir. İlk render’da yayılmaz (<code>onReady</code> kullanın).
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
            ['activeOverflow', "'none' | 'scroll' | 'wrap' | 'reduce-months'", <>Şu an uygulanan: her şey sığıyorsa <code>none</code>; başka çare kalmadığında <code>scroll</code>.</>],
            ['atMinDaySize', 'boolean', 'Gün hücreleri minDaySize boyutunda ve daha fazla küçülemez.'],
            ['containerWidth', 'number | null', 'Ölçülen içerik genişliği; ölçümden önce null.'],
            ['minMonthWidth', 'number', 'Bir ayın alabileceği en dar genişlik (7 × minimum gün genişliği + iç boşluk).'],
            ['direction', "'ltr' | 'rtl'", 'Yazı yönü.'],
          ]}
        />
      </Section>

      <Section title="Örnek: veri ve yerleşim olayları">
        <p>
          Fiyatları ay ay <code>onRenderedMonthsChange</code> ile yükleyin (kaldırılan ayların isteklerini iptal ederek), hataları{' '}
          <code>onLoadingChange</code> ile bildirin ve footer’ı gerçek sütun sayısına göre düzenleyin.
        </p>
        <Snippet files={dataLayoutCode} label="Veri ve yerleşim olayları" />
      </Section>

      {/* ------------------------------------------------------- etkileşim */}

      <Section title="onDayFocusChange">
        <p>
          Klavye (DOM) odağı son odaklanan günden farklı bir güne geldiğinde tetiklenir: ok ve Page tuşları, takvime Tab ile girmek, bir tıklama,{' '}
          <code>ref.focusDate()</code>, <code>goToMonth(…, {'{ focus: true }'})</code> ya da odaktaki daha fazla ay yükleme düğmesi kaybolduğunda takvimin
          odağı ızgaraya taşıması. Takvimden çıkmak onu tetiklemez (son odaklanan gün korunur); aynı güne yeniden odaklanmak da tetiklemez.
        </p>
        <Signature>{'onDayFocusChange?: (e: DayFocusChangeEvent) => void'}</Signature>
        <Payload
          caption="DayFocusChangeEvent"
          rows={[
            ['previous', 'CalendarDate | null', 'Önceden odaklanan gün; ilk odakta null.'],
            ['date', 'CalendarDate | null', 'Odaklanan gün. Tipte null olabilir, ama mevcut sürüm her zaman bir tarih gönderir.'],
            ['source', 'EventSource', "'pointer', 'keyboard', 'programmatic' veya 'load-more'."],
          ]}
        />
      </Section>

      <Section title="onTooltipOpenChange">
        <p>
          Bir günün tooltip’i açıldığında, kapandığında veya açık tooltip başka bir güne geçtiğinde tetiklenir; tooltip’i neyin açtığı fark etmez: fareyle
          üzerine gelme, klavye odağı, dokunma, kalıcı (persistent) tooltip ya da controlled <code>tooltip.openDate</code> (açık günü siz belirlersiniz).
          Aynı günde yalnızca açılma sebebinin değişmesi (önce hover, sonra odak) onu tetiklemez. İlk render’da yalnızca zaten açık bir tooltip varsa
          tetiklenir. Escape tooltip’i kapatır ve bu da bildirilir.
        </p>
        <Signature>{'onTooltipOpenChange?: (e: TooltipOpenChangeEvent) => void'}</Signature>
        <Payload
          caption="TooltipOpenChangeEvent"
          rows={[
            ['date', 'CalendarDate | null', 'Tooltip’i şu an açık olan gün; kapalıyken null.'],
            ['previous', 'CalendarDate | null', 'Tooltip’i önceden açık olan gün.'],
            ['open', 'boolean', 'Şu an açık bir tooltip olup olmadığı.'],
            ['trigger', "'hover' | 'focus' | 'touch' | 'persistent' | 'controlled' | null", 'Tooltip’i neyin açtığı; kapalıyken null.'],
          ]}
        />
      </Section>

      <Section title="onOutsideClick">
        <p>
          Sayfada takvimin dışındaki her <code>pointerdown</code>’da (fare, dokunma veya kalem; herhangi bir tuş) tetiklenir. &quot;İçerisi&quot;
          takvimin React ağacıdır: takvimin DOM’u, portal ile render edilen tooltip ve slotlarınızın render ettiği her şey (portal üzerinden olsa bile).
          Takvimin etrafındaki kendi sarmalayıcınız ve takvimi açan düğme dışarıda sayılır; bunları kendiniz ayıklayın (aşağıdaki örneğe bakın).
        </p>
        <p>
          Takvim yalnızca <code>onOutsideClick</code> veya <code>onEvent</code> verildiğinde dinler. Takvim kendisi hiçbir şeyi kapatmaz: satır içi bir
          takvimin açık/kapalı durumu yoktur.
        </p>
        <Signature>{'onOutsideClick?: (e: OutsideClickEvent) => void'}</Signature>
        <Payload caption="OutsideClickEvent" rows={[['nativeEvent', 'PointerEvent', <>Tarayıcının asıl olayı; kendi öğelerinizi ayıklamak için <code>nativeEvent.target</code>’a bakın.</>]]} />
      </Section>

      <Section title="onScroll">
        <p>
          Takvimin aylar alanı kaydırıldığında tetiklenir: <code>overflow=&quot;scroll&quot;</code> ile yatay ya da <code>maxBlockSize</code> ile dikey
          kaydırmada. Çağrılar animasyon karesi başına bire indirilir ve en son konumu taşır. Sayfayı kaydırmak onu tetiklemez; takvim yalnızca <code>onScroll</code>{' '}
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
          Yukarıdaki her olayı, ilgili callback’ten sonra, <code>type</code> alanıyla ayırt edilen <code>CalendarEvent</code> birleşimi olarak alır. Analitik,
          hata ayıklama veya olayları bir durum makinesine iletmek için kullanın. <code>CalendarEventType</code>, <code>type</code> dizelerinin birleşimidir.
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
          Seçim tamamlanınca veya dışarı tıklanınca popover’ını kapatan bir tarih alanı, <code>onDayFocusChange</code> ile beslenen bir ayrıntı paneli,{' '}
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
          Controller, kendi düğmelerinizin ve kodunuzun takvimi yönetmesini sağlar: ayı değiştirin, tarih seçin veya seçimi temizleyin, odağı taşıyın ve
          mevcut durumu okuyun. Ona bir ref üzerinden ya da takvimin slotlarında <code>ctx.actions</code> olarak erişirsiniz.
        </>
      }
    >
      <Section title="Controller’ı edinmek">
        <p>
          Ref, React’te bir bileşene dışarıdan erişmenin yoludur: <code>useRef</code> ile oluşturursunuz, React onu mount’tan sonra doldurur. Türü{' '}
          <code>CalendarController</code> olan bir ref oluşturun ve <code>Calendar</code>’a verin. Ref mount’tan önce ve sunucuda <code>null</code>’dır;
          bu yüzden metotları olay işleyicilerinden veya effect’lerden <code>?.</code> ile çağırın (örneğin <code>calendar.current?.next()</code>).
          Nesne takvim yaşadığı sürece aynı kalır ve her zaman en güncel durumla çalışır; saklamak veya alt bileşenlere aktarmak güvenlidir.
        </p>
        <p>
          Slotlar, takvimin bazı bölümlerini kendiniz çizmenizi sağlayan render prop’lardır (<code>renderHeader</code>, <code>renderFooter</code>,{' '}
          <code>renderMonthHeader</code>, <code>renderNavigation</code>, <code>renderLoading</code>, <code>renderError</code>,{' '}
          <code>renderLoadMore</code>). Her biri slot bağlamı <code>ctx</code>’i alır: mevcut durum (<code>ctx.phase</code>,{' '}
          <code>ctx.visibleMonths</code>, … yani <code>getSnapshot()</code> ile aynı alanlar) ve <code>ctx.actions</code> olarak aynı controller. Böylece
          takvimin içine koyduğunuz bir düğme için ref gerekmez.
        </p>
        <p>
          Metotlar, kullanıcı eylemleriyle aynı olayları <code>source: &apos;programmatic&apos;</code> ile yayar. Controlled prop’larla (<code>value</code>,{' '}
          <code>visibleMonth</code>, <code>activeEndpoint</code>; değeri siz tutarsınız ve callback ile güncellersiniz) bir metot, tıpkı bir tıklama gibi,
          değişikliği callback üzerinden yalnızca <em>ister</em>.
        </p>
        <p>
          Aşağıdaki örnekte her düğme bir metodu çağırır ve döndürdüğü değeri yazar. &quot;2 yıl sonrasına git (sınıra çekilir)&quot; düğmesini deneyin:
          takvim yalnızca önümüzdeki 180 güne izin verdiği için sonuç <code>clamped: true</code> içerir. &quot;2 gün önce başlayan aralık
          (reddedilir)&quot; ise <code>valid: false</code> döndürür ve seçimi değiştirmez.
        </p>
        <Example src="events/ControllerButtons" title="Takvimin dışındaki düğmeler" />
        <Snippet files={controllerCode} label="Ref’ten ve slottan controller" />
      </Section>

      <Section title="instanceId">
        <p>
          <code>readonly instanceId: string</code>. Takvimin kök öğesinin <code>id</code>’si: <code>id</code> prop’u ya da otomatik üretilen benzersiz bir id. Her
          olay aynı değeri taşır; böylece ortak bir işleyicide takvimleri birbirinden ayırabilir veya kendi düğmenizin <code>aria-controls</code>’unu
          takvime bağlayabilirsiniz.
        </p>
      </Section>

      <Section title="goToMonth()">
        <p>
          <code>{'goToMonth(month: CalendarMonth | CalendarDate | string, options?: GoToMonthOptions): GoToMonthResult | null'}</code>
        </p>
        <p>Verilen ayı referans ay yapar. Seçimi hiçbir zaman değiştirmez.</p>
        <ul>
          <li>
            <code>YYYY-MM</code> veya geçerli bir <code>YYYY-MM-DD</code> kabul eder (ayı kullanılır). Başka her şey (geçersiz bir tarih, başka bir biçim, dize
            olmayan bir değer) için <code>null</code> döndürür ve hiçbir şey yapmaz.
          </li>
          <li>
            <code>minDate</code>’ten önceki veya <code>maxDate</code>’ten sonraki bir ay, izin verilen en yakın aya çekilir; bu durumda sonuçta{' '}
            <code>clamped: true</code> olur. <code>disablePast</code>/<code>disableFuture</code> gezinmeyi sınırlamaz.
          </li>
          <li>
            Sınıra çekildikten sonraki hedef mevcut referans ay değilse <code>visibleMonthChange</code> (<code>source: &apos;programmatic&apos;</code>,{' '}
            <code>reason: &apos;jump&apos;</code>) yayar; zaten referans aysa olay yayılmaz, ama istek sınırların dışındaysa sonuçta yine{' '}
            <code>clamped: true</code> olur. Türetilmiş olaylar (<code>visibleMonthsChange</code>, <code>renderedMonthsChange</code>) ardından gelir.
          </li>
          <li>
            Sayfalı mod: gösterilen aylar, hedef <code>monthPosition</code> sırasında duracak şekilde yeniden belirlenir. Sürekli mod: render edilmiş bir ay
            görünür alana kaydırılır (aynı ay için bile her çağrıda); render edilmemiş bir ay için liste, aradaki aylar render edilmeden o ayın etrafında
            yeniden kurulur.
          </li>
          <li>
            controlled <code>visibleMonth</code>: çağrı yalnızca isteği yayar. Dönüş değeri yine istenen ayı verir, ama siz prop’u güncelleyene kadar
            referans ay değişmez (sürekli modda zaten render edilmiş bir aya hemen kaydırılır; ayı sonradan prop’a yazmak ikinci bir kaydırmaya yol
            açmaz).
          </li>
        </ul>
        <Payload
          caption="GoToMonthOptions"
          rows={[
            [
              'focus',
              'boolean?',
              <>
                Klavye odağını, hedef ay render edilir edilmez ayın ilk gününe (<code>minDate</code>/<code>maxDate</code> içine çekilmiş) taşır. Kullanıcı bu
                arada odağı başka yere taşıdıysa odak taşınmaz. Odaklanan gün değişirse <code>dayFocusChange</code> yayar.
              </>,
            ],
            [
              'behavior',
              "'auto' | 'smooth' | 'instant'",
              <>
                Yalnızca sürekli modda. <code>smooth</code>, kullanıcı azaltılmış hareket tercih etmiyorsa yumuşak kaydırır; <code>auto</code>,{' '}
                <code>instant</code> veya hiç verilmemesi durumunda hemen atlar.
              </>,
            ],
          ]}
        />
        <Payload
          caption="GoToMonthResult"
          rows={[
            ['month', 'CalendarMonth', 'Gerçekten kullanılan ay (sınıra çekildikten sonra).'],
            ['clamped', 'boolean', 'Hedef min/max dışındaydı ve sınıra çekildi.'],
          ]}
        />
      </Section>

      <Section title="next() ve previous()">
        <p>
          <code>next(): void</code>, <code>previous(): void</code>. Referans ayı, varsayılan oklar gibi <code>stepMonths</code> kadar (varsayılan 1) ileri veya geri alır;
          olay <code>source: &apos;programmatic&apos;</code> ve <code>reason: &apos;next&apos;</code> / <code>&apos;previous&apos;</code> ile gelir. Sürekli
          modda takvim yeni referans aya kaydırır; yeni ay yüklenmez ve <code>loadMore</code> yayılmaz.
        </p>
        <p>
          Varsayılan düğmelerin aksine hiçbir zaman devre dışı değildir: <code>minDate</code>/<code>maxDate</code> sınırında istek mevcut aya geri çekilir,
          bu yüzden ay değişmez ve <code>visibleMonthChange</code> yayılmaz. Kendi düğmelerinizi devre dışı bırakmak için <code>renderNavigation</code>’daki{' '}
          <code>canPrevious</code>/<code>canNext</code> değerlerini kullanın. Referans ay henüz bilinmiyorsa (<code>today</code> olmadan sunucu render’ı) hiçbir
          şey yapmazlar.
        </p>
      </Section>

      <Section title="loadMore()">
        <p>
          <code>{"loadMore(direction?: 'next' | 'previous'): void"}</code>, varsayılan <code>&apos;next&apos;</code>. Yalnızca sürekli modda; sayfalı modda
          hiçbir şey yapmaz. O yöne <code>monthsPerLoad</code> ay ekler, <code>minDate</code>/<code>maxDate</code>’te durur ve <code>maxRenderedMonths</code>{' '}
          aşıldığında karşı uçtan ay kaldırır (odaktaki günün ayını hiçbir zaman). Aylar başa eklendiğinde ekranda gördüğünüz yer kaymaz.
        </p>
        <p>
          <code>loadDirections</code> ne olursa olsun, her <code>loadMore</code> moduyla ve iki yönde de çalışır: <code>loadDirections</code> yalnızca hangi
          yerleşik düğmelerin ve otomatik yükleme gözcülerinin bulunacağını belirler, controller’ın hangi yöne yükleyebileceğini değil.{' '}
          <code>loadMore=&quot;manual&quot;</code> yerleşik düğmeyi gizler; böylece yüklemeyi yalnızca sizin düğmeniz başlatır (örneğin{' '}
          <code>renderFooter</code> içinde). <code>trigger: &apos;manual&apos;</code> ile <code>loadMore</code>, ardından <code>renderedMonthsChange</code>{' '}
          yayar. Sınırda hiçbir şey olmaz ve olay yayılmaz.
        </p>
      </Section>

      <Section title="clear()">
        <p>
          <code>clear(): void</code>. Seçimi boşaltır: <code>change</code> (<code>reason: &apos;clear&apos;</code>, <code>date: null</code>), ardından{' '}
          <code>selectionClear</code> yayar; aralık modunda sonraki tıklama yine başlangıcı belirler (uç nokta <code>end</code> idiyse{' '}
          <code>activeEndpointChange</code> da gelir). Doğrulama yapılmaz. Seçim zaten boşsa veya salt okunur modda hiçbir şey yapmaz ve olay yaymaz.
          Controlled bir <code>value</code> ile değişiklik yalnızca bir istektir.
        </p>
      </Section>

      <Section title="reset()">
        <p>
          <code>reset(): void</code>. <code>defaultValue</code>’yu mount anındaki haliyle geri yükler (bu prop’ta sonradan yapılan değişiklikler yok sayılır);
          varsayılan değer yoksa veya mod o zamandan beri değiştiyse seçimi boşaltır. <code>reason: &apos;reset&apos;</code> ile{' '}
          <code>change</code> yayar (değer zaten varsayılana eşitse hiçbir olay yaymaz); sonuç boşsa ve seçim boş değildiyse <code>selectionClear</code>{' '}
          da yayar; <code>selectionComplete</code>’i hiçbir zaman yaymaz. Varsayılan değer
          yeniden doğrulanmaz (geçersiz hale gelmiş olabilirse <code>onValidationChange</code>’i izleyin). Salt okunur modda hiçbir şey yapmaz.
        </p>
        <p>
          Controlled bir <code>value</code> ile normalde <code>defaultValue</code> vermezsiniz; bu yüzden <code>reset()</code> boş bir değer ister.
        </p>
      </Section>

      <Section title="select()">
        <p>
          <code>{'select(value: CalendarDate | DateRange | readonly CalendarDate[] | null): ValidationResult'}</code>
        </p>
        <p>
          Mevcut mod için tam bir değer önerir (<code>null</code> boş demektir) ve onu bir tıklamayla aynı kurallarla doğrular: sınırlar, geçmiş/gelecek,
          müsaitlik, uzunluklar, <code>validateSelection</code>, <code>maxSelections</code> ve veri durumu.
        </p>
        <ul>
          <li>
            <strong>Geçerli</strong>: değer <code>reason: &apos;set&apos;</code> ve <code>date: null</code> ile uygulanır. <code>change</code> yayar; ardından
            değer tamamlanmışsa (tekli tarih, iki ucu da olan aralık, boş olmayan liste) <code>selectionComplete</code> veya seçimi boşaltıyorsa{' '}
            <code>selectionClear</code> gelir. Aralığın uç noktası değere uyar (yalnızca başlangıç verilirse sonraki tıklama bitişi belirler). Değer mevcut
            değere eşitse hiçbir olay yayılmaz (<code>change</code> de, <code>selectionComplete</code> de).
          </li>
          <li>
            <strong>Geçersiz</strong>: hiçbir şey değişmez. Yalnızca <code>invalidSelection</code> (<code>source: &apos;programmatic&apos;</code>) yayar ve{' '}
            <code>{'{ valid: false, issue }'}</code> döndürür.
          </li>
          <li>
            Takvim <strong>ilk</strong> <code>loading</code> durumundayken henüz hiçbir veri bilinmez; bu yüzden boş olmayan her değer bir{' '}
            <code>data-loading</code> sorunu döndürür ve seçim değişmez (<code>unknownDataPolicy: &apos;allow&apos;</code> verilmediyse). Arka planda
            yenileme sırasında ise zaten gösterilen verilere göre doğrulanır ve seçim engellenmez.
          </li>
          <li>
            Salt okunur modda <code>{"{ valid: false, issue: { code: 'custom', message: 'read-only' } }"}</code> döndürür ve hiçbir şey yaymaz.
          </li>
          <li>Takvimi o tarihe götürmez: yeni değeri göstermek için <code>goToMonth()</code>’u çağırın.</li>
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
          örneğin &quot;Giriş&quot; / &quot;Çıkış&quot; alanlarından. Başlangıç yokken <code>end</code> vermek işe yaramaz: sonraki tıklama yine yeni bir
          aralık başlatır. Diğer modlarda veya uç nokta zaten verilen değerse hiçbir şey yapmaz.
        </p>
        <p>
          uncontrolled (uç noktayı takvim tutar): <code>activeEndpointChange</code> (<code>source: &apos;programmatic&apos;</code>) render’dan sonra bildirilir.
          Controlled <code>activeEndpoint</code> (uç noktayı siz tutarsınız): çağrı yalnızca isteği yayar; uygulamak için prop’u güncelleyin. Uncontrolled
          bir uç nokta, sonraki seçim değişikliğinde yine değere göre belirlenir (örneğin aralık tamamlanınca <code>start</code>’a döner).
        </p>
      </Section>

      <Section title="focusDate()">
        <p>
          <code>focusDate(date: CalendarDate): void</code>. Klavye (DOM) odağını verilen güne (<code>minDate</code>/<code>maxDate</code> içine çekilmiş haliyle) taşır ve
          günü görünür alana kaydırır. O gün zaten odaktaysa da yeniden odaklar. Odaklanan gün değişirse <code>source: &apos;programmatic&apos;</code> ile{' '}
          <code>dayFocusChange</code> yayar.
        </p>
        <p>
          Gün render edilmemişse takvim önce o güne gider: sayfalı mod pencereyi taşır (<code>source: &apos;programmatic&apos;</code> ve{' '}
          <code>reason: &apos;keyboard&apos;</code> ile <code>visibleMonthChange</code>); sürekli mod, ay listenin bir ucuna en fazla <code>monthsPerLoad</code> ay uzaktaysa listeyi
          genişletir (trigger <code>keyboard</code>, source <code>programmatic</code> ile <code>onLoadMore</code>), değilse listeyi o ayın etrafında yeniden
          kurar. Kullanıcı bu arada odağı başka yere taşımadıysa, gün render edilince odak oraya geçer. Hiçbir tarih seçmez.
        </p>
      </Section>

      <Section title="getSnapshot()">
        <p>
          <code>getSnapshot(): CalendarSnapshot</code>. Mevcut durumun düz bir kopyasını döndürür; çağırmanın yan etkisi yoktur. Değerler son render’a aittir: aynı işleyicide bir eylemin hemen ardından
          (örneğin <code>select()</code> sonra <code>getSnapshot()</code>) hâlâ eylemden önceki durumu görürsünüz. Durumu daha sonra okuyun ya da eylemin
          dönüş değerini ve olaylarını kullanın.
        </p>
        <Payload
          caption="CalendarSnapshot"
          rows={[
            ['selection', 'Selection', <><code>{'{ mode, value }'}</code>; <code>value</code>’nun tipini daraltmak için <code>mode</code>’a bakın.</>],
            ['activeEndpoint', "'start' | 'end'", <>Sonraki tıklamanın belirleyeceği uç (aralık modu dışında her zaman <code>start</code>).</>],
            ['phase', 'SelectionPhase', "'empty', 'start-selected' veya 'complete'."],
            ['validation', 'ValidationResult', 'Mevcut değerin doğrulaması.'],
            ['referenceMonth', 'CalendarMonth | null', 'monthPosition konumundaki ay; today bilinene kadar null (today olmadan sunucu render’ı).'],
            ['visibleMonths', 'readonly CalendarMonth[]', 'Ekrandaki aylar (bkz. onVisibleMonthsChange).'],
            ['renderedMonths', 'readonly CalendarMonth[]', 'DOM’daki aylar (bkz. onRenderedMonthsChange).'],
            ['layout', 'CalendarLayout', <>Etkin yerleşim; <code>containerWidth</code> en son ölçülen genişliktir.</>],
            ['focusedDate', 'CalendarDate | null', 'Son odaklanan gün; odak takvimden çıktıktan sonra da korunur; hiç odaklanılmadıysa null.'],
            ['today', 'CalendarDate | null', <><code>today</code> prop’u veya hesaplanan tarih; prop olmadan sunucuda null.</>],
          ]}
        />
      </Section>
    </Page>
  );
}
