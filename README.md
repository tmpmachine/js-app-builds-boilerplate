# guitartab-builds

`src/app/src/build-version.json`

```
cd src/app
git pull

cd /
npm run build

firebase deploy
```

- manage build files to copy `build.mjs`

## App
Create a `build-version.json` in the app folder. This will determine the build folder name, e.g. `/builds/v1/`, `builds/v2`, etc.
```json
{
    "version": 1
}
```
