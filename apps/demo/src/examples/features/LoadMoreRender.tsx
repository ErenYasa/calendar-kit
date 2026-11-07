import { useState } from 'react';
import { Calendar, addDays, getToday } from 'calendar-kit';
import './LoadMoreRender.css';

// renderLoadMore replaces the whole control. You get `direction`, `loading`
// (the months just added are still loading their data), `loadMore()` and the
// default `label`. It is only called while more months can load: at
// minDate/maxDate no control is rendered at all (so `canLoad` is always true).
export default function LoadMoreRender() {
  const [today] = useState(() => getToday());
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="single"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={1}
        minDate={addDays(today, -90)}
        maxDate={addDays(today, 365)}
        maxBlockSize={420}
        renderLoadMore={({ direction, loadMore }) => (
          <button type="button" className="add-month" onClick={loadMore}>
            {direction === 'previous' ? '← Add the previous month' : 'Add the next month →'}
          </button>
        )}
      />
    </div>
  );
}
