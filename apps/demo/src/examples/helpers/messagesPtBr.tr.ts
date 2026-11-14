import type { CalendarMessages } from 'calendar-kit';

// Eksiksiz bir Brezilya Portekizcesi paketi. Türü CalendarMessages
// (CalendarMessagesInput değil); bu yüzden her anahtar ve her sebep kodu
// zorunludur: eksik bir anahtar TypeScript hatası verir; hiçbir metin sessizce İngilizceden gelmez.
// (Metinler Portekizce kalır; yalnızca yorumlar çevrilmiştir.)

// dayReasons bir Record<string, string>; TypeScript eksik etiketleri bunda
// yakalayamaz. Hazır paketlerin kullandığı etiketleri listelemek onları da zorunlu yapar.
type DayReasonTag = 'check-in-only' | 'check-out-only' | 'booked' | 'closed' | 'start-only' | 'end-only' | 'out-of-schedule';
const dayReasons: Record<DayReasonTag, string> = {
  'check-in-only': 'Somente check-in',
  'check-out-only': 'Somente check-out',
  booked: 'Reservado',
  closed: 'Fechado',
  'start-only': 'Somente início',
  'end-only': 'Somente término',
  'out-of-schedule': 'Sem atendimento neste dia',
};

// `n` ve ardından 1 için tekil, diğer sayılar için çoğul ad (2 noites, 0 noites).
const count = (n: unknown, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
// Uzunluk parametrelerinin birimi 'nights' (stayRules) ya da 'days' (dayRangeRules) olur.
const length = (n: unknown, unit: unknown) => (unit === 'nights' ? count(n, 'noite', 'noites') : count(n, 'dia', 'dias'));

export const messagesPtBr: CalendarMessages = {
  calendar: 'Calendário',
  previousMonth: 'Mês anterior',
  nextMonth: 'Próximo mês',
  loadNext: 'Mostrar mais datas',
  loadPrevious: 'Mostrar datas anteriores',
  loading: 'Carregando…',
  error: 'Não foi possível carregar a disponibilidade.',
  retry: 'Tentar novamente',
  today: 'hoje',
  todayLabel: 'Hoje',
  readOnlyNotice: 'Somente visualização — não é possível selecionar datas',
  selected: 'selecionada',
  rangeStart: 'data de início',
  rangeEnd: 'data de término',
  inRange: 'no período selecionado',
  unavailable: 'indisponível',
  announceStart: (d) => `Data de início: ${d}. Escolha a data de término.`,
  announceRange: (s, e) => `Período selecionado: de ${s} a ${e}.`,
  announceSingle: (d) => `Data selecionada: ${d}.`,
  announceAdded: (d, c) => `Data adicionada: ${d}. ${count(c, 'data selecionada', 'datas selecionadas')}.`,
  announceRemoved: (d, c) => `Data removida: ${d}. ${count(c, 'data selecionada', 'datas selecionadas')}.`,
  announceCleared: 'Seleção removida.',
  announceRejected: (d, r) => `Não é possível selecionar ${d}: ${r}`,
  reasons: {
    'invalid-date': () => 'Data inválida',
    'before-min': (p, f) => `Disponível a partir de ${f.date(p.min)}`,
    'after-max': (p, f) => `Disponível até ${f.date(p.max)}`,
    past: () => 'Data passada',
    future: () => 'Data futura',
    closed: () => 'Indisponível',
    'start-not-allowed': () => 'Indisponível como data de início',
    'end-not-allowed': () => 'Indisponível como data de término',
    'blocked-in-range': () => 'O período inclui datas indisponíveis',
    'weekday-start': () => 'Não é possível começar neste dia da semana',
    'weekday-end': () => 'Não é possível terminar neste dia da semana',
    'min-length': (p) => `Mínimo de ${length(p.min, p.unit)}`,
    'max-length': (p) => `Máximo de ${length(p.max, p.unit)}`,
    'fixed-length': (p) => `Exatamente ${length(p.length, p.unit)}`,
    'same-day': () => 'O início e o término não podem ser no mesmo dia',
    'end-before-start': () => 'O término é anterior ao início',
    'max-selections': (p) => `Você pode selecionar até ${count(p.max, 'data', 'datas')}`,
    'data-unknown': () => 'Disponibilidade ainda não carregada',
    'data-loading': () => 'Carregando disponibilidade…',
    'data-error': () => 'Não foi possível carregar a disponibilidade',
    custom: () => 'Indisponível',
  },
  dayReasons,
};
