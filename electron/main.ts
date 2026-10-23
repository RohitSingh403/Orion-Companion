import { app, BrowserWindow, Menu, Notification, Tray, dialog, globalShortcut, ipcMain, nativeImage, net, protocol, screen, session, type IpcMainEvent, type IpcMainInvokeEvent } from "electron";
import { execFile } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { rendererFileForRequest } from "./appProtocol";
import { claimInstance, handoffSocketPath } from "./handoff";
import { isAllowedNavigation } from "./navigation";

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Chromium otherwise trusts a tiny GPU-memory reading, then logs
// "tile memory limits exceeded, some content may not draw" and skips pixels.
app.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null = null;
let mini: BrowserWindow | null = null;
let companion: BrowserWindow | null = null;
let petMode: "idle" | "focus" | "break" = "idle";
let petPaused = false;
let reduceMotion = false;
let walkingNow = false;
let walkTimer: ReturnType<typeof setInterval> | null = null;
let walkDirection: 1 | -1 = -1;
let walkLeft = 0;
let walkPausedUntil = 0;
let lastWalk: { walking: boolean; facing: 1 | -1 } | null = null;
let hitRects: Array<{ x: number; y: number; width: number; height: number }> = [];
let mouseIgnored = false;
let tray: Tray | null = null;
let quitting = false;
let trayReady = false;
let trayLabel = "Ready";
let watchingActivity = false;
let activityTimer: ReturnType<typeof setInterval> | null = null;
let latestTimer: TimerSnapshot | null = null;
let updateReady = false;
let installDownloadedUpdate: (() => void) | null = null;
let closeHandoff: (() => Promise<void>) | null = null;

interface TimerSnapshot {
  remainingTime: number;
  running: boolean;
  session: "focus" | "break";
}

function productIcon() {
  const image = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "icon.png"));
  return image.isEmpty() ? null : image;
}

function trayIcon() {
  const base = process.env.VITE_PUBLIC;
  if (process.platform === "darwin") {
    const image = nativeImage.createFromPath(path.join(base, "trayTemplate.png"));
    if (!image.isEmpty()) {
      image.setTemplateImage(true);
      return image;
    }
  }
  const image = nativeImage.createFromPath(path.join(base, "tray.png"));
  if (!image.isEmpty()) return image;
  return nativeImage.createEmpty();
}

function harden(target: BrowserWindow) {
  target.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  const block = (event: { preventDefault: () => void }, url: string) => {
    if (!isAllowedNavigation(url, RENDERER_DIST, VITE_DEV_SERVER_URL)) event.preventDefault();
  };
  target.webContents.on("will-navigate", block);
  target.webContents.on("will-redirect", block);
  target.webContents.on("will-attach-webview", (event) => {
    event.preventDefault();
  });
}

function fromApp(event: IpcMainEvent | IpcMainInvokeEvent) {
  return [win, mini, companion].some((target) => target && !target.isDestroyed() && target.webContents.id === event.sender.id);
}

function plainText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return [...value].map((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127 ? " " : char;
  }).join("").trim().slice(0, max);
}

