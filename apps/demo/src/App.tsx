import type { ReactNode } from 'react';
import { StayMobile, StayReference } from './examples/Stay';
import { BoatWeekendExample, BoatWeeklyExample, EventExample, MultipleExample, ReadonlyExample } from './examples/Others';
import { SyncExample } from './examples/Sync';
import { LocalesExample } from './examples/Locales';
import { LoadingExample } from './examples/Loading';
import { Playground } from './examples/Playground';
import { EndpointsExample, LoadMoreExample, SkeletonExample, TodayExample, TooltipExample } from './examples/Features';

const SECTIONS: { id: string; title: string; note: string; node: ReactNode }[] = [
  { id: 'f-endpoints', title: 'Yeni — Başlangıç/bitiş görünümü ve singleDayFirst', note: 'Uç günlerde dış tarafta yarım halka, iç tarafta bant; tek gün düz daire. singleDayFirst açıkken ilk tıklama tek günü seçer, sonraki bir güne tıklama aralığa genişletir, aynı güne tekrar tıklama temizler. Fareyle üzerinde gezerek önizlemeyi görün.', node: <EndpointsExample /> },
  { id: 'f-custom', title: 'Yeni — Özel tarih (relaxSchedule)', note: 'Program kuralları (Cumartesi→Cumartesi, yalnızca hafta sonu, min/maks süre) “Özel tarih” ile kalkar; dolu/kapalı günler, geçmiş ve min/max tarih kalır. Örnekler: aşağıdaki iki tekne takvimi ve konaklama takvimi (footer’daki “Özel tarih”).', node: <p className="note">↓ <a href="#boat">Tekne — Cumartesi → Cumartesi</a> · <a href="#boat-weekend">Tekne — yalnızca hafta sonu</a> · <a href="#stay">Konaklama</a></p> },
  { id: 'f-tooltip', title: 'Yeni — Tooltip sınırı ve yerleşimi', note: 'tooltip={{ boundary, placement }}. “calendar” sınırında tooltip takvimin ay alanında kalır, hafta günü satırının üstüne çıkmaz; sığmazsa karşı tarafa, sonra sağa/sola geçer, metin satır kırar.', node: <TooltipExample /> },
  { id: 'f-loadmore', title: 'Yeni — “Daha fazla / önceki tarihleri göster” kontrolleri', note: 'Varsayılan buton; yalnızca içerik için loadMoreLabels (ReactNode); tamamen farklı kontrol için renderLoadMore; dışarıya taşımak için loadMore="manual" + ctx.actions.loadMore().', node: <LoadMoreExample /> },
  { id: 'f-loading', title: 'Yeni — Yükleme görünümü', note: 'Görünür “Yükleniyor” yazısı yok; her gün için eşit boyutlu iskelet. İsteğe bağlı ek gösterge renderLoading ile.', node: <SkeletonExample /> },
  { id: 'f-today', title: 'Yeni — Bugün işareti (highlightToday)', note: 'İnce çember bugünü gösterir, üzerine gelince “Bugün” tooltip’i açılır. highlightToday={false} ile kapatılabilir.', node: <TodayExample /> },
  { id: 'stay', title: 'Konaklama — referans görünüm', note: 'stayRules: [start, end) — 13→20 = 7 gece. Saat, fiyat, “Özel tarih” (relaxSchedule — min 2 gece kuralını kaldırır), Temizle/Kaydet tüketici slotunda. Geç çıkış (18:00) ruleContext ile kuralları değiştirir.', node: <StayReference /> },
  { id: 'mobile', title: 'Mobil dikey liste', note: 'navigation="continuous", “Daha fazla tarih göster” iki yönde (loadMoreLabels ile her iki buton aynı metin), container genişliğine göre ölçek, iç dikey scroll.', node: <StayMobile /> },
  { id: 'boat', title: 'Tekne — Cumartesi → Cumartesi', note: 'dayRangeRules([start, end]): startWeekdays/endWeekdays = Cumartesi. “Özel tarih” açılınca relaxSchedule ile program kuralları kalkar; dolu günler yine seçilemez.', node: <BoatWeeklyExample /> },
  { id: 'boat-weekend', title: 'Tekne — yalnızca hafta sonu, tek gün veya aralık', note: 'availableWeekdays=[Cmt, Paz] + singleDayFirst: ilk tıklama tek gün seçer, ikinci tıklama aralığa genişletir. Aralık hafta içinden geçemez.', node: <BoatWeekendExample /> },
  { id: 'event', title: 'Etkinlik bileti — tek tarih', note: 'İkon, rozet, nokta işaretleri, tükendi günleri.', node: <EventExample /> },
  { id: 'multiple', title: 'Ders/seans — çoklu tarih', note: 'Bağımsız tarihler, en fazla 5, yalnızca Salı/Perşembe.', node: <MultipleExample /> },
  { id: 'readonly', title: 'Salt okunur müsaitlik', note: 'mode="readonly" + modifier.', node: <ReadonlyExample /> },
  { id: 'loading', title: 'Async müsaitlik, hata/tekrar, ilk müsait aya git', note: 'Veri getirme tüketicide; bayat yanıt koruması; ay atlama seçimi değiştirmez.', node: <LoadingExample /> },
  { id: 'sync', title: 'Senkron üç takvim (inline / modal / portal)', note: 'Ortak value + activeEndpoint + kurallar; görünen ay, focus, hover, tooltip instance’a özel.', node: <SyncExample /> },
  { id: 'locales', title: 'Diller ve RTL', note: 'Intl.DateTimeFormat; tr/en/de/fr/es/it/nl + ar (RTL), farklı temalar aynı sayfada.', node: <LocalesExample /> },
  { id: 'playground', title: 'Yerleşim, olaylar ve ölçüm', note: 'Kutuyu köşesinden yeniden boyutlandırın. Sağda React commit süreleri ve onEvent akışı.', node: <Playground /> },
];

export function App() {
  return (
    <div className="page">
      <header>
        <h1>calendar-kit</h1>
        <nav>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title.startsWith('Yeni') ? s.title.split(' — ')[1]!.split(' (')[0] : s.title.split(' — ')[0]}
            </a>
          ))}
        </nav>
      </header>
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="demo-section">
          <h2>{s.title}</h2>
          <p className="muted">{s.note}</p>
          {s.node}
        </section>
      ))}
    </div>
  );
}
