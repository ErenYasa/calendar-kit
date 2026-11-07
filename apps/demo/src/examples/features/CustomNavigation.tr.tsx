import { Calendar } from 'calendar-kit';
import './Slots.css';

// `renderNavigation` okların yerini alır (tüm aylar için tek bir çubuk);
// `renderMonthHeader` her ayın başlık satırının yerini alır.
export default function CustomNavigation() {
  return (
    <Calendar
      mode="single"
      numberOfMonths={2}
      renderNavigation={(nav) => (
        <div className="slot-row">
          <button type="button" onClick={nav.previous} disabled={!nav.canPrevious}>
            ← {nav.labels.previous}
          </button>
          <button type="button" onClick={nav.next} disabled={!nav.canNext}>
            {nav.labels.next} →
          </button>
        </div>
      )}
      renderMonthHeader={({ title }) => <h4 style={{ margin: '4px 0', textAlign: 'center' }}>{title}</h4>}
    />
  );
}
