import { app, BrowserWindow, ipcMain, Notification, autoUpdater } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Focus Companion",
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  ipcMain.on("show-break-notification", () => {
    new Notification({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  });
  ipcMain.on("show-focus-notification", () => {
    new Notification({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  });
  ipcMain.on("show-reminder-notification", (_event, title, body) => {
    new Notification({
      title: `🔔 ${title}`,
      body
    }).show();
  });
  if (!VITE_DEV_SERVER_URL) {
    const server = "https://github.com/RohitSingh403/Orion-Companion/releases";
    const feed = `${server}/latest`;
    autoUpdater.setFeedURL({
      url: feed,
      headers: { "Accept": "application/json" }
    });
    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
    });
    autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info);
    });
    autoUpdater.on("update-not-available", (info) => {
      console.log("Update not available:", info);
    });
    autoUpdater.on("error", (err) => {
      console.error("Auto-updater error:", err);
    });
    autoUpdater.on("update-downloaded", (info) => {
      console.log("Update downloaded:", info);
      new Notification({
        title: "Update Available",
        body: "A new version is ready to install. Restart to apply."
      }).show();
    });
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 4 * 60 * 60 * 1e3);
    autoUpdater.checkForUpdates();
  }
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
