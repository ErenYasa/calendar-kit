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
      <Section title="Özellikler kısaca">
        <ul>
          <li>
            Dört seçim modu: tek tarih (<code>single</code>), başlangıç ve bitiş tarihi (<code>range</code>), birbirinden bağımsız istediğiniz sayıda tarih (
            <code>multiple</code>) ya da hiç seçim olmadan yalnızca müsaitliği gösterme (<code>readonly</code>).
          </li>
          <li>
            Hangi günlerin seçilebileceğine ve hangi seçimlerin geçerli olduğuna kurallar karar verir: en erken ve en geç tarih, geçmiş veya gelecek günlerin
            kapatılması, en az, en fazla veya sabit uzunluk, izin verilen başlangıç ve bitiş hafta günleri, verinizden gelen gün bazında müsaitlik ve kendi
            kontrolleriniz.
          </li>
          <li>
            Yerleşim pencerenin değil, kapsayıcının genişliğine uyar: birden çok ay yan yana veya alt alta; oklarla sayfa sayfa ya da “daha fazla tarih
            göster” düğmesiyle yeni aylar yükleyen sürekli bir liste olarak.
          </li>
          <li>
            Günler verilerinizi gösterebilir: fiyat gibi etiketler, badge’ler, simgeler, işaretler ve tooltip’ler (bir günün üzerine gelindiğinde veya gün
            odaklandığında açılan küçük kutu). Her parçayı slotlar ve render prop’larla (o parçanın JSX’ini döndüren, sizin verdiğiniz fonksiyonlar; örneğin{' '}
            <code>renderFooter</code>) değiştirebilir ya da CSS ile yeniden biçimlendirebilirsiniz.
          </li>
          <li>
            Klavyeyle ve ekran okuyucularla kullanılabilir, tarihleri ve metinleri tarayıcının <code>Intl</code> API’siyle her yerel ayara göre biçimlendirir
            ve sunucuda render edilebilir (SSR).
          </li>
        </ul>
      </Section>
      <Section title="Takvim ne yapar, uygulamanız ne yapar?">
        <ul>
          <li>
            <strong>Takvim</strong> ayları gösterir, kullanıcının tarih seçmesini sağlar ve uygulamanızın verdiği kuralları uygular. Örneğin verinizde{' '}
            <code>stayRules</code> için <code>&apos;check-out-only&apos;</code> durumuyla işaretlenen bir gün çıkış tarihi olarak seçilebilir, giriş tarihi
            olarak seçilemez. Takvim hiçbir zaman veri çekmez ve rezervasyon saklamaz.
          </li>
          <li>
            <strong>Uygulamanız</strong> müsaitlik verisini kendi API’sinden alır ve takvime fonksiyonlar aracılığıyla verir: her günün durumunu{' '}
            <code>stayRules</code> veya <code>dayRangeRules</code> içindeki <code>getDayStatus</code> ile ya da kendi kurallarınızdaki{' '}
            <code>getDayAvailability</code> ile (<a href="#/api-rules">Kurallar ve adaptörler</a>). <code>onRenderedMonthsChange</code> uygulamanıza
            ekranda hangi ayların olduğunu bildirir, böylece neyi yükleyeceğini bilir; <code>getDataStatus</code> ise takvime hangi ayların henüz hazır
            olmadığını söyler (<code>&apos;loading&apos;</code>, <code>&apos;unknown&apos;</code> veya <code>&apos;error&apos;</code>). Bu ayların günleri
            veri gelene kadar seçilemez (<a href="#/loading">Yükleme ve hatalar</a>). Fiyatlar, giriş ve çıkış saatleri, misafir sayısı ve rezervasyonu
            oluşturmak da uygulamanızın işidir. Uygulamanın hesapladığı bir şeyi, örneğin toplam fiyatı, takvimin altında göstermek için{' '}
            <code>renderFooter</code> kullanın.
          </li>
        </ul>
        <p>
          <strong>Örnek:</strong> Bir ev rezervasyonunda kullanıcı tarihleri takvimden seçer. Uygulama seçilen aralık için toplam fiyatı hesaplar,{' '}
          <code>renderFooter</code> ile gösterir ve kullanıcı onayladığında rezervasyonu oluşturur (<a href="#/recipe-home-rental">Ev kiralama örneği</a>).
        </p>
      </Section>
      <Section title="Tarihler">
        <p>
          Tarihler <code>YYYY-MM-DD</code> biçiminde düz dizelerdir (tipi <code>CalendarDate</code>), aylar ise <code>YYYY-MM</code> biçimindedir (
          <code>CalendarMonth</code>). Seçimde <code>Date</code> nesnesi ve saat dilimi yoktur; bu yüzden <code>&quot;2026-11-13&quot;</code>, kullanıcının
          saat dilimi ne olursa olsun sunucuda da her tarayıcıda da 13 Kasım’dır. Tarih oluşturmak ve denetlemek için{' '}
          <a href="#/core-concepts">Temel kavramlar</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="Desteklenen ortamlar">
        <ul>
          <li>React 18.2+ ve 19 (peer dependency); yalnızca ESM; çalışma zamanı bağımlılığı yok.</li>
          <li>
            <code>calendar-kit/client</code> ve <code>calendar-kit/core</code> giriş noktaları üzerinden Next.js App Router (bkz. <a href="#/react-nextjs">React ve Next.js</a>).
          </li>
          <li>
            Tarayıcılar: otomatik testler yalnızca Google Chrome’da çalışır. Safari, Firefox ve gerçek mobil cihazlar henüz test edilmedi; ekran okuyuculardan yalnızca macOS’ta VoiceOver test edildi —
            bkz. <a href="#/testing">Test ve uyumluluk</a>.
          </li>
        </ul>
      </Section>
    </Page>
  );
}

