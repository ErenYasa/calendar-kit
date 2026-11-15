import { useEffect, useState } from 'react';
import { Calendar } from 'calendar-kit';

// Initial load: `loading` is on when the calendar first opens, so empty
// placeholders replace the dates (screen readers get a status message) and,
// with the default unknownDataPolicy 'block', no day can be selected.
// Background refresh: once dates have been shown, turning `loading` on again
// keeps the view, the selection and keyboard focus; days stay selectable and
// only aria-busy is set. "Reload" remounts the calendar (new key) to show the
// initial load again.
export default function InitialLoad() {
  const [mount, setMount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 3000); // your request
    return () => clearTimeout(t);
  }, [loading, mount]);

  return (
    <div>
      <p>
        <button type="button" onClick={() => (setMount((m) => m + 1), setLoading(true))}>
          Reload (initial load)
        </button>{' '}
        <button type="button" disabled={loading} onClick={() => setLoading(true)}>
          Refresh in background
        </button>
      </p>
      <Calendar key={mount} mode="single" numberOfMonths={2} loading={loading} />
    </div>
  );
}
