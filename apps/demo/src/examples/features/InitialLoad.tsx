import { useEffect, useState } from 'react';
import { Calendar } from 'calendar-kit';

// `loading` before any data was shown = initial load: days are a skeleton
// (no visible text; screen readers get a status message) and cannot be
// selected. Turned on again later = background refresh: the view, the
// selection and keyboard focus are kept, only aria-busy is set.
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
