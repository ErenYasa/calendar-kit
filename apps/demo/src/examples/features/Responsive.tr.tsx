import { Calendar } from 'calendar-kit';
import './Responsive.css';

// Yerleşim pencereyi değil, takvimin kabını izler. Kutunun köşesini sürükleyin:
// `overflow="reduce-months"` ile iki ay sığmadığında daha az ay gösterilir;
// `wrap` (varsayılan) ayları yeni bir satıra geçirir, `scroll` içeride kaydırır.
export default function Responsive() {
  return (
    <div className="resizable">
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" />
    </div>
  );
}
