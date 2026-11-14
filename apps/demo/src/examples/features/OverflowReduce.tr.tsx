import { useState } from 'react';
import { Calendar } from 'calendar-kit';

// overflow="reduce-months": aylar sığmadığı sürece daha az ay gösterilir; yer
// açılınca istenen sayıya geri dönülür. onLayoutChange gerçekte gösterilen ay
// sayısını bildirir (burada metin olarak). Kutu tam genişlikte başlar (iki ay
// sığar) ve yeniden boyutlandırılabilir: sağ alt köşesini sürükleyip yaklaşık
// 650px’in (2 × (7 × 40px + 16px) ve aralıklar) altına indirince tek ay
// gösterilir; gösterilen ay referans ay olarak kalır.
export default function OverflowReduce() {
  const [shown, setShown] = useState<number | null>(null);
  return (
    <div style={{ width: '100%', minWidth: 240, maxWidth: '100%', resize: 'horizontal', overflow: 'auto', boxSizing: 'border-box', border: '1px dashed #c4c8cf', padding: 8 }}>
      <Calendar mode="range" numberOfMonths={2} overflow="reduce-months" onLayoutChange={(e) => setShown(e.current.effectiveMonths)} />
      <p>2 ay istendi, {shown ?? '…'} ay gösteriliyor. Kutuyu daraltmak için sağ alt köşesini sürükleyin.</p>
    </div>
  );
}
