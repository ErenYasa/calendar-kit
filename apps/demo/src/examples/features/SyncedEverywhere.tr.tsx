import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, type CalendarController, type DateRange, diffDays, getToday, type RangeEndpoint, stayRules } from 'calendar-kit';
import './SyncedEverywhere.css';

const rules = stayRules({ minNights: 2, disablePast: true });
const GAP = 8;
const MARGIN = 8;

// Üç takvim, tek seçim: sayfa içinde, modal bir <dialog> içinde ve portal ile
// document.body içine taşınan bir açılır pencerede (popover). Gizli bir depo
// (store) yoktur; üçü de aynı prop’ları alır. `activeEndpoint` da paylaşılır;
// böylece bir takvimde seçilen başlangıç diğerinde tamamlanabilir. Görünen ay,
// odak ve araç ipucu her takvime özeldir.
export default function SyncedEverywhere() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [endpoint, setEndpoint] = useState<RangeEndpoint>('start');
  const shared = { rules, value: range, onChange: setRange, activeEndpoint: endpoint, onActiveEndpointChange: setEndpoint };

  // Modal: diyalog üst katmanda (top layer) yer alır, bu yüzden araç ipucu portal ile onun içine konur.
  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogContent, setDialogContent] = useState<HTMLDivElement | null>(null);

  // Açılır pencere: konumlandırma uygulamanın işidir (Popover örneğiyle aynı yaklaşım).
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const popoverCalendar = useRef<CalendarController>(null);
  const [open, setOpen] = useState(false);

  const closePopover = () => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const place = () => {
      frame = 0;
      const t = trigger.current!.getBoundingClientRect();
      const el = popover.current!;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      if (t.bottom < 0 || t.top > vh) return closePopover(); // tetikleyici kaydırılarak görünümden çıktı
      const below = vh - t.bottom - GAP - MARGIN;
      const above = t.top - GAP - MARGIN;
      const height = el.scrollHeight + el.offsetHeight - el.clientHeight; // kenarlıklar dahil doğal yükseklik
      const up = height > below && above > below;
      el.style.maxHeight = `${Math.max(120, up ? above : below)}px`;
      el.style.top = `${up ? t.top - GAP - Math.min(height, above) : t.bottom + GAP}px`;
      el.style.left = `${Math.min(Math.max(MARGIN, t.left), Math.max(MARGIN, vw - el.offsetWidth - MARGIN))}px`;
      el.dataset.side = up ? 'top' : 'bottom';
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    place();
    addEventListener('scroll', schedule, { capture: true, passive: true });
    addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(popover.current!);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule, { capture: true });
      removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [open]);

  const nights = range.start && range.end ? diffDays(range.start, range.end) : 0;
  const summary = range.start
    ? `${range.start} → ${range.end ?? '…'}${nights ? ` (${nights} gece)` : ''}, sıradaki: ${endpoint}`
    : `Henüz tarih yok, sıradaki: ${endpoint}`;

  return (
    <div className="synced-everywhere">
      <p className="synced-everywhere-summary" aria-live="polite">
        {summary}
      </p>

      <Calendar mode="range" {...shared} aria-label="Sayfa içi" />

      <div className="synced-everywhere-actions">
        <button type="button" onClick={() => dialog.current?.showModal()}>
          Diyalogda düzenle
        </button>
        <button ref={trigger} type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => (open ? closePopover() : setOpen(true))}>
          Açılır pencerede düzenle
        </button>
      </div>

      <dialog ref={dialog} className="synced-everywhere-dialog" aria-label="Tarihleri düzenle">
        <div ref={setDialogContent}>
          <Calendar mode="range" {...shared} numberOfMonths={2} tooltip={{ container: dialogContent }} aria-label="Diyalogda" />
          <form method="dialog" className="synced-everywhere-dialog-actions">
            <button type="submit">Tamam</button>
          </form>
        </div>
      </dialog>

      {open &&
        createPortal(
          <div
            ref={popover}
            className="synced-everywhere-popover"
            role="dialog"
            aria-label="Tarihleri düzenle"
            onKeyDown={(e) => e.key === 'Escape' && !e.defaultPrevented && closePopover()}
          >
            <Calendar
              ref={popoverCalendar}
              mode="range"
              {...shared}
              aria-label="Açılır pencerede"
              onOutsideClick={(e) => !trigger.current?.contains(e.nativeEvent.target as Node) && closePopover()}
              onReady={() => popoverCalendar.current?.focusDate(range.start ?? today)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
