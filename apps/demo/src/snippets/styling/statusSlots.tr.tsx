import { Calendar, type CalendarMonth, type DataStatus } from 'calendar-kit';

// Yükleme, hata ve daha fazla ay yükleme slotları (sürekli gezinme).
export function ScrollingCalendar({ status, retry }: { status: (m: CalendarMonth) => DataStatus; retry: (months: readonly CalendarMonth[]) => void }) {
  return (
    <Calendar
      mode="single"
      navigation="continuous"
      getDataStatus={status}
      onRetry={retry}
      // scope: 'initial' (ilk yüklemede loading prop’u), 'month' (bir ayın
      // durumu 'loading'), 'load-more' (yeni eklenen aylar yükleniyor).
      renderLoading={({ scope, months, messages }) => (
        <p role="status" className="my-loading" data-scope={scope}>
          {messages.loading} {months.join(', ')}
        </p>
      )}
      // Durumu 'error' olan her ay için bir tane. retry(), onRetry([month]) çağırır.
      renderError={({ months, retry, messages }) => (
        <div role="alert" className="my-error">
          {messages.error} ({months[0]}) <button type="button" onClick={retry}>{messages.retry}</button>
        </div>
      )}
      // loadMore="button" (varsayılan): her daha fazla ay yükleme düğmesinin yerine geçer.
      // minDate/maxDate sınırında da canLoad: false ile çağrılır (orada loadMore() bir şey yapmaz).
      renderLoadMore={({ direction, canLoad, loading, loadMore, label }) => (
        <button type="button" className="my-load-more" data-direction={direction} disabled={!canLoad || loading} onClick={loadMore}>
          {canLoad ? label : 'Başka tarih yok'}
        </button>
      )}
    />
  );
}
