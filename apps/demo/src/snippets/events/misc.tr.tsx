// Odak, araç ipucu, işaretçi ve kaydırma olayları; analitik için tek giriş
// noktası olarak onEvent.
import { useRef, useState } from 'react';
import { Calendar, type CalendarDate, type CalendarEvent, formatDate } from 'calendar-kit';

// Uygulamanızın kendi fonksiyonları.
declare function track(name: string, data?: Record<string, unknown>): void;
declare function debugLog(...values: unknown[]): void;

// Popover’lı bir tarih alanı. onOutsideClick yalnızca takvimin kendi React
// ağacını bilir; popover çerçevenize ve açan düğmeye yapılan pointer down’lar
// "dışarıda" sayılır: bunları kendiniz kontrol edin.
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
        {date ? formatDate(date, 'en-US', { dateStyle: 'medium' }) : 'Tarih seçin'}
      </button>
      {open && (
        <div ref={popover} role="dialog" aria-label="Bir tarih seçin">
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

// Odaklanan günün ayrıntılarını takvimin yanında gösterin; iç kaydırma alanı
// hareket ettiğinde başlığa gölge ekleyin.
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
          // Animasyon karesi başına en fazla bir çağrı.
          onScroll={(e) => setScrolled(e.scrollTop > 0)}
          onTooltipOpenChange={(e) => {
            if (e.open && e.trigger !== 'persistent') track('tooltip_opened', { date: e.date, trigger: e.trigger });
          }}
        />
      </div>
      <p aria-live="off">{focused ? formatDate(focused, 'en-US', { dateStyle: 'full' }) : 'Tarihleri gezmek için ok tuşlarını kullanın.'}</p>
    </div>
  );
}

// onEvent: her olay, kendi callback’inden sonra, tek bir ayrımlı birleşim (discriminated union) olarak.
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
      break; // analitik için fazla sık
    default:
      debugLog(e.instanceId, e.type, e);
  }
};

export function TrackedCalendar() {
  return <Calendar mode="range" numberOfMonths={2} onEvent={onCalendarEvent} />;
}