export function Installation() {
  return (
    <Page title="Kurulum ve hızlı başlangıç" lead="Paketi kurun, stil dosyasını bir kez içe aktarın ve bir takvim render edin.">
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
          Paketin JavaScript kodu hiçbir CSS dosyasını içe aktarmaz; varsayılan temayı içe aktarana kadar takvimin stili olmaz. Temayı bir kez, örneğin
          uygulamanızın giriş dosyasında veya kök layout’ta içe aktarın: <code>import &apos;calendar-kit/styles.css&apos;</code>. Dosya bir tip bildirimiyle
          gelir; bu yüzden TypeScript projelerinde ayrıca bir <code>*.css</code> bildirimi yazmanız gerekmez. Renkleri ve boyutları değiştirmek için{' '}
          <a href="#/styling">Stil ve özelleştirme</a> sayfasına bakın.
        </p>
      </Section>
      <Section title="İlk takvim">
        <p>
          Konaklama seçmek için iki aylık bir takvim. Takvim <strong>controlled</strong> kullanılır: seçili aralığı bileşeniniz kendi state’inde tutar ve{' '}
          <code>value</code> olarak verir; takvim her yeni seçimi <code>onChange</code> ile bildirir, bu da state’i günceller. Aralık sizin state’inizde
          olduğu için takvimin altındaki metin, <code>countNights</code> ile hesaplanan gece sayısını gösterebilir. <code>stayRules()</code> bitiş
          tarihini çıkış günü yapar, bu yüzden o gün gece olarak sayılmaz: bir başlangıç, ardından bir bitiş tarihi seçin ve metne bakın.
        </p>
        <Example src="start/QuickStart" title="Hızlı başlangıç" />
      </Section>
    </Page>
  );
}

