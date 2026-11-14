import { Example } from '../../Code';
import { Page, Section } from '../../ui';

export function HomeRental() {
  return (
    <Page
      title="Ev kiralama"
      lead="Minimum konaklama süresi, canlı müsaitlik, fiyatlar, çıkış saati ve “özel tarihler” seçeneğiyle gecelik konaklama. Rezervasyonu uygulamanın state’i tutar; takvim yalnızca tarihleri seçer."
    >
      <Section title="Parçalar nasıl birleşiyor">
        <ul>
          <li>
            <code>stayRules</code> şunları sağlar: hariç bitişli aralıklar (geceler sayılır), en az 2 gece ve yüklenen veriden gelen dolu günler.
          </li>
          <li>
            Çıkış saatini uygulama tutar ve bu değer kurala <code>ruleContext</code> üzerinden ulaşır: çıkış saati 18:00 seçiliyse, bir sonraki misafirin geldiği
            gün çıkış günü olarak seçilemez.
          </li>
          <li>
            “Özel tarihler” <code>relaxSchedule</code>’ı açar: minimum konaklama süresi aranmaz, ama dolu günler yine seçilemez.
          </li>
          <li>Fiyatlar gün etiketi olarak görünür; toplamı uygulama hesaplar ve Temizle ile Rezervasyon yap düğmeleriyle birlikte footer slotunda gösterir.</li>
        </ul>
        <Example src="recipes/HomeRental" title="Ev kiralama" />
      </Section>
    </Page>
  );
}

export function BoatRental() {
  return (
    <Page title="Tekne kiralama" lead="Cumartesiden cumartesiye haftalık kiralama; bakım günleri ve özel talepler için bir istisna seçeneği var.">
      <Section title="Cumartesiden cumartesiye">
        <p>
          Giriş ve çıkış hafta günleri ile 7–14 gecelik süre, takvim düzeni (schedule) kurallarıdır. “Özel tarihler” bu kuralları kaldırır; bakım günleri ise
          tekne gerçekten müsait olmadığı için yine seçilemez.
        </p>
        <Example src="recipes/BoatRental" title="Tekne kiralama" />
      </Section>
    </Page>
  );
}

export function EventTickets() {
  return (
    <Page title="Etkinlik biletleri" lead="Yalnızca belirli hafta günlerinde yapılan bir etkinlik için günlük bilet ve çok günlük kart.">
      <Section title="Günlük bilet veya kart">
        <p>
          <code>dayRangeRules</code> günleri bitiş dahil sayar. <code>singleDayFirst</code> ile ilk tıklama tek bir günü hemen seçer, sonraki tıklama seçimi çok
          günlük bir karta genişletir. <code>availableWeekdays</code> diğer hafta günlerini kapatır; biletleri tükenen günler <code>getDayStatus</code> ile
          kapatılır. Bilet sayısını ve fiyatı uygulama tutar.
        </p>
        <Example src="recipes/EventTickets" title="Etkinlik biletleri" />
      </Section>
    </Page>
  );
}

export function ThreeCalendars() {
  return (
    <Page title="Üç senkron takvim" lead="Tek bir rezervasyonun üç görünümü: kompakt, liste ve genel bakış; üçü de aynı aralığı değiştirir.">
      <Section title="Tek durum, üç takvim">
        <p>
          Her takvime aynı <code>value</code>, <code>onChange</code>, <code>activeEndpoint</code> ve <code>onActiveEndpointChange</code> verilir. Birinde
          başlangıcı seçip bitişi bir diğerinde seçebilirsiniz. Görünen aylar, odak ve tooltip’ler her takvimde ayrıdır.
        </p>
        <Example src="recipes/ThreeCalendars" title="Üç senkron takvim" />
      </Section>
    </Page>
  );
}
