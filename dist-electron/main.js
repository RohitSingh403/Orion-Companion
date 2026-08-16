import { app as a, BrowserWindow as d, ipcMain as r, Notification as i, autoUpdater as o } from "electron";
import { fileURLToPath as m } from "node:url";
import t from "node:path";
const c = t.dirname(m(import.meta.url));
process.env.APP_ROOT = t.join(c, "..");
const s = process.env.VITE_DEV_SERVER_URL, R = t.join(process.env.APP_ROOT, "dist-electron"), p = t.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? t.join(process.env.APP_ROOT, "public") : p;
let n;
function h() {
  n = new d({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Focus Companion",
    autoHideMenuBar: !0,
    icon: t.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: t.join(c, "preload.mjs")
    }
  }), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), s ? n.loadURL(s) : n.loadFile(t.join(p, "index.html"));
}
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), n = null);
});
a.on("activate", () => {
  d.getAllWindows().length === 0 && h();
});
a.whenReady().then(() => {
  h(), r.on("show-break-notification", () => {
    new i({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), r.on("show-focus-notification", () => {
    new i({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), r.on("show-reminder-notification", (w, l, e) => {
    new i({
      title: `🔔 ${l}`,
      body: e
    }).show();
  }), s || (o.setFeedURL({
    url: "https://github.com/RohitSingh403/Orion-Companion/releases/latest",
    headers: { Accept: "application/json" }
  }), o.on("checking-for-update", () => {
    console.log("Checking for update...");
  }), o.on("update-available", (e) => {
    console.log("Update available:", e);
  }), o.on("update-not-available", (e) => {
    console.log("Update not available:", e);
  }), o.on("error", (e) => {
    console.error("Auto-updater error:", e);
  }), o.on("update-downloaded", (e) => {
    console.log("Update downloaded:", e), new i({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    o.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), o.checkForUpdates());
});
export {
  R as MAIN_DIST,
  p as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
