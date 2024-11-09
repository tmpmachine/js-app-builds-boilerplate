js-app-builds-boilerplate
=========================

For source project setup, see [js-build-project-source-boilerplate](https://github.com/tmpmachine/js-build-project-source-boilerplate).

Project Setup
-------------

The project that you want to build must follow this structure:

```
src/
  ...
build-version.json
```

Create a `build-version.json` in the app folder. This will determine the build folder name, e.g. `/builds/v1/`, `builds/v2`, etc.

`build-version.json`

```
{
    "version": 1
}
```

Building
--------

1.  Clone the project repo to root.
    
2.  update project folder name in `build.mjs`.
    

```
let appBuildPath = 'draftpost';
```

Then, to build and deploy the project:

```
pnpm i
npm run build
firebase deploy
```

### Dealing with Minifed Files

Some files are already minifed. To speed up the build process, you may skip these files and copy them manually later on.

`build.mjs`

```
const jsfiles = await glob(appSrcPath+'/**/*.js', { ignore: '**/sw.js' })
const cssfiles = await glob(appSrcPath+'/**/*.css')
const htmlfiles = await glob(appSrcPath+'/**/*.html', { ignore: '.divless' })
const jsonfiles = await glob(appSrcPath+'/**/*.json',  { ignore: ['**/build-version.json', '**/jsconfig.json'] })
```

### Pull the Project Repository

To pull and display the remote branches of the project repository, run:

```
npm run pull
```

Firebase Setup
--------------

```
npx firebase login
npx firebase init
npx firebase target:apply hosting hostingTarget siteName
```

`hostingTarget` see `firebase.json`.

Setup hosting config in `firebase.json`.

Running The App
===============

```
node server
```

Manage Caches
=============

*   open `public/main-component.js`.
    
*   make sure `local.appCacheNamePrefix` value is the same as in `pwa-cacher.js` `cacheName` settings (without the build version postfix).
    

Shared Assets
=============

*   Create `public/assets/`.
    
*   Point all shared assets to this directory.
