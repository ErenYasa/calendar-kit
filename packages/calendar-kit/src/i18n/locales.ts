import { type CalendarMessages, type ReasonMessage, messagesEn } from './messages';

/**
 * Additional UI message bundles. Month and weekday names always come from
 * `Intl`; these only cover the calendar's own UI strings. Each export is
 * tree-shakable — import only what you use.
 */

type Reasons = CalendarMessages['reasons'];

function bundle(
  base: Omit<CalendarMessages, 'reasons' | 'dayReasons'>,
  reasons: Partial<Reasons> & Pick<Reasons, 'closed' | 'min-length' | 'max-length' | 'past' | 'blocked-in-range'>,
  dayReasons: Record<string, string>,
): CalendarMessages {
  return { ...base, reasons: { ...messagesEn.reasons, custom: reasons.closed, ...reasons } as Reasons, dayReasons };
}

const unit = (one: string, many: string, dayOne: string, dayMany: string): ((n: unknown, u: unknown) => string) => (n, u) =>
  `${n} ${u === 'nights' ? (n === 1 ? one : many) : n === 1 ? dayOne : dayMany}`;

const de = unit('Nacht', 'Nächte', 'Tag', 'Tage');
export const messagesDe = bundle(
  {
    calendar: 'Kalender', previousMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat', loadNext: 'Weitere Daten anzeigen',
    loadPrevious: 'Frühere Daten anzeigen', loading: 'Wird geladen…', error: 'Verfügbarkeit konnte nicht geladen werden.', retry: 'Erneut versuchen',
    today: 'heute', todayLabel: 'Heute', readOnlyNotice: 'Nur Ansicht — keine Auswahl möglich', selected: 'ausgewählt', rangeStart: 'Startdatum', rangeEnd: 'Enddatum', inRange: 'im ausgewählten Zeitraum', unavailable: 'nicht verfügbar',
    announceStart: (d) => `Startdatum ${d}. Wählen Sie ein Enddatum.`, announceRange: (s, e) => `${s} bis ${e} ausgewählt.`,
    announceSingle: (d) => `${d} ausgewählt.`, announceAdded: (d, c) => `${d} hinzugefügt. ${c} ausgewählt.`,
    announceRemoved: (d, c) => `${d} entfernt. ${c} ausgewählt.`, announceCleared: 'Auswahl gelöscht.', announceRejected: (d, r) => `${d} nicht wählbar: ${r}`,
  },
  {
    closed: () => 'Nicht verfügbar', past: () => 'Vergangenes Datum', 'blocked-in-range': () => 'Der Zeitraum enthält nicht verfügbare Tage',
    'min-length': ((p) => `Mindestens ${de(p.min, p.unit)}`) as ReasonMessage, 'max-length': ((p) => `Höchstens ${de(p.max, p.unit)}`) as ReasonMessage,
  },
  { 'check-in-only': 'Nur Anreise', 'check-out-only': 'Nur Abreise', booked: 'Belegt', closed: 'Geschlossen' },
);

const fr = unit('nuit', 'nuits', 'jour', 'jours');
export const messagesFr = bundle(
  {
    calendar: 'Calendrier', previousMonth: 'Mois précédent', nextMonth: 'Mois suivant', loadNext: 'Afficher plus de dates',
    loadPrevious: 'Afficher les dates précédentes', loading: 'Chargement…', error: 'Impossible de charger les disponibilités.', retry: 'Réessayer',
    today: "aujourd'hui", todayLabel: "Aujourd'hui", readOnlyNotice: 'Consultation uniquement — sélection impossible', selected: 'sélectionné', rangeStart: 'date de début', rangeEnd: 'date de fin', inRange: 'dans la période', unavailable: 'indisponible',
    announceStart: (d) => `Début ${d}. Choisissez une date de fin.`, announceRange: (s, e) => `Du ${s} au ${e} sélectionné.`,
    announceSingle: (d) => `${d} sélectionné.`, announceAdded: (d, c) => `${d} ajouté. ${c} sélectionnés.`,
    announceRemoved: (d, c) => `${d} retiré. ${c} sélectionnés.`, announceCleared: 'Sélection effacée.', announceRejected: (d, r) => `${d} indisponible : ${r}`,
  },
  {
    closed: () => 'Indisponible', past: () => 'Date passée', 'blocked-in-range': () => 'La période contient des jours indisponibles',
    'min-length': ((p) => `Minimum ${fr(p.min, p.unit)}`) as ReasonMessage, 'max-length': ((p) => `Maximum ${fr(p.max, p.unit)}`) as ReasonMessage,
  },
  { 'check-in-only': 'Arrivée uniquement', 'check-out-only': 'Départ uniquement', booked: 'Réservé', closed: 'Fermé' },
);

