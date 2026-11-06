# calendar-kit is not published to npm yet ("private": true in its package.json).
# Build a tarball from this repository and install that file in your app.
git clone https://github.com/ErenYasa/calendar-kit.git
cd calendar-kit
npm ci
npm run build -w calendar-kit
npm pack -w calendar-kit   # → calendar-kit-0.1.0.tgz

# In your app (React 18.2+ or 19 are peer dependencies):
npm install ../calendar-kit/calendar-kit-0.1.0.tgz
