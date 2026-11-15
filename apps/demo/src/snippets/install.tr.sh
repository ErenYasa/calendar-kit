# calendar-kit henüz npm'de yayımlanmadı (package.json dosyasında "private": true).
# Bu depodan bir tarball derleyin ve o dosyayı uygulamanıza kurun.
git clone https://github.com/ErenYasa/calendar-kit.git
cd calendar-kit
npm ci
npm run build -w calendar-kit
npm pack -w calendar-kit   # → calendar-kit-0.1.0.tgz

# Uygulamanızda (React 18.2+ veya 19 peer dependency'dir):
npm install ../calendar-kit/calendar-kit-0.1.0.tgz