const es = unit('noche', 'noches', 'día', 'días');
export const messagesEs = bundle(
  {
    calendar: 'Calendario', previousMonth: 'Mes anterior', nextMonth: 'Mes siguiente', loadNext: 'Mostrar más fechas',
    loadPrevious: 'Mostrar fechas anteriores', loading: 'Cargando…', error: 'No se pudo cargar la disponibilidad.', retry: 'Reintentar',
    today: 'hoy', todayLabel: 'Hoy', readOnlyNotice: 'Solo lectura — no se pueden seleccionar fechas', selected: 'seleccionado', rangeStart: 'fecha de inicio', rangeEnd: 'fecha de fin', inRange: 'en el rango', unavailable: 'no disponible',
    announceStart: (d) => `Inicio ${d}. Elige una fecha de fin.`, announceRange: (s, e) => `Seleccionado del ${s} al ${e}.`,
    announceSingle: (d) => `${d} seleccionado.`, announceAdded: (d, c) => `${d} añadido. ${c} seleccionados.`,
    announceRemoved: (d, c) => `${d} eliminado. ${c} seleccionados.`, announceCleared: 'Selección borrada.', announceRejected: (d, r) => `${d} no disponible: ${r}`,
  },
  {
    closed: () => 'No disponible', past: () => 'Fecha pasada', 'blocked-in-range': () => 'El rango contiene días no disponibles',
    'min-length': ((p) => `Mínimo ${es(p.min, p.unit)}`) as ReasonMessage, 'max-length': ((p) => `Máximo ${es(p.max, p.unit)}`) as ReasonMessage,
  },
  { 'check-in-only': 'Solo entrada', 'check-out-only': 'Solo salida', booked: 'Reservado', closed: 'Cerrado' },
);

const it = unit('notte', 'notti', 'giorno', 'giorni');
export const messagesIt = bundle(
  {
    calendar: 'Calendario', previousMonth: 'Mese precedente', nextMonth: 'Mese successivo', loadNext: 'Mostra altre date',
    loadPrevious: 'Mostra date precedenti', loading: 'Caricamento…', error: 'Impossibile caricare la disponibilità.', retry: 'Riprova',
    today: 'oggi', todayLabel: 'Oggi', readOnlyNotice: 'Sola lettura — date non selezionabili', selected: 'selezionato', rangeStart: 'data di inizio', rangeEnd: 'data di fine', inRange: "nell'intervallo", unavailable: 'non disponibile',
    announceStart: (d) => `Inizio ${d}. Scegli una data di fine.`, announceRange: (s, e) => `Selezionato dal ${s} al ${e}.`,
    announceSingle: (d) => `${d} selezionato.`, announceAdded: (d, c) => `${d} aggiunto. ${c} selezionati.`,
    announceRemoved: (d, c) => `${d} rimosso. ${c} selezionati.`, announceCleared: 'Selezione annullata.', announceRejected: (d, r) => `${d} non selezionabile: ${r}`,
  },
  {
    closed: () => 'Non disponibile', past: () => 'Data passata', 'blocked-in-range': () => "L'intervallo contiene giorni non disponibili",
    'min-length': ((p) => `Minimo ${it(p.min, p.unit)}`) as ReasonMessage, 'max-length': ((p) => `Massimo ${it(p.max, p.unit)}`) as ReasonMessage,
  },
  { 'check-in-only': 'Solo arrivo', 'check-out-only': 'Solo partenza', booked: 'Prenotato', closed: 'Chiuso' },
);