const windowPreferences = {
  preload: path.join(__dirname, "preload.mjs"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true,
  webSecurity: true,
};

function loadSurface(target: BrowserWindow, route: string, search: Record<string, string> = {}) {
  if (VITE_DEV_SERVER_URL) {
    const base = VITE_DEV_SERVER_URL.endsWith("/") ? VITE_DEV_SERVER_URL : `${VITE_DEV_SERVER_URL}/`;
    const url = new URL(route.replace(/^\//, ""), base);
    Object.entries(search).forEach(([key, value]) => url.searchParams.set(key, value));
    void target.loadURL(url.toString());
    return;
  }
  const packaged = new URL(`app://orion/${route.replace(/^\//, "") || "app"}`);
  Object.entries(search).forEach(([key, value]) => packaged.searchParams.set(key, value));
  void target.loadURL(packaged.toString());
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
        label: companion && !companion.isDestroyed() && companion.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          if (companion && !companion.isDestroyed() && companion.isVisible()) hideCompanion();
          else showCompanion();
        },
      },
      {
        label: "Quick add",
        click: () => {
          showMain();
          win?.webContents.send("tray-quick-add-task");
        },
      },
      { type: "separator" },
      ...(updateReady
        ? [{
            label: "Install update and restart",
            click: () => installDownloadedUpdate?.(),
          }]
        : []),
      {
        label: "Restart Orion",
        click: () => {
          app.relaunch();
          quitting = true;
          app.quit();
        },
      },
      {
        label: "Close dashboard",
        click: () => {
          win?.hide();
          showCompanion();
        },
      },
      {
        label: "Quit completely",
        click: () => {
          win?.hide();
          showCompanion();
        },
      },
      {
        label: "Exit Orion",
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

function companionPositionFile() {
  return path.join(app.getPath("userData"), "companion-position.json");
}

function readCompanionPosition() {
  try {
    const parsed = JSON.parse(fs.readFileSync(companionPositionFile(), "utf8")) as { x?: number; y?: number };
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
  return null;
}

function rememberCompanionPosition() {
  if (!companion || companion.isDestroyed()) return;
  const [x, y] = companion.getPosition();
  try {
    fs.writeFileSync(companionPositionFile(), JSON.stringify({ x, y }));
  } catch {
    // The pet still works if the position file cannot be written.
  }
}

function placeCompanion(target: BrowserWindow) {
  const width = 300;
  const height = 360;
  const saved = readCompanionPosition();
  const anchor = saved ?? { x: 0, y: 0 };
  const area = screen.getDisplayNearestPoint(anchor).workArea;
  const fallbackX = area.x + area.width - width - 24;
  const fallbackY = area.y + area.height - height - 24;
  const x = saved ? Math.min(Math.max(area.x, saved.x), area.x + area.width - width) : fallbackX;
  const y = saved ? Math.min(Math.max(area.y, saved.y), area.y + area.height - height) : fallbackY;
  target.setBounds({ x: Math.round(x), y: Math.round(y), width, height });
}

function keepCompanionAbove() {
  if (!companion || companion.isDestroyed()) return;
  companion.setAlwaysOnTop(true, "floating");
  companion.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
}

function showCompanion() {
  if (companion && !companion.isDestroyed()) {
    if (!companion.isVisible()) companion.showInactive();
    keepCompanionAbove();
    if (latestTimer) companion.webContents.send("timer-state", latestTimer);
    return;
  }

  companion = new BrowserWindow({
    width: 300,
    height: 360,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: true,
    title: "Orion Companion",
    backgroundColor: "#00000000",
    ...(process.platform === "darwin" ? { type: "panel" as const } : {}),
    icon: productIcon() ?? undefined,
    webPreferences: {
      ...windowPreferences,
      backgroundThrottling: false,
    },
  });
  harden(companion);
  placeCompanion(companion);
  keepCompanionAbove();

  loadSurface(companion, "companion", { surface: "companion" });
  companion.once("ready-to-show", () => {
    companion?.showInactive();
    keepCompanionAbove();
  });
  companion.webContents.on("did-finish-load", () => {
    if (latestTimer && companion && !companion.isDestroyed()) companion.webContents.send("timer-state", latestTimer);
  });
  companion.on("moved", () => {
    if (walkingNow) return;
    rememberCompanionPosition();
  });
  companion.on("closed", () => {
    companion = null;
  });
}

function hideCompanion() {
  if (companion && !companion.isDestroyed()) companion.hide();
}

function publishWalk(walking: boolean) {
  walkingNow = walking;
  const next = { walking, facing: walkDirection };
  if (lastWalk && lastWalk.walking === next.walking && lastWalk.facing === next.facing) return;
  lastWalk = next;
  if (companion && !companion.isDestroyed()) companion.webContents.send("companion-walk", next);
}

function syncCompanionMouse() {
  if (!companion || companion.isDestroyed() || !companion.isVisible()) return;
  if (petPaused) {
    if (mouseIgnored) {
      companion.setIgnoreMouseEvents(false);
      mouseIgnored = false;
    }
    return;
  }
  const point = screen.getCursorScreenPoint();
  const bounds = companion.getBounds();
  const inside = hitRects.some((rect) => {
    const x = bounds.x + rect.x;
    const y = bounds.y + rect.y;
    return point.x >= x && point.x <= x + rect.width && point.y >= y && point.y <= y + rect.height;
  });
  if (inside === !mouseIgnored) return;
  mouseIgnored = !inside;
  if (process.platform === "linux") companion.setIgnoreMouseEvents(mouseIgnored);
  else companion.setIgnoreMouseEvents(mouseIgnored, { forward: true });
}

function startCompanionWalk() {
  if (walkTimer) return;
  walkPausedUntil = Date.now() + 1600;
  walkTimer = setInterval(() => {
    if (!companion || companion.isDestroyed() || !companion.isVisible() || petPaused || reduceMotion || petMode !== "idle") {
      publishWalk(false);
      return;
    }
    const now = Date.now();
    if (now < walkPausedUntil) {
      publishWalk(false);
      return;
    }
    if (walkLeft <= 0) {
      walkLeft = 280 + Math.round(Math.random() * 240);
      walkDirection = Math.random() > 0.5 ? 1 : -1;
    }
    const bounds = companion.getBounds();
    const area = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y }).workArea;
    let nextX = bounds.x + walkDirection * 4;
    if (nextX <= area.x + 8) {
      nextX = area.x + 8;
      walkDirection = 1;
    }
    const maxX = area.x + area.width - bounds.width - 8;
    if (nextX >= maxX) {
      nextX = maxX;
      walkDirection = -1;
    }
    companion.setPosition(Math.round(nextX), bounds.y);
    walkLeft -= 4;
    if (walkLeft <= 0) walkPausedUntil = now + 1800 + Math.round(Math.random() * 1200);
    publishWalk(true);
  }, 140);
  setInterval(syncCompanionMouse, 40);
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
    icon: productIcon() ?? undefined,
    webPreferences: windowPreferences,
  });
  harden(mini);

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
    icon: productIcon() ?? undefined,

    webPreferences: {
      ...windowPreferences,
      backgroundThrottling: false,
    },
  });
  harden(win);
  const branded = productIcon();
  if (branded && process.platform === "darwin" && app.dock) app.dock.setIcon(branded);

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.on("close", (event) => {
    if (quitting || !trayReady) return;
    event.preventDefault();
    win?.hide();
  });

  win.on("hide", () => {
    if (!companion || companion.isDestroyed() || !companion.isVisible()) return;
    companion.showInactive();
    keepCompanionAbove();
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
  if (walkTimer) clearInterval(walkTimer);
  void closeHandoff?.();
});

