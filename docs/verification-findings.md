# Doğrulama bulguları — takip listesi

Kaynak: `checkpoint/verification-start` (da02d87) üzerinde yapılan doğrulama.
Her bulgunun tekil bir kimliği var (`F01`…). Önceki rapordaki "8 sorun" ifadesi
tutarsızdı: ayrıntılı listede 6 yüksek, 9 orta grup (bazıları birden çok
alt bulgu içeriyordu) ve ayrı düşük maddeler vardı. Bu liste tek kaynaktır.

Durum: `açık` · `düzeltildi` · `sözleşme` (davranış belgelendi, kod değişmedi) ·
`yeniden üretilemedi` · `doğrulanamadı`.
Kanıt: `kanıtlandı` (test/ölçüm ile) · `şüphe`.

## Sayım (çakışmasız: 55 bulgu kimliği, F39 ve F50 alt maddelere bölündü → 58 madde; + 8 şüphe/gözlem; S04 iki alt maddeye bölündü)

Her madde tam olarak bir grupta sayılır.

| Grup | Sayı | Maddeler |
|---|---|---|
| Düzeltildi | 55 | F01–F26, F28, F30, F32–F38, F39a, F39b, F40–F46, F48, F49, F50a, F50c, F51, F52, F53, F54, F55, S04a, S04b |
| Yalnızca belgelendi (davranış bilinçli olarak aynı) | 5 | F27, F29, F31, F47, F50b |
| Beklenen davranış (gerekçe ve kanıt aşağıda) | 4 | S03, S05, S06, S07 |
| Doğrulama engeli (gereken ortam ve adımlar aşağıda) | 1 | S08 (yeniden üretilemeyen geliştirme hatası) |
| Açık | 0 | — |
| Bulguya dönüştü (ayrıca sayılmaz) | 2 | S01 → F35, S02 → F34 |

