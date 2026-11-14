import { Calendar, type CalendarDate, type SlotContext as Ctx, countDays, dayRangeRules } from 'calendar-kit';

const rules = dayRangeRules();
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 4px' } as const;

// Alt bilgi her şeyi `ctx`’ten okur: uygulamada state tutmaya gerek yoktur.
function Footer(ctx: Ctx) {
  // ctx.selection { mode, value } biçimindedir; aralık modunda value { start, end } olur.
  const range = ctx.selection.mode === 'range' ? ctx.selection.value : null;
  const label = (date: CalendarDate | null) => (date ? ctx.formatDate(date, { day: 'numeric', month: 'short' }) : '…');

  // ctx.phase: 'empty' → 'start-selected' → 'complete'.
  let text = 'Bir başlangıç tarihi seçin';
  if (ctx.phase === 'start-selected' && range) text = `${label(range.start)} → bir bitiş tarihi seçin`;
  if (ctx.phase === 'complete' && range) text = `${label(range.start)} → ${label(range.end)} (${countDays(range)} gün)`;

  return (
    <div style={row}>
      <span>{text}</span>
      <span>
        {/* ctx.actions takvimin controller’ıdır (ref ile aynı metotlar). */}
        <button type="button" onClick={() => ctx.today && ctx.actions.goToMonth(ctx.today)}>
          Bugün
        </button>{' '}
        <button type="button" onClick={() => ctx.actions.clear()} disabled={ctx.phase === 'empty'}>
          Temizle
        </button>
      </span>
    </div>
  );
}

// Uncontrolled aralık takvimi: seçimi takvim tutar, alt bilgi slotu onu gösterir.
export default function SlotContext() {
  return <Calendar mode="range" rules={rules} renderFooter={Footer} />;
}
