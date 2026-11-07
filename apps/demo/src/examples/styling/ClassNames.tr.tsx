import { Calendar } from 'calendar-kit';
import './ClassNames.css';

// `classNames` takvimin parçalarına kendi sınıflarınızı ekler; gün parçaları
// günün durumunu alan bir fonksiyon da kabul eder.
export default function ClassNames() {
  return (
    <Calendar
      mode="single"
      classNames={{
        monthTitle: 'brand-title',
        weekday: 'brand-weekday',
        dayButton: (day) => (day.weekEnd || day.weekStart ? 'brand-weekend' : undefined),
      }}
    />
  );
}
