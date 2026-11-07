import install from '../../../snippets/install.tr.sh?code';
import nextLayout from '../../../snippets/next/layout.tr.tsx?code';
import nextPage from '../../../snippets/next/page.tr.tsx?code';
import ssr from '../../../snippets/ssr.tr.tsx?code';
import { Example, Snippet } from '../../Code';
import { Note, Page, PropsTable, Section } from '../../ui';

export function Introduction() {
  return (
    <Page
      title="Giriş"
      lead="calendar-kit, React + TypeScript ile yazılmış bir tarih seçim bileşenidir: tek tarih, aralık, çoklu tarih ve salt okunur müsaitlik; altında headless bir kural motoru çalışır."
    >
      <Section title="Ne yapar">
        <ul>
          <li>Tarih seçer: <code>single</code>, <code>range</code>, <code>multiple</code> ve <code>readonly</code> modları.</li>
          <li>Seçimleri birleştirilebilir kurallarla doğrular: sınırlar, geçmiş/gelecek, minimum/maksimum/sabit uzunluk, başlangıç ve bitiş hafta günleri, gün bazında müsaitlik ve kendi doğrulayıcılarınız.</li>
          <li>Yerleşimini pencereye değil kapsayıcısına göre kurar: birden çok ay, yatay veya dikey, sayfalı ya da “daha fazla tarih göster” ile sürekli.</li>
          <li>Verilerinizi günlerin üzerinde gösterir (etiketler, rozetler, simgeler, işaretler, araç ipuçları) ve her parçayı slotlar, render prop’lar veya CSS ile değiştirmenize izin verir.</li>
          <li>Klavye ve ekran okuyucuyla erişilebilirdir, <code>Intl</code> ile yerelleştirilir ve SSR ile çalışır.</li>
        </ul>
      </Section>
      <Section title="Uygulamanızda kalanlar">
        <p>
          Paket yalnızca seçime odaklanır. Fiyatlar, toplamlar, giriş/çıkış saatleri, misafir sayıları ve rezervasyon mantığı paketin parçası değildir: bu
          durum uygulamanıza aittir; onu uygulamanız hesaplar ve <code>renderFooter</code> gibi slotlar üzerinden gösterir. İş kuralları takvime yalnızca
          seçilebilirlik olarak ulaşır (örneğin “bu gün yalnızca çıkış günü olabilir”). Takvim hiçbir zaman veri çekmez: her ayın yükleme durumunu siz
          bildirirsiniz.
        </p>
      </Section>
      <Section title="Tarihler">
        <p>
          Tarihler <code>YYYY-MM-DD</code> biçiminde düz dizelerdir (tipi <code>CalendarDate</code>), aylar ise <code>YYYY-MM</code> biçimindedir (
          <code>CalendarMonth</code>). Seçimde <code>Date</code> nesnesi veya saat dilimi yoktur; bu yüzden bir değer sunucuda ve her tarayıcıda aynı takvim
          gününü ifade eder.
        </p>
      </Section>
      <Section title="Desteklenen ortamlar">
        <ul>
          <li>React 18.2+ ve 19 (peer dependency); yalnızca ESM; çalışma zamanı bağımlılığı yok.</li>
          <li>
            <code>calendar-kit/client</code> ve <code>calendar-kit/core</code> giriş noktaları üzerinden Next.js App Router (bkz. React ve Next.js).
          </li>
          <li>
            Tarayıcılar: otomatik olarak yalnızca Google Chrome’da doğrulanır. Safari, Firefox, gerçek mobil cihazlar ve ekran okuyucular henüz test edilmedi —
            bkz. <a href="#/testing">Test ve uyumluluk</a>.
          </li>
        </ul>
      </Section>
    </Page>
  );
}

export function Installation() {
  return (
    <Page title="Kurulum ve Hızlı Başlangıç" lead="Paketi kurun, stil dosyasını bir kez içe aktarın ve bir takvim render edin.">
      <Section title="Kurulum">
        <Note>
          <p>
            calendar-kit henüz <strong>npm’de yayımlanmadı</strong>: <code>package.json</code> dosyasında <code>&quot;private&quot;: true</code> var, bu
            yüzden <code>npm install calendar-kit</code> çalışmaz. Depodan derlenen bir tarball kurun:
          </p>
        </Note>
        <Snippet files={install} label="Tarball’dan kurulum" />
      </Section>
      <Section title="Stiller">
        <p>
          JavaScript hiçbir zaman CSS içe aktarmaz. Varsayılan temayı bir kez içe aktarın, örneğin uygulamanızın giriş dosyasında veya kök layout’ta:{' '}
          <code>import &apos;calendar-kit/styles.css&apos;</code>. Tip bildirimiyle birlikte gelir; bu yüzden TypeScript projelerinde ek bir{' '}
          <code>*.css</code> bildirimi gerekmez.
        </p>
      </Section>
      <Section title="İlk takvim">
        <p>Kontrollü bir aralık seçici: değeri uygulama tutar ve gece sayısını ondan hesaplar.</p>
        <Example src="start/QuickStart" title="Hızlı başlangıç" />
      </Section>
    </Page>
  );
}

