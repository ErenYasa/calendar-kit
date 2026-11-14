import { Example } from '../../Code';
import { Page, Section } from '../../ui';

export function HomeRental() {
  return (
    <Page
      title="Ev kiralama"
      lead="Gecelik kiralanan bir tatil evi: en az 2 gece, ay ay yüklenen müsaitlik, her müsait günde fiyat, çıkış saati seçimi ve “Özel tarihler” anahtarı. Takvim yalnızca tarihleri seçer; rezervasyonun kendisi uygulamanızın state’inde durur."
    >
      <Section title="Parçalar nasıl birlikte çalışır?">
        <ul>
          <li>
            <code>stayRules</code> bitiş tarihini çıkış günü yapar; bu yüzden alt bilgi geceleri sayar. <code>minNights: 2</code> 1 gecelik konaklamaları
            reddeder, <code>getDayStatus</code> dolu geceleri kapatır. Bir rezervasyonun ilk günü yine de çıkış günü olabilir: siz sabah çıkarsınız, sonraki
            misafir daha sonra gelir.
          </li>
          <li>
            Müsaitlik simüle edilmiş bir API’den gelir. <code>onRenderedMonthsChange</code> uygulamaya hangi ayları yükleyeceğini söyler;{' '}
            <code>getDataStatus</code> ise bir ay yüklenirken (yaklaşık bir saniye) o ayın günlerini seçilemez tutar.
          </li>
          <li>
            Çıkış saati (11:00 veya 18:00) uygulamanın state’idir. <code>ruleContext=&#123;booking&#125;</code> bu değeri kurallara iletir; kural onu{' '}
            <code>ctx.context</code> olarak okur (bir kuralın ikinci argümanı kural bağlamıdır: seçim, bugün ve sizin <code>ruleContext</code>’iniz). 18:00
            seçiliyken sonraki misafirin geldiği gün artık çıkış günü olamaz: iki saat arasında geçiş yapıp bu günlere bakın.
          </li>
          <li>
            “Özel tarihler” <code>relaxSchedule</code>’ı açar: 2 gecelik minimum gibi takvim düzeni (schedule) kuralları kapanır, böylece 1 gecelik
            konaklama seçilebilir; dolu günler kapalı kalır.
          </li>
          <li>
            Fiyatlar <code>getDayData</code>’dan gelen gün etiketleridir. Uygulama seçilen gecelerin fiyatlarını toplar ve toplamı Temizle ile Rezervasyon
            yap düğmelerinin yanında, <code>renderFooter</code> içinde gösterir. Rezervasyon yap düğmesi yalnızca tamamlanmış ve geçerli bir aralıkta etkindir.
          </li>
        </ul>
        <Example src="recipes/HomeRental" title="Ev kiralama" />
      </Section>
    </Page>
  );
}

export function BoatRental() {
  return (
    <Page title="Tekne kiralama" lead="Cumartesiden cumartesiye haftalık kiralama; bakım günleri ve özel talepler için bir anahtar var.">
      <Section title="Cumartesiden cumartesiye">
        <p>
          Kiralama cumartesi başlar ve cumartesi biter (<code>checkInWeekdays</code> ve <code>checkOutWeekdays</code>), 7 ila 14 gece sürer (
          <code>minNights</code>, <code>maxNights</code>); bu yüzden yalnızca bir veya iki hafta seçilebilir. Bunlar takvim düzeni (schedule) kurallarıdır:
          işletmenin olağan çalışma biçimini anlatır. “Özel tarihler” <code>relaxSchedule</code>’ı açar ve özel bir talep için bu kuralları kapatır; o zaman
          herhangi bir başlangıç ve bitiş günü seçilebilir. Bakım günleri (her ayın 3’ü ve 4’ü) kapalı kalır, çünkü tekne o günlerde gerçekten müsait değildir.
        </p>
        <Example src="recipes/BoatRental" title="Tekne kiralama" />
      </Section>
    </Page>
  );
}

export function EventTickets() {
  return (
    <Page title="Etkinlik biletleri" lead="Perşembeden pazara süren bir festival için günlük bilet ve çok günlük kart.">
      <Section title="Günlük bilet veya kart">
        <p>
          <code>dayRangeRules</code> günleri bitiş dahil sayar: seçilen son gün de karta dahildir. <code>singleDayFirst</code> ile ilk tıklama tek bir günü
          hemen seçer (günlük bilet); daha sonraki bir güne tıklamak seçimi en fazla 4 günlük bir karta genişletir, tek seçili güne yeniden tıklamak ise
          seçimi temizler. <code>availableWeekdays</code> pazartesiden çarşambaya kadar olan günleri kapatır. Biletleri tükenen günler{' '}
          <code>getDayStatus</code> ile kapatılır; 10’dan az bileti kalan günlerde kalan sayı etiket olarak görünür. Bilet sayısını ve fiyatı uygulama tutar
          ve alt bilgide gösterir.
        </p>
        <Example src="recipes/EventTickets" title="Etkinlik biletleri" />
      </Section>
    </Page>
  );
}

export function ThreeCalendars() {
  return (
    <Page title="Üç senkron takvim" lead="Tek bir rezervasyonun üç görünümü: kompakt bir ay, kayan bir liste ve iki aylık genel bakış. Üçü de aynı aralığı değiştirebilir.">
      <Section title="Tek state, üç takvim">
        <p>
          Üç takvime de aynı <code>value</code> ve <code>onChange</code> ile aynı <code>activeEndpoint</code> (bir sonraki tıklamanın hangi ucu ayarlayacağı)
          ve <code>onActiveEndpointChange</code> verilir. Bir takvimde başlangıcı, başka bir takvimde bitişi seçin: aralık üçünde de görünür. Görünüm ise her
          takvimde ayrıdır: her birinin kendi görünen ayları, odaklanan günü ve tooltip’i vardır.
        </p>
        <Example src="recipes/ThreeCalendars" title="Üç senkron takvim" />
      </Section>
    </Page>
  );
}
