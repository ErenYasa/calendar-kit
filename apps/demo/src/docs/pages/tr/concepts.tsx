import { Example } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function CoreConcepts() {
  return (
    <Page
      title="Temel Kavramlar"
      lead="Diğer tüm sayfaların üzerine kurulduğu birkaç fikir: tarih biçimi, modlar, değerin kime ait olduğu, takvimin nereden başladığı ve aralıkların nasıl sayıldığı."
    >
      <Section title="Tarih biçimi">
        <p>
          <code>CalendarDate</code> markalı (branded) bir <code>&quot;YYYY-MM-DD&quot;</code> dizesi, <code>CalendarMonth</code> ise bir{' '}
          <code>&quot;YYYY-MM&quot;</code> dizesidir. Bunları <code>toCalendarDate(&apos;2026-11-13&apos;)</code> (geçersiz girdide hata fırlatır),{' '}
          <code>parseDate</code> (<code>null</code> döndürür), <code>fromJSDate(date)</code> veya <code>getToday(&#123; timeZone &#125;)</code> ile
          oluşturun. Düz dizeler tipler tarafından reddedilir; böylece geçersiz tarihler araya sızamaz. Aritmetik yardımcılar (<code>addDays</code>,{' '}
          <code>addMonths</code>, <code>diffDays</code>, <code>eachDay</code>, …) yalnızca takvim günü üzerinde çalışır; yaz saati geçişleri bir tarihi
          kaydıramaz.
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
            { name: "'multiple'", type: 'readonly CalendarDate[]', description: 'Birbirinden bağımsız istenen sayıda tarih (maxSelections ile sınırlayın).' },
            { name: "'readonly'", type: '—', description: 'Müsaitliği gösterir; hiçbir şey seçilemez.' },
          ]}
        />
        <p>
          Değerin tipi moda göre belirlenir; bu yüzden <code>onChange</code> da buna göre tiplenir. Canlı örnekler için{' '}
          <a href="#/selection-modes">Seçim modları</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="Kontrolsüz">
        <p>
          <code>defaultValue</code> verin ve seçimi takvimin tutmasına izin verin. <code>defaultValue</code> yalnızca bir kez, mount sırasında okunur; sonraki
          değişiklikler yok sayılır (<code>value</code> kullanın ya da ona dönmek için <code>ref.reset()</code> çağırın). <code>mode</code> değişince seçim,{' '}
          <code>onChange</code> çağrılmadan yeni modun boş değerinden başlar.
        </p>
        <Example src="concepts/Uncontrolled" title="Kontrolsüz takvim" />
      </Section>
      <Section title="Kontrollü">
        <p>
          <code>value</code> ve <code>onChange</code> verin. Takvim tam olarak <code>value</code>’yu gösterir; değeri dışarıdan ayarlamak (bir düğme, bir URL,
          başka bir takvim) <code>onChange</code>’i hiçbir zaman geri çağırmaz. Seçime bağlı başka bir arayüz olduğunda kontrollü modu kullanın.
        </p>
        <Example src="concepts/Controlled" title="Kontrollü takvim" />
      </Section>
      <Section title="Başlangıç ayı">
        <p>
          İlk olarak neyin gösterileceğine <strong>referans ay</strong> karar verir: <code>visibleMonth</code> (kontrollü) veya{' '}
          <code>defaultVisibleMonth</code>; bunlar yoksa seçimin ayı, o da yoksa bugünün ayı. Bugün verilmediğinde varsayılan ay, bilinen ilk bugüne göre
          sabitlenir; sonradan gelen bir gece yarısı yalnızca bugün işaretini taşır. Birden çok ay varsa <code>monthPosition</code> referans ayı pencere içinde
          konumlandırır (<a href="#/month-position">Referans ayın konumu</a>).
        </p>
      </Section>
      <Section title="Seçim aşaması">
        <p>
          <code>getSelectionPhase(selection)</code> (slotlarda <code>ctx.phase</code> olarak da bulunur) <code>empty</code>, <code>start-selected</code>{' '}
          (bitişini bekleyen bir aralık) veya <code>complete</code> değerini alır. Aralık modunda <code>activeEndpoint</code>, sonraki tıklamanın hangi ucu
          ayarlayacağını söyler; kontrol edilebilir ve takvimler arasında paylaşılabilir.
        </p>
      </Section>
      <Section title="Hariç ve dahil bitişli aralıklar">
        <p>
          Bir aralık yalnızca iki tarih saklar; bunların ne anlama geldiğine <code>rangeSemantics</code> karar verir. Bunu adaptörler sizin için ayarlar:{' '}
          <code>stayRules</code> <strong>hariç</strong> bitişlidir (bitiş, çıkış günüdür ve dahil edilmez: 13 → 16 Kasım 3 gecedir),{' '}
          <code>dayRangeRules</code> <strong>dahil</strong> bitişlidir (her gün sayılır: 13 → 16 Kasım 4 gündür). <code>countNights</code> ve{' '}
          <code>countDays</code> ile sayın; sayılan günleri <code>getIncludedDays(range, semantics)</code> ile listeleyin.
        </p>
        <Example src="concepts/RangeSemantics" title="Geceler ve günler" />
      </Section>
      <Section title="Aynı gün aralıkları">
        <p>
          Dahil bitişli aralıklar varsayılan olarak <code>start === end</code>’e izin verir (tek günlük bilet). Hariç bitişli aralıklar izin vermez, çünkü
          böyle bir konaklama 0 gecedir; günübirlik kullanım için <code>allowSameDay</code> ile açın.
        </p>
        <Note>
          <p>
            Hariç bitişli aynı gün aralığının uzunluğu 0’dır; bu yüzden <code>allowSameDay</code>, 1 veya daha fazla gecelik bir minimumla birlikte
            kullanılamaz: <code>minNights: 1</code> ile günübirlik kullanım yine reddedilir.
          </p>
        </Note>
        <Example src="concepts/SameDay" title="Günübirlik kullanım" />
      </Section>
    </Page>
  );
}
