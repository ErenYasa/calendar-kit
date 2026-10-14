# calendar-kit (geçici ad)

React + TypeScript için hafif, erişilebilir, responsive ve genişletilebilir tarih seçimi paketi. Ev/tekne kiralama, etkinlik bileti, ders/seans rezervasyonu ve salt okunur müsaitlik gösterimi gibi farklı ürünlerde kullanılmak üzere tasarlandı; hiçbir işletme modeline bağlı değildir.

> `calendar-kit` geçici addır. Bileşen adları (`Calendar`) ve CSS önekleri (`cal-`) paket adından bağımsızdır: önek tek yerden değişir (`src/react/utils.ts` → `PREFIX`, `src/styles/index.scss` → `$p`). Paket `private: true`; npm'e yayımlanmadı.

- Bağımlılık yok (React/ReactDOM peer). Moment, react-dates veya başka tarih kütüphanesi kullanılmaz.
- Tipik kullanım **19.1 kB gzip** JS + **2.6 kB gzip** CSS (ölçüm aşağıda).
- 81 test (tarih, motor, bileşen, SSR, etkileşim maliyeti) + dist üzerinden SSR duman testi.

---

## 1. Kurulum ve komutlar

Gereksinim: Node 20+ (geliştirmede Node 22.23 / npm 10.9 kullanıldı).

```bash
cd ~/Desktop/my_folder/calendar-kit
```

```bash
npm install
```

```bash
npm run dev
```

Demo: **http://127.0.0.1:5173**

| Komut (kök dizinde) | Ne yapar |
|---|---|
| `npm run dev` | Demo geliştirme sunucusu (Vite, HMR). Paket kaynakları build gerektirmeden kullanılır. |
| `npm test` | Vitest (jsdom). Testler DST'li `America/New_York` saat diliminde çalışır. |
| `npm run typecheck` | Paket + demo için `tsc --noEmit`. |
| `npm run build:package` | `packages/calendar-kit/dist` → ESM + `.d.ts` + `styles.css`. |
| `npm run build` | Paket + demo production build'i. |
| `npm run size` | Minify + gzip/brotli boyut ölçümü. |
| `npm run check` | typecheck + test + paket build + dist üzerinden SSR duman testi. |

Demo production önizleme: `npm run build -w demo` ardından `npx vite preview` (`apps/demo` içinde). React Profiler süreleriyle production ölçümü için `PROFILE=1 npm run build -w demo`.

## 2. Proje yapısı ve mimari

```
calendar-kit/
├─ packages/calendar-kit/        ← yayımlanacak paket
│  ├─ src/date/                  ← CalendarDate, saf takvim aritmetiği, Intl yardımcıları
│  ├─ src/core/                  ← seçim/doğrulama motoru (React'ten bağımsız)
│  ├─ src/adapters/              ← stayRules, dayRangeRules, closedDates (isteğe bağlı)
│  ├─ src/i18n/                  ← UI mesajları (en, tr, de, fr, es, it, nl, ar)
│  ├─ src/react/                 ← Calendar, gün hücresi, tooltip, layout
│  ├─ src/styles/index.scss      ← varsayılan tema → dist/styles.css
│  ├─ test/                      ← vitest
│  └─ scripts/                   ← size.mjs, ssr-smoke.mjs
└─ apps/demo/                    ← yalnızca public API'yi kullanan demo
```

Katmanlar tek yönlü bağımlıdır: `date` ← `core` ← `adapters` ← `react`. Çekirdek (`createSelectionEngine`) React olmadan da kullanılabilir (ör. sunucuda aynı kurallarla doğrulama; 2.9 kB gzip).

**Demo ve public API ayrımı:** paketin `exports` haritasında bir `source` koşulu vardır. Demo'nun Vite config'i bu koşulu açar; böylece `import { Calendar } from 'calendar-kit'` ve `import 'calendar-kit/styles.css'` geliştirmede kaynak dosyalara, dağıtımda `dist`'e çözülür. Demo hiçbir iç dosyaya doğrudan erişmez.

**Temel kararlar (kısa gerekçe):**

| Karar | Neden / trade-off |
|---|---|
| Tarih = doğrulanmış `YYYY-MM-DD` string | Saat dilimi yok, serileştirilebilir, `===` ile karşılaştırılır. Aritmetik tamsayı "epoch day" ile; DST etkisiz. |
| Tek değerlendirme kaynağı: `engine.plan(date)` | Tıklama, klavye, hover önizleme, disabled görünümü, tooltip ve aria-label aynı sonuçtan beslenir. |
| `DayCell` `memo` + durum anahtarı | Ölçüldü: hover başına 365 hücreden ~2.75'i render ediliyor (memo olmadan hepsi). |
| Ay düzeyinde memo **yok** | 12 ayda hover 5.9 ms (prod) — bütçe içinde; ek karmaşıklık gerekçelendirilemedi. |
| Kendi tooltip konumlandırması (~1 kB) | Floating UI vb. bağımlılığa gerek kalmadı; ref ile anchor, flip + clamp, `position: fixed` + portal. |
| CSS container queries (`cqmin`) | Daire, bant ve yazı boyutu hücreye göre ölçeklenir; JS ölçümü yalnızca kolon/ay sayısı kararı için. |
| ESM tek dosya, minify edilmemiş + sourcemap | Tüketici bundler'ı minify eder; okunabilir hata ayıklama. |

## 3. Hızlı kullanım

