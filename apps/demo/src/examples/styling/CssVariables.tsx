import { Calendar } from 'calendar-kit';
import 'calendar-kit/styles.css';
import './CssVariables.css';

// A dark theme with CSS variables only: no selectors into the calendar's markup.
export default function CssVariables() {
  return <Calendar mode="range" numberOfMonths={2} className="night" />;
}
