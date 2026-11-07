import type { CalendarMessages } from './messages.js';

/**
 * Additional UI message bundles. Month and weekday names always come from
 * `Intl`; these only cover the calendar's own UI strings. Each export is
 * tree-shakable — import only what you use.
 */

type Reasons = CalendarMessages['reasons'];
/** Day-reason tags produced by the built-in adapters and the engine (see `messagesEn.dayReasons`). */
type DayReasonTag = 'check-in-only' | 'check-out-only' | 'booked' | 'closed' | 'start-only' | 'end-only' | 'out-of-schedule';

/** Every reason code and every built-in day-reason tag is required, so a pack can never fall back to English. */
function bundle(
  base: Omit<CalendarMessages, 'reasons' | 'dayReasons'>,
  reasons: Omit<Reasons, 'custom'> & Partial<Pick<Reasons, 'custom'>>,
  dayReasons: Record<DayReasonTag, string>,
): CalendarMessages {
  return { ...base, reasons: { custom: reasons.closed, ...reasons }, dayReasons };
}

const unit = (one: string, many: string, dayOne: string, dayMany: string): ((n: unknown, u: unknown) => string) => (n, u) =>
  `${n} ${u === 'nights' ? (n === 1 ? one : many) : n === 1 ? dayOne : dayMany}`;
