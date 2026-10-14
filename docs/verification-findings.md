# Doğrulama bulguları — takip listesi

Kaynak: `checkpoint/verification-start` (da02d87) üzerinde yapılan doğrulama.
Her bulgunun tekil bir kimliği var (`F01`…). Önceki rapordaki "8 sorun" ifadesi
tutarsızdı: ayrıntılı listede 6 yüksek, 9 orta grup (bazıları birden çok
alt bulgu içeriyordu) ve ayrı düşük maddeler vardı. Bu liste tek kaynaktır.

Durum: `açık` · `düzeltildi` · `sözleşme` (davranış belgelendi, kod değişmedi) ·
`yeniden üretilemedi` · `doğrulanamadı`.
Kanıt: `kanıtlandı` (test/ölçüm ile) · `şüphe`.

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
| F16 | 9 | `loading` prop'u görünür "Yükleniyor…" yazısı gösteriyor; günler iskelete dönmüyor | kanıtlandı | açık (bkz. not) |
| F17 | 9 | "Hareketi azalt" iskelet parıltısını durdurmuyor (CSS özgüllüğü) | kanıtlandı (özgüllük) | düzeltildi |
| F18 | 9 | Continuous liste yeni `minDate`/`maxDate` dışındaki ayları tutuyor | kanıtlandı | düzeltildi |
| F19 | 9 | Ebeveyn controlled değeri reddettiğinde `onActiveEndpointChange` yine gönderiliyor (gerçek geçiş değil) | kanıtlandı | düzeltildi |
| F20 | 9 | Özel `renderLoadMore` kontrolü sınırda kaybolunca odak kayboluyor | kanıtlandı | düzeltildi |
| F21 | 9 | Tooltip tema değişkenleri portala ulaşmıyor; `.cal-tooltip` `--cal-tooltip-bg`'yi kendisi sıfırlıyor | kanıtlandı (kod) | düzeltildi |
| F22 | 9 | Demo: konaklama "Özel tarih" anahtarı ve mobil `loadMoreLabels` kayıp (dosya dışarıdan üzerine yazılmış) | kanıtlandı | düzeltildi |
| F23 | 9 | Yayımlanan `exports`'taki `source` koşulu tarball'da olmayan `src/`'yi gösteriyor | kanıtlandı (pack) | düzeltildi |
| F24 | 9 | README: reddedilen tıklama olay sırası "test edildi" deniyor ama test yok; Escape iddiası; DayState listesinde `outOfSchedule` yok; test yorumu yanlış ("Exclusive semantics") | kanıtlandı (okuma) | düzeltildi |
| F25 | düşük | `reachableEndIssue` gerçek sebep ne olursa olsun `min-length` raporluyor ("Minimum 0 gece" dahil) | kanıtlandı | düzeltildi |
| F26 | düşük | Ulaşılabilir bitiş araması en fazla 63 bitiş adayına bakıyor | kanıtlandı | sözleşme (belgelendi) |
| F27 | düşük | `stayRules({ allowSameDay: true, minNights: 1 })` aynı gün konaklamaya izin vermiyor | kanıtlandı | sözleşme (belgelendi) |
| F28 | düşük | Çoklu modda tekrarlanan tarihlerde `plan()` ve `validate()` sayımı tutarsız | kanıtlandı | düzeltildi |
| F29 | düşük | `onVisibleMonthChange` için load-more sebebi yok | kanıtlandı (okuma) | sözleşme (belgelendi) |
| F30 | düşük | Etiket genişliği daire yerine hücreye göre; 40 px hücrede etiket köşeleri bugün halkasına değiyor | kanıtlandı (Chrome ölçümü: 61/61 etiket) | düzeltildi |
| F31 | düşük | `addDays` yıl 1–9999 dışına çıkabiliyor; `eachMonth` 9999'da tekrar ay üretiyor; geçersiz `timeZone` hata fırlatıyor | kanıtlandı | sözleşme (belgelendi) |
| F32 | düşük | Kontrolsüz modda mod değişimi eski seçimi geri getiriyor; `today` prop'u yokken görünen ay gece yarısı kayıyor | kanıtlandı | sözleşme (belgelendi) |
| F33 | 6 | İskelet (yükleme) günlerinde klavye odak halkası gizleniyor (iskelet kuralı 0,5,1 > odak 0,4,1); F17 düzeltmesi sırasında bulundu | kanıtlandı (özgüllük) | düzeltildi |
| S01 | şüphe | `transform` içeren portal container'da tooltip kayması | şüphe | açık |
| S02 | şüphe | 304 px'ten dar continuous görünümde ortak hafta günü satırının taşması | şüphe | açık |
| S03 | şüphe | `maxBlockSize` scrollbar'ı eklenince viewport genişliğinin yeniden ölçülmemesi | şüphe | açık |
| S04 | şüphe | `aria-selected` + `aria-pressed` ile durumun iki kez okunması; boş hücrelerin kolon indeksini kaydırması | şüphe | açık |

## Tarayıcı regresyon kontrolleri

`npm run test:browser` (playwright-core + sistem Chrome, demo üzerinde) jsdom'un
doğrulayamadığı davranışları gerçek tarayıcıda kontrol eder: F06, F10, F15, F17,
F21, F30. Aynı betik `checkpoint/verification-start` koduna karşı çalıştırıldığında
altı kontrolün altısı da başarısız oldu; düzeltilmiş kodda altısı da geçiyor.
