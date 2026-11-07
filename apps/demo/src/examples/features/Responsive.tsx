import { Calendar } from 'calendar-kit';
import './Responsive.css';

// Layout follows the calendar's container, not the window. Drag the box's
// corner: with `overflow="reduce-months"` fewer months are shown when two
// do not fit; `wrap` (default) moves them to a new row, `scroll` scrolls inside.
export default function Responsive() {
  return (
    <div className="resizable">
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" />
    </div>
  );
}
