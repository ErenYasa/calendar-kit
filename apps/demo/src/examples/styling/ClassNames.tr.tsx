import { Calendar } from 'calendar-kit';
import './ClassNames.css';

// `classNames` sınıflarınızı varsayılan sınıfların yanına ekler. Gün parçaları
// günün durumunu alan bir fonksiyon da kabul eder: burada cumartesi ve pazar
// (weekday 6 ve 0) bir sınıf alır. (`day.weekStart`/`day.weekEnd` satırın
// ilk/son sütunu demektir; bu, yerel ayarın hafta başlangıcına bağlıdır.)
export default function ClassNames() {
  return (
    <Calendar
      mode="single"
      classNames={{
        monthTitle: 'brand-title',
        weekday: 'brand-weekday',
        dayButton: (day) => (day.weekday === 0 || day.weekday === 6 ? 'brand-weekend' : undefined),
      }}
    />
  );
}
