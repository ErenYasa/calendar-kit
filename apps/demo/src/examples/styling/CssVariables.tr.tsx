import { Calendar } from 'calendar-kit';
import 'calendar-kit/styles.css';
import './CssVariables.tr.css';

// Yalnızca CSS değişkenleriyle koyu tema: takvimin HTML yapısına yönelik seçici yok.
export default function CssVariables() {
  return <Calendar mode="range" numberOfMonths={2} className="night" />;
}
