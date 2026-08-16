import { app, BrowserWindow, Notification, ipcMain, autoUpdater } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

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
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
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

  // Focus -> Break
  ipcMain.on("show-break-notification", () => {
    new Notification({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water.",
    }).show();
  });

  // Break -> Focus
  ipcMain.on("show-focus-notification", () => {
    new Notification({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?",
    }).show();
  });

  // Reminder notification
  ipcMain.on("show-reminder-notification", (_event, title: string, body: string) => {
    new Notification({
      title: `🔔 ${title}`,
      body,
    }).show();
  });

  // Auto-launch handlers
  ipcMain.handle("get-auto-launch-status", async () => {
    try {
      const AutoLaunch = (await import("electron-auto-launch")).default;
      const autoLaunch = new AutoLaunch({
        name: "Focus Companion",
        path: process.execPath,
      });
      const isEnabled = await autoLaunch.isEnabled();
      return isEnabled;
    } catch (error) {
      console.error("Failed to get auto-launch status:", error);
      return false;
    }
  });

  ipcMain.handle("toggle-auto-launch", async (_event, enable: boolean) => {
    try {
      const AutoLaunch = (await import("electron-auto-launch")).default;
      const autoLaunch = new AutoLaunch({
        name: "Focus Companion",
        path: process.execPath,
      });
      
      if (enable) {
        await autoLaunch.enable();
        return true;
      } else {
        await autoLaunch.disable();
        return false;
      }
    } catch (error) {
      console.error("Failed to toggle auto-launch:", error);
      return false;
    }
  });

  // Auto-updater configuration
  if (!VITE_DEV_SERVER_URL) {
    const server = "https://github.com/RohitSingh403/Orion-Companion/releases";
    const feed = `${server}/latest`;

    autoUpdater.setFeedURL({
      url: feed,
      headers: { "Accept": "application/json" },
    });

    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
    });

    autoUpdater.on("update-available", (info: any) => {
      console.log("Update available:", info);
    });

    autoUpdater.on("update-not-available", (info: any) => {
      console.log("Update not available:", info);
    });

    autoUpdater.on("error", (err: Error) => {
      console.error("Auto-updater error:", err);
    });

    autoUpdater.on("update-downloaded", (info: any) => {
      console.log("Update downloaded:", info);
      // Notify user that update is ready
      new Notification({
        title: "Update Available",
        body: "A new version is ready to install. Restart to apply.",
      }).show();
    });

    // Check for updates every 4 hours
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 4 * 60 * 60 * 1000);

    // Initial check
    autoUpdater.checkForUpdates();
  }
});