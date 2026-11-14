import dates from '../../../snippets/concepts/dates.tr.ts?code';
import { Example, Snippet } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function CoreConcepts() {
  return (
    <Page
      title="Temel Kavramlar"
      lead="Diğer tüm sayfaların üzerine kurulduğu birkaç fikir: tarih biçimi, modlar, değeri kimin tuttuğu, hangi ayların gösterildiği, slotlara ne verildiği ve aralıkların nasıl sayıldığı."
    >
      <Section title="Tarih biçimi">
        <p>
          Takvim iki tarih biçimi kullanır. <code>CalendarDate</code> tek bir gündür, örneğin <code>&quot;2026-11-13&quot;</code>.{' '}
          <code>CalendarMonth</code> bütün bir aydır, örneğin <code>&quot;2026-11&quot;</code>. İkisi de birer <strong>branded type</strong>’tır: çalışma
          zamanında sıradan dizelerdir, ancak TypeScript onları ayrı tipler olarak tanır; bu yüzden tarih ya da ay beklenen bir yere sıradan bir dizeyi
          doğrudan veremezsiniz.
        </p>
        <p>Geçersiz tarihleri iki ayrı kontrol dışarıda tutar:</p>
        <ul>
          <li>
            <strong>Tip kontrolü (derleme zamanı).</strong> TypeScript düz bir <code>string</code> değerini kod çalışmadan önce durdurur. Yalnızca tipe
            baktığı için <code>&apos;2026-02-30&apos;</code>’un gerçek bir gün olup olmadığını bilemez.
          </li>
          <li>
            <strong>Tarih kontrolü (çalışma zamanı).</strong> <code>parseDate</code>, gün varsa tarihi, yoksa <code>null</code> döndürür; sizin
            denetlemediğiniz girdiler (URL, form, JSON) için bunu kullanın. <code>toCalendarDate</code> aynı denetimi yapar ama geçersiz girdide{' '}
            <code>RangeError</code> fırlatır; kodunuza yazdığınız ve geçerli olduğunu bildiğiniz değerler için bunu kullanın.
          </li>
        </ul>
        <Snippet files={dates} label="Tarihler ve aylar" />
        <p>
          Tarihi <code>fromJSDate(date)</code> (bir JavaScript <code>Date</code> değerinin denk geldiği gün) veya{' '}
          <code>getToday(&#123; timeZone &#125;)</code> ile de elde edebilirsiniz. Aritmetik yardımcılar (<code>addDays</code>, <code>addMonths</code>,{' '}
          <code>diffDays</code>, <code>eachDay</code>, …) yalnızca takvim günüyle çalışır; yaz saati geçişleri bir tarihi kaydıramaz.
        </p>
      </Section>
      <Section title="Modlar">
        <PropsTable
          caption="mode"
          rows={[
            { name: "'single'", type: 'CalendarDate | null', description: 'Tek bir tarih.' },
            {
              name: "'range'",
              type: '{ start, end }',
              description: 'İki tıklama: önce başlangıç, sonra bitiş. Aralıklar hariç bitişli (konaklamalar) veya dahil bitişli (günler) olabilir.',
            },
            { name: "'multiple'", type: 'readonly CalendarDate[]', description: 'Birbirinden bağımsız, istediğiniz sayıda tarih (maxSelections ile sınırlayın).' },
            { name: "'readonly'", type: '—', description: 'Müsaitliği gösterir; hiçbir şey seçilemez.' },
          ]}
        />
        <p>
          Değerin tipi moda göre belirlenir; bu yüzden <code>onChange</code> da buna göre tiplenir. Canlı örnekler için{' '}
          <a href="#/selection-modes">Seçim modları</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="Uncontrolled">
        <p>
          Uncontrolled kullanımda değeri takvim tutar: bir başlangıç değeri verirsiniz (örneğin{' '}
          <code>defaultValue=&#123;addDays(today, 3)&#125;</code>), kullanıcı onu değiştirir ve takvim değişikliği kendisi saklar.{' '}
          <code>defaultValue</code> yalnızca bir kez, takvim ilk render edildiğinde okunur; sonraki değişiklikler yok sayılır (<code>value</code> kullanın ya
          da başlangıç değerine dönmek için <code>ref.reset()</code> çağırın). <code>mode</code> değişirse seçim, <code>onChange</code> çağrılmadan yeni
          modun boş değerinden başlar.
        </p>
        <Example src="concepts/Uncontrolled" title="Uncontrolled takvim" />
      </Section>
      <Section title="Controlled">
        <p>
          Controlled kullanımda değeri siz tutarsınız: <code>value</code>’yu kendi state’inizden verir, bu state’i <code>onChange</code> içinde
          güncellersiniz (örneğin <code>value=&#123;range&#125;</code> ve <code>onChange=&#123;setRange&#125;</code>). Asıl değer sizin state’inizdir:
          takvim tam olarak <code>value</code>’yu gösterir; değeri dışarıdan değiştirmek (bir düğmeyle, URL’den, başka bir takvimden){' '}
          <code>onChange</code>’i tetiklemez. Seçime bağlı başka arayüz parçaları varsa controlled kullanımı tercih edin.
        </p>
        <Example src="concepts/Controlled" title="Controlled takvim" />
      </Section>
      <Section title="Referans ay">
        <p>
          Referans ay, takvimin göstereceği ayları belirlemek için baz aldığı aydır. Şu sırayla seçilir: <code>visibleMonth</code> (controlled) veya{' '}
          <code>defaultVisibleMonth</code>; bunlar yoksa seçimin ayı; o da yoksa bugünün ayı. Bugün prop olarak verilmediğinde varsayılan ay, takvimin
          ilk öğrendiği bugüne göre sabitlenir; sonradan gece yarısı geçse de yalnızca bugün işareti yer değiştirir.
        </p>
        <p>
          Birden çok ay gösterildiğinde <code>monthPosition</code> (1’den başlar), referans ayın gösterilen aylar arasında kaçıncı sırada duracağını
          belirler. Referans ayı değiştirmez. Örneğin referans ay Kasım ve üç ay gösteriliyorsa:
        </p>
        <ul>
          <li>
            <code>monthPosition=&#123;1&#125;</code> ile Kasım, Aralık, Ocak gösterilir;
          </li>
          <li>
            <code>monthPosition=&#123;2&#125;</code> ile Ekim, Kasım, Aralık gösterilir.
          </li>
        </ul>
        <p>
          Canlı örnekler: <a href="#/month-position">Referans ayın konumu</a>.
        </p>
      </Section>
      <Section title="Seçim aşaması">
        <p>
          <code>getSelectionPhase(selection)</code> (slotlarda <code>ctx.phase</code> olarak da bulunur) <code>empty</code>, <code>start-selected</code>{' '}
          (bitişi seçilmeyi bekleyen bir aralık) veya <code>complete</code> değerini alır. Aralık modunda <code>activeEndpoint</code>, bir sonraki tıklamanın
          aralığın hangi ucunu ayarlayacağını gösterir; bu değeri siz de yönetebilir ve birden çok takvim arasında paylaşabilirsiniz.
        </p>
      </Section>
      <Section title="Slot bağlamı">
        <p>
          <code>renderHeader</code> ve <code>renderFooter</code> gibi slotlar, takvimin o anki durumunu <code>ctx</code> olarak alır (tipi{' '}
          <code>SlotContext</code>). En çok kullanılan alanlar: <code>ctx.selection</code> (değer ve onun <code>mode</code>’u), <code>ctx.phase</code>,{' '}
          <code>ctx.validation</code>, <code>ctx.visibleMonths</code>, <code>ctx.today</code>, <code>ctx.formatDate</code> (takvimin yerel ayarıyla
          biçimlendirir) ve takvimin controller’ı olan <code>ctx.actions</code> (<code>clear()</code>, <code>goToMonth(month)</code>,{' '}
          <code>select(value)</code>, …). Böylece bir slot, uygulamanızda hiç state tutmadan seçimi gösterebilir ve değiştirebilir.
        </p>
        <Example src="concepts/SlotContext" title="ctx ile oluşturulan alt bilgi" />
        <p>Diğer callback’ler slot bağlamı değil, farklı nesneler alır:</p>
        <ul>
          <li>
            <code>getDayAvailability</code> ve <code>validateSelection</code> gibi kural callback’leri ikinci argüman olarak bir <code>RuleContext</code>{' '}
            alır: <code>mode</code>, <code>selection</code>, <code>activeEndpoint</code>, <code>today</code> ve <code>context</code> (sizin{' '}
            <code>ruleContext</code> prop’unuz).
          </li>
          <li>
            <code>renderDayContent</code> ve <code>getDayTooltip</code> tek bir gün için <code>&#123; day, data &#125;</code> alır;{' '}
            <code>renderDay</code> aynı nesneye ek olarak <code>getDayProps</code> ve <code>defaultContent</code> alır.
          </li>
          <li>
            <code>onChange</code> gibi olay callback’leri olay nesneleri alır (bkz. <a href="#/api-events">Callback’ler ve olaylar</a>).
          </li>
        </ul>
      </Section>
      <Section title="Hariç ve dahil bitişli aralıklar">
        <p>
          Bir aralık yalnızca iki tarih saklar; bu tarihlerin ne anlama geldiğine <code>rangeSemantics</code> karar verir. Bunu adaptörler sizin için ayarlar:{' '}
          <code>stayRules</code> <strong>hariç</strong> bitişlidir (bitiş, çıkış günüdür ve sayılmaz: 13 → 16 Kasım 3 gecedir),{' '}
          <code>dayRangeRules</code> <strong>dahil</strong> bitişlidir (her gün sayılır: 13 → 16 Kasım 4 gündür). <code>countNights</code> ve{' '}
          <code>countDays</code> ile sayın; sayılan günleri <code>getIncludedDays(range, semantics)</code> ile listeleyin.
        </p>
        <Example src="concepts/RangeSemantics" title="Geceler ve günler" />
      </Section>
      <Section title="Aynı gün aralıkları">
        <p>
          Dahil bitişli aralıklarda başlangıç ve bitiş varsayılan olarak aynı gün olabilir (<code>start === end</code>; tek günlük bilet gibi). Hariç
          bitişli aralıklarda olamaz, çünkü böyle bir konaklama 0 gecedir; günübirlik kullanım için <code>allowSameDay</code> ile açın.
        </p>
        <Note>
          <p>
            Hariç bitişli aynı gün aralığının uzunluğu 0’dır; bu yüzden <code>allowSameDay</code>, en az 1 gecelik bir sınırla birlikte işe yaramaz:{' '}
            <code>minNights: 1</code> varsa günübirlik seçim yine reddedilir.
          </p>
        </Note>
        <Example src="concepts/SameDay" title="Günübirlik kullanım" />
      </Section>
    </Page>
  );
}
