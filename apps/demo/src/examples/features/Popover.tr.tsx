import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, type CalendarController, type CalendarDate, getToday } from 'calendar-kit';
import './Popover.css';

const GAP = 8;
const MARGIN = 8;

// Portal ile document.body içine render edilen bir açılır pencere (popover).
// Portal yalnızca DOM’u taşır; konumlandırma uygulamanın işidir (takvim yalnızca
// kendi araç ipucunu konumlandırır). Burada konum, kaydırmada (herhangi bir
// kaydırma kabında) ve yeniden boyutlandırmada tetikleyiciyi izler, yukarıda daha
// çok yer varsa yukarı açılır, yatayda görünüm alanının içinde kalır ve
// tetikleyici kaydırılarak görünümden çıkınca kapanır. Escape, dışarıya tıklama
// ve bir seçim onu kapatır; odak ardından tetikleyiciye döner. Kapatma onChange’de
// değil onSelectionComplete’te yapılır: zaten seçili tarihi yeniden seçmek hiçbir
// şeyi değiştirmez (onChange çağrılmaz) ama seçimi yine de tamamlar, bu yüzden
// açılır pencereyi de kapatır.
export default function Popover() {
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const calendar = useRef<CalendarController>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<CalendarDate | null>(null);

  const close = () => {
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
      if (t.bottom < 0 || t.top > vh) return close(); // tetikleyici kaydırılarak görünümden çıktı
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

  return (
    <div>
      <button ref={trigger} type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => (open ? close() : setOpen(true))}>
        {date ?? 'Bir tarih seçin'}
      </button>
      {open &&
        createPortal(
          <div
            ref={popover}
            className="popover"
            role="dialog"
            aria-label="Bir tarih seçin"
            onKeyDown={(e) => e.key === 'Escape' && !e.defaultPrevented && close()}
          >
            <Calendar
              ref={calendar}
              mode="single"
              value={date}
              onChange={setDate}
              onSelectionComplete={close}
              onOutsideClick={(e) => !trigger.current?.contains(e.nativeEvent.target as Node) && close()}
              onReady={() => calendar.current?.focusDate(date ?? getToday())}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