/** `n` followed by the singular or plural noun. */
const count = (n: unknown, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

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
    'invalid-date': () => 'Ungültiges Datum', 'before-min': (p, f) => `Verfügbar ab ${f.date(p.min)}`, 'after-max': (p, f) => `Verfügbar bis ${f.date(p.max)}`,
    past: () => 'Vergangenes Datum', future: () => 'Datum in der Zukunft', closed: () => 'Nicht verfügbar',
    'start-not-allowed': () => 'Nicht als Startdatum verfügbar', 'end-not-allowed': () => 'Nicht als Enddatum verfügbar',
    'blocked-in-range': () => 'Der Zeitraum enthält nicht verfügbare Tage',
    'weekday-start': () => 'An diesem Wochentag kein Beginn möglich', 'weekday-end': () => 'An diesem Wochentag kein Ende möglich',
    'min-length': (p) => `Mindestens ${de(p.min, p.unit)}`, 'max-length': (p) => `Höchstens ${de(p.max, p.unit)}`, 'fixed-length': (p) => `Genau ${de(p.length, p.unit)}`,
    'same-day': () => 'Beginn und Ende dürfen nicht auf denselben Tag fallen', 'end-before-start': () => 'Das Ende liegt vor dem Beginn',
    'max-selections': (p) => `Sie können höchstens ${count(p.max, 'Datum', 'Daten')} auswählen`,
    'data-unknown': () => 'Verfügbarkeit noch nicht geladen', 'data-loading': () => 'Verfügbarkeit wird geladen…', 'data-error': () => 'Verfügbarkeit konnte nicht geladen werden',
  },
  {
    'check-in-only': 'Nur Anreise', 'check-out-only': 'Nur Abreise', booked: 'Belegt', closed: 'Geschlossen',
    'start-only': 'Nur Beginn', 'end-only': 'Nur Ende', 'out-of-schedule': 'An diesem Tag kein Betrieb',
  },
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
    'invalid-date': () => 'Date invalide', 'before-min': (p, f) => `Disponible à partir du ${f.date(p.min)}`, 'after-max': (p, f) => `Disponible jusqu'au ${f.date(p.max)}`,
    past: () => 'Date passée', future: () => 'Date future', closed: () => 'Indisponible',
    'start-not-allowed': () => 'Indisponible comme date de début', 'end-not-allowed': () => 'Indisponible comme date de fin',
    'blocked-in-range': () => 'La période contient des jours indisponibles',
    'weekday-start': () => 'Impossible de commencer ce jour de la semaine', 'weekday-end': () => 'Impossible de terminer ce jour de la semaine',
    'min-length': (p) => `Minimum ${fr(p.min, p.unit)}`, 'max-length': (p) => `Maximum ${fr(p.max, p.unit)}`, 'fixed-length': (p) => `Exactement ${fr(p.length, p.unit)}`,
    'same-day': () => 'Le début et la fin ne peuvent pas être le même jour', 'end-before-start': () => 'La fin précède le début',
    'max-selections': (p) => `Vous pouvez sélectionner jusqu'à ${count(p.max, 'date', 'dates')}`,
    'data-unknown': () => 'Disponibilités pas encore chargées', 'data-loading': () => 'Chargement des disponibilités…', 'data-error': () => 'Impossible de charger les disponibilités',
  },
  {
    'check-in-only': 'Arrivée uniquement', 'check-out-only': 'Départ uniquement', booked: 'Réservé', closed: 'Fermé',
    'start-only': 'Début uniquement', 'end-only': 'Fin uniquement', 'out-of-schedule': 'Aucun service ce jour-là',
  },
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
    'invalid-date': () => 'Fecha no válida', 'before-min': (p, f) => `Disponible desde el ${f.date(p.min)}`, 'after-max': (p, f) => `Disponible hasta el ${f.date(p.max)}`,
    past: () => 'Fecha pasada', future: () => 'Fecha futura', closed: () => 'No disponible',
    'start-not-allowed': () => 'No disponible como fecha de inicio', 'end-not-allowed': () => 'No disponible como fecha de fin',
    'blocked-in-range': () => 'El rango contiene días no disponibles',
    'weekday-start': () => 'No se puede empezar en este día de la semana', 'weekday-end': () => 'No se puede terminar en este día de la semana',
    'min-length': (p) => `Mínimo ${es(p.min, p.unit)}`, 'max-length': (p) => `Máximo ${es(p.max, p.unit)}`, 'fixed-length': (p) => `Exactamente ${es(p.length, p.unit)}`,
    'same-day': () => 'El inicio y el fin no pueden ser el mismo día', 'end-before-start': () => 'El fin es anterior al inicio',
    'max-selections': (p) => `Puedes seleccionar hasta ${count(p.max, 'fecha', 'fechas')}`,
    'data-unknown': () => 'Disponibilidad aún no cargada', 'data-loading': () => 'Cargando disponibilidad…', 'data-error': () => 'No se pudo cargar la disponibilidad',
  },
  {
    'check-in-only': 'Solo entrada', 'check-out-only': 'Solo salida', booked: 'Reservado', closed: 'Cerrado',
    'start-only': 'Solo inicio', 'end-only': 'Solo fin', 'out-of-schedule': 'Sin servicio este día',
  },
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
    'invalid-date': () => 'Data non valida', 'before-min': (p, f) => `Disponibile dal ${f.date(p.min)}`, 'after-max': (p, f) => `Disponibile fino al ${f.date(p.max)}`,
    past: () => 'Data passata', future: () => 'Data futura', closed: () => 'Non disponibile',
    'start-not-allowed': () => 'Non disponibile come data di inizio', 'end-not-allowed': () => 'Non disponibile come data di fine',
    'blocked-in-range': () => "L'intervallo contiene giorni non disponibili",
    'weekday-start': () => 'Impossibile iniziare in questo giorno della settimana', 'weekday-end': () => 'Impossibile terminare in questo giorno della settimana',
    'min-length': (p) => `Minimo ${it(p.min, p.unit)}`, 'max-length': (p) => `Massimo ${it(p.max, p.unit)}`, 'fixed-length': (p) => `Esattamente ${it(p.length, p.unit)}`,
    'same-day': () => "L'inizio e la fine non possono cadere nello stesso giorno", 'end-before-start': () => "La fine precede l'inizio",
    'max-selections': (p) => `Puoi selezionare fino a ${count(p.max, 'data', 'date')}`,
    'data-unknown': () => 'Disponibilità non ancora caricata', 'data-loading': () => 'Caricamento della disponibilità…', 'data-error': () => 'Impossibile caricare la disponibilità',
  },
  {
    'check-in-only': 'Solo arrivo', 'check-out-only': 'Solo partenza', booked: 'Prenotato', closed: 'Chiuso',
    'start-only': 'Solo inizio', 'end-only': 'Solo fine', 'out-of-schedule': 'Nessun servizio in questo giorno',
  },
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
    'invalid-date': () => 'Ongeldige datum', 'before-min': (p, f) => `Beschikbaar vanaf ${f.date(p.min)}`, 'after-max': (p, f) => `Beschikbaar tot en met ${f.date(p.max)}`,
    past: () => 'Datum in het verleden', future: () => 'Datum in de toekomst', closed: () => 'Niet beschikbaar',
    'start-not-allowed': () => 'Niet beschikbaar als begindatum', 'end-not-allowed': () => 'Niet beschikbaar als einddatum',
    'blocked-in-range': () => 'De periode bevat onbeschikbare dagen',
    'weekday-start': () => 'Kan niet op deze weekdag beginnen', 'weekday-end': () => 'Kan niet op deze weekdag eindigen',
    'min-length': (p) => `Minimaal ${nl(p.min, p.unit)}`, 'max-length': (p) => `Maximaal ${nl(p.max, p.unit)}`, 'fixed-length': (p) => `Precies ${nl(p.length, p.unit)}`,
    'same-day': () => 'Begin en einde kunnen niet op dezelfde dag vallen', 'end-before-start': () => 'Het einde ligt vóór het begin',
    'max-selections': (p) => `Je kunt maximaal ${count(p.max, 'datum', 'datums')} selecteren`,
    'data-unknown': () => 'Beschikbaarheid nog niet geladen', 'data-loading': () => 'Beschikbaarheid wordt geladen…', 'data-error': () => 'Beschikbaarheid kon niet worden geladen',
  },
  {
    'check-in-only': 'Alleen aankomst', 'check-out-only': 'Alleen vertrek', booked: 'Bezet', closed: 'Gesloten',
    'start-only': 'Alleen begin', 'end-only': 'Alleen einde', 'out-of-schedule': 'Geen dienst op deze dag',
  },
);

