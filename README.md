# js-app-builds-boilerplate

`src/app/src/build-version.json`

```
cd src/app
git pull

cd /
npm run build

firebase deploy
```

- manage build files to copy `build.mjs`

## Firebase Setup
```
npx firebase login
npx firebase init
npx firebase target:apply hosting hostingTarget siteName
```
`hostingTarget` see `firebase.json`.

Setup hosting config in `firebase.json`.

### Deploying
```
npm run deploy
```

## App
Create a `build-version.json` in the app folder. This will determine the build folder name, e.g. `/builds/v1/`, `builds/v2`, etc.
```json
{
    "version": 1
}
```

# Running The App
`node server`

# Manage Caches
- open `public/main-component.js`.
- make sure `local.appCacheNamePrefix` value is the same as in `pwa-cacher.js` `cacheName` settings (without the build version postfix).

# Sharing Assets
- Create `public/assets/`.
- Point all shared assets to this directory.
