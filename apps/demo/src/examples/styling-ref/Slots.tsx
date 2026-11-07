import { useState } from 'react';
import { Calendar, addDays, getToday, type DateRange } from 'calendar-kit';
import './Slots.css';

// Slots replace one region and receive the calendar's state (`ctx`, a
// SlotContext): the snapshot, the controller (`ctx.actions`), messages,
// locale and `formatDate`. Each one is wrapped in an element that still gets
// its default class and your `classNames` key (header, navigation, footer).
export default function Slots() {
  const [today] = useState(() => getToday());
  const [range, setRange] = useState<DateRange>({ start: addDays(today, 3), end: addDays(today, 7) });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      today={today}
      disablePast
      value={range}
      onChange={setRange}
      classNames={{ header: 'sl-header', navigation: 'sl-nav', footer: 'sl-footer' }}
      renderHeader={(ctx) => <strong>Phase: {ctx.phase}</strong>}
      // Replaces the default arrows (paged navigation only).
      renderNavigation={(nav, ctx) => (
        <>
          <button type="button" className="sl-button" onClick={nav.previous} disabled={!nav.canPrevious} aria-label={nav.labels.previous}>
            ←
          </button>
          <button type="button" className="sl-button" onClick={() => ctx.actions.goToMonth(today)}>
            Today
          </button>
          <button type="button" className="sl-button" onClick={nav.next} disabled={!nav.canNext} aria-label={nav.labels.next}>
            →
          </button>
        </>
      )}
      // Replaces the month title row. Keep a heading: it names the month for screen readers.
      renderMonthHeader={({ title, index }) => (
        <h3 className="sl-month-title">
          <span className="sl-index">{index + 1}</span> {title}
        </h3>
      )}
      // Inside the default day button: no buttons or links here.
      renderDayContent={({ day }) => (
        <span className="sl-day">
          {day.dayText}
          {day.weekEnd && <span className="sl-dot" aria-hidden="true" />}
        </span>
      )}
      getDayTooltip={({ day }) => (day.selectedStart || day.selectedEnd ? day.label : null)}
      // Wraps the tooltip content; `content` is what getDayTooltip returned.
      renderDayTooltip={({ day, content, placement }) => (
        <span className="sl-tip">
          {day.selectedStart ? 'Start' : 'End'} · {content} ({placement})
        </span>
      )}
      renderFooter={(ctx) => (
        <span>
          {range.start && range.end ? `${ctx.formatDate(range.start)} – ${ctx.formatDate(range.end)}` : 'Pick a range'}
          <button type="button" className="sl-button" onClick={() => ctx.actions.clear()}>
            Clear
          </button>
        </span>
      )}
    />
  );
}