export function ReactNext() {
  return (
    <Page title="React ve Next.js" lead="Tek bileşen, üç içe aktarma yolu: kodunuzun çalıştığı yere uygun olanı seçin.">
      <Section title="Hangi içe aktarma yolu kullanılır?">
        <p>
          Düz bir React uygulamasında her dosya tarayıcıda çalışır; <code>calendar-kit</code> yeterlidir. Next.js App Router’da iki tür bileşen vardır:{' '}
          <strong>Server Component</strong> yalnızca sunucuda çalışır, state ve olay işleyicisi tutamaz; <strong>Client Component</strong> (
          <code>&apos;use client&apos;</code> ile başlayan bir dosya) tarayıcıda da çalışır. Diğer yollar bu ayrım için vardır.
        </p>
        <PropsTable
          caption="İçe aktarma yolları"
          rows={[
            {
              name: 'calendar-kit',
              type: <>her şey</>,
              description: <>Takvim, yardımcılar ve tipler; <code>&apos;use client&apos;</code> yönergesi olmadan. Düz React uygulamalarında ve kendi Client Component’lerinizin içinde kullanın.</>,
            },
            {
              name: 'calendar-kit/client',
              type: "'use client'",
              description: <><code>Calendar</code> bileşeni ve React tipleri; Client Component olarak işaretlidir. Bir Server Component bu takvimi, prop olarak fonksiyon vermediği sürece doğrudan render edebilir.</>,
            },
            {
              name: 'calendar-kit/core',
              type: <>React yok</>,
              description: 'React olmadan tarih yardımcıları, seçim motoru, kurallar, adaptörler ve mesajlar. Server Component’lerde, API route’larında ve React dışındaki kodda çağırabilirsiniz.',
            },
            { name: 'calendar-kit/styles.css', type: 'CSS', description: 'Varsayılan tema (tip bildirimiyle birlikte).' },
          ]}
        />
      </Section>
      <Section title="Düz React (Vite, CRA, …)">
        <p>
          <a href="#/installation">Hızlı başlangıçta</a> olduğu gibi her şeyi <code>calendar-kit</code>’ten içe aktarın. Takvim yalnızca tarayıcıda render
          ediliyorsa başka bir şey gerekmez.
        </p>
      </Section>
      <Section title="Next.js App Router ile">
        <p>
          Stil dosyasını <code>app/layout.tsx</code> içinde içe aktarın. Bir Server Component’te <code>Calendar</code>’ı <code>calendar-kit/client</code>’tan
          render edin, yardımcıları <code>calendar-kit/core</code>’dan çağırın. Bir Server Component prop olarak fonksiyon veremez; bu yüzden kurallara,{' '}
          <code>onChange</code>’e veya render prop’lara ihtiyaç duyan takvim, sayfanın render ettiği kendi <code>&apos;use client&apos;</code> bileşeninize
          girer (aşağıdaki <code>BookingCalendar</code>).
        </p>
        <Snippet files={[...nextPage, ...nextLayout]} label="Next.js App Router örneği" />
        <Note>
          <p>
            Bir Server Component, <code>/client</code> yerine <code>calendar-kit</code>’ten içe aktarılan <code>Calendar</code>’ı render ederse render başarısız
            olur: takvim React hook’ları kullanır ve Server Component’ler bunları çalıştıramaz. Hata metni Next.js ve React sürümüne göre değişir; bir örneği{' '}
            <code>useSyncExternalStore is not a function</code>. Kök giriş noktasında <code>&apos;use client&apos;</code> yönergesi
            bilerek yoktur: olsaydı <code>addDays</code> gibi yardımcılar istemci referanslarına dönüşür ve sunucuda çağrılamazdı.
          </p>
        </Note>
      </Section>
      <Section title="SSR ve hydration">
        <ul>
          <li>
            Paketi içe aktarmak hiçbir global nesneyi değiştirmez ve render sırasında <code>window</code> veya <code>document</code> okunmaz; bu yüzden
            sunucuda çalışır.
          </li>
          <li>
            Sunucu kullanıcının tarihini bilmez. <code>today</code> (ya da bir <code>value</code> veya <code>defaultVisibleMonth</code>) verin; böylece
            sunucu HTML’i doğru ayları gösterir ve React onu tarayıcıda devralır (hydration). Hiçbiri verilmezse sunucu boş bir yer tutucu render eder; aylar
            sayfa tarayıcıda çalışınca görünür. <code>today</code> verilmezse bugün işareti ve bugüne bağlı kurallar (<code>disablePast</code> gibi) yalnızca
            tarayıcıda uygulanır. Paket testleri bu durumları React 19 (jsdom) ile uyuşmazlık olmadan hydrate eder; gerçek bir Next.js uygulamasında
            denenmedi.
          </li>
          <li>Yerel ayar varsayılanları (haftanın ilk günü, metin yönü) tarayıcıdan değil paketteki tablolardan gelir; bu yüzden sunucu ve tarayıcı aynı sonucu verir.</li>
          <li>
            Yerleşim kapsayıcının genişliğine bağlıdır ve bu genişliği yalnızca tarayıcı bilir. Bu yüzden takvim hydration’dan sonra daha az veya daha çok
            sütunla ay gösterebilir.
          </li>
        </ul>
        <Snippet files={ssr} label="Sunucuda render etme" />
      </Section>
    </Page>
  );
}
