import { useEffect, useState } from 'react';
import { Calendar } from 'calendar-kit';

// Henüz hiç veri gösterilmeden `loading` = ilk yükleme: günler iskelet olarak
// çizilir (görünür metin yok; ekran okuyucular bir durum mesajı alır) ve
// seçilemez. Daha sonra yeniden açılırsa = arka planda yenileme: görünüm,
// seçim ve klavye odağı korunur, yalnızca aria-busy ayarlanır.
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
