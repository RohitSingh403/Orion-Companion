import { app, BrowserWindow, Menu, Notification, Tray, autoUpdater, globalShortcut, ipcMain, nativeImage } from "electron";
import { execFile } from "node:child_process";
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

let win: BrowserWindow | null = null;
let mini: BrowserWindow | null = null;
let tray: Tray | null = null;
let quitting = false;
let trayReady = false;
let trayLabel = "Ready";
let watchingActivity = false;
let activityTimer: ReturnType<typeof setInterval> | null = null;
let latestTimer: TimerSnapshot | null = null;

interface TimerSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

function trayIcon() {
  const size = 16;
  const buffer = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      if (Math.sqrt(dx * dx + dy * dy) >= 6.5) continue;
      const offset = (y * size + x) * 4;
      buffer[offset] = 245;
      buffer[offset + 1] = 215;
      buffer[offset + 2] = 122;
      buffer[offset + 3] = 255;
    }
  }
  return nativeImage.createFromBitmap(buffer, { width: size, height: size });
}

function loadSurface(target: BrowserWindow, route: string, search: Record<string, string> = {}) {
  if (VITE_DEV_SERVER_URL) {
    const base = VITE_DEV_SERVER_URL.endsWith("/") ? VITE_DEV_SERVER_URL : `${VITE_DEV_SERVER_URL}/`;
    const url = new URL(route.replace(/^\//, ""), base);
    Object.entries(search).forEach(([key, value]) => url.searchParams.set(key, value));
    void target.loadURL(url.toString());
    return;
  }
  void target.loadFile(path.join(RENDERER_DIST, "index.html"), { query: search });
}

function showMain() {
  if (!win || win.isDestroyed()) {
    createWindow();
    return;
  }
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function rebuildTray() {
  if (!tray) return;
  tray.setToolTip(`Orion Companion — ${trayLabel}`);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: trayLabel, enabled: false },
      { label: "Show Orion", click: () => showMain() },
      { label: "Start focus", click: () => win?.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => win?.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => createMiniWindow() },
      {
        label: "Quick add",
        click: () => {
          showMain();
          win?.webContents.send("tray-quick-add-task");
        },
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          quitting = true;
          app.quit();
        },
      },
    ])
  );
}

function createTray() {
  try {
    tray = new Tray(trayIcon());
    trayReady = true;
    rebuildTray();
    tray.on("click", () => showMain());
  } catch (error) {
    console.error("Tray unavailable:", error);
    trayReady = false;
  }
}

function createMiniWindow() {
  if (mini && !mini.isDestroyed()) {
    mini.show();
    mini.focus();
    return;
  }

  mini = new BrowserWindow({
    width: 280,
    height: 188,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  loadSurface(mini, "mini-timer", { surface: "mini" });
  mini.webContents.on("did-finish-load", () => {
    if (latestTimer && mini && !mini.isDestroyed()) mini.webContents.send("timer-state", latestTimer);
  });
  mini.on("closed", () => {
    mini = null;
  });
}

function readForegroundApp(): Promise<string | null> {
  return new Promise((resolve) => {
    const finish = (value: string | null) => {
      if (!value) {
        resolve(null);
        return;
      }
      const cleaned = value.replace(/\s+/g, " ").trim();
      if (!cleaned || /orion companion/i.test(cleaned)) {
        resolve(null);
        return;
      }
      resolve(cleaned.slice(0, 80));
    };

    if (process.platform === "darwin") {
      execFile(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2000 },
        (error, stdout) => finish(error ? null : stdout)
      );
      return;
    }

    if (process.platform === "win32") {
      execFile(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          "Add-Type -TypeDefinition 'using System; using System.Text; using System.Runtime.InteropServices; public class OrionForeground { [DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow(); [DllImport(\"user32.dll\")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count); }'; $handle = [OrionForeground]::GetForegroundWindow(); $builder = New-Object System.Text.StringBuilder 256; [void][OrionForeground]::GetWindowText($handle, $builder, 256); $builder.ToString()",
        ],
        { timeout: 2500 },
        (error, stdout) => finish(error ? null : stdout)
      );
      return;
    }

    execFile("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2000 }, (error, stdout) => {
      if (error || !stdout.trim()) {
        finish(null);
        return;
      }
      const parts = stdout
        .trim()
        .split(" - ")
        .map((part) => part.trim())
        .filter(Boolean);
      finish(parts[parts.length - 1] ?? null);
    });
  });
}

function setActivityWatch(enabled: boolean) {
  watchingActivity = enabled;
  if (!enabled) {
    if (activityTimer) clearInterval(activityTimer);
    activityTimer = null;
    return;
  }
  if (activityTimer) return;
  activityTimer = setInterval(() => {
    void readForegroundApp().then((name) => {
      if (!watchingActivity || !name || !win || win.isDestroyed()) return;
      win.webContents.send("activity-sample", name);
    });
  }, 15000);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "orion.svg"),

    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.on("close", (event) => {
    if (quitting || !trayReady) return;
    event.preventDefault();
    win?.hide();
  });

  loadSurface(win, "app");
}

app.on("window-all-closed", () => {
  if (!trayReady && process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (!win || win.isDestroyed()) createWindow();
  else showMain();
});

app.on("before-quit", () => {
  quitting = true;
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  if (activityTimer) clearInterval(activityTimer);
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  try {
    globalShortcut.register("CommandOrControl+Shift+Space", () => {
      showMain();
      win?.webContents.send("global-shortcut-quick-capture");
    });
  } catch (error) {
    console.error("Shortcut unavailable:", error);
  }

  ipcMain.on("update-tray-status", (_event, status: string) => {
    trayLabel = status || "Ready";
    rebuildTray();
  });

  ipcMain.on("report-timer", (_event, snapshot: TimerSnapshot) => {
    if (!snapshot) return;
    latestTimer = snapshot;
    const minutes = Math.floor(snapshot.remainingTime / 60);
    const seconds = snapshot.remainingTime % 60;
    const clock = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    trayLabel = snapshot.running ? `${snapshot.session === "focus" ? "Focus" : "Break"} ${clock}` : "Ready";
    rebuildTray();
    if (mini && !mini.isDestroyed()) mini.webContents.send("timer-state", snapshot);
  });

  ipcMain.on("mini-command", (_event, command: string) => {
    win?.webContents.send("mini-command", command);
  });

  ipcMain.on("watch-activity", (_event, enabled: boolean) => {
    setActivityWatch(Boolean(enabled));
  });

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
        name: "Orion Companion",
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
        name: "Orion Companion",
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

    autoUpdater.on("update-available", (info: { version: string; files: string[] }) => {
      console.log("Update available:", info);
    });

    autoUpdater.on("update-not-available", (info: { version: string }) => {
      console.log("Update not available:", info);
    });

    autoUpdater.on("error", (err: Error) => {
      console.error("Auto-updater error:", err);
    });

    autoUpdater.on("update-downloaded", (info: Record<string, unknown>) => {
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