export function ReactNext() {
  return (
    <Page title="React ve Next.js" lead="Tek bileşen, üç içe aktarma yolu: kodunuzun çalıştığı yere uyanı seçin.">
      <Section title="Giriş noktaları">
        <PropsTable
          caption="İçe aktarma yolları"
          rows={[
            {
              name: 'calendar-kit',
              type: <>her şey</>,
              description: <>Takvim, yardımcılar ve tipler. <code>&apos;use client&apos;</code> yönergesi yoktur. Düz React uygulamalarında ve kendi Client Component’lerinizin içinde kullanın.</>,
            },
            {
              name: 'calendar-kit/client',
              type: "'use client'",
              description: <><code>Calendar</code> bileşeni ve React tipleri, Client Component sınırı olarak işaretlenmiş hâlde: bir Server Component onu doğrudan render edebilir.</>,
            },
            {
              name: 'calendar-kit/core',
              type: <>React yok</>,
              description: 'Tarih modeli, seçim motoru, kurallar, adaptörler ve mesajlar. React’i hiç yüklemez; Server Component’lerde ve React dışı kodda güvenle kullanılır.',
            },
            { name: 'calendar-kit/styles.css', type: 'CSS', description: 'Varsayılan tema (tip bildirimiyle birlikte).' },
          ]}
        />
      </Section>
      <Section title="Düz React (Vite, CRA, …)">
        <p>
          <a href="#/installation">Hızlı başlangıçta</a> olduğu gibi <code>calendar-kit</code>’ten içe aktarın. İstemcide render etmek için başka bir şey
          gerekmez.
        </p>
      </Section>
      <Section title="Next.js App Router ile">
        <p>
          Stil dosyasını <code>app/layout.tsx</code> içinde içe aktarın. Bir Server Component’te <code>Calendar</code>’ı <code>calendar-kit/client</code>’tan
          render edin, yardımcıları <code>calendar-kit/core</code>’dan çağırın. Fonksiyon olan prop’lar (kurallar, <code>onChange</code>, render prop’lar) bir
          Server Component’ten aktarılamaz; o takvimi kendi <code>&apos;use client&apos;</code> bileşeninize koyun.
        </p>
        <Snippet files={[...nextPage, ...nextLayout]} label="Next.js App Router örneği" />
        <Note>
          <p>
            <code>calendar-kit</code>’ten (<code>/client</code>’tan değil) içe aktarılan <code>Calendar</code>’ı doğrudan bir Server Component’te render
            etmek derleme sırasında <code>useSyncExternalStore is not a function</code> hatasıyla başarısız olur. Kök giriş noktasında bilerek yönerge
            yoktur: olsaydı saf yardımcıları istemci referanslarına dönüşür ve sunucuda çağrılamazdı.
          </p>
        </Note>
      </Section>
      <Section title="SSR ve hydration">
        <ul>
          <li>Paketi içe aktarmak hiçbir global değeri değiştirmez; render sırasında <code>window</code> veya <code>document</code> okunmaz.</li>
          <li>
            Sunucuda render ederken <code>today</code> (ya da <code>value</code>/<code>defaultVisibleMonth</code>) verin: sunucu kullanıcının tarihini
            bilemez. Bu prop ile sunucu HTML’i ve hydration eşleşir. Verilmezse bir yer tutucu render edilir ve ayları istemci doldurur.
          </li>
          <li>Yerel ayar varsayılanları (hafta başlangıcı, yön) statik tablolardan gelir; bu yüzden sunucu ve tarayıcı aynı sonucu verir.</li>
          <li>Yerleşim, yalnızca tarayıcıda bilinen kapsayıcı genişliğine bağlıdır; ilk istemci render’ı sütun sayısını değiştirebilir.</li>
        </ul>
        <Snippet files={ssr} label="Sunucuda render etme" />
      </Section>
    </Page>
  );
}
