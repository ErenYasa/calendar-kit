import { type ComponentType, lazy } from 'react';

type PageModule = Record<string, ComponentType>;
const from = (load: () => Promise<PageModule>) => (name: string) => lazy(() => load().then((m) => ({ default: m[name]! })));

const start = from(() => import('./pages/start'));
const concepts = from(() => import('./pages/concepts'));
const features = from(() => import('./pages/features'));
const api = from(() => import('./pages/api'));
const styling = from(() => import('./pages/styling'));
const rules = from(() => import('./pages/rules'));
const helpers = from(() => import('./pages/helpers'));
const events = from(() => import('./pages/events'));
const recipes = from(() => import('./pages/recipes'));
const project = from(() => import('./pages/project'));

export interface DocPage {
  slug: string;
  title: string;
  Component: ComponentType;
}
export interface NavGroup {
  title: string;
  pages: DocPage[];
}

const p = (slug: string, title: string, Component: ComponentType): DocPage => ({ slug, title, Component });

export const NAV: NavGroup[] = [
  {
    title: 'Getting started',
    pages: [
      p('introduction', 'Introduction', start('Introduction')),
      p('installation', 'Installation & Quick Start', start('Installation')),
      p('react-nextjs', 'React & Next.js', start('ReactNext')),
    ],
  },
  { title: 'Core concepts', pages: [p('core-concepts', 'Core Concepts', concepts('CoreConcepts'))] },
  {
    title: 'Features',
    pages: [
      p('selection-modes', 'Selection modes', features('SelectionModes')),
      p('date-limits', 'Date limits', features('DateLimits')),
      p('length-rules', 'Length rules', features('LengthRules')),
      p('day-rules', 'Start/end days & validation', features('DayRules')),
      p('orientation', 'Orientation & months', features('Orientation')),
      p('month-position', 'Reference month position', features('MonthPosition')),
      p('responsive', 'Responsive layout', features('Responsive')),
      p('day-size', 'Day size & inner scroll', features('DaySize')),
      p('load-more', 'Progressive months', features('LoadMore')),
      p('go-to-month', 'Programmatic navigation', features('GoToMonth')),
      p('tooltip', 'Tooltip', features('TooltipPage')),
      p('day-content', 'Day content', features('DayContent')),
      p('loading', 'Loading & errors', features('Loading')),
      p('i18n', 'Locales, week start & RTL', features('I18n')),
      p('slots', 'Slots & render props', features('Slots')),
      p('placement', 'Inline, modal & portal', features('Placement')),
      p('synced', 'Synced calendars', features('Synced')),
      p('accessibility', 'Keyboard & accessibility', features('Accessibility')),
    ],
  },
  {
    title: 'API reference',
    pages: [
      p('api-props', 'Calendar props', api('PropsReference')),
      p('api-events', 'Callbacks & events', events('EventsReference')),
      p('api-controller', 'Controller (ref)', events('ControllerReference')),
      p('api-rules', 'Rules & adapters', rules('RulesReference')),
      p('api-dates', 'Date helpers', helpers('DateHelpers')),
      p('api-messages', 'Messages & formatting', helpers('MessagesReference')),
      p('api-types', 'Types', api('TypesReference')),
    ],
  },
  {
    title: 'Styling',
    pages: [p('styling', 'Styling & Customization', styling('Styling')), p('styling-reference', 'Styling reference', styling('StylingReference'))],
  },
  {
    title: 'Recipes',
    pages: [
      p('recipe-home-rental', 'Home rental', recipes('HomeRental')),
      p('recipe-boat-rental', 'Boat rental', recipes('BoatRental')),
      p('recipe-event-tickets', 'Event tickets', recipes('EventTickets')),
      p('recipe-three-calendars', 'Three synced calendars', recipes('ThreeCalendars')),
    ],
  },
  {
    title: 'Project',
    pages: [
      p('testing', 'Testing & Compatibility', project('Testing')),
      p('performance', 'Performance', project('Performance')),
      p('migration', 'Migration & Troubleshooting', project('Migration')),
    ],
  },
];

export const PAGES = NAV.flatMap((g) => g.pages);
