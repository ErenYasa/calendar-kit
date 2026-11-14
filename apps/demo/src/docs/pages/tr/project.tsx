import migration from '../../../snippets/migration.tr.tsx?code';
import { Snippet } from '../../Code';
import { DataTable, Note, Page, PropsTable, Section } from '../../ui';

export function Testing() {
  return (
    <Page title="Test ve uyumluluk" lead="Neyin test edildiği, testlerin nerede çalıştığı ve henüz neyin doğrulanmadığı.">
      <Section title="Komutlar">
        <PropsTable
          rows={[
            { name: 'npm run check', type: <>tümü</>, description: 'Tür denetimi, paket derlemesi, paket ve demo testleri, derlenmiş paketin SSR duman testi (smoke test).' },
            { name: 'npm run typecheck', type: <>tipler</>, description: 'Kütüphane kaynağı (ortam/ambient türleri olmadan), paket testleri ve yapılandırması (Node türleriyle), demo (tüm doküman örnekleri dahil) ve demonun Vite yapılandırması.' },
            { name: 'npm test', type: <>birim</>, description: 'Paket ve demo için Vitest + jsdom.' },
            { name: 'npm run test:browser', type: 'Chrome', description: 'Doküman sitesinde gerçek tarayıcıda regresyon testleri (cascade, yerleşim, tooltip konumu, yükleme).' },
            { name: 'npm run smoke:ssr -w calendar-kit', type: 'SSR', description: 'dist’i paketin exports alanı üzerinden içe aktarır ve sunucuda render eder.' },
            { name: 'npm run size', type: <>paket boyutu</>, description: 'Küçültülmüş (minified) + gzip/brotli boyutları.' },
            { name: 'npm run perf', type: <>zamanlama</>, description: 'CPU yavaşlatmalı (throttling) Chrome’da etkileşim süreleri.' },
          ]}
        />
      </Section>
      <Section title="Test grupları">
        <ul>
          <li>Tarih modeli ve aritmetiği (saat dilimi ve yaz saatine karşı güvenli), seçim motoru ve kurallar.</li>
          <li>jsdom’da takvim davranışı: modlar, klavye, odak, olaylar ve sıraları, yükleme, tooltip’ler, yerleşim kararları, render sayıları.</li>
          <li>Düzeltilen her doğrulama bulgusu için regresyon testleri (bkz. <code>docs/verification-findings.md</code>).</li>
          <li>
            Derlenmiş CSS üzerinde stil dosyası cascade’i: odak, bugün, tarihler yüklenirken gösterilen boş yer tutucular ve azaltılmış hareket kurallarının
            özgüllüğü (specificity).
          </li>
          <li>
            Paket: export hedeflerinin <code>npm pack</code> içinde bulunması, derleme çıktısı (<code>&apos;use client&apos;</code> korunur, core React içermez),
            node16/nodenext/bundler altında tür bildirimleri.
          </li>
          <li>Dokümanlar: her örnek yalnızca genel giriş noktalarını kullanır ve yalnızca var olan dosyaları gösterir.</li>
        </ul>
      </Section>
      <Section title="Sürekli entegrasyon">
        <p>
          GitHub Actions, pull request’lerde ve <code>development</code> ile <code>master</code> dallarına yapılan push’larda çalışır (Node 22,{' '}
          <code>npm ci</code>): tür denetimi, derlemeler, testler ve SSR duman testi; ayrı bir job’da da iş akışının kurduğu Google Chrome’da tarayıcı testleri.
        </p>
      </Section>
      <Section title="Yalnızca yerelde doğrulananlar">
        <ul>
          <li>
            Paketlenmiş tarball’ın temiz tüketici uygulamalarında kullanımı: Vite + React 19, Vite + React 18, Next.js App Router (<code>calendar-kit/client</code>{' '}
            kullanan sunucu sayfası, sunucuda core yardımcıları), düz TypeScript (bundler, node16, nodenext).
          </li>
          <li>Etkileşim performansı ölçümleri (macOS, Chrome).</li>
        </ul>
      </Section>
      <Section title="Henüz doğrulanmayanlar">
        <Note>
          <p>
            Safari, Firefox, gerçek mobil cihazlar (dokunmatik) ve ekran okuyucular (VoiceOver, NVDA, TalkBack) test edilmedi. Stil dosyası container query
            birimlerine ve <code>color-mix()</code>’e ihtiyaç duyduğundan, kabaca Chrome/Edge 111, Safari 16.2 ve Firefox 113’ten eski tarayıcıların çalışması
            beklenmez; Safari ve Firefox’un daha yeni sürümleri de test edilmedi; çalıştıkları doğrulanmış değildir.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

export function Performance() {
  return (
    <Page title="Performans" lead="Deponun kendi betikleriyle ölçülmüş sayılar. Kendi donanımınızda yeniden çalıştırın; bunlar garanti değildir.">
      <Section title="Paket boyutu">
        <p>
          <code>npm run size</code>: rolldown ile küçültülmüş, React hariç. README’de en son kaydedilen değerler (Kasım 2026):
        </p>
        <DataTable
          caption="Paket boyutu"
          head={['Paket', 'min', 'gzip', 'brotli']}
          rows={[
            ['Tipik: Calendar + stayRules + messagesTr', '58.7 kB', '20.2 kB', '18.4 kB'],
            ['Her şey (export *)', '68.7 kB', '23.6 kB', '21.0 kB'],
            ['Yalnızca core (motor + adaptör + tarihler)', '8.5 kB', '3.1 kB', '2.9 kB'],
            ['styles.css', '9.4 kB', '2.6 kB', '2.2 kB'],
          ]}
        />
      </Section>
      <Section title="Etkileşimler">
        <p>
          <code>npm run perf</code>, içinde yalnızca React Profiler’a (production profiling derlemesi) sarılı takvimin bulunduğu bir sayfa derler ve sistemdeki
          Chrome’u gerçek fare ve klavye girdisiyle, isteğe bağlı CPU yavaşlatmasıyla kullanır. Apple M5 Pro (macOS 26.6, Chrome 156) üzerinde ölçülmüştür;
          değerler ms cinsinden medyandır. “render”, takvimin React Profiler <code>actualDuration</code> değeridir; “işleme”, olayın gönderilmesinden React’in
          DOM’u güncellemesine kadar geçen süredir.
        </p>
        <DataTable
          caption="Medyan render · işleme (ms)"
          head={['Ay / gün', 'CPU', 'Başlangıç tıklaması', 'Üzerine gelme', 'Bitiş tıklaması', 'Ok tuşu', 'Sonraki ay']}
          rows={[
            ['2 / 61', '1×', '1.7 · 1.1', '0.8 · 1.8', '2.5 · 1.3', '0.7 · 1.7', '1.4 · 1.6'],
            ['2 / 61', '4× yavaş', '3.8 · 2.4', '1.6 · 3.1', '4.8 · 2.6', '1.3 · 2.8', '2.9 · 3.5'],
            ['2 / 61', '6× yavaş', '5.3 · 3.5', '2.2 · 4.6', '7.5 · 3.6', '2.2 · 4.3', '5.2 · 5.8'],
            ['12 / 365', '1×', '6.1 · 2.7', '2.5 · 4.1', '9.3 · 3.8', '1.9 · 3.0', '4.1 · 4.6'],
            ['12 / 365', '4× yavaş', '16.0 · 7.0', '4.9 · 8.0', '21.8 · 7.7', '4.6 · 7.1', '9.4 · 11.3'],
            ['12 / 365', '6× yavaş', '24.9 · 10.7', '7.4 · 12.0', '31.7 · 11.7', '6.4 · 10.9', '13.9 · 17.2'],
          ]}
        />
        <p>
          1–3 ayda render ve işleme, 6× yavaş bir CPU’da bile bir karenin (16 ms) altında kalır. On iki ayda (365 gün) ise 4–6× yavaş bir CPU’da tıklamalar
          bir kareyi aşar; uzun listeler için küçük bir <code>maxRenderedMonths</code> ile <code>navigation=&quot;continuous&quot;</code> tercih edin.
        </p>
      </Section>
      <Section title="Sınırlar">
        <ul>
          <li>Sürekli mod DOM’u, ayları bütün olarak kaldırarak küçük tutar; sanallaştırma (virtualization) yoktur (ölçümler buna gerek göstermedi).</li>
          <li>
            Fareyle üzerine gelindiğinde gösterilen aralık önizlemesi, render edilen ayların tüm gün durumlarını yeniden hesaplar; gün hücreleri memoize
            edildiğinden yalnızca değişen günler yeniden render edilir.
          </li>
          <li>Ulaşılabilir bitiş araması her başlangıç için en fazla 63 olası bitiş gününe bakar.</li>
          <li>Bu doküman sitesi her sayfayı ve her örneği yalnızca açıldığında yükler; kod renklendirmesi derleme sırasında yapılır.</li>
        </ul>
      </Section>
    </Page>
  );
}

export function Migration() {
  return (
    <Page title="Geçiş ve sorun giderme" lead="react-dates ve Moment’ten geçiş ve sık karşılaşılan sorunların çözümleri.">
      <Section title="react-dates’ten geçiş">
        <PropsTable
          rows={[
            { name: <><code>startDate</code> / <code>endDate</code> (moment)</>, type: "value={{ start, end }}", description: "'YYYY-MM-DD' dizeleri." },
            { name: 'onDatesChange', type: 'onChange(value, e)', description: 'Olay nesnesinde e.reason, e.phase ve e.validation bulunur.' },
            { name: 'focusedInput / onFocusChange', type: 'activeEndpoint / onActiveEndpointChange', description: '“Kapalı” (null) durumu yoktur: takvimi açıp kapatmak uygulamanızın işidir.' },
            { name: 'initialVisibleMonth', type: 'defaultVisibleMonth', description: 'controlled kullanım için (ayı siz tutarsınız): visibleMonth + onVisibleMonthChange.' },
            { name: <><code>numberOfMonths</code> (mobil cihaz denetimiyle)</>, type: 'numberOfMonths + overflow', description: 'Yerleşim kapsayıcıya uyar; pencere genişliği mantığına gerek yoktur.' },
            { name: 'daySize', type: 'minDaySize / maxDaySize', description: 'Hücreler kapsayıcıyla birlikte ölçeklenir.' },
            { name: 'isDayBlocked / isOutsideRange', type: 'rules', description: 'Kullanılabilecek kurallar: getDayAvailability, closedDates, stayRules({ getDayStatus }), minDate/maxDate, disablePast.' },
            { name: 'minimumNights', type: 'stayRules({ minNights })', description: 'minimumNights={0} karşılığı allowSameDay: true’dur.' },
            { name: 'firstDayOfWeek / weekDayFormat', type: 'firstDayOfWeek / weekdayFormat', description: 'Intl tabanlı, varsayılanı yerel ayardan gelir.' },
            { name: 'navPrev / navNext', type: 'renderNavigation, renderMonthHeader', description: 'Ya da mobilde daha fazla ay yüklemeli sürekli gezinme.' },
            { name: 'renderCalendarInfo', type: 'renderFooter / renderHeader', description: 'Seçim durumunu ve eylemleri (actions) parametre olarak alırlar.' },
            { name: 'renderDayContents', type: 'renderDayContent / renderDay', description: 'Elle yazılmış açılır pencereler yerine getDayTooltip ile tooltip’ler.' },
            { name: 'onOutsideClick', type: 'onOutsideClick', description: 'React ağacını ve portal’ları hesaba katar.' },
            { name: 'keepOpenOnDateSelect', type: '—', description: 'Varsayılan: takvim satır içidir (inline) ve kendini asla kapatmaz.' },
          ]}
        />
        <p>
          Bilinçli bir fark: aralık tamamlandıktan sonraki tıklama yeni bir aralık başlatır (react-dates ise başlangıç alanı odaktayken bitişi korur). Yalnızca
          bitişi değiştirmek için <code>activeEndpoint=&quot;end&quot;</code> verin.
        </p>
        <Snippet files={migration} label="Geçiş örneği" />
      </Section>
      <Section title="Sorun giderme">
        <PropsTable
          rows={[
            { name: <>Takvimde stil yok</>, type: 'CSS', description: "'calendar-kit/styles.css' dosyasını bir kez içe aktarın (JavaScript hiçbir zaman CSS içe aktarmaz). Next.js’te app/layout.tsx içinde." },
            { name: <>CSS’im temayı geçersiz kılmıyor</>, type: 'CSS', description: 'CSS değişkenlerini takvimin kendisinde (className/style ile) tanımlayın ve kendi CSS’inizi temadan sonra içe aktarın; iç sınıf adları yerine classNames ve data-* özniteliklerini kullanın.' },
            { name: <>Hydration uyuşmazlığı</>, type: 'SSR', description: 'today’i (ve gerekirse sabit bir defaultVisibleMonth) verin; sunucu kullanıcının tarihini bilemez.' },
            { name: 'useSyncExternalStore is not a function (Next.js)', type: 'RSC', description: "'calendar-kit' paketinden alınan Calendar bir Server Component içinde render edildi: onu 'calendar-kit/client' yolundan içe aktarın ya da 'use client' ile işaretli bir bileşene sarın." },
            { name: <>Fonksiyonlar Client Component’lere aktarılamaz</>, type: 'RSC', description: 'Kurallar, callback’ler ve render prop’lar için takvimi kendi Client Component’inize koyun.' },
            { name: <>Tooltip bir modalın arkasında kalıyor</>, type: <>portal</>, description: 'tooltip.container’ı diyaloğun içindeki bir öğeye ayarlayın (modal diyaloglar en üst katmanda, top layer’da durur).' },
            { name: <>Tooltip, transform uygulanmış bir kapsayıcıda kayık görünüyor</>, type: <>portal</>, description: 'Paket bunu kendisi çözer: transform uygulanmış portal kapsayıcılarında konum otomatik düzeltilir.' },
            { name: <>Aylar taşıyor / sayfa yana kayıyor</>, type: <>yerleşim</>, description: 'Takvim sayfayı hiçbir zaman genişletmez; üst öğesinin bir genişliği olduğundan emin olun (flex/grid üst öğelerinde min-width: 0).' },
            { name: <>defaultValue ayarlayınca seçim değişmiyor</>, type: <>durum</>, description: 'defaultValue yalnızca ilk render’da okunur; değeri sonradan değiştirmek için value ile controlled kullanın ya da ref.reset() çağırın.' },
            { name: <>Bir gün seçilemiyor ve tooltip göstermiyor</>, type: <>veri</>, description: 'O ayın verisi bilinmiyor ya da hâlâ yükleniyor (unknownDataPolicy: block); sebep günün aria-label’ında yazar.' },
          ]}
        />
      </Section>
    </Page>
  );
}