const nl = unit('nacht', 'nachten', 'dag', 'dagen');
export const messagesNl = bundle(
  {
    calendar: 'Kalender', previousMonth: 'Vorige maand', nextMonth: 'Volgende maand', loadNext: 'Meer datums tonen',
    loadPrevious: 'Eerdere datums tonen', loading: 'Laden…', error: 'Beschikbaarheid kon niet worden geladen.', retry: 'Opnieuw proberen',
    today: 'vandaag', todayLabel: 'Vandaag', readOnlyNotice: 'Alleen bekijken — datums niet selecteerbaar', selected: 'geselecteerd', rangeStart: 'begindatum', rangeEnd: 'einddatum', inRange: 'in geselecteerde periode', unavailable: 'niet beschikbaar',
    announceStart: (d) => `Begindatum ${d}. Kies een einddatum.`, announceRange: (s, e) => `${s} tot ${e} geselecteerd.`,
    announceSingle: (d) => `${d} geselecteerd.`, announceAdded: (d, c) => `${d} toegevoegd. ${c} geselecteerd.`,
    announceRemoved: (d, c) => `${d} verwijderd. ${c} geselecteerd.`, announceCleared: 'Selectie gewist.', announceRejected: (d, r) => `${d} niet beschikbaar: ${r}`,
  },
  {
    closed: () => 'Niet beschikbaar', past: () => 'Datum in het verleden', 'blocked-in-range': () => 'De periode bevat onbeschikbare dagen',
    'min-length': ((p) => `Minimaal ${nl(p.min, p.unit)}`) as ReasonMessage, 'max-length': ((p) => `Maximaal ${nl(p.max, p.unit)}`) as ReasonMessage,
  },
  { 'check-in-only': 'Alleen aankomst', 'check-out-only': 'Alleen vertrek', booked: 'Bezet', closed: 'Gesloten' },
);

export const messagesAr = bundle(
  {
    calendar: 'التقويم', previousMonth: 'الشهر السابق', nextMonth: 'الشهر التالي', loadNext: 'عرض المزيد من التواريخ',
    loadPrevious: 'عرض التواريخ السابقة', loading: 'جارٍ التحميل…', error: 'تعذر تحميل التوفر.', retry: 'إعادة المحاولة',
    today: 'اليوم', todayLabel: 'اليوم', readOnlyNotice: 'للعرض فقط — لا يمكن تحديد التواريخ', selected: 'محدد', rangeStart: 'تاريخ البداية', rangeEnd: 'تاريخ النهاية', inRange: 'ضمن النطاق المحدد', unavailable: 'غير متاح',
    announceStart: (d) => `تاريخ البداية ${d}. اختر تاريخ النهاية.`, announceRange: (s, e) => `تم تحديد ${s} إلى ${e}.`,
    announceSingle: (d) => `تم تحديد ${d}.`, announceAdded: (d, c) => `تمت إضافة ${d}. ${c} محدد.`,
    announceRemoved: (d, c) => `تمت إزالة ${d}. ${c} محدد.`, announceCleared: 'تم مسح التحديد.', announceRejected: (d, r) => `لا يمكن تحديد ${d}: ${r}`,
  },
  {
    closed: () => 'غير متاح', past: () => 'تاريخ سابق', 'blocked-in-range': () => 'يحتوي النطاق على أيام غير متاحة',
    'min-length': ((p) => `الحد الأدنى ${p.min} ${p.unit === 'nights' ? 'ليالٍ' : 'أيام'}`) as ReasonMessage,
    'max-length': ((p) => `الحد الأقصى ${p.max} ${p.unit === 'nights' ? 'ليالٍ' : 'أيام'}`) as ReasonMessage,
  },
  { 'check-in-only': 'وصول فقط', 'check-out-only': 'مغادرة فقط', booked: 'محجوز', closed: 'مغلق' },
);