```tsx
import { Calendar, stayRules, messagesTr, type DateRange } from 'calendar-kit';
import 'calendar-kit/styles.css';

function Booking() {
  const [dates, setDates] = useState<DateRange>({ start: null, end: null });
  return (
    <Calendar
      mode="range"
      locale="tr-TR"
      messages={messagesTr}
      numberOfMonths={2}
      value={dates}
      onChange={setDates}
      rules={stayRules({ minNights: 2, disablePast: true })}
    />
  );
}
```

## 4. Tarih veri modeli

```ts
type CalendarDate = string & { [brand] };  // '2026-11-13'
type CalendarMonth = string & { [brand] }; // '2026-11'
```

- `parseDate(x)` → `CalendarDate | null` (kesin; `2026-02-30`, `2026-1-1`, zamanlı string reddedilir). `toCalendarDate('…')` geçersizde `RangeError` atar. `isCalendarDate`, `createDate(y, m, d)`, `parseMonth`.
- `new Date(string)` hiçbir yerde kullanılmaz. `diffDays`, `addDays`, `addMonths` (gün sıkıştırmalı: 31 Ocak + 1 ay = 28/29 Şubat) DST'den etkilenmez.
- **Bugün:** `getToday({ timeZone, now })` açık ve test edilebilir. Bileşende `today` prop'u verilirse o kullanılır; verilmezse yalnızca istemcide hesaplanır (`useSyncExternalStore`, sunucu snapshot'ı `null`) ve gece yarısı / sekme görünür olunca yenilenir.

## 5. Seçim modları

| `mode` | `value` tipi | Davranış |
|---|---|---|
| `single` | `CalendarDate \| null` | Tıklama seçer; seçili güne tekrar tıklama değişiklik yapmaz (temizlemek için `ref.clear()`). |
| `range` | `{ start, end }` | Aşağıdaki geçişler. |
| `multiple` | `readonly CalendarDate[]` | Tıklama ekler/çıkarır; `rules.maxSelections`. |
| `readonly` | — | Seçim yok; günler odaklanabilir ve sebepleri okunur. |

**Controlled / uncontrolled:** `value` + `onChange` veya `defaultValue`. `defaultValue` **yalnızca ilk değerdir**; sonradan değişmesi state'i sıfırlamaz (`ref.reset()` ilk değere döner). Controlled `value` dışarıdan değişince görünüm güncellenir, `onChange` tekrar tetiklenmez. Aynı desen `visibleMonth`/`defaultVisibleMonth` ve `activeEndpoint`/`defaultActiveEndpoint` için geçerlidir.

**Aralık geçişleri** (`activeEndpoint` = sonraki tıklamanın hangi ucu belirleyeceği):

| Durum | Tıklama | Sonuç |
|---|---|---|
| Boş / tamamlanmış | gün | Yeni başlangıç (`{start: gün, end: null}`), endpoint → `end` |
| Başlangıç seçili | başlangıçtan önce | Yeni başlangıç |
| Başlangıç seçili | aynı gün | `allowSameDay` ise `start === end`; değilse seçim temizlenir |
| Başlangıç seçili | sonra, geçerli | Tamamlanır, endpoint → `start` |
| Başlangıç seçili | sonra, geçersiz | Reddedilir (typed sebep), değer değişmez |
| `activeEndpoint="end"` + tamamlanmış | gün ≥ start | Bitiş güncellenir (ör. "çıkış" alanı odaktayken) |
| `fixedLength` | gün | Tek tıklamayla tüm aralık |
| `singleDayFirst` | gün | İlk tıklama o günü tek başına seçer (`start === end`, tamamlanmış). Sonraki bir güne tıklama aralığa genişletir; aynı güne tekrar tıklama temizler. Tek gün ve çok gün seçimi aynı takvimde. |

Geçersiz başlangıç değerleri (`invalid-date`, `end-before-start`, kurala aykırı) **değiştirilmez**; `onValidationChange` (`cause: 'initial'`) ile bildirilir.

## 6. Aralık semantiği

Çekirdek yalnızca seçilen iki ucu taşır; `end`'e otomatik anlam yüklemez. Üç kavram ayrıdır:

| Kavram | Nerede |
|---|---|
| Seçilen uçlar | `value.start`, `value.end` (`DayState.selectedStart/End`) |
| Dahil edilen / doğrulanan günler | `rangeSemantics` → `getIncludedDays(range, semantics)`, `DayState.included` |
| Çizilen aralık | Her zaman `start`…`end` (`data-range-start`, `data-in-range`, `data-range-end`) |

| Senaryo | Adaptör | Semantik | 13 → 20 Kasım |
|---|---|---|---|
| Konaklama | `stayRules()` | `[start, end)` | **7 gece** (`countNights`) — 20'si çıkış günü, çizilir ama dahil değil |
| Gün bazlı (tekne, çok günlü etkinlik) | `dayRangeRules()` | `[start, end]` | **8 gün** (`countDays`) |
| Aynı gün | `stayRules({ allowSameDay: true })` | `start === end` | 1 günlük kullanım; saat kuralları uygulamada |
| Tek tarih | `mode="single"` | — | aralık değil |

Adaptör kullanılmazsa varsayılan `rangeSemantics: 'inclusive'`dir (aradaki her gün doğrulanır — en temkinli seçenek).

## 7. Kurallar, adaptörler ve doğrulama

