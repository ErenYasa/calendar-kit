# Docs translation guide (EN → TR)

How the docs are translated (see `i18n.ts`) and the terms to use, so every page
reads the same.

## Files

| English | Turkish |
|---|---|
| `src/docs/pages/<file>.tsx` | `src/docs/pages/tr/<file>.tsx` (same exported components) |
| `src/examples/<dir>/<Name>.tsx` | `src/examples/<dir>/<Name>.tr.tsx` (the Turkish page runs and shows this file) |
| `src/examples/<dir>/<Name>.css` with comments | `<Name>.tr.css` (same rules, translated comments) |
| `src/snippets/<path>.ts(x)` | `src/snippets/<path>.tr.ts(x)` |
| UI strings (menu, buttons, ARIA) | `UI.tr` in `i18n.ts` (typed: a missing key does not compile) |

`test/i18n.test.tsx` fails when a Turkish file is missing, when the rendered
structure differs (headings, tables and rows, examples, code blocks), when an
inline `<code>` is added, dropped or changed, or when an English sentence is
left in a Turkish page.

## Rules

- Never translate API names: props, events, methods, types, import paths, CSS
  variables and classes, `data-*` attributes, string literal values such as
  `'range'`. They stay in `<code>` exactly as in English.
- Turkish suffixes go outside the code element with a typographic apostrophe:
  `<code>onChange</code>’i`, `<code>Calendar</code>’ın`.
- Keep the same inline `<code>` elements (same text, same count) as the English
  page; rephrase the sentence around them instead of dropping or adding one.
- The docs language never changes a calendar's `locale`: an example keeps the
  locale and messages its code sets. Examples about locales or RTL keep their
  configuration unchanged.
- Translated example files keep the same logic, imports and documented outputs
  (`// → value`); only comments and user-visible text change.
- Address the reader with the polite/neutral form ("seçin", "kullanın").
- Prefer plain Turkish; keep an English term in parentheses on first use when it
  is the name developers search for, e.g. "araç ipucu (tooltip)".

## Terms

| English | Turkish |
|---|---|
| selection, select | seçim, seçmek |
| single / range / multiple / read-only mode | tekli / aralık / çoklu / salt okunur mod |
| start, end (of a range) | başlangıç, bitiş |
| check-in, check-out | giriş, çıkış |
| night, stay | gece, konaklama |
| inclusive / exclusive end | dahil / hariç bitiş |
| day cell, day button | gün hücresi, gün düğmesi |
| reference month | referans ay |
| visible months / rendered months | görünen aylar / render edilen aylar |
| paged / continuous navigation | sayfalı / sürekli gezinme |
| load more, progressive months | daha fazla ay yükleme, kademeli ay yükleme |
| tooltip | araç ipucu |
| slot, render prop | slot, render prop |
| controller (ref) | controller (ref) |
| event, callback, handler | olay, callback, işleyici |
| prop | prop (çoğul: prop’lar) |
| controlled / uncontrolled | kontrollü / kontrolsüz |
| rule, adapter | kural, adaptör |
| availability, available, booked, closed | müsaitlik, müsait, dolu, kapalı |
| disabled, blocked | devre dışı, engellenmiş |
| validation, valid, invalid, issue, reason | doğrulama, geçerli, geçersiz, sorun, sebep |
| message, formatting | mesaj, biçimlendirme |
| locale, week start, RTL | yerel ayar (locale), hafta başlangıcı, RTL (sağdan sola) |
| focus, keyboard, screen reader | odak, klavye, ekran okuyucu |
| accessibility | erişilebilirlik |
| layout, overflow, wrap, inner scroll | yerleşim, taşma, alt satıra geçme, iç kaydırma |
| loading, error, retry | yükleme, hata, yeniden deneme |
| today, past, future, weekday | bugün, geçmiş, gelecek, hafta günü |
| clamp (to min/max) | sınıra çekmek |
| render (verb) | render etmek |
| snapshot | anlık durum (snapshot) |
| bundle size | paket boyutu |
| recipe | tarif |
| fallback | yedek değer |
| deprecated | kullanımdan kaldırılmış |
