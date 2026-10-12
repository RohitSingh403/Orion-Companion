import { app as f, globalShortcut as _, ipcMain as c, BrowserWindow as g, screen as A, Notification as v, autoUpdater as m, Tray as $, nativeImage as V, Menu as z } from "electron";
import { execFile as D } from "node:child_process";
import E from "node:fs";
import { fileURLToPath as N } from "node:url";
import u from "node:path";
const x = u.dirname(N(import.meta.url));
f.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = u.join(x, "..");
const y = process.env.VITE_DEV_SERVER_URL, ie = u.join(process.env.APP_ROOT, "dist-electron"), j = u.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = y ? u.join(process.env.APP_ROOT, "public") : j;
let i = null, l = null, t = null, b = null, R = !1, T = !1, k = "Ready", F = !1, p = null, h = null;
function q() {
  const e = Buffer.alloc(1024);
  for (let o = 0; o < 16; o += 1)
    for (let r = 0; r < 16; r += 1) {
      const s = r - 7.5, a = o - 7.5;
      if (Math.sqrt(s * s + a * a) >= 6.5) continue;
      const d = (o * 16 + r) * 4;
      e[d] = 245, e[d + 1] = 215, e[d + 2] = 122, e[d + 3] = 255;
    }
  return V.createFromBitmap(e, { width: 16, height: 16 });
}
function M(n, e, o = {}) {
  if (y) {
    const r = y.endsWith("/") ? y : `${y}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([a, d]) => s.searchParams.set(a, d)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(u.join(j, "index.html"), { query: o });
}
function w() {
  if (!i || i.isDestroyed()) {
    I();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function P() {
  b && (b.setToolTip(`Orion Companion — ${k}`), b.setContextMenu(
    z.buildFromTemplate([
      { label: k, enabled: !1 },
      { label: "Show Orion", click: () => w() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => Y() },
      {
        label: t && !t.isDestroyed() && t.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          t && !t.isDestroyed() && t.isVisible() ? L() : O();
        }
      },
      {
        label: "Quick add",
        click: () => {
          w(), i == null || i.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          R = !0, f.quit();
        }
      }
    ])
  ));
}
function G() {
  try {
    b = new $(q()), T = !0, P(), b.on("click", () => w());
  } catch (n) {
    console.error("Tray unavailable:", n), T = !1;
  }
}
function B() {
  return u.join(f.getPath("userData"), "companion-position.json");
}
function H() {
  try {
    const n = JSON.parse(E.readFileSync(B(), "utf8"));
    if (typeof n.x == "number" && typeof n.y == "number") return { x: n.x, y: n.y };
  } catch {
    return null;
  }
  return null;
}
function J() {
  if (!t || t.isDestroyed()) return;
  const [n, e] = t.getPosition();
  try {
    E.writeFileSync(B(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function Q(n) {
  const r = H(), s = r ?? { x: 0, y: 0 }, a = A.getDisplayNearestPoint(s).workArea, d = a.x + a.width - 300 - 24, S = a.y + a.height - 360 - 24, U = r ? Math.min(Math.max(a.x, r.x), a.x + a.width - 300) : d, W = r ? Math.min(Math.max(a.y, r.y), a.y + a.height - 360) : S;
  n.setBounds({ x: Math.round(U), y: Math.round(W), width: 300, height: 360 });
}
function C() {
  !t || t.isDestroyed() || (t.setAlwaysOnTop(!0, "floating"), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function O() {
  if (t && !t.isDestroyed()) {
    t.isVisible() || t.showInactive(), C(), h && t.webContents.send("timer-state", h);
    return;
  }
  t = new g({
    width: 300,
    height: 360,
    frame: !1,
    transparent: !0,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    focusable: !0,
    title: "Orion Companion",
    backgroundColor: "#00000000",
    ...process.platform === "darwin" ? { type: "panel" } : {},
    webPreferences: {
      preload: u.join(x, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), Q(t), C(), M(t, "companion", { surface: "companion" }), t.once("ready-to-show", () => {
    t == null || t.showInactive(), C();
  }), t.webContents.on("did-finish-load", () => {
    h && t && !t.isDestroyed() && t.webContents.send("timer-state", h);
  }), t.on("moved", J), t.on("closed", () => {
    t = null;
  });
}
function L() {
  t && !t.isDestroyed() && t.hide();
}
function Y() {
  if (l && !l.isDestroyed()) {
    l.show(), l.focus();
    return;
  }
  l = new g({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    webPreferences: {
      preload: u.join(x, "preload.mjs")
    }
  }), M(l, "mini-timer", { surface: "mini" }), l.webContents.on("did-finish-load", () => {
    h && l && !l.isDestroyed() && l.webContents.send("timer-state", h);
  }), l.on("closed", () => {
    l = null;
  });
}
function X() {
  return new Promise((n) => {
    const e = (o) => {
      if (!o) {
        n(null);
        return;
      }
      const r = o.replace(/\s+/g, " ").trim();
      if (!r || /orion companion/i.test(r)) {
        n(null);
        return;
      }
      n(r.slice(0, 80));
    };
    if (process.platform === "darwin") {
      D(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      D(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          `Add-Type -TypeDefinition 'using System; using System.Text; using System.Runtime.InteropServices; public class OrionForeground { [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count); }'; $handle = [OrionForeground]::GetForegroundWindow(); $builder = New-Object System.Text.StringBuilder 256; [void][OrionForeground]::GetWindowText($handle, $builder, 256); $builder.ToString()`
        ],
        { timeout: 2500 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    D("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, r) => {
      if (o || !r.trim()) {
        e(null);
        return;
      }
      const s = r.trim().split(" - ").map((a) => a.trim()).filter(Boolean);
      e(s[s.length - 1] ?? null);
    });
  });
}
function K(n) {
  if (F = n, !n) {
    p && clearInterval(p), p = null;
    return;
  }
  p || (p = setInterval(() => {
    X().then((e) => {
      !F || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function I() {
  i = new g({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: u.join(process.env.VITE_PUBLIC, "orion.svg"),
    webPreferences: {
      preload: u.join(x, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (n) => {
    R || !T || (n.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !t || t.isDestroyed() || !t.isVisible() || (t.showInactive(), C());
  }), M(i, "app");
}
f.on("window-all-closed", () => {
  !T && process.platform !== "darwin" && (f.quit(), i = null);
});
f.on("activate", () => {
  !i || i.isDestroyed() ? I() : w();
});
f.on("before-quit", () => {
  R = !0;
});
f.on("will-quit", () => {
  _.unregisterAll(), p && clearInterval(p);
});
f.whenReady().then(() => {
  I(), G(), O();
  try {
    _.register("CommandOrControl+Shift+Space", () => {
      w(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  c.on("update-tray-status", (n, e) => {
    k = e || "Ready", P();
  }), c.on("report-timer", (n, e) => {
    if (!e) return;
    h = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${o}:${r.toString().padStart(2, "0")}`;
    k = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", P(), l && !l.isDestroyed() && l.webContents.send("timer-state", e), t && !t.isDestroyed() && t.webContents.send("timer-state", e);
  }), c.on("companion-nudge", (n, e, o) => {
    const r = g.fromWebContents(n.sender);
    if (!r || r.isDestroyed() || !Number.isFinite(e) || !Number.isFinite(o)) return;
    const s = r.getBounds(), a = A.getDisplayNearestPoint({ x: s.x, y: s.y }).workArea, d = Math.min(Math.max(a.x, s.x + e), a.x + a.width - s.width), S = Math.min(Math.max(a.y, s.y + o), a.y + a.height - s.height);
    r.setPosition(Math.round(d), Math.round(S));
  }), c.on("companion-mouse-passthrough", (n, e) => {
    if (process.platform === "linux") return;
    const o = g.fromWebContents(n.sender);
    !o || o.isDestroyed() || o.setIgnoreMouseEvents(!!e, { forward: !0 });
  }), c.on("companion-show-main", () => {
    w();
  }), c.on("companion-visibility", (n, e) => {
    e ? O() : L(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e);
  }), c.on("mini-command", (n, e) => {
    i == null || i.webContents.send("mini-command", e);
  }), c.on("watch-activity", (n, e) => {
    K(!!e);
  }), c.on("show-break-notification", () => {
    new v({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), c.on("show-focus-notification", () => {
    new v({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), c.on("show-reminder-notification", (n, e, o) => {
    new v({
      title: `🔔 ${e}`,
      body: o
    }).show();
  }), c.handle("get-auto-launch-status", async () => {
    try {
      const n = (await import("./index-BYV84ozA.js").then((r) => r.i)).default;
      return await new n({
        name: "Orion Companion",
        path: process.execPath
      }).isEnabled();
    } catch (n) {
      return console.error("Failed to get auto-launch status:", n), !1;
    }
  }), c.handle("toggle-auto-launch", async (n, e) => {
    try {
      const o = (await import("./index-BYV84ozA.js").then((s) => s.i)).default, r = new o({
        name: "Orion Companion",
        path: process.execPath
      });
      return e ? (await r.enable(), !0) : (await r.disable(), !1);
    } catch (o) {
      return console.error("Failed to toggle auto-launch:", o), !1;
    }
  }), y || (m.setFeedURL({
    url: "https://github.com/RohitSingh403/Orion-Companion/releases/latest",
    headers: { Accept: "application/json" }
  }), m.on("checking-for-update", () => {
    console.log("Checking for update...");
  }), m.on("update-available", (o) => {
    console.log("Update available:", o);
  }), m.on("update-not-available", (o) => {
    console.log("Update not available:", o);
  }), m.on("error", (o) => {
    console.error("Auto-updater error:", o);
  }), m.on("update-downloaded", (o) => {
    console.log("Update downloaded:", o), new v({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    m.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), m.checkForUpdates());
});
export {
  ie as MAIN_DIST,
  j as RENDERER_DIST,
  y as VITE_DEV_SERVER_URL
};
