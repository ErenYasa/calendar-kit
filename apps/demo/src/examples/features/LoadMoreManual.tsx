import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';
import './LoadMoreManual.css';

// loadMore="manual": no control inside the months area. Months are added only
// when you call `loadMore(direction)` — here from the footer slot through
// `ctx.actions` (the same object as the ref controller), e.g. to keep the
// buttons in a sticky footer of a mobile sheet.
export default function LoadMoreManual() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="single"
        orientation="vertical"
        navigation="continuous"
        loadMore="manual"
        loadDirections="both"
        numberOfMonths={1}
        minDate={addDays(today, -90)}
        maxDate={addDays(today, 365)}
        maxBlockSize={360}
        renderFooter={(ctx) => (
          <div className="manual-footer">
            <button type="button" onClick={() => ctx.actions.loadMore('previous')}>
              Earlier
            </button>
            <span>{ctx.renderedMonths.length} months</span>
            <button type="button" onClick={() => ctx.actions.loadMore('next')}>
              Later
            </button>
          </div>
        )}
      />
    </div>
  );
}
