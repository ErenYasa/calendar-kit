# calendar-kit (temporary name)

Lightweight, accessible, responsive date selection for React (single, range, multiple, read-only).
No runtime dependencies; React/ReactDOM are peer dependencies.

```tsx
import { Calendar, stayRules } from 'calendar-kit';
import 'calendar-kit/styles.css';

<Calendar mode="range" numberOfMonths={2} value={dates} onChange={setDates} rules={stayRules({ minNights: 2, disablePast: true })} />;
```

Full documentation (API, range semantics, adapters, events, react-dates migration, measurements): see the repository README.
