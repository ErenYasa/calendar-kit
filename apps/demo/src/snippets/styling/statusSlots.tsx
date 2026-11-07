import { Calendar, type CalendarMonth, type DataStatus } from 'calendar-kit';

// Loading, error and load-more slots (continuous navigation).
export function ScrollingCalendar({ status, retry }: { status: (m: CalendarMonth) => DataStatus; retry: (months: readonly CalendarMonth[]) => void }) {
  return (
    <Calendar
      mode="single"
      navigation="continuous"
      getDataStatus={status}
      onRetry={retry}
      // scope: 'initial' (loading prop on first load), 'month' (a month's
      // status is 'loading'), 'load-more' (months just added are loading).
      renderLoading={({ scope, months, messages }) => (
        <p role="status" className="my-loading" data-scope={scope}>
          {messages.loading} {months.join(', ')}
        </p>
      )}
      // One per month whose status is 'error'. retry() calls onRetry([month]).
      renderError={({ months, retry, messages }) => (
        <div role="alert" className="my-error">
          {messages.error} ({months[0]}) <button type="button" onClick={retry}>{messages.retry}</button>
        </div>
      )}
      // loadMore="button" (default): replaces each load-more button. Also called
      // at minDate/maxDate with canLoad: false (loadMore() does nothing there).
      renderLoadMore={({ direction, canLoad, loading, loadMore, label }) => (
        <button type="button" className="my-load-more" data-direction={direction} disabled={!canLoad || loading} onClick={loadMore}>
          {canLoad ? label : 'No more dates'}
        </button>
      )}
    />
  );
}
