import { useState } from 'react';
import { Calendar, addDays, addMonths, getToday } from 'calendar-kit';
import './LoadMoreRender.css';

// renderLoadMore replaces the whole control. You get `direction`, `canLoad`,
// `loading` (the months just added are still loading their data), `loadMore()`
// and the default `label`. At minDate/maxDate it is still called, with
// `canLoad: false` (loadMore() does nothing then), so it can show the end state.
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
        minDate={addDays(today, -60)}
        maxDate={addMonths(today, 2)}
        maxBlockSize={420}
        renderLoadMore={({ direction, canLoad, loadMore }) =>
          canLoad ? (
            <button type="button" className="add-month" onClick={loadMore}>
              {direction === 'previous' ? '← Add the previous month' : 'Add the next month →'}
            </button>
          ) : (
            <p className="no-more">{direction === 'previous' ? 'No earlier dates' : 'No more dates'}</p>
          )
        }
      />
    </div>
  );
}
