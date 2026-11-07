import { Calendar } from 'calendar-kit';

// overflow="scroll": aylar tek satırda kalır ve ay alanı takvimin içinde
// yatay olarak kayar (sayfa asla taşmaz).
// Kutu 520px genişliğinde: iki ay yaklaşık 2 × (7 × 40px + 16px) + 32px gerektirir.
export default function OverflowScroll() {
  return (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <Calendar mode="range" numberOfMonths={2} overflow="scroll" />
    </div>
  );
}
