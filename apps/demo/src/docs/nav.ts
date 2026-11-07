import { type ComponentType, lazy } from 'react';
import type { Lang } from './i18n';

type PageModule = Record<string, ComponentType>;
type Loader = () => Promise<PageModule>;
// Each page file exists in English (pages/x.tsx) and Turkish (pages/tr/x.tsx)
// with the same exported component names.
const from = (load: Record<Lang, Loader>) => (name: string) =>
  ({ en: lazy(() => load.en().then((m) => ({ default: m[name]! }))), tr: lazy(() => load.tr().then((m) => ({ default: m[name]! }))) }) as Record<Lang, ComponentType>;

const start = from({ en: () => import('./pages/start'), tr: () => import('./pages/tr/start') });
const concepts = from({ en: () => import('./pages/concepts'), tr: () => import('./pages/tr/concepts') });
const features = from({ en: () => import('./pages/features'), tr: () => import('./pages/tr/features') });
const api = from({ en: () => import('./pages/api'), tr: () => import('./pages/tr/api') });
const styling = from({ en: () => import('./pages/styling'), tr: () => import('./pages/tr/styling') });
const rules = from({ en: () => import('./pages/rules'), tr: () => import('./pages/tr/rules') });
const helpers = from({ en: () => import('./pages/helpers'), tr: () => import('./pages/tr/helpers') });
const events = from({ en: () => import('./pages/events'), tr: () => import('./pages/tr/events') });
const recipes = from({ en: () => import('./pages/recipes'), tr: () => import('./pages/tr/recipes') });
const project = from({ en: () => import('./pages/project'), tr: () => import('./pages/tr/project') });
const lab = from({ en: () => import('./pages/lab'), tr: () => import('./pages/tr/lab') });

type Text = Record<Lang, string>;
export interface DocPage {
  slug: string;
  title: Text;
  Component: Record<Lang, ComponentType>;
}
export interface NavGroup {
  title: Text;
  pages: DocPage[];
}

const p = (slug: string, en: string, tr: string, Component: Record<Lang, ComponentType>): DocPage => ({ slug, title: { en, tr }, Component });
const g = (en: string, tr: string, pages: DocPage[]): NavGroup => ({ title: { en, tr }, pages });

export const NAV: NavGroup[] = [
  g('Getting started', 'Başlarken', [
    p('introduction', 'Introduction', 'Giriş', start('Introduction')),
    p('installation', 'Installation & Quick Start', 'Kurulum ve hızlı başlangıç', start('Installation')),
    p('react-nextjs', 'React & Next.js', 'React ve Next.js', start('ReactNext')),
  ]),
  g('Core concepts', 'Temel kavramlar', [p('core-concepts', 'Core Concepts', 'Temel kavramlar', concepts('CoreConcepts'))]),
  g('Features', 'Özellikler', [
    p('selection-modes', 'Selection modes', 'Seçim modları', features('SelectionModes')),
    p('date-limits', 'Date limits', 'Tarih sınırları', features('DateLimits')),
    p('length-rules', 'Length rules', 'Uzunluk kuralları', features('LengthRules')),
    p('day-rules', 'Start/end days & validation', 'Başlangıç/bitiş günleri ve doğrulama', features('DayRules')),
    p('orientation', 'Orientation & months', 'Yön ve ay sayısı', features('Orientation')),
    p('month-position', 'Reference month position', 'Referans ayın konumu', features('MonthPosition')),
    p('responsive', 'Responsive layout', 'Duyarlı yerleşim', features('Responsive')),
    p('day-size', 'Day size & inner scroll', 'Gün boyutu ve iç kaydırma', features('DaySize')),
    p('load-more', 'Progressive months', 'Kademeli ay yükleme', features('LoadMore')),
    p('go-to-month', 'Programmatic navigation', 'Programla gezinme', features('GoToMonth')),
    p('tooltip', 'Tooltip', 'Araç ipucu', features('TooltipPage')),
    p('day-content', 'Day content', 'Gün içeriği', features('DayContent')),
    p('loading', 'Loading & errors', 'Yükleme ve hatalar', features('Loading')),
    p('i18n', 'Locales, week start & RTL', 'Yerel ayarlar, hafta başı ve RTL', features('I18n')),
    p('slots', 'Slots & render props', 'Slotlar ve render prop’ları', features('Slots')),
    p('placement', 'Inline, modal & portal', 'Satır içi, modal ve portal', features('Placement')),
    p('synced', 'Synced calendars', 'Senkron takvimler', features('Synced')),
    p('accessibility', 'Keyboard & accessibility', 'Klavye ve erişilebilirlik', features('Accessibility')),
    p('layout-lab', 'Layout, events & measurement', 'Yerleşim, olaylar ve ölçüm', lab('LayoutLab')),
  ]),
  g('API reference', 'API başvurusu', [
    p('api-props', 'Calendar props', 'Calendar prop’ları', api('PropsReference')),
    p('api-events', 'Callbacks & events', 'Callback’ler ve olaylar', events('EventsReference')),
    p('api-controller', 'Controller (ref)', 'Controller (ref)', events('ControllerReference')),
    p('api-rules', 'Rules & adapters', 'Kurallar ve adaptörler', rules('RulesReference')),
    p('api-dates', 'Date helpers', 'Tarih yardımcıları', helpers('DateHelpers')),
    p('api-messages', 'Messages & formatting', 'Mesajlar ve biçimlendirme', helpers('MessagesReference')),
    p('api-types', 'Types', 'Tipler', api('TypesReference')),
  ]),
  g('Styling', 'Stil', [
    p('styling', 'Styling & Customization', 'Stil ve özelleştirme', styling('Styling')),
    p('styling-reference', 'Styling reference', 'Stil başvurusu', styling('StylingReference')),
  ]),
  g('Recipes', 'Tarifler', [
    p('recipe-home-rental', 'Home rental', 'Ev kiralama', recipes('HomeRental')),
    p('recipe-boat-rental', 'Boat rental', 'Tekne kiralama', recipes('BoatRental')),
    p('recipe-event-tickets', 'Event tickets', 'Etkinlik biletleri', recipes('EventTickets')),
    p('recipe-three-calendars', 'Three synced calendars', 'Üç senkron takvim', recipes('ThreeCalendars')),
  ]),
  g('Project', 'Proje', [
    p('testing', 'Testing & Compatibility', 'Test ve uyumluluk', project('Testing')),
    p('performance', 'Performance', 'Performans', project('Performance')),
    p('migration', 'Migration & Troubleshooting', 'Geçiş ve sorun giderme', project('Migration')),
  ]),
];

export const PAGES = NAV.flatMap((group) => group.pages);
