import { Calendar, type CalendarDate, type SlotContext as Ctx, countDays, dayRangeRules } from 'calendar-kit';

const rules = dayRangeRules();
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 4px' } as const;

// The footer reads everything from `ctx`: no app state is needed.
function Footer(ctx: Ctx) {
  // ctx.selection is { mode, value }; in range mode, value is { start, end }.
  const range = ctx.selection.mode === 'range' ? ctx.selection.value : null;
  const label = (date: CalendarDate | null) => (date ? ctx.formatDate(date, { day: 'numeric', month: 'short' }) : '…');

  // ctx.phase: 'empty' → 'start-selected' → 'complete'.
  let text = 'Select a start date';
  if (ctx.phase === 'start-selected' && range) text = `${label(range.start)} → select an end date`;
  if (ctx.phase === 'complete' && range) text = `${label(range.start)} → ${label(range.end)} (${countDays(range)} days)`;

  return (
    <div style={row}>
      <span>{text}</span>
      <span>
        {/* ctx.actions is the calendar's controller (the same methods as a ref). */}
        <button type="button" onClick={() => ctx.today && ctx.actions.goToMonth(ctx.today)}>
          Today
        </button>{' '}
        <button type="button" onClick={() => ctx.actions.clear()} disabled={ctx.phase === 'empty'}>
          Clear
        </button>
      </span>
    </div>
  );
}

// Uncontrolled range calendar: the calendar keeps the selection, the footer slot shows it.
export default function SlotContext() {
  return <Calendar mode="range" rules={rules} renderFooter={Footer} />;
}
