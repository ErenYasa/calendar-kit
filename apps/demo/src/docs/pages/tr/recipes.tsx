import { Example } from '../../Code';
import { Page, Section } from '../../ui';

export function HomeRental() {
  return (
    <Page
      title="Ev kiralama"
      lead="Minimum konaklama süresi, canlı müsaitlik, fiyatlar, çıkış saati ve “özel tarihler” içeren gecelik konaklamalar. Rezervasyon uygulama durumunda tutulur; takvim yalnızca tarihleri seçer."
    >
      <Section title="Parçalar nasıl birleşiyor">
        <ul>
          <li>
            <code>stayRules</code> hariç bitişli aralıklar (geceler), 2 gecelik minimum ve yüklenen verideki dolu günleri sağlar.
          </li>
          <li>
            Çıkış saati uygulama durumudur ve kurala <code>ruleContext</code> üzerinden ulaşır: çıkış 18:00 olduğunda, sonraki misafirin geldiği gün çıkış günü
            olamaz.
          </li>
          <li>
            “Özel tarihler” <code>relaxSchedule</code>’ı açar: minimum konaklama yok sayılır, rezervasyonlar yok sayılmaz.
          </li>
          <li>Fiyatlar gün etiketleridir; toplamı uygulama hesaplar ve Temizle ile Rezervasyon yap düğmeleriyle birlikte footer slotunda gösterir.</li>
        </ul>
        <Example src="recipes/HomeRental" title="Ev kiralama" />
      </Section>
    </Page>
  );
}

export function BoatRental() {
  return (
    <Page title="Tekne kiralama" lead="Cumartesiden cumartesiye haftalık kiralamalar; bakım günleri ve özel talepler için bir istisna seçeneğiyle.">
      <Section title="Cumartesiden cumartesiye">
        <p>
          Giriş ve çıkış hafta günleri ile 7–14 gecelik süre, takvim (schedule) kurallarıdır. “Özel tarihler” bunları gevşetir; kapalı bakım günleri ise gerçek
          bir müsait olmama durumu olduğu için yine geçerlidir.
        </p>
        <Example src="recipes/BoatRental" title="Tekne kiralama" />
      </Section>
    </Page>
  );
}

export function EventTickets() {
  return (
    <Page title="Etkinlik biletleri" lead="Yalnızca bazı hafta günlerinde yapılan bir etkinlik için günlük biletler ve çok günlük kartlar.">
      <Section title="Günlük bilet veya kart">
        <p>
          <code>dayRangeRules</code> günleri dahil olarak sayar. <code>singleDayFirst</code> ile ilk tıklama tek bir günü hemen seçer, sonraki tıklama bunu çok
          günlük bir karta genişletir. <code>availableWeekdays</code> diğer hafta günlerini kapatır; biletleri tükenen günler <code>getDayStatus</code> ile
          kapatılır. Bilet sayısı ve fiyat uygulama durumudur.
        </p>
        <Example src="recipes/EventTickets" title="Etkinlik biletleri" />
      </Section>
    </Page>
  );
}

export function ThreeCalendars() {
  return (
    <Page title="Üç senkron takvim" lead="Tek bir rezervasyonun üç görünümü: kompakt, liste ve genel bakış; üçü de aynı aralığı düzenler.">
      <Section title="Tek durum, üç takvim">
        <p>
          Her takvim aynı <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code> ve <code>onActiveEndpointChange</code> değerlerini alır. Birinde
          seçilen başlangıç diğerinde tamamlanabilir. Görünen aylar, odak ve araç ipuçları her takvimde ayrıdır.
        </p>
        <Example src="recipes/ThreeCalendars" title="Üç senkron takvim" />
      </Section>
    </Page>
  );
}
