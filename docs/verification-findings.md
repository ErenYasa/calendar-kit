# Doğrulama bulguları — takip listesi

Kaynak: `checkpoint/verification-start` (da02d87) üzerinde yapılan doğrulama.
Her bulgunun tekil bir kimliği var (`F01`…). Önceki rapordaki "8 sorun" ifadesi
tutarsızdı: ayrıntılı listede 6 yüksek, 9 orta grup (bazıları birden çok
alt bulgu içeriyordu) ve ayrı düşük maddeler vardı. Bu liste tek kaynaktır.

Durum: `açık` · `düzeltildi` · `sözleşme` (davranış belgelendi, kod değişmedi) ·
`yeniden üretilemedi` · `doğrulanamadı`.
Kanıt: `kanıtlandı` (test/ölçüm ile) · `şüphe`.

## Sayım (çakışmasız, 36 bulgu + 4 şüphe)

Her madde tam olarak bir grupta sayılır.

| Grup | Sayı | Maddeler |
|---|---|---|
| Düzeltildi | 31 | F01–F26, F28, F30, F33, F34, F35 |
| Yalnızca belgelendi (davranış bilinçli olarak aynı) | 3 | F27, F29, F31 |
| Bekleyen (karar gerekli) | 2 | F32 — (a) kısmı düzeltildi, (b) mod değişiminde sıfırlama önerisi onay bekliyor; F36 — `styles.css` için tip bildirimi önerisi |
| Doğrulanamadı | 2 | S03 (klasik scrollbar gerekir), S04 (ekran okuyucu gerekir) |
| Bulguya dönüştü (ayrıca sayılmaz) | 2 | S01 → F35, S02 → F34 |

Bulgu listesi dışında, hiç yapılmamış ve bekleyen ortam kontrolleri: Safari,
Firefox, gerçek mobil cihaz (dokunma), ekran okuyucu (VoiceOver/NVDA).

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
| F36 | düşük | `calendar-kit/styles.css` export'unun tip bildirimi yok: TypeScript 6+ (`noUncheckedSideEffectImports` varsayılan açık) ortamı `*.css` bildirmiyorsa `import 'calendar-kit/styles.css'` TS2882 verir. Vite (`vite/client`) ve Next'te sorun yok | kanıtlandı (temiz tüketici, TS 7.0.2) | bekliyor: öneri `exports["./styles.css"].types` → boş `styles.css.d.ts`; kapsam dışı olduğu için uygulanmadı |
| F37 | 6 | `loading` ile ilk yüklemede fareyle seçim (CSS katmanı) engelleniyor ama klavyeyle ve `ref.select()` ile veri bilinmeden seçim yapılabiliyordu | kanıtlandı (test; Chrome) | düzeltildi: tüm yollar aynı `data-loading` doğrulamasından geçer, odak/gezinti ayrı |
| S01 | şüphe | `transform` içeren portal container'da tooltip kayması | yeniden üretildi → F35 | F35'e taşındı |
| S02 | şüphe | 304 px'ten dar continuous görünümde ortak hafta günü satırının taşması | yeniden üretildi → F34 | F34'e taşındı |
| S03 | şüphe | `maxBlockSize` scrollbar'ı eklenince viewport genişliğinin yeniden ölçülmemesi | bu makinede yeniden üretilemedi (macOS overlay scrollbar, genişlik 0) | doğrulanamadı |
| S04 | şüphe | `aria-selected` + `aria-pressed` ile durumun iki kez okunması; boş hücrelerin kolon indeksini kaydırması | ekran okuyucu gerektirir (VoiceOver/NVDA) | doğrulanamadı |

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

## Uyumluluk: npm pack çıktısı temiz tüketicilerde (2026-11-07)

Tarball: `calendar-kit-0.1.0.tgz` (22 dosya, yalnızca `dist`, README, LICENSE,
package.json). Her tüketici ayrı klasörde, yalnızca tarball'dan kuruldu.

| Tüketici | Tipler | Build | SSR / hydration (Chrome 155) | CSS | Etkileşim |
|---|---|---|---|---|---|
| Vite 8 + React 19.2.0 | `bundler`, `node16` (skipLibCheck false), `nodenext`, JSX (`vite/client`): 0 hata; `@ts-expect-error` yoklamaları tutuyor | geçti; bundle'da kaynak yolu yok | `renderToString` + `hydrateRoot` (StrictMode): 122 gün butonu, konsol hatası / kurtarılabilir hata yok | `--cal-accent` uygulanmış | aralık seçimi: 4 gece |
| Vite 8 + React 18.3.1 (`@types/react` 18.3) | aynı: 0 hata | geçti | aynı: hata yok | uygulanmış | 4 gece |
| Next.js 16.4.5 App Router (React 19.3.1) | `next build` TypeScript (skipLibCheck false): 0 hata | geçti | `next start` ve `next dev`: hydration hatası yok | `app/layout.tsx` import'u uygulanmış | 4 gece |

- Client Component sınırı: `'use client'` dosyasında `Calendar` çalışıyor; Server
  Component'te yalnızca saf yardımcılar (`addDays`, `countNights`, `getToday`,
  `toCalendarDate`) sunucuda render edildi. `Calendar` doğrudan Server
  Component'e konunca build prerender'da `useSyncExternalStore is not a
  function` ile duruyor (beklenen; README §18'de belgelendi).
- Özel yollar (`calendar-kit/src/...`) `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Next'te React 18 denenmedi: App Router kendi React 19 kopyasını kullanır.
- Yapılmayanlar (bekleyen): Safari, Firefox, gerçek mobil cihaz, ekran
  okuyucular (VoiceOver/NVDA). Hiçbiri bu ortamda çalıştırılmadı.

## Tarayıcı regresyon kontrolleri

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
