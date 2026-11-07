// Focus, tooltip, pointer and scroll events, and onEvent as a single entry
// point for analytics.
import { useRef, useState } from 'react';
import { Calendar, type CalendarDate, type CalendarEvent, formatDate } from 'calendar-kit';

// Your app's own functions.
declare function track(name: string, data?: Record<string, unknown>): void;
declare function debugLog(...values: unknown[]): void;

// A date field with a popover. onOutsideClick only knows the calendar's own
// React tree, so pointer downs on your popover chrome and on the trigger
// button are "outside": check them yourself.
export function DateField() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<CalendarDate | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div>
      <button ref={trigger} type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {date ? formatDate(date, 'en-US', { dateStyle: 'medium' }) : 'Pick a date'}
      </button>
      {open && (
        <div ref={popover} role="dialog" aria-label="Choose a date">
          <Calendar
            mode="single"
            value={date}
            onChange={setDate}
            onSelectionComplete={close}
            onOutsideClick={(e) => {
              const target = e.nativeEvent.target as Node;
              if (!popover.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

// Show details of the focused day next to the calendar, and a header shadow
// once the inner scroll area has moved.
export function FocusDetails() {
  const [focused, setFocused] = useState<CalendarDate | null>(null);
  const [scrolled, setScrolled] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ boxShadow: scrolled ? '0 4px 8px -6px rgb(0 0 0 / 40%)' : 'none' }}>
        <Calendar
          mode="single"
          navigation="continuous"
          orientation="vertical"
          maxBlockSize={420}
          onDayFocusChange={(e) => setFocused(e.date)}
          // One call per animation frame at most.
          onScroll={(e) => setScrolled(e.scrollTop > 0)}
          onTooltipOpenChange={(e) => {
            if (e.open && e.trigger !== 'persistent') track('tooltip_opened', { date: e.date, trigger: e.trigger });
          }}
        />
      </div>
      <p aria-live="off">{focused ? formatDate(focused, 'en-US', { dateStyle: 'full' }) : 'Use the arrow keys to explore dates.'}</p>
    </div>
  );
}

// onEvent: every event as one discriminated union, after its own callback.
const onCalendarEvent = (e: CalendarEvent) => {
  switch (e.type) {
    case 'change':
      track('calendar_change', { reason: e.reason, source: e.source, phase: e.phase });
      break;
    case 'invalidSelection':
      track('calendar_invalid', { code: e.issue.code, source: e.source });
      break;
    case 'visibleMonthChange':
      track('calendar_month', { month: e.month, reason: e.reason });
      break;
    case 'scroll':
    case 'resize':
    case 'dayFocusChange':
      break; // too frequent for analytics
    default:
      debugLog(e.instanceId, e.type, e);
  }
};

export function TrackedCalendar() {
  return <Calendar mode="range" numberOfMonths={2} onEvent={onCalendarEvent} />;
}
