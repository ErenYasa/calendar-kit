import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, type CalendarController, type CalendarDate, getToday } from 'calendar-kit';
import './Popover.css';

// A popover rendered through a portal into document.body, positioned under its
// button. Opening, closing and focus are the app's job: the calendar never
// closes itself. `onOutsideClick` treats the calendar's own portals (tooltip)
// as inside.
export default function Popover() {
  const button = useRef<HTMLButtonElement>(null);
  const calendar = useRef<CalendarController>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const r = button.current.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left });
  }, [open]);

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  return (
    <div>
      <button ref={button} type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {date ?? 'Pick a date'}
      </button>
      {open &&
        createPortal(
          <div className="popover" style={pos} role="dialog" aria-label="Pick a date" onKeyDown={(e) => e.key === 'Escape' && !e.defaultPrevented && close()}>
            <Calendar
              ref={calendar}
              mode="single"
              value={date}
              onChange={(d) => (setDate(d), close())}
              onOutsideClick={(e) => e.nativeEvent.target !== button.current && close()}
              onReady={() => calendar.current?.focusDate(date ?? getToday())}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
