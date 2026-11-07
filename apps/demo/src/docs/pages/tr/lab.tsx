import { Example } from '../../Code';
import { DataTable, Note, Page, Section } from '../../ui';

const c = (s: string) => <code>{s}</code>;

export function LayoutLab() {
  return (
    <Page
      title="Yerleşim, olaylar ve ölçüm"
      lead={
        <>
          Boyutunu değiştirip yeniden yapılandırabileceğiniz tek bir takvim; bunu yaparken hangi olayları yaydığını ve React’in onu render etmeye ne kadar
          süre harcadığını izlersiniz. Yerleşimin kapsayıcısına ve prop’lara nasıl tepki verdiğini, bir etkileşimde hangi olayların tetiklendiğini ve bir
          render’ın kabaca ne kadar sürdüğünü görmek için kullanın.
        </>
      }
    >
      <Section title="Laboratuvar">
        <p>
          Takvim, alt köşesini sürükleyerek daraltabileceğiniz bir kutunun içindedir. Yerleşim pencereyi değil bu kutuyu izler; böylece masaüstü ekranda
          telefon genişliğini deneyebilirsiniz. Kutu, örnek alanının tam genişliğiyle başlar. Takvimin altında React Profiler ölçümleri ve {c('onEvent')} akışı, yer
          varsa yan yana, dar ekranlarda alt alta durur.
        </p>
        <Example src="lab/LayoutLab" title="Yerleşim, olaylar ve ölçüm" />
        <Note>
          Bu sayfa bir tanılama aracıdır, kopyalanacak bir kalıp değil. Bu dokümantasyondaki diğer örneklerin her biri tek bir özelliği en az kodla gösterir.
        </Note>
      </Section>

      <Section title="Kontroller">
        <DataTable
          caption="Her kontrolün neyi değiştirdiği"
          head={['Kontrol', 'Prop', 'Neye bakmalı', 'Ayrıntılar']}
          rows={[
            ['orientation', c('orientation'), 'Aylar yan yana mı, alt alta mı.', <a href="#/orientation">Yön ve ay sayısı</a>],
            [
              'navigation',
              c('navigation'),
              <>
                {c('paged')} önceki/sonraki oklarıyla sabit bir pencere gösterir; {c('continuous')} aylar arasında kaydırır ve kenarlarda yenilerini yükler
                (kutunun içinde kaysın diye laboratuvar {c('maxBlockSize={480}')} ve {c('loadDirections="both"')} ayarlar).
              </>,
              <a href="#/load-more">Kademeli ay yükleme</a>,
            ],
            [
              'overflow',
              c('overflow'),
              <>
                İstenen aylar genişliğe sığmadığında ne olacağı: {c('wrap')} ile yeni satıra geçer, {c('scroll')} ile takvimin içinde kaydırılır ya da{' '}
                {c('reduce-months')} ile daha az ay gösterilir. Sürüklerken {c('layoutChange')}’i izleyin.
              </>,
              <a href="#/responsive">Duyarlı yerleşim</a>,
            ],
            ['numberOfMonths', c('numberOfMonths'), 'Kaç ay istendiği (yerleşim daha azını gösterebilir).', <a href="#/orientation">Yön ve ay sayısı</a>],
            ['monthPosition', c('monthPosition'), 'Gösterilen aylardan hangisinin referans ay olduğu.', <a href="#/month-position">Referans ayın konumu</a>],
            [
              'minDaySize',
              c('minDaySize'),
              'Taşma stratejisi devreye girmeden önce bir gün hücresinin küçülebileceği en küçük boyut.',
              <a href="#/day-size">Gün boyutu ve iç kaydırma</a>,
            ],
            ['disableFuture', c('disableFuture'), 'Bugünden sonraki günler müsait olmaz.', <a href="#/date-limits">Tarih sınırları</a>],
            [
              'RTL (sağdan sola, ar-EG)',
              <>
                {c('locale')}, {c('messages')}
              </>,
              <>
                {c('messagesAr')} ile Arapça yerel ayar: sağdan sola yerleşim, Arap-Hint rakamları, yansıtılmış oklar.
              </>,
              <a href="#/i18n">Yerel ayarlar, hafta başı ve RTL</a>,
            ],
          ]}
        />
      </Section>

      <Section title="Ölçümler">
        <p>
          React {c('<Profiler>')} içine yalnızca {c('<Calendar>')} sarılıdır; ölçüm ve olay panelleri onun dışındadır, bu yüzden panellerin kendi render’ları
          sayılmaz. Her satır, takvimi render eden bir React commit’idir (son 20 tanesi tutulur).
        </p>
        <DataTable
          caption="Profiler sütunları"
          head={['Sütun', 'Anlamı']}
          rows={[
            [
              'aşama',
              <>
                İlk render için {c('mount')}, sonrakiler için {c('update')}; güncelleme aynı commit’in bir layout effect’inden planlandıysa{' '}
                {c('nested-update')}.
              </>,
            ],
            [
              'gerçek ms',
              <>
                {c('actualDuration')}: React’in o commit için takvim alt ağacını render etmeye harcadığı süre (render aşaması: bileşenlerin çağrılması ve
                farkların hesaplanması). DOM değişikliklerinin uygulanmasını, layout’u ve paint’i içermez; yani commit süresi de, kullanıcının toplamda
                beklediği süre de değildir.
              </>,
            ],
            [
              'taban ms',
              <>
                {c('baseDuration')}: alt ağacın tamamını hiçbir memoizasyon olmadan render etmenin tahmini süresi, yani en kötü durum. Taban ile gerçek
                arasındaki büyük fark, memoize edilmiş parçaların atlandığını gösterir.
              </>,
            ],
          ]}
        />
        <ul>
          <li>
            Profiler yalnızca geliştirme derlemelerinde ve {c('react-dom/profiling')} derlemesinde ölçüm bildirir. Normal bir production derlemesinde
            (yayımlanan dokümantasyon sitesi gibi) hiçbir şey bildirmez; laboratuvar bu durumda sıfır göstermek yerine bunu açıkça söyler. Sayıları görmek
            için dokümantasyonu {c('npm run dev')} ile yerel olarak çalıştırın.
          </li>
          <li>
            Geliştirme modundaki React, production’dan belirgin şekilde yavaştır ve sayılar makineye, tarayıcıya ve aynı anda çalışan diğer işlere bağlıdır.
            Bunları mutlak değerler olarak değil, etkileşimleri birbiriyle karşılaştırmak için kullanın.
          </li>
          <li>
            Tekrarlanabilir sayılar için {c('npm run perf')}, gerçek girdi ve CPU yavaşlatmasıyla bir production profiling derlemesini ölçer; yöntem ve
            kaydedilen sonuçlar için <a href="#/performance">Performans</a> sayfasına bakın.
          </li>
        </ul>
      </Section>

      <Section title="Olaylar">
        <p>
          Liste, {c('onEvent')}’e iletilen her olayı en yenisi üstte olacak şekilde kısa bir özetle gösterir (bir tarih, görünen aylar, yerleşimin sütunları
          ve etkin ay sayısı, …); son 30 satır tutulur. Art arda gelen {c('resize')}, {c('scroll')}, {c('dayFocusChange')} ve{' '}
          {c('tooltipOpenChange')} olayları sayaçlı tek bir satırda birleştirilir, çünkü bir sürükleme veya kaydırma bunlardan çok sayıda yayar.
        </p>
        <ul>
          <li>
            Mount işlemi {c('ready')}’yi ve türetilmiş olayları ({c('layoutChange')}, {c('visibleMonthsChange')}, {c('validationChange')}, …) yayar.
            Geliştirme modunda StrictMode altında bunların bazıları iki kez görünür.
          </li>
          <li>
            Kutuyu sürüklemek {c('resize')} yayar; {c('layoutChange')} yalnızca sütunlar, etkin ay sayısı veya taşma gerçekten değiştiğinde ardından gelir.
          </li>
          <li>
            Bir güne tıklamak {c('dateClick')} (reddedilen bir gün için de), ardından {c('change')} ve {c('activeEndpointChange')} yayar; aralığı
            tamamlayan tıklama buna {c('selectionComplete')} ekler. Odağı başka bir güne taşımak {c('dayFocusChange')} yayar; React render ettikten
            sonra, doğrulama sonucu değiştiyse {c('validationChange')} gelir.
          </li>
        </ul>
        <p>
          Tüm olay tipleri ve yükleri <a href="#/api-events">Callback’ler ve olaylar</a> sayfasında listelenir.
        </p>
      </Section>
    </Page>
  );
}
