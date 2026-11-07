import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, type CalendarController, type CalendarDate, getToday } from 'calendar-kit';
import './Popover.css';

const GAP = 8;
const MARGIN = 8;

// A popover rendered through a portal into document.body. A portal only moves
// the DOM; positioning is the app's job (the calendar positions only its own
// tooltip). Here the position follows the trigger on scroll (any scroll
// container) and resize, flips above when there is more room there, stays
// inside the viewport horizontally, and the popover closes when the trigger
// scrolls out of view. Escape, an outside click and a pick close it; focus
// then returns to the trigger. Closing is done in onSelectionComplete, not
// onChange: re-picking the date that is already selected changes nothing (no
// onChange) but still completes the selection, so it closes the popover too.
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
      if (t.bottom < 0 || t.top > vh) return close(); // trigger scrolled out of view
      const below = vh - t.bottom - GAP - MARGIN;
      const above = t.top - GAP - MARGIN;
      const height = el.scrollHeight + el.offsetHeight - el.clientHeight; // natural height incl. borders
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
        {date ?? 'Pick a date'}
      </button>
      {open &&
        createPortal(
          <div
            ref={popover}
            className="popover"
            role="dialog"
            aria-label="Pick a date"
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
