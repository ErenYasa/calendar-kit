// Docs language (EN/TR). The docs language is independent of the calendars'
// `locale`: examples keep the locale their code sets.
//
// - UI strings (menu, buttons, ARIA labels, notices) live in `ui` below; the
//   Turkish table is typed against the English one, so a missing key is a type
//   error.
// - Pages: src/docs/pages/<file>.tsx (EN) and src/docs/pages/tr/<file>.tsx (TR)
//   export the same components.
// - Examples and snippets: `Name.tsx` (EN) and `Name.tr.tsx` (TR) next to it;
//   the running example and its View code come from the same file.
// test/i18n.test.tsx checks that every page, example and snippet has both.
import { createContext, useContext } from 'react';

export const LANGS = ['en', 'tr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
const STORAGE_KEY = 'calendar-kit-docs-lang';

export function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'tr' || v === 'en' ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage unavailable (private mode): the choice lasts for this visit
  }
}

const en = {
  skipToContent: 'Skip to content',
  version: '0.1.0 · not published',
  menu: 'Menu',
  closeMenu: 'Close menu',
  navLabel: 'Documentation',
  pagerLabel: 'Previous and next page',
  loadingPage: 'Loading…',
  languageLabel: 'Documentation language',
  docTitleSuffix: 'calendar-kit',
  viewCode: 'View code',
  hideCode: 'Hide code',
  loadingExample: 'Loading example…',
  loadingCode: 'Loading code…',
  copy: 'Copy',
  copied: 'Copied',
  copyFailed: 'Copy failed',
  copiedStatus: (file: string) => `Copied ${file} to the clipboard`,
  copyFailedStatus: 'Copy failed: select the code and copy it manually',
  filesLabel: (label: string) => `${label} files`,
  sourceLabel: (file: string) => `${file} source`,
  colName: 'Name',
  colType: 'Type',
  colDefault: 'Default',
  colDescription: 'Description',
  propsCaption: 'Props',
  required: 'required',
  untranslatedExample: 'English only: this example has no translation yet.',
};

export type UiStrings = typeof en;

const tr: UiStrings = {
  skipToContent: 'İçeriğe geç',
  version: '0.1.0 · yayımlanmadı',
  menu: 'Menü',
  closeMenu: 'Menüyü kapat',
  navLabel: 'Dokümantasyon',
  pagerLabel: 'Önceki ve sonraki sayfa',
  loadingPage: 'Yükleniyor…',
  languageLabel: 'Dokümantasyon dili',
  docTitleSuffix: 'calendar-kit',
  viewCode: 'Kodu göster',
  hideCode: 'Kodu gizle',
  loadingExample: 'Örnek yükleniyor…',
  loadingCode: 'Kod yükleniyor…',
  copy: 'Kopyala',
  copied: 'Kopyalandı',
  copyFailed: 'Kopyalanamadı',
  copiedStatus: (file) => `${file} panoya kopyalandı`,
  copyFailedStatus: 'Kopyalanamadı: kodu seçip elle kopyalayın',
  filesLabel: (label) => `${label} dosyaları`,
  sourceLabel: (file) => `${file} kaynağı`,
  colName: 'Ad',
  colType: 'Tip',
  colDefault: 'Varsayılan',
  colDescription: 'Açıklama',
  propsCaption: 'Prop’lar',
  required: 'zorunlu',
  untranslatedExample: 'Yalnızca İngilizce: bu örneğin Türkçe sürümü henüz yok.',
};

export const UI: Record<Lang, UiStrings> = { en, tr };

export const LangContext = createContext<Lang>(DEFAULT_LANG);
export const useLang = () => useContext(LangContext);
export const useUi = () => UI[useLang()];
