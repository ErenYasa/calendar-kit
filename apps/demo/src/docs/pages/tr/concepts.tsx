import dates from '../../../snippets/concepts/dates.tr.ts?code';
import { Example, Snippet } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function CoreConcepts() {
  return (
    <Page
      title="Temel kavramlar"
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
              description: 'İki tıklamayla seçilen bir başlangıç ve bir bitiş tarihi. Bitiş gününün sayılıp sayılmadığı (günler veya geceler) aşağıda anlatılıyor.',
            },
            { name: "'multiple'", type: 'readonly CalendarDate[]', description: 'Birbirinden bağımsız, istediğiniz sayıda tarih; her tıklama bir tarih ekler veya çıkarır (sayıyı maxSelections ile sınırlayın).' },
            { name: "'readonly'", type: '—', description: 'Yalnızca ayları ve müsaitliği gösterir; bir güne tıklamak hiçbir şey seçmez.' },
          ]}
        />
        <p>
          Değerin tipi moda göre belirlenir: <code>mode=&quot;range&quot;</code> ile <code>onChange</code> bir <code>&#123; start, end &#125;</code> nesnesi
          alır ve tek bir tarih verirseniz TypeScript hata gösterir. Canlı örnekler için <a href="#/selection-modes">Seçim modları</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="Uncontrolled">
        <p>
          Uncontrolled kullanımda seçili değeri takvimin kendisi tutar. İsterseniz bir başlangıç değeri verirsiniz (örneğin{' '}
          <code>defaultValue=&#123;addDays(today, 3)&#125;</code>); kullanıcı başka bir gün seçtiğinde takvim onu saklar ve bileşeninizin state tutması
          gerekmez. <code>onChange</code> yine çağrılır, böylece seçime tepki verebilirsiniz. Sayfada seçime ihtiyaç duyan başka bir şey yoksa bu yolu
          kullanın.
        </p>
        <ul>
          <li>
            <code>defaultValue</code> yalnızca bir kez, takvim ilk render edildiğinde okunur; sonradan değiştirmenin etkisi olmaz. Seçimi dışarıdan değiştirmek
            için <code>value</code> kullanın (controlled, aşağıda) ya da <code>defaultValue</code>’ya dönmek için <code>ref.reset()</code> çağırın. ref,
            React’in <code>ref</code> prop’u aracılığıyla verdiği nesnedir; takvimde <code>reset()</code> ve <code>clear()</code> gibi metotları içerir.
          </li>
          <li>
            <code>mode</code> değişirse seçim yeni modda boş başlar ve <code>onChange</code> çağrılmaz.
          </li>
        </ul>
        <p>Örnekte başlangıçta bugünden üç gün sonrası seçilidir. Başka bir gün seçin: bileşende hiç state olmadan takvim seçimi saklar.
        </p>
        <Example src="concepts/Uncontrolled" title="Uncontrolled takvim" />
      </Section>
      <Section title="Controlled">
        <p>
          Controlled kullanımda değeri bileşeniniz tutar: <code>value</code>’yu kendi state’inizden verir, bu state’i <code>onChange</code> içinde
          güncellersiniz (örneğin <code>value=&#123;range&#125;</code> ve <code>onChange=&#123;setRange&#125;</code>). Takvim her zaman tam olarak{' '}
          <code>value</code>’yu gösterir. State’i siz değiştirdiğinizde (bir düğmeyle, URL’den veya başka bir takvimden) takvim ona uyar ve{' '}
          <code>onChange</code>’i çağırmaz. Sayfanın başka parçaları seçimi gösteriyor veya değiştiriyorsa (fiyat, özet gibi) controlled kullanımı tercih
          edin.
        </p>
        <p>
          Örnekte takvimin altındaki metin ve iki düğme aynı state’i kullanır: “Bugün + 7’yi seç” ve “Temizle” takvime dokunmadan seçimi değiştirir.
        </p>
        <Example src="concepts/Controlled" title="Controlled takvim" />
      </Section>
      <Section title="Referans ay">
        <p>
          Referans ay, takvimin göstereceği ayları belirlemek için baz aldığı aydır: gösterilen aylar ondan itibaren sayılır, önceki/sonraki okları onu
          kaydırır. Takvim ilk render edildiğinde şu sırayla belirlenir: <code>visibleMonth</code> (controlled) veya <code>defaultVisibleMonth</code>; bunlar yoksa ilk seçimin ayı; o da yoksa içinde
          bulunulan ay. <code>today</code> vermezseniz takvim, tarihi ilk okuduğunda bulduğu ayı korur; sonradan gece yarısı geçtiğinde yalnızca bugün
          işareti yer değiştirir, gösterilen aylar aynı kalır.
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
          Seçim aşaması kullanıcının ne kadar ilerlediğini söyler; örneğin ilk tıklamadan sonra “Bir bitiş tarihi seçin” göstermek için. Değeri{' '}
          <code>empty</code> (hiçbir şey seçili değil), <code>start-selected</code> (aralığın başlangıcı seçildi, bitiş bekleniyor) veya{' '}
          <code>complete</code> (bir tarih seçili, aralığın iki ucu da seçili ya da çoklu modda en az bir tarih var) olur. Bunu{' '}
          <code>getSelectionPhase(selection)</code> ile alırsınız; bir slotun içinde ise doğrudan <code>ctx.phase</code> olarak hazırdır (bir sonraki
          bölüme bakın).
        </p>
        <p>
          Aralık modunda <code>activeEndpoint</code> (<code>&apos;start&apos;</code> veya <code>&apos;end&apos;</code>), bir sonraki tıklamanın aralığın
          hangi ucunu ayarlayacağını söyler. Bunu <code>value</code> gibi siz yönetebilir ve takvimler arasında paylaşabilirsiniz; böylece bir takvimde
          başlayan aralık başka bir takvimde tamamlanabilir (<a href="#/recipe-three-calendars">Üç senkron takvim</a>).
        </p>
      </Section>
      <Section title="Slot bağlamı">
        <p>
          Slot, takvimin bir alanını render eden fonksiyon tipinde bir prop’tur; örneğin <code>renderHeader</code> (ayların üstü) veya{' '}
          <code>renderFooter</code> (ayların altı). Her slot, genellikle <code>ctx</code> diye adlandırılan slot bağlamını alır (tipi{' '}
          <code>SlotContext</code>): takvimin o anki durumu ve eylemleri. Hangi argüman olduğu slota göre değişir: <code>renderHeader(ctx)</code> ve{' '}
          <code>renderFooter(ctx)</code> onu tek argüman olarak alır; <code>renderNavigation</code>, <code>renderMonthHeader</code>,{' '}
          <code>renderLoading</code>, <code>renderError</code> ve <code>renderLoadMore</code> önce kendi prop’larını, ikinci argüman olarak da{' '}
          <code>ctx</code>’i alır; örneğin <code>renderNavigation(props, ctx)</code>. En çok kullanılan alanlar:
        </p>
        <ul>
          <li>
            <code>ctx.selection</code>: değer ve onun <code>mode</code>’u; <code>ctx.phase</code>: yukarıdaki seçim aşaması; <code>ctx.validation</code>:
            seçimin geçerli olup olmadığı ve değilse nedeni.
          </li>
          <li>
            <code>ctx.visibleMonths</code>: ekrandaki aylar; <code>ctx.today</code>: bugünün tarihi; <code>ctx.formatDate</code>: bir tarihi takvimin yerel
            ayarıyla biçimlendirir.
          </li>
          <li>
            <code>ctx.actions</code>: takvimin controller’ı, ref’iyle aynı metotlar (<code>clear()</code>, <code>goToMonth(month)</code>,{' '}
            <code>select(value)</code>, …).
          </li>
        </ul>
        <p>
          Böylece bir slot, uygulamanızda hiç state tutmadan seçimi gösterebilir ve değiştirebilir. Örnekteki takvim uncontrolled’dır; alt bilgideki metin
          her tıklamayı <code>ctx.phase</code> ile izler, Bugün ve Temizle düğmeleri <code>ctx.actions</code>’ı çağırır.
        </p>
        <Example src="concepts/SlotContext" title="Slot bağlamını okuyan alt bilgi" />
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
          Bir aralık yalnızca iki tarih saklar; bitiş gününün sayılıp sayılmadığına <code>rangeSemantics</code> karar verir. Bunu genellikle kendiniz
          ayarlamazsınız, adaptörler ayarlar: <code>stayRules</code> <strong>hariç</strong> bitişlidir (bitiş, çıkış günüdür ve sayılmaz: 13 → 16 Kasım 3
          gecedir), <code>dayRangeRules</code> <strong>dahil</strong> bitişlidir (her gün sayılır: 13 → 16 Kasım 4 gündür). Kural verilmezse aralık dahil
          bitişlidir. <code>countNights</code> ve <code>countDays</code> ile sayın; sayılan günleri, örneğin gecelik fiyatları toplamak için,{' '}
          <code>getIncludedDays(range, semantics)</code> ile listeleyin.
        </p>
        <p>Örnekte iki takvimde de aynı başlangıç ve bitişi seçip altlarındaki sayıları karşılaştırın.
        </p>
        <Example src="concepts/RangeSemantics" title="Geceler ve günler" />
      </Section>
      <Section title="Aynı gün aralıkları">
        <p>
          Dahil bitişli bir aralık varsayılan olarak aynı gün başlayıp bitebilir (<code>start === end</code>): tek günlük bilet gibi. Hariç bitişli bir
          aralık bitemez, çünkü böyle bir konaklama 0 gecedir; başlangıç gününe yeniden tıklamak seçimi temizler. Günübirlik kullanıma (aynı gün gelip
          gitme, örneğin bir otelde gündüz odası) izin vermek için <code>allowSameDay</code> verin.
        </p>
        <Note>
          <p>
            Hariç bitişli aynı gün aralığı 0 gecedir; bu yüzden en kısa konaklama sınırı onu yine reddeder: <code>allowSameDay</code> ve{' '}
            <code>minNights: 1</code> birlikteyse günübirlik kullanım mümkün olmaz. Günübirlik kullanıma izin verdiğinizde en kısa süreyi boş bırakın.
          </p>
        </Note>
        <Example src="concepts/SameDay" title="Günübirlik kullanım" />
      </Section>
    </Page>
  );
}
