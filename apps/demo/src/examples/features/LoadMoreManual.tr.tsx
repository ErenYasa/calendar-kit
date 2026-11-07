import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';
import './LoadMoreManual.css';

// loadMore="manual": aylar alanının içinde kontrol yoktur. Aylar yalnızca
// `loadMore(direction)` çağrıldığında eklenir; burada footer slot’undan
// `ctx.actions` üzerinden (ref controller ile aynı nesne), ör. düğmeleri bir
// mobil alt panelin yapışkan (sticky) alt kısmında tutmak için.
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
              Önceki
            </button>
            <span>{ctx.renderedMonths.length} ay</span>
            <button type="button" onClick={() => ctx.actions.loadMore('next')}>
              Sonraki
            </button>
          </div>
        )}
      />
    </div>
  );
}
