import { Calendar, addDays, addMonthsToMonth, getMonth, getToday } from 'calendar-kit';

const today = getToday();

// Continuous navigation: two months first (starting two months ahead), more on
// request in both directions until minDate/maxDate.
// `loadMoreLabels` only changes the buttons' content; the default buttons,
// their behaviour and accessibility stay.
export default function LoadMore() {
  return (
    <div style={{ maxWidth: 380 }}>
      <Calendar
        mode="range"
        orientation="vertical"
        navigation="continuous"
        loadDirections="both"
        numberOfMonths={2}
        monthsPerLoad={2}
        defaultVisibleMonth={addMonthsToMonth(getMonth(today), 2)}
        minDate={today}
        maxDate={addDays(today, 365)}
        maxBlockSize={480}
        loadMoreLabels={{ previous: 'Show earlier dates', next: 'Show more dates' }}
      />
    </div>
  );
}
