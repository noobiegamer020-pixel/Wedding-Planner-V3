# Wedding Planner: APK builder (GitHub)

This repo builds the whole Android app for you on GitHub. You never need Android Studio.

## First: new app or update over the old one?

**Treat it as a NEW app the first time.** Android only lets an APK update an installed app when both of these match:
1. the same app id (here: `com.mizou.weddingplanner`, set in `capacitor.config.json`)
2. the same signing key (here: the key in `signing/`)

I could not see your old project, so I could not copy its app id or key. So do this once:
1. In your OLD app: Settings (gear) > **Backup**. Keep the file (it is also saved in Documents/Mizou-Chouchou).
2. Uninstall the old app.
3. Install the new APK from this repo.
4. Open it: Settings > **Restore** and pick your backup. If you use online sync, pairing again also brings the shared data back.

From then on, every APK built by this repo installs OVER the previous one and keeps your data. No more uninstalling.

**To update in place over your old app instead:** put your old app id in `capacitor.config.json` AND add your old keystore as the secrets below. If the old app was built from Android Studio, its key is usually the debug key on that PC: `~/.android/debug.keystore`, alias `androiddebugkey`, password `android`.

## How to build

1. Create a **private** GitHub repository (private matters, see "Signing key" below).
2. Upload everything from this zip. The hidden folder `.github/workflows/build-apk.yml` must be there. If your browser skips it: on GitHub click Add file > Create new file, type `.github/workflows/build-apk.yml` as the name and paste the contents.
3. Go to the **Actions** tab > **Build APK** > **Run workflow**. (It also runs on every push.)
4. Wait about 5 to 10 minutes. Open the finished run, scroll to **Artifacts**, download **WeddingPlanner-APK**, unzip it, and install `WeddingPlanner.apk` on the phone (allow "install unknown apps").

## Updating the app later
Replace `www/index.html` in the repo and commit. GitHub builds a new APK, with a higher version number each time.
Your Firebase settings are inside `index.html` as before. `www/firebase-config.js` is optional.

## Signing key
`signing/wedding-planner.keystore` is a key made for this project (alias `weddingplanner`, password `20ad3hHS5HbtdsjTegpn`). It keeps every build compatible with the last one.
Because the password is in the repo, **keep the repo private**. For your own key, add these repository secrets (Settings > Secrets and variables > Actions): `KEYSTORE_BASE64` (the keystore file as base64), `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.
**Back up this keystore.** If you lose it you can no longer update installed apps.

## Optional
- App icon: already included (cake with the couple and a heart). Ready-made sizes are in `icons/res`, the 1024 px originals in `assets/`. To change it, replace those files.
- Font: put `nunito.woff2` in `www/fonts/` (the app also loads the font online).
- App name and id: `capacitor.config.json`.

## What this build includes
Your new app icon (adaptive + round + old-style) and a matching splash screen, installed automatically by `scripts/patch-android.mjs`.
Capacitor 6 with the plugins your app uses: App, Filesystem, Haptics, Local Notifications (loan reminders), Preferences, Share, Splash Screen, Status Bar. The build script adds the notification and storage permissions.

## Not tested
This was written without internet access, so the build itself has not been run. If the first Actions run fails, open the failed step, copy the red error, and send it to me.