/**
 * Arabic counted nouns follow the CLDR plural categories: one and two use the
 * singular/dual noun without a numeral, 3–10 the plural, 11–99 the accusative
 * singular (tamyīz) and 0/100+ the genitive singular.
 * `forms` = [one, two, few (3–10), many (11–99), other].
 */
const arCount = (n: unknown, forms: readonly [string, string, string, string, string]) => {
  if (typeof n !== 'number' || !Number.isInteger(n)) return `${n} ${forms[2]}`;
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  const m = n % 100;
  return `${n} ${m >= 3 && m <= 10 ? forms[2] : m >= 11 ? forms[3] : forms[4]}`;
};
const ar = (n: unknown, u: unknown) =>
  arCount(n, u === 'nights' ? ['ليلة واحدة', 'ليلتان', 'ليالٍ', 'ليلة', 'ليلة'] : ['يوم واحد', 'يومان', 'أيام', 'يومًا', 'يوم']);

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
    'invalid-date': () => 'تاريخ غير صالح', 'before-min': (p, f) => `متاح اعتبارًا من ${f.date(p.min)}`, 'after-max': (p, f) => `متاح حتى ${f.date(p.max)}`,
    past: () => 'تاريخ سابق', future: () => 'تاريخ مستقبلي', closed: () => 'غير متاح',
    'start-not-allowed': () => 'غير متاح كتاريخ بداية', 'end-not-allowed': () => 'غير متاح كتاريخ نهاية',
    'blocked-in-range': () => 'يحتوي النطاق على أيام غير متاحة',
    'weekday-start': () => 'لا يمكن البدء في هذا اليوم من الأسبوع', 'weekday-end': () => 'لا يمكن الانتهاء في هذا اليوم من الأسبوع',
    'min-length': (p) => `الحد الأدنى ${ar(p.min, p.unit)}`, 'max-length': (p) => `الحد الأقصى ${ar(p.max, p.unit)}`, 'fixed-length': (p) => `${ar(p.length, p.unit)} بالضبط`,
    'same-day': () => 'لا يمكن أن تكون البداية والنهاية في اليوم نفسه', 'end-before-start': () => 'النهاية تسبق البداية',
    'max-selections': (p) => `يمكنك تحديد ${arCount(p.max, ['تاريخ واحد', 'تاريخين', 'تواريخ', 'تاريخًا', 'تاريخ'])} كحد أقصى`,
    'data-unknown': () => 'لم يتم تحميل التوفر بعد', 'data-loading': () => 'جارٍ تحميل التوفر…', 'data-error': () => 'تعذر تحميل التوفر',
  },
  {
    'check-in-only': 'وصول فقط', 'check-out-only': 'مغادرة فقط', booked: 'محجوز', closed: 'مغلق',
    'start-only': 'بداية فقط', 'end-only': 'نهاية فقط', 'out-of-schedule': 'لا توجد خدمة في هذا اليوم',
  },
);
