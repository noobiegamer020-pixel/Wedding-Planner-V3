// Runs in CI after `npx cap add android`. Adds permissions the app needs
// and sets the version from the GitHub run number.
import fs from "node:fs";

const run = process.env.RUN_NUMBER || "1";
const manifestPath = "android/app/src/main/AndroidManifest.xml";
let m = fs.readFileSync(manifestPath, "utf8");

const perms = [
  '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
  '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />',
  '<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />',
  '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />',
  '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
];
for (const p of perms) {
  const name = p.match(/android:name="([^"]+)"/)[1];
  if (!m.includes(name)) m = m.replace("</manifest>", `    ${p}\n</manifest>`);
}
if (!m.includes("requestLegacyExternalStorage"))
  m = m.replace("<application", '<application android:requestLegacyExternalStorage="true"');
fs.writeFileSync(manifestPath, m);

const gp = "android/app/build.gradle";
let g = fs.readFileSync(gp, "utf8");
g = g.replace(/versionCode\s+\d+/, `versionCode ${run}`)
     .replace(/versionName\s+"[^"]*"/, `versionName "1.0.${run}"`);
fs.writeFileSync(gp, g);
// ---- app icon (adaptive + legacy) and splash screen ----
const res = "android/app/src/main/res";
if (fs.existsSync("icons/res")) {
  fs.cpSync("icons/res", res, { recursive: true, force: true });
  console.log("Installed launcher icons");
}
if (fs.existsSync("icons/splash")) {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);
  for (const f of walk(res).filter((f) => f.endsWith("/splash.png"))) {
    const land = f.includes("land");
    fs.copyFileSync(land ? "icons/splash/splash-land.png" : "icons/splash/splash-port.png", f);
  }
  console.log("Installed splash screen");
}
console.log("Patched manifest + version (build " + run + ")");
