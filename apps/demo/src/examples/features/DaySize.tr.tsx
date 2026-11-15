import { Calendar } from 'calendar-kit';

// Daha büyük dokunma hedefleri (48 px). Bir ay kapsayıcısına artık sığmadığında
// aylar alanı takvimin içinde yatay olarak kayar (sayfa asla taşmaz);
// `maxBlockSize` dikey kaydırma ekler.
export default function DaySize() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Calendar mode="single" minDaySize={48} maxBlockSize={300} orientation="vertical" numberOfMonths={2} />
    </div>
  );
}