`rules` tek bir `SelectionRules` veya dizi alır (dizi `combineRules` ile birleştirilir: sınırlar kesişir, uygunluk bayrakları AND'lenir). Kısa yollar: `minDate`, `maxDate`, `disablePast`, `disableFuture`, `getDataStatus`.

```ts
interface SelectionRules<TContext> {
  minDate, maxDate, disablePast, disableFuture,
  rangeSemantics?: 'inclusive' | 'exclusive',
  allowSameDay?, minLength?, maxLength?, fixedLength?,   // birim: exclusive → gece, inclusive → gün
  startWeekdays?, endWeekdays?,              // program kuralı: aralık hangi günlerde başlar/biter
  availableWeekdays?,                        // program kuralı: hizmet verilen günler (ör. hafta sonu [6, 0])
  singleDayFirst?,                           // inclusive: ilk tıklama tek gün, ikinci tıklama aralık
  getDayAvailability?(date, ctx): { closed?, canStart?, canEnd?, canPassThrough?, reason?, message?, schedule? },
  getDataStatus?(month): 'unknown' | 'loading' | 'loaded' | 'error',
  unknownDataPolicy?: 'block' | 'allow',                  // varsayılan block
  validateSelection?(selection, ctx): ValidationIssue | null,
  maxSelections?, requireReachableEnd?,
}
```

- `ctx` = `{ mode, selection, activeEndpoint, today, context }`; `context` = `ruleContext` prop'u (ör. seçilen saatler). Kurallar, veri veya context değişince mevcut seçim **yeniden doğrulanır**; geçersizleşen seçim silinmez, `onValidationChange` (`cause: 'rules'`) gelir.
- Aralığın yalnızca uçları değil, semantiğe göre dahil olan **tüm günleri** doğrulanır (`blocked-in-range`).
- `stayRules({ getDayStatus })`: `'available' | 'booked' | 'closed' | 'check-in-only' | 'check-out-only'` (gecenin durumu). İlk dolu gecenin sabahı otomatik olarak "sadece çıkış" olur; art arda dolu günler kapalıdır. `minNights`/`maxNights`/`fixedNights`, `checkInWeekdays`/`checkOutWeekdays`.
- `dayRangeRules({ getDayStatus })`: `'available' | 'closed' | 'start-only' | 'end-only'`, `minDays`/`maxDays`/`fixedDays`.
- `closedDates(set, reason)`: hızlı kapalı gün listesi.

**Program kuralları ve "Özel tarih" (`relaxSchedule`).** Kurallar iki türlüdür: *program* (Cumartesi→Cumartesi, yalnızca hafta sonu, min/maks/sabit süre) ve *gerçek müsaitlik* (dolu, bakım, kapalı, veri durumu). `relaxSchedule` açıkken program kuralları yok sayılır, gerçek müsaitlik, min/max tarih, geçmiş/gelecek ve özel doğrulayıcılar uygulanmaya devam eder:

```tsx
// Tekne: yalnızca Cumartesi → Cumartesi; "Özel tarih" açılınca istenen serbest aralık.
<Calendar
  mode="range"
  rules={dayRangeRules({ startWeekdays: [6], endWeekdays: [6], minDays: 8, getDayStatus: (d) => (booked.has(d) ? 'closed' : undefined) })}
  relaxSchedule={customDates}          // true | { weekdays?: boolean; length?: boolean }
/>

// Yalnızca hafta sonu hizmet; tek gün veya hafta sonu aralığı.
<Calendar mode="range" rules={dayRangeRules({ availableWeekdays: [6, 0], singleDayFirst: true })} />
```

Kendi `getDayAvailability` kodunuzda program kaynaklı kısıtlamaları `schedule: true` ile işaretlerseniz onlar da gevşetilir. Aynı işlem saf fonksiyon olarak da var: `relaxRules(rules, { weekdays, length })`. Programa takılan günler görselde yalnızca soluk gösterilir (`data-out-of-schedule`, `day.outOfSchedule`); gerçekten dolu/kapalı günler üstü çizilidir.

**Sebep kodları** (`ValidationIssue.code`): `invalid-date, before-min, after-max, past, future, closed, start-not-allowed, end-not-allowed, blocked-in-range, weekday-start, weekday-end, min-length, max-length, fixed-length, same-day, end-before-start, max-selections, data-unknown, data-loading, data-error, custom`. Ek alanlar: `date`, `params` (ör. `{ min: 2, unit: 'nights' }`), `dayReason` (adaptör etiketi, ör. `check-out-only`), `message`. Metinler `messages.reasons[code](params)` ve `messages.dayReasons[tag]` ile özelleştirilir.

## 8. Gün verisi, özel içerik ve iki özelleştirme seviyesi

- `getDayData(date) → TDayData` metadata'yı seçilebilirlikten ayrı tutar. `DefaultDayData` şeklini (`label`, `badge`, `icon`, `markers[]`, `description`) varsayılan içerik doğrudan çizer; `description` erişilebilir açıklamaya eklenir. Paket fiyat/kapasite hesaplamaz.
- `modifiers={{ name: (day) => boolean }}` → `data-mod-name` ve `day.modifiers.name` (görsellerdeki pembe işaretler demo'da böyle üretildi; iş anlamı uygulamaya aittir).
- **`renderDayContent(ctx)`**: paket etkileşimli `<button>` kabuğunu yönetir, siz yalnızca içini değiştirirsiniz.
- **`renderDay({ day, data, getDayProps, defaultContent })`**: elementi siz render edersiniz:

```tsx
<Calendar renderDay={({ day, getDayProps }) => (
  <button {...getDayProps({ className: 'custom-day', onClick: myHandler })}>{day.dayText}</button>
)} />
```

`getDayProps` ref'i (tooltip anchor + roving focus), `tabIndex`, ARIA (`aria-label`, `aria-disabled`, `aria-pressed`, `aria-current`, `aria-describedby`), `data-*` durumlarını ve olayları birleştirir. **Sizin handler'ınız önce çalışır; `event.preventDefault()` çağırırsanız paketin o olaydaki işi (seçim, klavye gezinmesi, hover önizleme, focus takibi) atlanır.** Buton dışı element kullanırsanız Enter/Space'i paket yönetir.

**İç içe etkileşim sınırı:** gün zaten bir `<button>`'dır. `renderDayContent` içine buton/link koymayın (geçersiz HTML, klavye sorunları). Gün içinde ayrı bir eylem gerekiyorsa `renderDay` ile kabuğu kendiniz kurup eylemi hücrenin dışına (ör. tooltip/slot) taşıyın.

`DayState` alanları: `date, month, dayOfMonth, dayText, weekday, column, label, today, past, future, disabled, unavailable, readOnly, selected, selectedSingle, selectedStart, selectedEnd, inRange, included, inPreviewRange, previewStart, previewEnd, focused, hovered, action, canStart, canEnd, canPassThrough, dataStatus, loading, reason, reasonText, modifiers, weekStart, weekEnd, monthStart, monthEnd`.

## 9. Yerleşim (container'a göre)

| Prop | Varsayılan | Açıklama |
|---|---|---|
| `orientation` | `horizontal` | `vertical` cihazdan bağımsız |
| `numberOfMonths` | `1` | Her iki yönde |
| `monthPosition` | `1` | Referans ayın 1-tabanlı sırası (bkz. §10) |
| `overflow` | `wrap` | Dar container: `wrap` (satır kır), `scroll` (iç yatay kaydırma), `reduce-months` (efektif ay sayısını düşür) |
| `minDaySize` | `40` | Tıklanabilir gün alanının min boyutu (sayı veya `{ width, height }`) |
| `maxDaySize` | `56` | Hücre yüksekliği üst sınırı |
| `monthGap` | `32` | Aylar arası boşluk |
| `maxBlockSize` | — | Ay alanına iç dikey scroll |
| `fixedWeeks` | `false` | Her ay 6 satır (yükseklik sabit) |

- Min ay genişliği = `7 × minDaySize + 2 × 8px` padding; kolon kararı bu değerden ve container genişliğinden (ResizeObserver, rAF ile birleştirilmiş) verilir. `window.innerWidth` kullanılmaz.
- Tek ay bile sığmıyorsa her stratejide **iç yatay scroll** devreye girer (sayfa taşmaz). Scroll alanı yalnızca ayları kapsar; header/footer slotları ve loading mesajları dışındadır. Scrollbar gizlenmez.
- Klavyeyle odaklanan gün scroll alanında görünür yapılır; sayfa gereksiz kaydırılmaz.
- İstenen ay sayısı sessizce değişmez: yalnızca `reduce-months` seçilirse azalır ve `onLayoutChange` → `{ requestedMonths, effectiveMonths, requestedMonthPosition, effectiveMonthPosition, columns, activeOverflow, atMinDaySize }` bildirilir.
- Resize sırasında seçim ve focus korunur.

## 10. Gezinme, ay konumu, ay yükleme

Üç ayrı ayar: yerleşim (`orientation`), gezinme (`navigation: 'paged' | 'continuous'`), ay ekleme (`loadMore: 'button' | 'auto' | 'manual'`).

**Referans ay** = `visibleMonth` / `defaultVisibleMonth` / `goToMonth` hedefi; yoksa seçimin ayı, o da yoksa bugünün ayı.

- `numberOfMonths={2} monthPosition={1}` → referans + sonraki; `{2, 2}` → önceki + referans; `{3, 2}` → önceki + referans + sonraki. Sıra her zaman kronolojiktir (RTL'de de; fiziksel yön `dir` ile çevrilir).
- Geçersiz konum `1..numberOfMonths` aralığına sıkıştırılır; efektif ay sayısı azalırsa ona göre tekrar sıkıştırılır.
- min/max: pencere max'ı aşarsa geri, min'den önce başlarsa ileri kaydırılır (sıra değişmez). Erişilebilir aralık pencereden kısaysa pencere min'de başlar.
- `disablePast` / `disableFuture` yalnızca gün seçimini kısıtlar, pencereyi kaydırmaz (ör. `monthPosition={2} disableFuture` bugün Ekim iken Eylül + Ekim gösterir).

**Programatik gezinme:** `ref.goToMonth('2026-12', { focus?, behavior? })` → `{ month, clamped }`. Seçimi değiştirmez. min/max dışındaki hedef en yakın izinli aya sıkıştırılır ve `clamped: true` döner. Takvim "ilk müsait ayı" kendisi aramaz/veri istemez; hedefi uygulama verir (demo: "İlk müsait tarihe git").

**"Daha fazla tarih" kontrolleri:** varsayılan buton kalır; yalnızca içeriği değiştirmek için `loadMoreLabels={{ previous: <…/>, next: <…/> }}` (ReactNode), tamamen farklı bir kontrol için `renderLoadMore({ direction, canLoad, loading, loadMore, label })`, kontrolü takvimin dışına (ör. footer) taşımak için `loadMore="manual"` + `ref.loadMore('next')`.

**Continuous mod:** başlangıçta yalnızca `numberOfMonths` ay render edilir; `monthsPerLoad` kadar önceki/sonraki ay eklenir, min/max'ta durur. Önceki aylar eklenirken scroll konumu korunur. DOM sınırı `maxRenderedMonths` (varsayılan 24) — aşılınca karşı uçtan ay düşülür (odaktaki ay asla). Render edilmemiş uzak bir aya `goToMonth`, ara ayları render etmeden listeyi o aya göre yeniden kurar. Liste var olan aylar arasında atlanırsa yeniden merkezlenmez; yalnızca kaydırılır.

## 11. Veri yükleme (sahibi uygulama)

Takvim fetch yapmaz. Uygulama `getDataStatus(month)` ile ay durumunu verir; `unknown/loading/error` günler varsayılan olarak seçilemez (`unknownDataPolicy: 'allow'` ile değiştirilebilir).

- `onRenderedMonthsChange({ months, added, removed })` ile istek başlatın (ilk mount'ta da gelir).
- `loading` prop'u: takvim geneli ilk yükleme. `renderLoading({ scope: 'initial' | 'month' | 'load-more', months, status })`, `renderError({ months, retry })`, `onRetry(months)`.
- Varsayılan ay/ay-ekleme yükleme görünümü **yalnızca gün iskeletidir**: her gün için eşit boyutlu bir hap (rakam genişliğinden bağımsız), görünür "Yükleniyor" yazısı yok. Ekran okuyucular için gizli durum metni, kök `aria-busy` ve canlı bölge duyurusu vardır. Görünür bir gösterge isterseniz `renderLoading` verin.
- `onLoadingChange` yalnızca durum geçişlerinde gelir.

**Hızlı gezinmede bayat veri koruması** (`apps/demo/src/data.ts`): her ay kendi `AbortController`'ı ve sıra numarasıyla istenir; yanıt yalnızca istendiği aya ve hâlâ güncel istekse yazılır; artık render edilmeyen ayların istekleri iptal edilir.

## 12. Tooltip

`getDayTooltip({ day, data })` → `ReactNode | { content, persistent }`; `renderDayTooltip({ day, content, trigger, placement })`; `tooltip={{ placement, boundary, offset, className, container, openDate }}` (controlled açık tarih). Varsayılan: devre dışı/müsait olmayan günlerde sebep metni (geçmiş/sınır dışı hariç), bugün için "Bugün".

- `boundary: 'calendar'` (varsayılan): tooltip takvimin ay alanının içinde kalır — takvimin dışına taşmaz, ay alanının üstündeki başlık/hafta günü satırının üzerine çıkmaz. `'viewport'`: takvim dışına taşabilir, pencere içinde kalır.
- Yerleşim sırası: tercih edilen taraf (`placement`, varsayılan `top`) → karşı taraf → sağ → sol; tamamen sığan ilk taraf seçilir, diğer eksende sınır içine kaydırılır. Genişlik sınıra göre ayarlanır ve metin satır kırar; metin asla kesilmez. Hiçbir taraf tam sığmazsa en çok yer olan üst/alt taraf kullanılır.

- Tetikleyiciler: hover, klavye focus'u, dokunmatikte dokunma (reddedilen güne dokununca açıklama açılır), `persistent` (ör. başlangıç seçildikten sonra "Çıkış tarihini seçin").
- Anchor doğrudan ref'tir; DOM araması yoktur. Portal + `position: fixed`; scroll/resize'da rAF ile yeniden konumlanır, viewport içine sıkıştırılır, yer yoksa ters yöne döner; gün, scroll alanının dışına çıkınca gizlenir.
- İskelet olarak çizilen günlerde (ay verisi `loading`/`unknown` veya `loading` prop'u açık) hiçbir tooltip gösterilmez — varsayılan, `getDayTooltip` ve persistent olanlar dahil.
- Tooltip `pointer-events: none` — seçimle çakışmaz. Sebep metni her zaman gün butonunun `aria-label`'ında da vardır; tooltip tek bilgi kaynağı değildir.

## 13. Slotlar ve dış kontroller

`renderHeader`, `renderFooter`, `renderMonthHeader`, `renderNavigation`, `renderLoading`, `renderError`, `renderLoadMore`, `renderDayTooltip`. Slot context'i: `selection, activeEndpoint, phase, validation, referenceMonth, visibleMonths, renderedMonths, layout, focusedDate, today, actions (controller), messages, locale, formatDate`.

Saat, check-in/check-out, fiyat, "Özel tarih", Temizle/Kaydet tüketicinin state'inde yaşar:

```ts
const [booking, setBooking] = useState({ dates, checkInTime: '14:00', checkOutTime: '09:00' });
<Calendar value={booking.dates} onChange={(dates) => setBooking((b) => ({ ...b, dates }))}
          ruleContext={booking}   // saat kuralları etkiliyorsa
          renderFooter={(ctx) => <MyTimeAndPriceControls … onClear={ctx.actions.clear} />} />
```

Inline takvim kendiliğinden kapanmaz; popup/modal açma-kapama uygulamaya aittir. `onOutsideClick` React ağacındaki (portal tooltip ve slotlardaki portallar dahil) olayları "içeride" sayar.

## 14. Olaylar

Tümü typed; `onEvent(e)` aynı olayları discriminated union olarak (özel callback'ten sonra, ek iş yapmadan) verir.

| Callback | Ne zaman |
|---|---|
| `onReady` | Mount + ilk layout ölçümü bitti, controller kullanılabilir (veri yüklendi anlamına gelmez). |
| `onDateClick` | Pointer/klavye ile gün aktivasyonu girişimi; `accepted`, `kind`, `issue`. Disabled günlerde de gelir. |
| `onChange(value, e)` | Kabul edilen kullanıcı/controller eylemi. `e`: `previous, source, reason, date, phase, validation`. Controlled prop değişiminde gelmez. |
| `onSelectionComplete` | single: seçim; range: bitiş; multiple: `maxSelections`'a ulaşınca. Render'larda tekrarlanmaz. |
| `onSelectionClear` | Seçim boşaldığında. |
| `onInvalidSelection` | Reddedilen girişim (`issue`, `message`). |
| `onValidationChange` | Doğrulama sonucu değişince (`cause: initial/selection/rules`). |
| `onActiveEndpointChange` | Sonraki tıklamanın ucu değişince. |
| `onVisibleMonthChange(month, e)` | Referans ay kullanıcı/controller ile değişince (`reason: previous/next/jump/keyboard`, `clamped`). |
| `onVisibleMonthsChange` | Görünen ay listesi (continuous'ta IntersectionObserver ile). İlk mount'ta da gelir. |
| `onRenderedMonthsChange` | DOM'daki aylar (`added/removed`). İlk mount'ta da gelir. |
| `onLoadMore` | Ay eklendi (`direction, months, trigger`). |
| `onLoadingChange` | Dış loading durumu geçişi. |
| `onResize` | Takvim kökünün ölçüsü; `previous`/`current` width/height. İlk ölçümde `previous: null`. Aynı ölçü tekrar bildirilmez, rAF ile birleştirilir; `resizeThreshold` yalnızca bildirimi seyreltir, yerleşimi geciktirmez. |
| `onLayoutChange` | Yapısal layout değişimi (yön, kolon, efektif ay/konum, overflow, min boyut). |
| `onDayFocusChange` | Roving focus tarihi değişince. |
| `onTooltipOpenChange` | Açık tooltip tarihi değişince. |
| `onOutsideClick` | Takvim ağacı dışındaki pointerdown. |
| `onScroll` | Ay alanı kaydırıldı (frame başına bir). |

**Sıra** (test edildi): başlangıç tıklaması `dateClick → dayFocusChange → change → activeEndpointChange`; bitiş tıklaması `… → change → activeEndpointChange → selectionComplete`; reddedilen `dateClick → (dayFocusChange) → invalidSelection`. Türetilmiş durum olayları (`validationChange`, `visibleMonthsChange`, `renderedMonthsChange`, `loadingChange`, `layoutChange`, `tooltipOpenChange`) commit'ten sonra effect'te gelir.

Callback'ler render sırasında çağrılmaz; kimlik değişimi olayı yeniden üretmez. **StrictMode:** geliştirmede React effect'leri simüle unmount/remount ile iki kez çalıştırır; `onReady` her (simüle) mount için gelebilir. Paket "uygulama ömrü boyunca bir kez" garantisi vermez; gerçek remount'ta olaylar yeniden gelir. Kullanıcı eylemi olayları StrictMode'da çift gelmez (test edildi).

`onUpdate` ayrıca sunulmadı: `onEvent` anlamlı geçişleri zaten tek noktadan verir.

## 15. Birden fazla takvim

Bağımsız takvimler farklı locale/tema/yön/mod ile aynı sayfada çalışır; global state, global locale veya stil sızıntısı yoktur; ID'ler `useId` ile instance başına benzersizdir.

Senkron kullanım için gizli store yoktur — ortak state'i siz verirsiniz:

| Durum | Varsayılan |
|---|---|
| Seçim | Ortak `value` verilirse ortak |
| Müsaitlik/kurallar | Ortak kaynaktan |
| Görünen ay | Instance'a özel; controlled `visibleMonth` ile ortak |
| `activeEndpoint` | Controlled verilirse ortak; verilmezse değerden türetilir (yine tutarlı) |
| Focus, hover, tooltip, render edilen ay sayısı | Instance'a özel |

Sonradan mount olan takvim güncel değeri gösterir; birinin unmount olması ortak seçimi sıfırlamaz (test + demo: inline/modal/portal).

## 16. Dil, yön ve stiller

- `locale` (varsayılan `en-US`, SSR'da deterministik), `direction` (varsayılan locale'den: ar/he/fa/ur… → rtl), `firstDayOfWeek` (varsayılan statik bölge tablosundan), `weekdayFormat`, `monthTitleFormat` (Intl seçenekleri), `formatMonthTitle`/`formatWeekday`/`formatDayLabel` callback'leri. Moment token'ları yoktur.
- Varsayılan görünüm: seçili gün koyu daire; aralık bandı uç günlerin merkezinden başlar; **başlangıç ve bitiş günlerinde dış tarafta yarım halka** (`--cal-ring`) vardır, böylece hangisinin başlangıç hangisinin bitiş olduğu anlaşılır; tek günlük seçim düz dairedir. **Bugün** ince bir çember ile gösterilir (`--cal-today`), üzerine gelince "Bugün" tooltip'i açılır ve `aria-label`'da "bugün" okunur (rakamın altı çizilmez, fiyat/etiketlerle çakışmaz). İşaret opsiyoneldir: `highlightToday={false}` çemberi ve tooltip'i kapatır (`day.today` ve aria metni korunur).
- Bant sözleşmesi: hücrede `data-band="start" | "mid" | "end"` (seçili aralık ya da hover önizlemesi; önizlemede ayrıca `data-band-preview`). Tek günlük seçimde bant ve yarım halka yoktur.
- Salt okunur takvimlerin üstünde "Yalnızca görüntüleme — tarih seçilemez" bildirimi gösterilir (`messages.readOnlyNotice`, `''` gizler; `classNames.readOnlyNotice`), günler normal kalınlıkta ve hover efektsizdir.
- `messages`: kısmi override. Hazır paketler: `messagesEn` (varsayılan), `messagesTr`, `messagesDe`, `messagesFr`, `messagesEs`, `messagesIt`, `messagesNl`, `messagesAr` (tree-shake edilir).
- Stil: `import 'calendar-kit/styles.css'` (JS CSS import etmez). Özelleştirme sırası: **CSS değişkenleri** (`--cal-accent`, `--cal-range`, `--cal-preview`, `--cal-focus`, `--cal-circle`, `--cal-radius`, …) → **`data-*` durum öznitelikleri** (`data-range-start`, `data-in-range`, `data-disabled`, `data-mod-*`, …) → **`classNames`** (`root, header, footer, viewport, months, month, monthHeader, monthTitle, navigation, navButton, weekdays, weekday, grid, week, dayCell, dayButton, dayContent, rangeBackground, tooltip, loadMore, loading, error, liveRegion, readOnlyNotice`; `dayCell/dayButton/dayContent` fonksiyon da alır) → **`unstyled`** (varsayılan sınıf adları hiç eklenmez). `!important` gerekmez.

Görsellerdeki ürün görünümü yalnızca bu araçlarla üretildi: `apps/demo/src/demo.css` → `.ref-look`.

## 17. Erişilebilirlik

- Her ay `role="grid"`, haftalar `row`, günler `gridcell` + `<button>`; tek `tabIndex=0` (roving).
- Klavye: oklar (RTL'de yatay oklar ters), `Home`/`End` (hafta başı/sonu), `PageUp`/`PageDown` (ay), `Shift+PageUp/Down` (yıl), `Enter`/`Space` (seç), `Escape` (geçici tooltip/hover kapat). Pencere dışına çıkan focus ay değiştirir ve focus kaybolmaz.
- `aria-label`: tam tarih + bugün/başlangıç/bitiş/aralıkta + engel sebebi. Engelli günler `aria-disabled` ile odaklanabilir kalır (sebep okunabilir).
- Canlı bölge: seçim, ret ve yükleme duyuruları.
- Ay ekleme/pencereleme sırasında focus korunur; "daha fazla" butonu sınırda kaybolursa focus yeni eklenen ilk güne taşınır.
- **Modal/portal sorumlulukları:** açma/kapama, focus'u içeri taşıma, focus trap ve kapatınca geri döndürme **uygulamanındır** (demo: native `<dialog>.showModal()`). Paket yalnızca kendi grid'i içindeki focus'u yönetir ve dış focus'u çalmaz.

## 18. SSR / Next.js

Import sırasında global/DOM değişikliği yoktur; render'da `window`/`document` okunmaz. `today` (veya `defaultVisibleMonth`/`value`) verilirse sunucu tam ay HTML'i üretir ve hydration uyumsuzluğu oluşmaz (test edildi). Hiçbiri verilmezse sunucu ay tahmin etmez; yükleme yer tutucusu render edilir ve istemci ilk render'da tamamlar. Locale varsayılanları statik tablolardan gelir (sunucu/tarayıcı farkı yok). Next.js App Router'da `'use client'` bileşeni içinde kullanın.

## 19. react-dates `DayPickerRangeController` karşılıkları

| react-dates | calendar-kit |
|---|---|
| `startDate`, `endDate` (moment) | `value={{ start, end }}` (`'YYYY-MM-DD'`) |
| `onDatesChange({ startDate, endDate })` | `onChange(value, e)` (`e.reason`, `e.phase`, `e.validation`) |
| `focusedInput` / `onFocusChange` | `activeEndpoint` (`'start' \| 'end'`) / `onActiveEndpointChange`. `null` (kapalı) kavramı yok: kapanma uygulamaya ait |
| `initialVisibleMonth={() => …}` | `defaultVisibleMonth` (yoksa seçimin ayı); controlled: `visibleMonth` + `onVisibleMonthChange` |
| `numberOfMonths={mobileView ? n : 2}` | `numberOfMonths` + `overflow` (container'a göre, `mobileView` gerekmez) |
| `orientation` | `orientation` |
| `daySize={Math.ceil(window.innerWidth / 7 …)}` | Gerek yok: hücreler container'a göre ölçeklenir; `minDaySize`/`maxDaySize` |
| `horizontalMonthPadding` | `monthGap` + CSS `--cal-month-padding` |
| `minDate` / `maxDate` (moment) | `minDate` / `maxDate` (`CalendarDate`) |
| `isDayBlocked(d)` | `rules.getDayAvailability(d) → { closed: true }` veya `closedDates(...)`; konaklamada `stayRules({ getDayStatus })` |
| `minimumNights={0}` | `stayRules({ allowSameDay: true })` (0 gece) veya `minNights` |
| `firstDayOfWeek={1}` | `firstDayOfWeek={1}` (varsayılan locale'den) |
| `weekDayFormat="ddd"` | `weekdayFormat="short"` (Intl) |
| `keepOpenOnDateSelect` | Varsayılan davranış (inline, kapanmaz) |
| `hideKeyboardShortcutsPanel` | Panel yok |
| `onOutsideClick` + `closest('.calendarLabelRef')` | `onOutsideClick` (React ağacı/portal farkında) — DOM araması gerekmez |
| `navPrev` / `navNext` | `renderNavigation` veya `renderMonthHeader` |
| Mobilde `navPrev/navNext` = "Daha fazla tarih göster" | `navigation="continuous"` + `renderLoadMore`/`messages.loadNext` |
| `calendarInfoPosition="bottom"` + `renderCalendarInfo` | `renderFooter(ctx)` (veya `renderHeader`) |
| `renderDayContents(d)` | `renderDayContent({ day, data })` veya `renderDay` + `getDayProps` |
| `renderDayContents` içinde Tippy + `<i hidden>` + `querySelector/closest` ile `appendTo` | `getDayTooltip(({ day }) => day.selectedStart && !end ? { content: …, persistent: true } : null)` — anchor ref ile, portal'da, kırpılmaz |

Örnek geçiş:

```tsx
<Calendar
  mode="range"
  locale="tr-TR"
  messages={messagesTr}
  value={dates}
  onChange={setDates}
  activeEndpoint={endpoint}
  onActiveEndpointChange={setEndpoint}
  numberOfMonths={2}
  overflow="reduce-months"
  minDate={startOfThisMonth}
  maxDate={endOfYearPlus2}
  rules={stayRules({ allowSameDay: true, getDayStatus: (d) => (blocked(d) ? 'booked' : 'available') })}
  getDayTooltip={({ day }) => (day.selectedStart && !dates.end ? { content: t('detail.calendar.select-same-day'), persistent: true } : null)}
  renderFooter={(ctx) => <CustomCalendarContents ctx={ctx} />}
  onOutsideClick={() => toggleCalendar('hide')}
/>
```

Bilinçli farklar: react-dates `focusedInput=startDate` iken bitişten önceki tıklamada bitişi korur; burada tamamlanmış aralıktan sonra tıklama **yeni aralık** başlatır (bitişi düzenlemek için `activeEndpoint="end"`).

## 20. Ölçümler

**Bundle** (`npm run size`, rolldown minify, React hariç):

| | min | gzip | brotli |
|---|---|---|---|
| Tümü (`export *`) | 65.7 kB | 22.5 kB | 20.0 kB |
| Tipik: `Calendar` + `stayRules` + `messagesTr` | 55.7 kB | 19.1 kB | 17.4 kB |
| Yalnız çekirdek (motor + adaptör + tarih) | 8.3 kB | 3.0 kB | 2.8 kB |
| `styles.css` | 9.8 kB | 2.6 kB | 2.2 kB |

**Etkileşim** — Chrome, production React (`PROFILE=1` build), React Profiler `actualDuration` (takvim alt ağacının render+commit işi), 5 tekrarın medyanı:

| Ay / gün | Başlangıç tıklaması | Hover önizleme | Sonraki ay |
|---|---|---|---|
| 1 / 31 | 1.1 ms | 0.9 ms | 1.7 ms |
| 2 / 61 | 2.3 ms | 1.4 ms | 2.1 ms |
| 3 / 91 | 2.9 ms | 1.5 ms | 2.4 ms |
| 12 / 365 | 15.9 ms | 5.9 ms | 10.1 ms |

Render sayısı (jsdom, `test/perf.test.tsx`, assert edilir): hover başına ortalama 2.75 gün hücresi render edilir (2 veya 12 ay fark etmez). Başlangıç seçimi tüm günlerin uygunluğunu değiştirdiği için tam geçiş yapar (beklenen). Tarih motoru 365 gün için ~0.34 ms (Node mikro ölçüm).

Ölçüm notu: 12 ayda tıklama ~16 ms'dir; çok uzun listeler için `navigation="continuous"` + makul `maxRenderedMonths` önerilir.

## 21. Dağıtım, destek, lisans

- `dist/index.js` (ESM, sourcemap), `dist/types/**/*.d.ts`, `dist/styles.css`. `exports`: `"."`, `"./styles.css"`. `sideEffects: ["*.css"]`. React/ReactDOM bundle'a dahil değil.
- React: peer `>=18.2` (`useId`, `useSyncExternalStore` gerekir). Testler React 19.3 ile çalıştırıldı; React 18 ile ayrıca test edilmedi.
- Tarayıcılar (container query `cqmin` + `color-mix`): Chrome/Edge 111+, Safari 16.2+, Firefox 113+.
- Lisans: MIT (varsayım — yayın öncesi onaylanmalı; `LICENSE`).

## 22. Desteklenen davranışlar ve bilinen sınırlar

Kapsam dışı (ilk sürüm, tasarım engellemiyor): birden fazla bağımsız aralık, Gregoryen dışı takvimler, saat seçici, tekrar eden rezervasyon motoru, çok günlük etkinlik yerleşimi, fiyat/kapasite hesabı, popup/modal yönetimi.

Bilinen sınırlar:
- Continuous modda DOM sınırı ay bazlı kırpma ile sağlanır; ölçüme dayalı sanal kaydırma (virtualization) yok — ölçümler buna gerek göstermedi.
- `requireReachableEnd` aramaları `maxLength` yoksa başlangıçtan en fazla ~62 gün ileri bakar.
- Tooltip `container`'ı CSS `transform` içeren bir elementse `position: fixed` o elemente göre konumlanır; varsayılan `document.body` önerilir.
- Ay sayısı JS'te `minDaySize` ve sabit 8px ay padding'i ile hesaplanır; `unstyled` kullanımda kendi CSS'inizin bu ölçülerle uyumlu olması gerekir.
- Hover önizlemesi aylar arası her render'da tüm gün durumlarını yeniden hesaplar (12 ayda 5.9 ms); ay düzeyinde memo gerekirse ileride eklenebilir.
