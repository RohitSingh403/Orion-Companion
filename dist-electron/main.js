import { app as d, globalShortcut as z, session as ie, ipcMain as u, screen as F, Notification as T, autoUpdater as m, BrowserWindow as W, Tray as re, nativeImage as I, Menu as se } from "electron";
import { execFile as L } from "node:child_process";
import X from "node:fs";
import { fileURLToPath as ae } from "node:url";
import f from "node:path";
const J = f.dirname(ae(import.meta.url));
d.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = f.join(J, "..");
const p = process.env.VITE_DEV_SERVER_URL, Pe = f.join(process.env.APP_ROOT, "dist-electron"), Q = f.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = p ? f.join(process.env.APP_ROOT, "public") : Q;
let i = null, l = null, t = null, Y = "idle", j = !1, K = !1, v = null, k = -1, P = 0, U = 0, D = null, Z = [], b = !1, x = null, A = !1, M = !1, O = "Ready", H = !1, h = null, w = null;
function R() {
  const n = I.createFromPath(f.join(process.env.VITE_PUBLIC, "icon.png"));
  return n.isEmpty() ? null : n;
}
function le() {
  const n = process.env.VITE_PUBLIC;
  if (process.platform === "darwin") {
    const o = I.createFromPath(f.join(n, "trayTemplate.png"));
    if (!o.isEmpty())
      return o.setTemplateImage(!0), o;
  }
  const e = I.createFromPath(f.join(n, "tray.png"));
  return e.isEmpty() ? I.createEmpty() : e;
}
function ue(n) {
  if (n.startsWith("file://")) return !0;
  if (!p) return !1;
  try {
    return new URL(n).origin === new URL(p).origin;
  } catch {
    return !1;
  }
}
function V(n) {
  n.webContents.setWindowOpenHandler(() => ({ action: "deny" })), n.webContents.on("will-navigate", (e, o) => {
    ue(o) || e.preventDefault();
  });
}
function c(n) {
  return [i, l, t].some((e) => e && !e.isDestroyed() && e.webContents.id === n.sender.id);
}
function _(n, e) {
  return typeof n != "string" ? "" : [...n].map((o) => {
    const r = o.charCodeAt(0);
    return r < 32 || r === 127 ? " " : o;
  }).join("").trim().slice(0, e);
}
const $ = {
  preload: f.join(J, "preload.mjs"),
  contextIsolation: !0,
  nodeIntegration: !1,
  sandbox: !0,
  webSecurity: !0
};
function q(n, e, o = {}) {
  if (p) {
    const r = p.endsWith("/") ? p : `${p}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([a, g]) => s.searchParams.set(a, g)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(f.join(Q, "index.html"), { query: o });
}
function y() {
  if (!i || i.isDestroyed()) {
    G();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function N() {
  x && (x.setToolTip(`Orion Companion — ${O}`), x.setContextMenu(
    se.buildFromTemplate([
      { label: O, enabled: !1 },
      { label: "Show Orion", click: () => y() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => we() },
      {
        label: t && !t.isDestroyed() && t.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          t && !t.isDestroyed() && t.isVisible() ? ne() : C();
        }
      },
      {
        label: "Quick add",
        click: () => {
          y(), i == null || i.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      {
        label: "Close dashboard",
        click: () => {
          i == null || i.hide(), C();
        }
      },
      {
        label: "Quit completely",
        click: () => {
          i == null || i.hide(), C();
        }
      },
      {
        label: "Exit Orion",
        click: () => {
          A = !0, d.quit();
        }
      }
    ])
  ));
}
function ce() {
  try {
    x = new re(le()), M = !0, N(), x.on("click", () => y());
  } catch (n) {
    console.error("Tray unavailable:", n), M = !1;
  }
}
function ee() {
  return f.join(d.getPath("userData"), "companion-position.json");
}
function de() {
  try {
    const n = JSON.parse(X.readFileSync(ee(), "utf8"));
    if (typeof n.x == "number" && typeof n.y == "number") return { x: n.x, y: n.y };
  } catch {
    return null;
  }
  return null;
}
function fe() {
  if (!t || t.isDestroyed()) return;
  const [n, e] = t.getPosition();
  try {
    X.writeFileSync(ee(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function me(n) {
  const r = de(), s = r ?? { x: 0, y: 0 }, a = F.getDisplayNearestPoint(s).workArea, g = a.x + a.width - 300 - 24, E = a.y + a.height - 360 - 24, te = r ? Math.min(Math.max(a.x, r.x), a.x + a.width - 300) : g, oe = r ? Math.min(Math.max(a.y, r.y), a.y + a.height - 360) : E;
  n.setBounds({ x: Math.round(te), y: Math.round(oe), width: 300, height: 360 });
}
function S() {
  !t || t.isDestroyed() || (t.setAlwaysOnTop(!0, "floating"), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function C() {
  if (t && !t.isDestroyed()) {
    t.isVisible() || t.showInactive(), S(), w && t.webContents.send("timer-state", w);
    return;
  }
  t = new W({
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
    icon: R() ?? void 0,
    webPreferences: {
      ...$,
      backgroundThrottling: !1
    }
  }), V(t), me(t), S(), q(t, "companion", { surface: "companion" }), t.once("ready-to-show", () => {
    t == null || t.showInactive(), S();
  }), t.webContents.on("did-finish-load", () => {
    w && t && !t.isDestroyed() && t.webContents.send("timer-state", w);
  }), t.on("moved", () => {
    K || fe();
  }), t.on("closed", () => {
    t = null;
  });
}
function ne() {
  t && !t.isDestroyed() && t.hide();
}
function B(n) {
  K = n;
  const e = { walking: n, facing: k };
  D && D.walking === e.walking && D.facing === e.facing || (D = e, t && !t.isDestroyed() && t.webContents.send("companion-walk", e));
}
function pe() {
  if (!t || t.isDestroyed() || !t.isVisible()) return;
  if (j) {
    b && (t.setIgnoreMouseEvents(!1), b = !1);
    return;
  }
  const n = F.getCursorScreenPoint(), e = t.getBounds(), o = Z.some((r) => {
    const s = e.x + r.x, a = e.y + r.y;
    return n.x >= s && n.x <= s + r.width && n.y >= a && n.y <= a + r.height;
  });
  o !== !b && (b = !o, process.platform === "linux" ? t.setIgnoreMouseEvents(b) : t.setIgnoreMouseEvents(b, { forward: !0 }));
}
function he() {
  v || (U = Date.now() + 1600, v = setInterval(() => {
    if (!t || t.isDestroyed() || !t.isVisible() || j || Y !== "idle") {
      B(!1);
      return;
    }
    const n = Date.now();
    if (n < U) {
      B(!1);
      return;
    }
    P <= 0 && (P = 280 + Math.round(Math.random() * 240), k = Math.random() > 0.5 ? 1 : -1);
    const e = t.getBounds(), o = F.getDisplayNearestPoint({ x: e.x, y: e.y }).workArea;
    let r = e.x + k * 4;
    r <= o.x + 8 && (r = o.x + 8, k = 1);
    const s = o.x + o.width - e.width - 8;
    r >= s && (r = s, k = -1), t.setPosition(Math.round(r), e.y), P -= 4, P <= 0 && (U = n + 1800 + Math.round(Math.random() * 1200)), B(!0);
  }, 140), setInterval(pe, 40));
}
function we() {
  if (l && !l.isDestroyed()) {
    l.show(), l.focus();
    return;
  }
  l = new W({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    icon: R() ?? void 0,
    webPreferences: $
  }), V(l), q(l, "mini-timer", { surface: "mini" }), l.webContents.on("did-finish-load", () => {
    w && l && !l.isDestroyed() && l.webContents.send("timer-state", w);
  }), l.on("closed", () => {
    l = null;
  });
}
function be() {
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
      L(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      L(
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
    L("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, r) => {
      if (o || !r.trim()) {
        e(null);
        return;
      }
      const s = r.trim().split(" - ").map((a) => a.trim()).filter(Boolean);
      e(s[s.length - 1] ?? null);
    });
  });
}
function ye(n) {
  if (H = n, !n) {
    h && clearInterval(h), h = null;
    return;
  }
  h || (h = setInterval(() => {
    be().then((e) => {
      !H || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function G() {
  i = new W({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: R() ?? void 0,
    webPreferences: {
      ...$,
      backgroundThrottling: !1
    }
  }), V(i);
  const n = R();
  n && process.platform === "darwin" && d.dock && d.dock.setIcon(n), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (e) => {
    A || !M || (e.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !t || t.isDestroyed() || !t.isVisible() || (t.showInactive(), S());
  }), q(i, "app");
}
d.on("window-all-closed", () => {
  !M && process.platform !== "darwin" && (d.quit(), i = null);
});
d.on("activate", () => {
  !i || i.isDestroyed() ? G() : y();
});
d.on("before-quit", () => {
  A = !0;
});
d.on("will-quit", () => {
  z.unregisterAll(), h && clearInterval(h), v && clearInterval(v);
});
d.whenReady().then(() => {
  G(), ce(), C(), he();
  try {
    z.register("CommandOrControl+Shift+Space", () => {
      y(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  ie.defaultSession.setPermissionRequestHandler((n, e, o) => {
    o(!1);
  }), u.on("update-tray-status", (n, e) => {
    c(n) && (O = _(e, 80) || "Ready", N());
  }), u.on("report-timer", (n, e) => {
    if (!c(n) || !e || e.session !== "focus" && e.session !== "break" || typeof e.remainingTime != "number" || !Number.isFinite(e.remainingTime)) return;
    w = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${o}:${r.toString().padStart(2, "0")}`;
    O = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", N(), l && !l.isDestroyed() && l.webContents.send("timer-state", e), t && !t.isDestroyed() && t.webContents.send("timer-state", e);
  }), u.on("companion-activity", (n, e) => {
    c(n) && (((e == null ? void 0 : e.mode) === "idle" || (e == null ? void 0 : e.mode) === "focus" || (e == null ? void 0 : e.mode) === "break") && (Y = e.mode), j = !!(e != null && e.dragging));
  }), u.on("companion-nudge", (n, e, o) => {
    if (!t || t.isDestroyed() || n.sender.id !== t.webContents.id) return;
    const r = t;
    if (!Number.isFinite(e) || !Number.isFinite(o)) return;
    const s = r.getBounds(), a = F.getDisplayNearestPoint({ x: s.x, y: s.y }).workArea, g = Math.min(Math.max(a.x, s.x + e), a.x + a.width - s.width), E = Math.min(Math.max(a.y, s.y + o), a.y + a.height - s.height);
    r.setPosition(Math.round(g), Math.round(E));
  }), u.on("companion-hits", (n, e) => {
    !c(n) || !Array.isArray(e) || (Z = e.filter((o) => Number.isFinite(o == null ? void 0 : o.x) && Number.isFinite(o == null ? void 0 : o.y) && o.width > 0 && o.height > 0 && o.width < 2e3 && o.height < 2e3).slice(0, 12));
  }), u.on("companion-reminder-sync", (n) => {
    c(n) && i && !i.isDestroyed() && i.webContents.send("reminder-sync");
  }), u.on("companion-exit", (n) => {
    c(n) && (A = !0, d.quit());
  }), u.on("companion-show-main", (n) => {
    c(n) && y();
  }), u.on("companion-visibility", (n, e) => {
    c(n) && (e ? C() : ne(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e));
  }), u.on("mini-command", (n, e) => {
    c(n) && (e !== "start" && e !== "pause" && e !== "reset" || i == null || i.webContents.send("mini-command", e));
  }), u.on("watch-activity", (n, e) => {
    c(n) && ye(!!e);
  }), u.on("show-break-notification", (n) => {
    c(n) && new T({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), u.on("show-focus-notification", (n) => {
    c(n) && new T({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), u.on("show-reminder-notification", (n, e, o) => {
    if (!c(n)) return;
    const r = _(e, 80);
    r && new T({
      title: r,
      body: _(o, 180)
    }).show();
  }), u.handle("get-auto-launch-status", async (n) => {
    if (!c(n)) return !1;
    try {
      const e = (await import("./index-BYV84ozA.js").then((s) => s.i)).default;
      return await new e({
        name: "Orion Companion",
        path: process.execPath
      }).isEnabled();
    } catch (e) {
      return console.error("Failed to get auto-launch status:", e), !1;
    }
  }), u.handle("toggle-auto-launch", async (n, e) => {
    if (!c(n)) return !1;
    try {
      const o = (await import("./index-BYV84ozA.js").then((s) => s.i)).default, r = new o({
        name: "Orion Companion",
        path: process.execPath
      });
      return e ? (await r.enable(), !0) : (await r.disable(), !1);
    } catch (o) {
      return console.error("Failed to toggle auto-launch:", o), !1;
    }
  }), p || (m.setFeedURL({
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
    console.log("Update downloaded:", o), new T({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    m.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), m.checkForUpdates());
});
export {
  Pe as MAIN_DIST,
  Q as RENDERER_DIST,
  p as VITE_DEV_SERVER_URL
};
