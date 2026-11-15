import { useEffect, useState } from 'react';
import { Calendar } from 'calendar-kit';

// İlk yükleme: takvim ilk açıldığında `loading` açıksa tarihlerin yerinde boş
// yer tutucular görünür (ekran okuyucular bir durum mesajı alır) ve varsayılan
// unknownDataPolicy 'block' ile hiçbir gün seçilemez.
// Arka planda yenileme: tarihler bir kez gösterildikten sonra `loading` yeniden
// açılırsa görünüm, seçim ve klavye odağı korunur; günler seçilebilir kalır,
// yalnızca aria-busy ayarlanır. "Yeniden yükle" takvimi yeni bir key ile yeniden
// mount eder; böylece ilk yükleme tekrar görünür.
export default function InitialLoad() {
  const [mount, setMount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 3000); // sizin isteğiniz
    return () => clearTimeout(t);
  }, [loading, mount]);

  return (
    <div>
      <p>
        <button type="button" onClick={() => (setMount((m) => m + 1), setLoading(true))}>
          Yeniden yükle (ilk yükleme)
        </button>{' '}
        <button type="button" disabled={loading} onClick={() => setLoading(true)}>
          Arka planda yenile
        </button>
      </p>
      <Calendar key={mount} mode="single" numberOfMonths={2} loading={loading} />
    </div>
  );
}