function registerAppProtocol() {
  protocol.handle("app", (request) => {
    const candidate = rendererFileForRequest(RENDERER_DIST, request.url);
    if (!candidate) return new Response("forbidden", { status: 403 });
    const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile()
      ? candidate
      : path.join(RENDERER_DIST, "index.html");
    return net.fetch(pathToFileURL(file).toString());
  });
}

function thisInstance() {
  return { execPath: process.execPath, version: app.getVersion() };
}

async function startUpdater() {
  if (VITE_DEV_SERVER_URL) return;
  try {
    const updaterModule = (await import("electron-updater")) as {
      autoUpdater?: {
        autoDownload: boolean;
        autoInstallOnAppQuit: boolean;
        on: (event: string, listener: (...args: unknown[]) => void) => void;
        checkForUpdates: () => Promise<unknown>;
        quitAndInstall: (isSilent?: boolean, isForceRunAfter?: boolean) => void;
      };
    };
    const updater = updaterModule.autoUpdater;
    if (!updater) return;
    updater.autoDownload = true;
    updater.autoInstallOnAppQuit = true;
    updater.on("error", (...args) => {
      console.error("Auto-updater unavailable:", args[0]);
    });
    updater.on("update-downloaded", () => {
      updateReady = true;
      installDownloadedUpdate = () => {
        quitting = true;
        updater.quitAndInstall(false, true);
      };
      rebuildTray();
      new Notification({
        title: "Update ready",
        body: "Install update and restart is in the tray menu.",
      }).show();
    });
    const check = () => {
      void updater.checkForUpdates().catch((error: unknown) => {
        console.error("Auto-updater unavailable:", error);
      });
    };
    setInterval(check, 4 * 60 * 60 * 1000);
    check();
  } catch (error) {
    console.error("Auto-updater unavailable:", error);
  }
}

