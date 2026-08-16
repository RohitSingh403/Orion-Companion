import { app as c, BrowserWindow as u, ipcMain as r, Notification as l, autoUpdater as o } from "electron";
import { fileURLToPath as f } from "node:url";
import n from "node:path";
const p = n.dirname(f(import.meta.url));
process.env.APP_ROOT = n.join(p, "..");
const d = process.env.VITE_DEV_SERVER_URL, R = n.join(process.env.APP_ROOT, "dist-electron"), h = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = d ? n.join(process.env.APP_ROOT, "public") : h;
let t;
function w() {
  t = new u({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Focus Companion",
    autoHideMenuBar: !0,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: n.join(p, "preload.mjs")
    }
  }), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), d ? t.loadURL(d) : t.loadFile(n.join(h, "index.html"));
}
c.on("window-all-closed", () => {
  process.platform !== "darwin" && (c.quit(), t = null);
});
c.on("activate", () => {
  u.getAllWindows().length === 0 && w();
});
c.whenReady().then(() => {
  w(), r.on("show-break-notification", () => {
    new l({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), r.on("show-focus-notification", () => {
    new l({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), r.on("show-reminder-notification", (a, i, e) => {
    new l({
      title: `🔔 ${i}`,
      body: e
    }).show();
  }), r.handle("get-auto-launch-status", async () => {
    try {
      const a = (await import("./index-BYV84ozA.js").then((s) => s.i)).default;
      return await new a({
        name: "Focus Companion",
        path: process.execPath
      }).isEnabled();
    } catch (a) {
      return console.error("Failed to get auto-launch status:", a), !1;
    }
  }), r.handle("toggle-auto-launch", async (a, i) => {
    try {
      const e = (await import("./index-BYV84ozA.js").then((m) => m.i)).default, s = new e({
        name: "Focus Companion",
        path: process.execPath
      });
      return i ? (await s.enable(), !0) : (await s.disable(), !1);
    } catch (e) {
      return console.error("Failed to toggle auto-launch:", e), !1;
    }
  }), d || (o.setFeedURL({
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
    console.log("Update downloaded:", e), new l({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    o.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), o.checkForUpdates());
});
export {
  R as MAIN_DIST,
  h as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