F52, F53, F54, F55, S04a ve S04b `fix/open-findings` branch’inde düzeltildi (PR #4). Ortam
kontrollerinin durumu en sonda, “Ortam matrisi” bölümünde.

Ek (bulgu değil, kullanıcı isteği): `calendar-kit/client` (`'use client'`) ve
`calendar-kit/core` (React'siz) giriş noktaları; `calendar-kit` değişmedi.

| ID | Öncelik | Bulgu | Kanıt | Durum |
|---|---|---|---|---|
| F01 | 1 | node16/nodenext TS tüketicilerinde `.d.ts` göreli import'ları çözülmüyor; `skipLibCheck: true` ile tipler sessizce `any` | kanıtlandı (tüketici app) | düzeltildi |
| F02 | 2 | `combineRules`: sonraki kural setindeki açık `undefined` değer önceki kuralı siliyor (validator, availability, rangeSemantics…) | kanıtlandı | düzeltildi |
| F03 | 3 | `relaxRules(combineRules(A, B))`: aynı günde program kısıtı + gerçek kısmi kısıt varsa gün tamamen kapalı kalıyor | kanıtlandı | düzeltildi |
| F04 | 4 | `maxRenderedMonths`: bir güne bir kez odaklanıldıktan/tıklandıktan sonra sınır uygulanmıyor | kanıtlandı | düzeltildi |
| F05 | 5 | Gün hücresi memo anahtarı eksik: `firstDayOfWeek`, `canStart/canEnd/canPassThrough` vb. değişince hücre eski kalıyor | kanıtlandı (belirli koşulda) | düzeltildi |
| F06 | 6 | Bugünün tarihinde klavye odak halkası görünmüyor (CSS özgüllüğü) | kanıtlandı (özgüllük) | düzeltildi |
| F07 | 6 | Controlled `visibleMonth` ebeveyn tarafından güncellenmezse bekleyen focus sonra odağı çalıyor; roving tabindex senkron dışı | kanıtlandı | düzeltildi |
| F08 | 6 | `focusDate(d)` / `goToMonth(m,{focus})` hedef zaten odak tarihi ise hiçbir şey yapmıyor; bekleyen focus sonra tetiklenebiliyor | kanıtlandı | düzeltildi |
| F09 | 6 | Continuous modda `goToMonth` aynı aya kaydırmıyor; kaydırma sonra alakasız bir render'da oluyor | kanıtlandı | düzeltildi |
| F10 | 7 | `boundary="calendar"` tooltip sayfalı modda ay başlığını/hafta günü satırını örtüyor | kanıtlandı (demo ölçümü) | düzeltildi |
| F11 | 7 | Hiçbir tarafa sığmayan tooltip ana eksende sınır dışına çıkıyor (metin kesilebilir) | kanıtlandı | düzeltildi |
| F12 | 7 | Escape, odak/persistent tooltip'i kapatmıyor | kanıtlandı | düzeltildi |
| F13 | 7 | Dokunmatik tooltip, `onOutsideClick` verilmemişse dışarı dokununca kapanmıyor | kanıtlandı | düzeltildi |
| F14 | 7 | Dışarıdan Tab ile gelindiğinde odak tooltip'i ve önizleme gösterilmiyor | kanıtlandı | düzeltildi |
| F15 | 8 | RTL CSS seçicileri takvimin kendi yönüne değil, atadaki `dir`'e bakıyor | kanıtlandı (`matches`) | düzeltildi |
| F16 | 9 | `loading` prop'u görünür "Yükleniyor…" yazısı gösteriyor; günler iskelete dönmüyor | kanıtlandı (davranış); kullanıcı (b)'yi seçti | düzeltildi |
| F17 | 9 | "Hareketi azalt" iskelet parıltısını durdurmuyor (CSS özgüllüğü) | kanıtlandı (özgüllük) | düzeltildi |
| F18 | 9 | Continuous liste yeni `minDate`/`maxDate` dışındaki ayları tutuyor | kanıtlandı | düzeltildi |
| F19 | 9 | Ebeveyn controlled değeri reddettiğinde `onActiveEndpointChange` yine gönderiliyor (gerçek geçiş değil) | kanıtlandı | düzeltildi |
| F20 | 9 | Özel `renderLoadMore` kontrolü sınırda kaybolunca odak kayboluyor | kanıtlandı | düzeltildi |
| F21 | 9 | Tooltip tema değişkenleri portala ulaşmıyor; `.cal-tooltip` `--cal-tooltip-bg`'yi kendisi sıfırlıyor | kanıtlandı (kod) | düzeltildi |
| F22 | 9 | Demo: konaklama "Özel tarih" anahtarı ve mobil `loadMoreLabels` kayıp (dosya dışarıdan üzerine yazılmış) | kanıtlandı | düzeltildi |
| F23 | 9 | Yayımlanan `exports`'taki `source` koşulu tarball'da olmayan `src/`'yi gösteriyor | kanıtlandı (pack) | düzeltildi |
| F24 | 9 | README: reddedilen tıklama olay sırası "test edildi" deniyor ama test yok; Escape iddiası; DayState listesinde `outOfSchedule` yok; test yorumu yanlış ("Exclusive semantics") | kanıtlandı (okuma) | düzeltildi |
| F25 | düşük | `reachableEndIssue` gerçek sebep ne olursa olsun `min-length` raporluyor ("Minimum 0 gece" dahil) | kanıtlandı | düzeltildi |
| F26 | düşük | Ulaşılabilir bitiş araması en fazla 63 bitiş adayına bakıyor; sınır dolunca "geçerli bitiş yok" diye başlangıcı reddediyordu (80 gece sonraki geçerli bitiş kaçıyordu) | kanıtlandı (test) | düzeltildi (sınır aynı; sınır dolması artık ret sebebi değil, public API değişmedi) |
| F27 | düşük | `stayRules({ allowSameDay: true, minNights: 1 })` aynı gün konaklamaya izin vermiyor | kanıtlandı | sözleşme (belgelendi) |
| F28 | düşük | Çoklu modda tekrarlanan tarihlerde `plan()` ve `validate()` sayımı tutarsız | kanıtlandı | düzeltildi |
| F29 | düşük | `onVisibleMonthChange` için load-more sebebi yok | kanıtlandı (okuma) | sözleşme (belgelendi) |
| F30 | düşük | Etiket genişliği daire yerine hücreye göre; 40 px hücrede etiket köşeleri bugün halkasına değiyor | kanıtlandı (Chrome ölçümü: 61/61 etiket) | düzeltildi |
| F31 | düşük | `addDays` yıl 1–9999 dışına çıkabiliyor; `eachMonth` 9999'da tekrar ay üretiyor; geçersiz `timeZone` hata fırlatıyor | kanıtlandı | sözleşme (belgelendi) |
| F32 | düşük | (a) `today` prop'u yokken görünen ay gece yarısı kayıyor; (b) kontrolsüz modda mod değişimi eski seçimi geri getiriyor | kanıtlandı (test) | düzeltildi (a ve b; b kullanıcı onayıyla, `onChange` gönderilmeden) |
| F33 | 6 | İskelet (yükleme) günlerinde klavye odak halkası gizleniyor (iskelet kuralı 0,5,1 > odak 0,4,1); F17 düzeltmesi sırasında bulundu | kanıtlandı (özgüllük) | düzeltildi |
| F34 | 9 | Dar (<~300 px) continuous görünümde ortak hafta günü satırı takvim kökünden taşıyor (kırpmayan bir üst öğede sayfayı genişletir) ve aylar yatay kaydırılınca kolonlarla hizasını kaybediyor (S02'den) | kanıtlandı (Chrome: kökten 122 px taşma, hizalama 57 vs −3 px) | düzeltildi |
| F35 | 7 | `transform` içeren portal kabında tooltip kabın konumu kadar kayıyor; dar kapta genişliği kaba göre daralıyor (S01'den) | kanıtlandı (Chrome: +300 px kayma; demo: −332 px boşluk) | düzeltildi |
| F36 | düşük | `calendar-kit/styles.css` export'unun tip bildirimi yok: TypeScript 6+ (`noUncheckedSideEffectImports` varsayılan açık) ortamı `*.css` bildirmiyorsa `import 'calendar-kit/styles.css'` TS2882 verir. Vite (`vite/client`) ve Next'te sorun yok | kanıtlandı (temiz tüketici, TS 7.0.2) | düzeltildi: `exports["./styles.css"].types` → `dist/styles.css.d.ts` (kullanıcı onayıyla) |
| F37 | 6 | `loading` ile ilk yüklemede fareyle seçim (CSS katmanı) engelleniyor ama klavyeyle ve `ref.select()` ile veri bilinmeden seçim yapılabiliyordu | kanıtlandı (test; Chrome) | düzeltildi: tüm yollar aynı `data-loading` doğrulamasından geçer, odak/gezinti ayrı |
| F38 | düşük | `DefaultDayData.icon` + `label` birlikteyken ikon sayının üstünde akışta durduğu için etiket aşağı itiliyor; minimum hücre boyutunda (40 px) etiket bugün/seçim halkasını aşıyor. Yalnızca etiket veya etiket + rozet sorunsuz | kanıtlandı (Chrome, docs "Day content" örneği: 2026-11-01 "★" + "$158", etiketin 2 köşesi halkanın dışında) | açık (dokümantasyon işinde paket davranışı değiştirilmedi) |
| S01 | şüphe | `transform` içeren portal container'da tooltip kayması | yeniden üretildi → F35 | F35'e taşındı |
| S02 | şüphe | 304 px'ten dar continuous görünümde ortak hafta günü satırının taşması | yeniden üretildi → F34 | F34'e taşındı |
| S03 | şüphe | `maxBlockSize` scrollbar'ı eklenince viewport genişliğinin yeniden ölçülmemesi | Chrome 157’de zorlanmış 17 px klasik scrollbar ile ölçüldü (ayrıntı aşağıda) | beklenen davranış |
| S04 | şüphe | (a) boş hücrelerin kolon indeksini kaydırması; (b) `aria-selected` + `aria-pressed` ile durumun iki kez okunması | (a) Chrome erişilebilirlik ağacında ve gerçek VoiceOver’da kanıtlandı; (b) gerçek VoiceOver’da kanıtlandı | (a) düzeltildi, (b) düzeltildi |

## F32 (b): uncontrolled mod değişiminde sıfırlama (uygulandı)

Bugün: seçim mod başına ayrı tutulur; `single → range → single` dönüşünde eski
tekil seçim geri gelir, `onChange` bu geri dönüşü bildirmez.

Öneri (tek, tutarlı kural): uncontrolled kullanımda `mode` değiştiğinde seçim
yeni modun boş değerine sıfırlanır (`single: null`, `range: { start: null, end:
null }`, `multiple: []`), `activeEndpoint` `start` olur, hover önizlemesi
temizlenir. Hiçbir moda ait eski değer saklanmaz. Controlled kullanım değişmez
(değer ebeveynindir). `defaultValue` yalnızca ilk kurulumda okunur.
Uygulamada öneriden tek fark: kullanıcı kararıyla `onChange`/`change`
**gönderilmez** ("dışarıdan prop değişimi onChange tetiklemez" sözleşmesi).
Ayrı bir olay da eklenmedi: sıfırlamayı tetikleyen `mode` prop'u tüketicinin
elindedir; seçimin boşaldığı gerekirse `getSnapshot()` veya `validationChange`
ile okunabilir. Testler: `regressions.test.tsx` F32(b).

## Uyumluluk: npm pack çıktısı temiz tüketicilerde (2026-11-07, F36 ve giriş noktalarından sonra)

Tarball: `calendar-kit-0.1.0.tgz` (32 dosya; yalnızca `dist`, README, LICENSE,
package.json; `dist/styles.css.d.ts`, `dist/client.js`, `dist/core.js` dahil).
Her tüketici ayrı klasörde, yalnızca tarball'dan kuruldu.

| Tüketici | Tipler | Build | SSR / hydration (Chrome) | CSS | Etkileşim |
|---|---|---|---|---|---|
| Düz TypeScript 7.0.2 (Vite/Next tipi yok, `types: []`) | `bundler`, `node16`, `nodenext` (skipLibCheck false): 0 hata; `styles.css` → `dist/styles.css.d.ts` (`--traceResolution`); `/core`, `/client` tipli. `types` koşulu kaldırılınca TS2882 geri geliyor | — | — | — | — |
| Vite 8 + React 19.2.0 | `bundler`, `node16`, `nodenext`, JSX (ortam tipi olmadan da): 0 hata | geçti; bundle'da kaynak yolu yok | `renderToString` + `hydrateRoot` (StrictMode): hata yok | uygulanmış | aralık: 4 gece |
| Vite 8 + React 18.3.1 | aynı: 0 hata | geçti | hata yok | uygulanmış | 4 gece |
| Next.js 16.4.5 App Router (React 19.3.1) | `next build` TypeScript: 0 hata | geçti | `next start` ve `next dev`: hydration hatası yok | `app/layout.tsx` import'u uygulanmış | aşağıda |

Next.js sayfaları (her biri `start` ve `dev` ile):
- **Server sayfası → `calendar-kit/client`**: `Calendar` doğrudan Server
  Component'ten (serileştirilebilir prop'larla) render edildi; SSR HTML'de 122
  gün butonu ve `defaultValue` seçili, tıklama seçimi değiştiriyor, konsol
  temiz. Aynı sayfada `countNights`/`addDays` (`calendar-kit/core`) sunucuda
  hesaplandı.
- **Yalnızca `calendar-kit/core`** kullanan dinamik server sayfası:
  `createSelectionEngine` + `stayRules` sunucuda çalıştı (`plan` → `rejected`,
  2 gece minimumu doğru).
- **Kendi `'use client'` sarmalayıcısı + `calendar-kit`** (mevcut kullanım):
  değişmeden çalışıyor.
- `calendar-kit` girişinden `Calendar`'ı doğrudan Server Component'te render
  etmek önceki gibi build'i durdurur (belgelendi; çözüm `calendar-kit/client`).
- `dist/client.js` ilk satırı `"use client";`; `core.js` React import etmiyor
  (`test/build-output.test.ts`).
- Next'te React 18 denenmedi: App Router kendi React 19 kopyasını kullanır.
- Yapılmayanlar (bekleyen, doğrulanmadı): Safari, Firefox, gerçek mobil cihaz,
  ekran okuyucular (VoiceOver/NVDA).

## Tarayıcı regresyon kontrolleri

Not (2026-11-07, `feature/demo-documentation`): demo dokümantasyon sitesine dönüştü. Kontroller
aynı doğrulamalarla yeni örneklere taşındı (ör. F30 → "Day content", F34 → "Progressive
months", F35 → "Inline, modal & portal" içindeki `<dialog>`; F30 ikonlu günleri kapsamaz,
bkz. F38). Siteye ait D01–D04 kontrolleri eklendi: tüm sayfalar/örnekler hatasız yüklenir,
menü ve başlık odağı, mobil menü + 375 px'te yatay taşma yok, View code sekmeleri + kopyalama.

`npm run test:browser` (playwright-core + sistem Chrome, demo üzerinde) jsdom'un
doğrulayamadığı davranışları gerçek tarayıcıda kontrol eder: F06, F10, F15, F16, F17,
F21, F30, F34, F35 (F34 ve F35 düzeltme öncesi/sonrası ayrıca çalıştırıldı: başarısız → geçti). Aynı betik `checkpoint/verification-start` koduna karşı çalıştırıldığında
altı kontrolün altısı da başarısız oldu; düzeltilmiş kodda altısı da geçiyor.

## F16 notu: `loading` prop'unda görünür yazı neden hata sayılmamalı

- Asıl gereksinim (#10): "Mutlaka renderLoading API'si sun: takvimin ilk yüklenmesi,
  ay verisinin yüklenmesi, daha fazla ay yüklenmesi… Varsayılan skeleton/loading
  görünümü de sağla. Layout kaymasını azalt; aria-busy ve yükleme duyurularını
  destekle." Görünür yazıyı yasaklamıyor; varsayılan bir "loading görünümü" istiyor.
- Sonraki geri bildirim (I): "tarihlerin load sırasında yukarda 'yükleniyor' yazısı
  çıkıyor… bu loader'a gerek bile yok, çünkü günlerin üzerinde loader (skeleton
  olarak) gözüküyor." Bu, **ay verisi** yüklenirken günlerin zaten iskelet olduğu
  durumla ilgiliydi ve o durum düzeltildi.
- `loading` prop'unda (takvim geneli ilk yükleme) günler iskelete dönmüyor; görünür
  gösterge yalnızca bu katman. Yazıyı kaldırmak görünür hiçbir yükleme işareti
  bırakmaz; erişilebilir açıklamayı (`role="status"`, `aria-busy`) kaldırmak da
  #10'a aykırı olur.
- Sonuç: mevcut davranış asıl gereksinime aykırı değil; I ile tutarlılık için iki
  seçenek var: (a) olduğu gibi bırakıp belgelemek (özelleştirme: `renderLoading`),
  (b) `loading` iken günleri de iskelet yapıp görünür yazıyı ekran okuyucuya özel
  metne çevirmek.
- Karar: (b). İlk yükleme (takvim henüz `loading` olmadan gösterilmedi) günleri
  iskelet çizer, görünür yazı yoktur, `role="status"` metni ve `aria-busy`
  korunur, `renderLoading({ scope: 'initial' })` çalışır, hareketi azalt tercihi
  parıltıyı durdurur. Sonraki `loading` arka plan yenilemesidir: görünüm, seçim
  ve odak korunur (`LoadingSnapshot.refreshing`). Testler: `regressions.test.tsx`
  (F16), `styles.test.ts` (F16 reduced motion), tarayıcı kontrolü F16.

## F38–F51: değerlendirme (2026-11-08)

Her madde önce yeniden üretildi (vitest; görsel olanlar gerçek Chrome). Durumlar:
**düzeltildi** (kanıtlanmış hata, mevcut sözleşme korunarak, regresyon testiyle),
**bug değil**, **karar gerekiyor** (davranış sözleşmesi değişikliği; seçenekler aşağıda).

| ID | Tetikleme senaryosu | Beklenen | Gerçek (düzeltme öncesi) | Etki | Test | Durum |
|---|---|---|---|---|---|---|
| F38 | `getDayData` → `{ icon, label }`, 40 px hücre | etiket daire içinde | ikon akışta, etiket 2 köşesiyle halkanın dışında | görsel çakışma | `styles.test.ts` F38, tarayıcı F30 (ikonlu günler dahil, ikon hücre içinde) | düzeltildi |
| F39a | `addDays(d, 1.5)`, `addMonths(d, 1.5)` | geçerli tarih | `"2026-01-2.5"`, `"2026-2.5-28"` | geçersiz `CalendarDate` | `date-arithmetic.test.tsx` | düzeltildi (sıfıra doğru kırpma) |
| F39b | `addDays('9999-12-31', 1)` | en yakın sınır (`addMonths` gibi) | `"10000-01-01"`; `addMonths` ise 9999-12'de sıkıştırır | geçersiz `CalendarDate` | `date-arithmetic.test.tsx` | düzeltildi (karar: 0001-01-01…9999-12-31'e sıkıştır; `NaN` → `RangeError`) |
| F40 | `getToday({ now: NaN })`, `fromJSDate(new Date('x'))` | tek tip hata | `timeZone` yokken `null` (tip `CalendarDate`), varken `RangeError` | null sızıntısı | `date-arithmetic.test.tsx` | düzeltildi (her iki yolda `RangeError`) |
| F41 | `mergeMessages(en, { today: undefined })` | temel metin kalır | metin `undefined` olur | boş UI metni | `messages-merge.test.tsx` | düzeltildi |
| F42 | de/fr/es/it/nl/ar paketleri | tam çeviri | 15 sebep + 3 gün etiketi İngilizce, Arapça çoğul tek biçim | karışık dil | `i18n.test.ts` (paketler tiplerle de zorunlu) | düzeltildi |
| F43 | `stayRules({ availableWeekdays: [5, 6] })`, Cuma → Pazar | 2 gece geçerli (hariç bitiş: Pazar sabahı çıkış, gece değil; adapter belgesi "diğer günlerin geceleri kapalı") | Pazar `closed/out-of-schedule` ile reddedildi | geçerli konaklama reddi | `stay-weekdays.test.tsx` | düzeltildi (yalnız adapter; çekirdek ve dahil bitişli aralıklar aynı) |
| F44 | `minNights: 2`, başlangıçtan sonra hiçbir gün çıkışa izin vermiyor | gerçek sebep (`end-not-allowed`, `check-in-only`) | "Minimum 2 gece" | yanlış sebep metni | `engine-reasons.test.tsx` | düzeltildi |
| F45 | `startWeekdays: [1], endWeekdays: [5]`, Pazartesi aynı gün aralığı | `weekday-end` reddi | geçerli sayıldı | kurala aykırı seçim | `engine-reasons.test.tsx` | düzeltildi |
| F46 | `renderLoadMore` sınırda | `canLoad: false` ile çağrı | sınırda hiç çağrılmıyor, `canLoad` hep `true` | alan işlevsiz | `decisions.test.tsx`, F20 testi | düzeltildi (karar: sınırda `canLoad: false` ile çağrılır; varsayılan düğme yine kaldırılır) |
| F47 | `loadDirections="next"`, `ref.loadMore('previous')` | controller yönden bağımsız | önceki ay eklendi | sözleşme belirsiz | — | belgelendi (karar: `loadDirections` yalnız yerleşik kontrol/otomatik yükleme; controller bağımsız) |
| F48 | continuous, controlled `visibleMonth` zaten render edilmiş aya | `goToMonth` gibi kaydırma? | liste yeni aydan yeniden kuruluyor (takılma/kopma yok) | tutarsızlık | `decisions.test.tsx` | düzeltildi (karar: `goToMonth` yolu; prop değişikliği olay göndermez, yansıyan gezinme iki kez kaydırmaz) |
| F49 | `renderDay` + `<div {...getDayProps()}>` | geçersiz öznitelik yok | `type="button"` div'e yazılıyor | HTML geçersizliği (işlev etkilenmiyor) | `decisions.test.tsx` | düzeltildi (karar: `getDayProps({ type: null })`, `role="button"`; varsayılan `type="button"`) |
| F50a | continuous, son günde `ArrowRight` | `onLoadMore` (`trigger: 'keyboard'`) | yalnız `renderedMonthsChange` | veri yükleme tetiklenmiyor | `keyboard-loadmore.test.tsx` | düzeltildi |
| F50b | `EventSource` `'resize'`/`'scroll'` | — | hiç gönderilmiyor | yalnız tip | — | belgelendi (karar: union aynı; olay bazında gerçek kaynaklar belgelendi, `resize`/`scroll` ayrılmış) |
| F50c | `ref.select()` tarihsiz sorunla reddedilir | ? | `onInvalidSelection` `date: ''` | geçersiz tarih alanı | `decisions.test.tsx` | düzeltildi (karar: `issue.date` ya da `null`; tip `CalendarDate \| null`) |
| F51 | `select(aynıDeğer)`, eşit değerde `reset()`, sınırda `next()` | değişiklik yoksa olay yok? | `change`/`selectionComplete`, `change`, `visibleMonthChange` (aynı ay, `clamped: true`) | gereksiz olay | `decisions.test.tsx` | düzeltildi (karar: değişiklik yoksa `change`/`visibleMonthChange` yok; programatik aynı değer completion üretmez; kullanıcı yeniden tamamlaması `selectionComplete` üretir; `invalidSelection`/`dateClick` bastırılmaz) |

Kalan açık: **0**. Kararlar 2026-11-07'de verildi (aşağıdaki seçenekler kayıt için duruyor).

### Karar seçenekleri

- **F39b** (yıl aralığı dışı): (a) belgelendiği gibi tanımsız bırak; (b) `addMonths` gibi 0001-01-01/9999-12-31'e sıkıştır; (c) `RangeError` fırlat. Öneri: (b) — iki fonksiyon tutarlı olur, hiçbir zaman geçersiz metin üretilmez.
- **F46** (`canLoad`): (a) sınırda da `renderLoadMore({ canLoad: false })` çağır (özel kontroller sınırda görünür hale gelir — davranış değişikliği); (b) mevcut davranışı koru, `canLoad`'ı kullanımdan kaldırılmış say. Öneri: (a) — "tarih kalmadı" gibi bir metin göstermenin tek yolu.
- **F47** (`ref.loadMore` ve `loadDirections`): (a) controller da `loadDirections`'a uysun (izin yoksa işlem yapmasın); (b) `loadDirections` yalnız yerleşik kontrolleri belirlesin, controller bağımsız olsun (mevcut; belgelendi). Öneri: (b).
- **F48** (continuous + controlled `visibleMonth`): (a) ay zaten render edilmişse `goToMonth` gibi kaydır; (b) yeniden kurmayı koru ve belgele. (a)'da ebeveyn `onVisibleMonthChange`'i yansıtıyorsa geri besleme riski var; öneri: (a), kaynak `prop` iken yalnız gerçekten değişen ay için.
- **F49** (`type="button"`): (a) `getDayProps({ type: null })` ile kaldırılabilsin (küçük API eklemesi); (b) belge: `renderDay`'de `<button>` kullanın. Öneri: (a).
- **F50b**: (a) `'resize'`/`'scroll'`u `EventSource`'tan çıkar (tip kırıcı, sürüm notu); (b) ayrılmış değer olarak bırak. **F50c**: (a) `InvalidSelectionEvent.date` `CalendarDate | null` olsun (tip kırıcı); (b) seçimdeki ilgili tarihe (tekil değer / aralık başlangıcı) düş.
- **F51**: (a) değişiklik yoksa olay gönderme (`select` aynı değer, eşit `reset`, sınırda `next`/`previous`); (b) mevcut davranışı koru ve belgele (`clamped: true` sınırı bildirir). Öneri: (a), `next`/`previous` için kesin; `select` için `selectionComplete`'in "onay" olarak kullanıldığı uygulamalar varsa (b).

### F52 (düzeltildi, `fix/open-findings`): `minNights` > `maxNights` olduğunda başlangıç kabulü tutarsız

Bulunduğu yer: dokümantasyon incelemesi (2026-11-15). Düzeltme: 83b9850 — `stayRules`/`dayRangeRules` çakışan değerleri adlandıran bir `RangeError` fırlatır; birleştirilmiş kural setlerinde motor her başlangıcı ve aralığı `conflicting-rules` ile reddeder (`test/f52-conflicting-rules.test.tsx`, üç senaryo ve geçerli sınırlar).

Yeniden üretim (paket kaynağı, vitest/jsdom; `createSelectionEngine` ve `<Calendar mode="range">` aynı sonucu verir):

1. `stayRules({ minNights: 5, maxNights: 3 })`, bütün günler müsait, `today` 2026-11-02.
   - Her başlangıç reddedilir: `plan('2026-11-10')` → `rejected`, `min-length`. Takvimde ayın 30 günü de devre dışıdır; tıklama `invalidSelection` (`min-length`) yayar.
   - Başlangıç 2026-11-10 kabul edilmiş gibi bitişler denendiğinde: 1–4 gece `min-length`, 5–6 gece `max-length`. Hiçbir uzunluk iki koşulu birden sağlamaz.
   - Sorun: sebep metni “en az 5 gece” der; asıl sebep (alt sınırın üst sınırdan büyük olması) bildirilmez.
2. Aynı kurallar + `getDayStatus: () => 'check-in-only'` (hiçbir gün çıkış günü olamaz).
   - Başlangıç **kabul edilir**: `plan('2026-11-10')` → `start`, sorun yok.
   - Ardından her bitiş reddedilir (`end-not-allowed`); aralık hiçbir zaman tamamlanamaz.
   - Sorun: `requireReachableEnd` (adaptörlerde açık) ulaşılamaz bitişli başlangıcı reddetmelidir. `maxLength < minLength` iken arama döngüsü hiç çalışmaz (`core/engine.ts` ulaşılabilir bitiş araması, ~281–317. satırlar); daha kısa bir bitiş de uzunluk kuralı olmadan geçerli olmadığı için `min-length` da dönmez ve başlangıç kabul edilir.
3. Aynı kurallar + yalnızca 11 Kasım dolu: başlangıç yine `min-length` ile reddedilir (1. durumla aynı).

Beklenen (öneri, karar verilmedi): çelişkili uzunluk sınırları hiçbir başlangıca izin vermemeli ve bunu açık bir sebeple bildirmeli (veya `stayRules`/`dayRangeRules` geliştirme ortamında uyarı vermeli). Kapsam: yalnızca yanlış yapılandırma; geçerli sınırlarla (`minNights ≤ maxNights`) etkisi yok.

### F53 (düzeltildi, `fix/open-findings`): `DefaultDayData.markers[].label` hiçbir yerde kullanılmıyordu

Bulunduğu yer: dokümantasyon doğrulaması (2026-11-15). Düzeltme: 3fc8c69 — varsayılan gün içeriğinde etiketler günün erişilebilir açıklamasına eklenir (`description`’dan sonra, büyük/küçük harf duyarsız tekrar yok, etiketsiz noktalar eklenmez; `renderDay`/`renderDayContent` ile eklenmez). DOM bağlantısı `test/f53-marker-labels.test.tsx` ile doğrulandı (`aria-describedby` var olan öğeye bağlanıyor). Gerçek ekran okuyucu (2026-11-24, macOS 26.6.2, Safari 26.6.2, VoiceOver Türkçe): okla 3 Kasım’a gelince VoiceOver “Tuesday, November 3, 2026 Partly booked aç veya kapat düğmesi” dedi; etiket açıklama olarak okunuyor. NVDA/JAWS denenmedi.

Yeniden üretim: `getDayData={() => ({ markers: [{ color: 'red', label: 'Partly booked' }] })}` ile bir takvim render edin.

- Noktalar `<span class="cal-day-markers" aria-hidden="true">` içinde çizilir.
- Her nokta yalnızca `className` ve arka plan rengini alır (`react/Day.tsx`, `DefaultDayContent`).
- `label` ne görünür metne, ne `title`’a, ne de günün `aria-label`/`aria-describedby` değerine eklenir; ekran okuyucular bu bilgiyi almaz.
- Tip yorumu (`react/types.ts`, “each is announced through `description`/`label`”) bunun aksini düşündürür.

Dokümantasyon düzeltildi: `label` kullanılmaz, anlam `description`’a yazılmalıdır. DayContent örneği artık bunu yapar.

Beklenen (öneri, karar verilmedi): ya etiketler günün açıklamasına eklenmeli, ya da alan ve yorumu kaldırılmalı/açıkça “kullanılmaz” diye belgelenmeli.

### F54 (düzeltildi, `fix/open-findings`): `maxRenderedMonths` odak varken aşılabiliyordu

Yeniden üretim (düzeltme öncesi): `navigation="continuous"`, `numberOfMonths={1}`, `monthsPerLoad={1}`, `maxRenderedMonths={3}`; 10 Kasım’a odaklan, dört kez sonraki ayı yükle → liste 5 ay (Kasım–Mart). Kırpma odaktaki ayda duruyor, odak ayrılınca ancak bir sonraki yüklemede yapılıyordu.

Düzeltme: 3277094 — sınır her yüklemede uygulanır. Odaktaki gün kaldırılan bir aydaysa odak önce, kalan aylardan ekranda görünen ve kaldırılana en yakın aydaki aynı güne (ay uzunluğuna ve min/max’a sıkıştırılmış) taşınır; odak sayfadan kaybolmaz. Testler: `test/max-rendered-months.test.tsx` (iki yön, ay sonu sıkıştırma, korunan ay, klavye, odak ayrılınca) ve güncellenen F04 testi. Gerçek tarayıcı: Chrome 157 ve Edge 157’de (geçici test sayfası, `loadMore="auto"`, `maxBlockSize`) tekerlekle 25’er kez aşağı/yukarı kaydırma, 6× PageDown ve 900→360 px yeniden boyutlandırmada liste hiçbir an 3 ayı aşmadı, odak hep ızgarada kaldı.

Tarayıcılar arası doğrulama (2026-11-15, geçici test sayfası: sürekli, `maxRenderedMonths={3}`, `maxBlockSize`): Chrome 157, Playwright Firefox 157 ve Playwright WebKit 27.2’de düğmelerle 4× sonraki → liste Oca–Mar, odak 10 Kas → 10 Oca; 6× önceki → Tem–Eyl, odak 10 Eyl; tekerlekle 20’şer aşağı/yukarı kaydırma, 6× PageDown ve 360 px’e küçültmede liste hiçbir an 3 ayı aşmadı, odak hep ızgarada kaldı. WebKit sonucu Safari veya iPhone sonucu değildir.

Gerçek Safari 26.6.2 (macOS 26.6.2, `safaridriver` ile gerçek fare/klavye olayları, 2026-11-24, aynı tür geçici sayfa): düğmelerle 4× sonraki → Oca–Mar, 6× önceki → Tem–Eyl; 4× PageDown → Oca–Mar, odak 10 Mar; 8× PageUp → Tem–Eyl, odak 10 Tem; `loadMore="auto"` ile tekerlekle 20’şer aşağı/yukarı → odak 10 Tem ve 10 Ağu, hep kalan bir ayda. Liste hiçbir an 3 ayı aşmadı. Not: Safari tıklanan düğmeye odaklanmadığı için, yükleme düğmesine fareyle tıklamak odaktaki günü daha hiçbir ay kaldırılmadan `<body>`’ye düşürür (tek tıklamada da, ay kaldırılmadan da aynı); bu Safari’nin düğme davranışıdır, F54 ile ilgili değildir. Klavye ve kaydırma yollarında odak doğru taşınır.

Ay yükleme süresi (production build, Chrome 157, 20 yükleme, düzeltme öncesi 3fc8c69 → sonrası): odak listede değilken medyanlar ±1 ms; odak listedeyken 4× yavaş CPU’da sonraki ay işleme 8.5 → 6.3 ms (öncesinde liste sınırı aşıp büyüyordu); sonraki kare medyanları her durumda 17 ms altında.

### F55 (düzeltildi, `fix/open-findings`): modal örneklerinde kapanışta odak tetikleyiciye dönmüyordu (Safari/WebKit)

Bulunduğu yer: Playwright WebKit’te tarayıcı kontrolü D11. Yeniden üretim: Yerleşim sayfası → “Calendar in a dialog” düğmesine fareyle tıklayın → bir güne gidin → Escape ×2: diyalog kapanır ama odak `<body>`’ye gider. Neden: WebKit (Safari gibi) tıklanan düğmeye odaklanmaz; `<dialog>` kapanırken geri dönecek öğe bulamaz. Düzeltme: 07bf2a2 — Modal, SyncedDialog ve SyncedEverywhere (EN/TR) `onClose` içinde tetikleyiciye odaklanır. Regresyon: D11 artık CI’da WebKit ve Firefox işinde de çalışır.

### Şüphe ve gözlemlerin sonuçları (2026-11-15)

- **S03 — beklenen davranış.** Chrome 157’de (`--hide-scrollbars` kapalı) `.cal-viewport::-webkit-scrollbar` ile 17 px yer kaplayan klasik scrollbar zorlandı. LoadMoreDefault ve Vertical örneklerinde (dikey taşma, scrollbar 17 px) yatay taşma yok, son sütun kesilmiyor. Layout lab’de sürekli + yatay + 2 ay, `maxBlockSize` 480: kutu 760→560 px, 4 px adımlarla 51 ölçüm; iki aydan bire geçiş scrollbar’sız 630 px, scrollbar’la 646 px (yer kaplayan çubuk hesaba katılıyor); hiçbir genişlikte yatay taşma veya kesilen sütun yok. Gerçek klasik scrollbar (Windows/Linux veya macOS “her zaman göster”) denenmedi: bu bir emülasyondur.
- **S04a — düzeltildi** (2861f5d, gerçek VoiceOver’dan sonra c77c709). Chrome 157 erişilebilirlik ağacında Aralık 2026’nın ilk satırı 5 hücreydi; “Tuesday, December 1” satırın ilk hücresi olarak “Sunday” sütun başlığının altında görünüyordu (boş hücreler `aria-hidden`). İlk düzeltme (2861f5d) gün hücrelerine ve başlıklara `aria-colindex`, ızgaraya `aria-colcount=7` ekledi. **Gerçek VoiceOver bunun yetmediğini gösterdi** (2026-11-24, macOS 26.6.2, Safari 26.6.2, VoiceOver Türkçe, VO+↑ AppleScript ile, okunan metin `last phrase` ile alındı): VoiceOver `aria-colindex`’i yok sayıyor; 1 Aralık’tan yukarı “satır 1 / 6 Sunday Sun”, 3 Aralık’tan (perşembe) yukarı “Tuesday Tue”, 8 Aralık’tan yukarı 3 Aralık okundu (ilk satır iki sütun kaymış). Düzeltme c77c709: boş hücreler artık `aria-hidden` değil, `aria-colindex` taşıyan boş gridcell. Sonrasında VoiceOver: 1 Aralık’tan yukarı “Tuesday Tue”, 3 Aralık’tan yukarı “Thursday Thu”, 8 Aralık’tan yukarı 1 Aralık, boş pazartesi hücresi “Monday Mon sütun 2 / 7”. Regresyon testi: `test/s04-column-index.test.tsx` (her satırda erişilebilirlik ağacındaki sıra = sütun, `firstDayOfWeek` 0 ve 1). Gözlem (düzeltilmedi): VoiceOver sütun başlığını “Tuesday Tue” diye, `aria-label` ve görünen kısaltmayla birlikte okuyor. Kısaltmayı `aria-hidden` yapmak denendi; VoiceOver başlığı bu kez “boş” okudu, değişiklik geri alındı. NVDA/JAWS denenmedi.
- **S04b — düzeltildi** (25321de). Gerçek VoiceOver (aynı ortam) seçili günü “Tuesday, December 8, 2026, selected seçildi aç veya kapat düğmesi” diye okudu: etiketteki “selected” (`messages.selected`) ve VoiceOver’ın `aria-pressed` için kendi dilinde söylediği “seçildi”. Hücredeki `aria-selected` ayrıca okunmadı (aralıktaki günlerde “seçildi” yok). Düzeltme: etikete “selected” eklenmez; `aria-pressed` ve `aria-selected` kalır, aralık ifadeleri (start date, end date, in selected range) değişmedi. `messages.selected` kullanımdan kaldırıldı (`@deprecated`, okunmuyor; tam `CalendarMessages` nesneleri derlenmeye devam etsin diye anahtar duruyor). Sonrasında VoiceOver: “Tuesday, December 8, 2026 seçildi aç veya kapat düğmesi”; aralıkta “…, start date seçildi”, “…, end date seçildi”, “…, in selected range”. Regresyon testi: `test/s04b-selected-once.test.tsx`. NVDA/JAWS denenmedi: NVDA’nın artık “pressed/basılı” demesi beklenir, doğrulanmadı.
- **S05 — beklenen davranış.** Chrome 157’de iki gerçek fare tıklaması arada bekleme olmadan (`page.mouse.click` × 2) aralığı doğru seçti (6–9 Kasım). Yalnızca aynı JS görevinde art arda iki `element.click()` ilkini kaybeder (sonuç: yalnızca 9 Kasım): her tıklama son render edilen durumu okur ve iki çağrı arasında render olmaz. Gerçek girdi olaylarında her tıklama ayrı görevdir. Betik ve testler tıklamalar arasında render’ı beklemelidir (`await`, `act`).
- **S06 — beklenen davranış.** Gün tıklaması bir `update` ve bir `nested-update` commit’i üretir (layout effect’ten durum güncellemesi). Etkisi ölçüldü (`npm run perf`, Chrome 157, 2026-11-15): 2 ay için tıklama render + işleme 6× yavaş CPU’da bile bir karenin (16 ms) altında; 12 ayda 4×–6× yavaşlamada bitiş tıklaması bir kareyi aşar (README’deki öneri: uzun listelerde sürekli mod + küçük `maxRenderedMonths`). Ölçülmüş bir kullanıcı etkisi olmadan yeniden yapılandırma yapılmadı.
- **S07 — beklenen davranış.** `element.click()` ve bir düğmede Enter/Space ile tetiklenen tıklama aynı olaydır: UI Events’e göre klavye etkinleştirmesiyle oluşan `click` olayının `detail` değeri 0’dır; `element.click()` de `detail: 0` üretir. Takvim ikisini ayırt edemez ve `source: 'keyboard'` raporlar; gerçek fare tıklaması `detail ≥ 1` ile `pointer` olarak raporlanır (paket testleri tıklamaları `detail: 1` ile gönderir).
- **S08 — doğrulama engeli (2026-11-15 hedefli tekrar: yeniden üretilmedi).** Temiz dev oturumu (önbelleği sıfırlanmış yeni Vite sunucusu), dört sayfada gezinme ve tıklama, ardından sayfalar açıkken sırayla: `Calendar.tsx` ortasına `useRef` ekleme, layout effect ekleme, ikisini geri alma, dosyayı yarım yazma (yalnızca beklenen Vite sözdizimi hatası) ve tamamlama, `Day.tsx`’e hook ekleme ve geri alma, `engine.ts` düzenleme ve geri alma; her adımdan sonra dört sayfada etkileşim. Hiçbir adımda hook sırası mesajı yok. Gereken: hatanın görüldüğü koşulun kendisi — tarayıcı kontrolleri Vite dev sunucusunda çalışırken paket kaynaklarının aynı anda düzenlenmesi (HMR). Temiz koşullarda yeniden üretilemedi: statik hook denetimi, production build ve yeni dev sunucusunda 3’er tur gezinme, HMR ile hook ekleme denemesi, art arda 3 `test:browser` çalıştırması ve bu turdaki Chrome ve Edge çalıştırmaları (21/21). Yeniden görülürse: tam console çıktısını (bileşen yığını), çalışma sırasında değişen dosyaları ve zaman damgalarını kaydedin.

### Ortam matrisi (2026-11-15, gerçek Safari ve VoiceOver 2026-11-24)

| Ortam | Durum |
|---|---|
| Google Chrome 157, macOS, masaüstü | gerçek tarayıcı: tarayıcı kontrolleri 21/21, F54 ve S03–S05 ölçümleri |
| Microsoft Edge 157 (Chromium), macOS | gerçek tarayıcı: `BROWSER_CHANNEL=msedge` ile tarayıcı kontrolleri 21/21, F54 ölçümü |
| Dokunmatik mobil (390×844, `isMobile`, `hasTouch`) | **emülasyon** (Chrome): dokunma ile seçim ve tooltip, sayfa taşması yok; gerçek cihaz yok |
| Klasik scrollbar | **emülasyon** (Chrome, `::-webkit-scrollbar`): S03 |
| Firefox (Playwright derlemesi 157) | tarayıcı kontrolleri 21/21 (pano içeriği okunmaz, yalnızca duyuru), F54; CI’da ayrı iş. Kurulu Firefox.app ile ayrıca denenmedi |
| Playwright WebKit 27.2 (macOS) | tarayıcı kontrolleri 21/21, F54; F55 burada bulundu; CI’da ayrı iş. **Safari veya iPhone sonucu değildir** |
| Safari 26.6.2 (gerçek, macOS 26.6.2) | 2026-11-24, `safaridriver` ile gerçek fare/klavye olayları: tekli ve aralık seçimi, tooltip (fare ve klavye, Escape), modal/popover kapatma (Escape, “Done”, dışarı tıklama, seçim) ve odağın tetikleyiciye dönmesi, iki yönde ay yükleme, 3 ay sınırı ve odak taşıma — 9/9 |
| VoiceOver (gerçek, macOS 26.6.2 + Safari 26.6.2, Türkçe) | 2026-11-24, okunan metin AppleScript `last phrase` ve `keyboard cursor` ile alındı: S04a (düzeltme sonrası doğru sütun), S04b (düzeltme sonrası “seçildi” bir kez), F53 (“Partly booked” okunuyor) |
| NVDA, JAWS (Windows) | **yapılmadı** — Windows yok; manuel adımlar aşağıda |
| Gerçek iPhone Safari (iOS VoiceOver dahil) | **yapılmadı** — cihaz yok; emülasyon ve Playwright WebKit bunun yerine sayılmaz; manuel adımlar aşağıda |

### Dokümantasyon sırasında görülen diğer gözlemler (hata olarak kanıtlanmadı)

- S05 (sonuç yukarıda): Aynı JS görevinde iki `element.click()` ilkini kaybediyor (aktivasyon son render edilen durumu okur). Gerçek kullanıcı etkileşiminde oluşmaz; betikler/testler için not.
- S06 (sonuç yukarıda): Her gün tıklaması bir `update` ve bir `nested-update` commit'i üretiyor (layout effect'ten durum güncellemesi). Performans ölçümünde bir karenin altında; azaltılabilir mi incelenmeli.
- S07 (sonuç yukarıda): `element.click()` (detail 0) `source: 'keyboard'` olarak raporlanıyor; Enter/Space ile aynı tıklama türü olduğundan beklenen davranış.
- S08 (sonuç yukarıda: doğrulama engeli): 2026-11-07'de `npm run test:browser` ilk çalıştırmasında D01, React'in "change in the order of Hooks" console hatasıyla bir kez başarısız oldu. Bileşen adı çıktıda yoktu. O sırada başka bir ajan paket kaynaklarını (`Calendar.tsx`, `engine.ts`) düzenliyordu ve kontrol Vite dev sunucusunda (HMR açık) çalışıyordu; hiçbir şey değişmeden yapılan ikinci çalıştırma 17/17 geçti. Araştırma (yeniden üretilemedi):
  - Statik denetim: `packages/calendar-kit/src` ve `apps/demo/src` içindeki 140 dosya, 207 bileşen/hook, 282 hook çağrısı; koşul, döngü, iç içe fonksiyon veya erken `return` sonrasında hook yok (denetim betiği bilinen hatalı örneklerin dördünü de yakaladı).
  - Temiz production build (`vite build` + `vite preview`, HMR yok) ve düzenleme yapılmayan yeni bir dev sunucusu: her biri 3 tur, 1440×900 ve 375×812, farklı sayfa sıralarıyla 117 sayfa ziyareti, 582 gün tıklaması, 909 tuş, 123 kontrol değişikliği (Lab'ın bütün seçenekleri dahil), popover/dialog tetikleyicileri; `pageerror` ve console hata/uyarısı yok (yalnız `/favicon.ico` 404).
  - HMR denemesi: dev sunucusu açıkken `Calendar.tsx`'e bileşenin ortasına `useRef` ve ayrı bir layout effect eklendi; React Refresh güncellemeyi aynı belgede hatasız uyguladı.
  - `npm run test:browser` düzenleme olmadan üç kez art arda: 17/17, hook uyarısı yok.
  Yeniden görülürse: tam console çıktısını (bileşen yığını) ve o anda değişen dosyaları kaydedin.

### Manuel test listesi: NVDA (S04a, S04b, F53)

macOS VoiceOver ile yapıldı (yukarıda). Kalan: Windows NVDA + Chrome veya Firefox. Okunan metni olduğu gibi kaydedin.

1. **Sütun (S04a).** “Seçim modları” → tekli takvimde Aralık 2026’ya geçin, okla 1’ine gidin, Ctrl+Alt+↑ ile sütun başlığına çıkın. Beklenen: “Tuesday”; hata: “Sunday”.
2. **Seçili bilgisi (S04b).** Bir günü Enter ile seçin, okla ayrılıp geri dönün. “selected/seçili” ve “pressed/basılı” kaç kez okunuyor, yazın. Aralık modunda başlangıç, bitiş ve aradaki bir gün için de yapın.
3. **Nokta etiketi (F53).** “Günlerde etiket, badge ve simge” → kırmızı noktalı bir güne odaklanın. Beklenen: “Partly booked” açıklama olarak okunur.

### Manuel test listesi: gerçek iPhone Safari

1. Dokümantasyonu iPhone Safari’de açın (Vercel önizleme bağlantısı). “Seçim modları” → aralık takvimi: bir güne dokunun, sonra başka bir güne dokunun. Beklenen: aralık seçilir; ilk dokunuşta günün tooltip’i açılabilir, sayfa yatay kaymaz.
2. “Tooltip” sayfası: tooltip’i olan bir güne dokunun → tooltip açılır; başka yere dokunun → kapanır.
3. “Daha fazla ay yükleme”: takvimin içinde parmakla aşağı kaydırın (iç kaydırma alanı) → yeni aylar eklenir, sayfanın kendisi gereksiz zıplamaz; “Show earlier dates” (örnekteki takvim İngilizcedir) ile önceki ay eklenince parmağın altındaki tarih yerinde kalır.
4. “Satır içinde, diyalogda veya popover’da”: diyaloğu açıp bir tarih seçin, “Done” ile kapatın; popover’ı açın, dışarı dokunun → kapanır.
5. Ekranı yatay çevirin ve geri çevirin: seçim korunur, yatay taşma yok.
Her adımda iOS sürümünü, sonucu ve varsa ekran görüntüsünü kaydedin.