app.whenReady().then(async () => {
  const place = handoffSocketPath(app.getPath("userData"), process.platform);
  const running = thisInstance();
  const claim = await claimInstance({
    socketPath: place,
    platform: process.platform,
    incoming: running,
    onFocus: () => showMain(),
    onReplace: () => {
      quitting = true;
      app.quit();
    },
    onOwned: (close) => {
      closeHandoff = close;
    },
  });
  if (claim !== "owner") {
    if (claim === "blocked") {
      dialog.showErrorBox("Orion is already open", "Choose Exit Orion in the tray, then open Orion again.");
    }
    app.quit();
    return;
  }

  registerAppProtocol();
  createWindow();
  createTray();
  showCompanion();
  startCompanionWalk();

  try {
    globalShortcut.register("CommandOrControl+Shift+Space", () => {
      showMain();
      win?.webContents.send("global-shortcut-quick-capture");
    });
  } catch (error) {
    console.error("Shortcut unavailable:", error);
  }

  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => {
    callback(false);
  });

  ipcMain.on("update-tray-status", (event, status: string) => {
    if (!fromApp(event)) return;
    trayLabel = plainText(status, 80) || "Ready";
    rebuildTray();
  });

  ipcMain.on("report-timer", (event, snapshot: TimerSnapshot) => {
    if (!fromApp(event) || !snapshot) return;
    if (snapshot.session !== "focus" && snapshot.session !== "break") return;
    if (typeof snapshot.remainingTime !== "number" || !Number.isFinite(snapshot.remainingTime)) return;
    latestTimer = snapshot;
    const minutes = Math.floor(snapshot.remainingTime / 60);
    const seconds = snapshot.remainingTime % 60;
    const clock = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    trayLabel = snapshot.running ? `${snapshot.session === "focus" ? "Focus" : "Break"} ${clock}` : "Ready";
    rebuildTray();
    if (mini && !mini.isDestroyed()) mini.webContents.send("timer-state", snapshot);
    if (companion && !companion.isDestroyed()) companion.webContents.send("timer-state", snapshot);
  });

  ipcMain.on("companion-activity", (event, activity: { mode?: "idle" | "focus" | "break"; dragging?: boolean; reduceMotion?: boolean }) => {
    if (!fromApp(event)) return;
    if (activity?.mode === "idle" || activity?.mode === "focus" || activity?.mode === "break") petMode = activity.mode;
    petPaused = Boolean(activity?.dragging);
    if (typeof activity?.reduceMotion === "boolean") reduceMotion = activity.reduceMotion;
  });

  ipcMain.on("companion-nudge", (event, dx: number, dy: number) => {
    if (!companion || companion.isDestroyed() || event.sender.id !== companion.webContents.id) return;
    const target = companion;
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    const bounds = target.getBounds();
    const area = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y }).workArea;
    const x = Math.min(Math.max(area.x, bounds.x + dx), area.x + area.width - bounds.width);
    const y = Math.min(Math.max(area.y, bounds.y + dy), area.y + area.height - bounds.height);
    target.setPosition(Math.round(x), Math.round(y));
  });

  ipcMain.on("companion-hits", (event, rects: Array<{ x: number; y: number; width: number; height: number }>) => {
    if (!fromApp(event) || !Array.isArray(rects)) return;
    hitRects = rects
      .filter((rect) => Number.isFinite(rect?.x) && Number.isFinite(rect?.y) && rect.width > 0 && rect.height > 0 && rect.width < 2000 && rect.height < 2000)
      .slice(0, 12);
  });

  ipcMain.on("companion-reminder-sync", (event) => {
    if (!fromApp(event)) return;
    if (win && !win.isDestroyed()) win.webContents.send("reminder-sync");
  });

  ipcMain.on("companion-exit", (event) => {
    if (!fromApp(event)) return;
    quitting = true;
    app.quit();
  });

  ipcMain.on("companion-show-main", (event) => {
    if (!fromApp(event)) return;
    showMain();
  });

  ipcMain.on("companion-visibility", (event, visible: boolean) => {
    if (!fromApp(event)) return;
    if (visible) showCompanion();
    else hideCompanion();
    if (win && !win.isDestroyed()) win.webContents.send("companion-visibility", Boolean(visible));
  });

  ipcMain.on("mini-command", (event, command: string) => {
    if (!fromApp(event)) return;
    if (command !== "start" && command !== "pause" && command !== "reset") return;
    win?.webContents.send("mini-command", command);
  });

  ipcMain.on("watch-activity", (event, enabled: boolean) => {
    if (!fromApp(event)) return;
    setActivityWatch(Boolean(enabled));
  });

  // Focus -> Break
  ipcMain.on("show-break-notification", (event) => {
    if (!fromApp(event)) return;
    new Notification({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water.",
    }).show();
  });

  // Break -> Focus
  ipcMain.on("show-focus-notification", (event) => {
    if (!fromApp(event)) return;
    new Notification({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?",
    }).show();
  });

  // Reminder notification
  ipcMain.on("show-reminder-notification", (event, title: string, body: string) => {
    if (!fromApp(event)) return;
    const label = plainText(title, 80);
    if (!label) return;
    new Notification({
      title: label,
      body: plainText(body, 180),
    }).show();
  });

  // Auto-launch handlers
  ipcMain.handle("get-auto-launch-status", async (event) => {
    if (!fromApp(event)) return false;
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

  ipcMain.handle("toggle-auto-launch", async (event, enable: boolean) => {
    if (!fromApp(event)) return false;
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

  void startUpdater();
});