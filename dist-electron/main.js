import { app as d, globalShortcut as G, session as ie, ipcMain as u, screen as A, Notification as P, autoUpdater as p, BrowserWindow as N, Tray as re, nativeImage as H, Menu as se } from "electron";
import { execFile as E } from "node:child_process";
import X from "node:fs";
import { fileURLToPath as ae } from "node:url";
import f from "node:path";
const J = f.dirname(ae(import.meta.url));
d.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = f.join(J, "..");
const w = process.env.VITE_DEV_SERVER_URL, De = f.join(process.env.APP_ROOT, "dist-electron"), Q = f.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = w ? f.join(process.env.APP_ROOT, "public") : Q;
let i = null, l = null, o = null, Y = "idle", W = !1, K = !1, I = null, k = -1, S = 0, L = 0, v = null, Z = [], g = !1, C = null, F = !1, O = !1, R = "Ready", z = !1, b = null, y = null;
function D() {
  const n = H.createFromPath(f.join(process.env.VITE_PUBLIC, "icon.png"));
  return n.isEmpty() ? null : n;
}
function le() {
  const n = D();
  if (n) return n.resize({ width: 18, height: 18 });
  const e = 16, t = Buffer.alloc(e * e * 4);
  for (let r = 0; r < e; r += 1)
    for (let s = 0; s < e; s += 1) {
      const a = s - 7.5, m = r - 7.5;
      if (Math.sqrt(a * a + m * m) >= 6.5) continue;
      const h = (r * e + s) * 4;
      t[h] = 245, t[h + 1] = 215, t[h + 2] = 122, t[h + 3] = 255;
    }
  return H.createFromBitmap(t, { width: e, height: e });
}
function ue(n) {
  if (n.startsWith("file://")) return !0;
  if (!w) return !1;
  try {
    return new URL(n).origin === new URL(w).origin;
  } catch {
    return !1;
  }
}
function V(n) {
  n.webContents.setWindowOpenHandler(() => ({ action: "deny" })), n.webContents.on("will-navigate", (e, t) => {
    ue(t) || e.preventDefault();
  });
}
function c(n) {
  return [i, l, o].some((e) => e && !e.isDestroyed() && e.webContents.id === n.sender.id);
}
function B(n, e) {
  return typeof n != "string" ? "" : [...n].map((t) => {
    const r = t.charCodeAt(0);
    return r < 32 || r === 127 ? " " : t;
  }).join("").trim().slice(0, e);
}
const j = {
  preload: f.join(J, "preload.mjs"),
  contextIsolation: !0,
  nodeIntegration: !1,
  sandbox: !0,
  webSecurity: !0
};
function $(n, e, t = {}) {
  if (w) {
    const r = w.endsWith("/") ? w : `${w}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(t).forEach(([a, m]) => s.searchParams.set(a, m)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(f.join(Q, "index.html"), { query: t });
}
function x() {
  if (!i || i.isDestroyed()) {
    q();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function _() {
  C && (C.setToolTip(`Orion Companion — ${R}`), C.setContextMenu(
    se.buildFromTemplate([
      { label: R, enabled: !1 },
      { label: "Show Orion", click: () => x() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => we() },
      {
        label: o && !o.isDestroyed() && o.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          o && !o.isDestroyed() && o.isVisible() ? ne() : T();
        }
      },
      {
        label: "Quick add",
        click: () => {
          x(), i == null || i.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      {
        label: "Close dashboard",
        click: () => {
          i == null || i.hide(), T();
        }
      },
      {
        label: "Quit completely",
        click: () => {
          i == null || i.hide(), T();
        }
      },
      {
        label: "Exit Orion",
        click: () => {
          F = !0, d.quit();
        }
      }
    ])
  ));
}
function ce() {
  try {
    C = new re(le()), O = !0, _(), C.on("click", () => x());
  } catch (n) {
    console.error("Tray unavailable:", n), O = !1;
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
  if (!o || o.isDestroyed()) return;
  const [n, e] = o.getPosition();
  try {
    X.writeFileSync(ee(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function me(n) {
  const r = de(), s = r ?? { x: 0, y: 0 }, a = A.getDisplayNearestPoint(s).workArea, m = a.x + a.width - 300 - 24, h = a.y + a.height - 360 - 24, te = r ? Math.min(Math.max(a.x, r.x), a.x + a.width - 300) : m, oe = r ? Math.min(Math.max(a.y, r.y), a.y + a.height - 360) : h;
  n.setBounds({ x: Math.round(te), y: Math.round(oe), width: 300, height: 360 });
}
function M() {
  !o || o.isDestroyed() || (o.setAlwaysOnTop(!0, "floating"), o.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function T() {
  if (o && !o.isDestroyed()) {
    o.isVisible() || o.showInactive(), M(), y && o.webContents.send("timer-state", y);
    return;
  }
  o = new N({
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
    icon: D() ?? void 0,
    webPreferences: {
      ...j,
      backgroundThrottling: !1
    }
  }), V(o), me(o), M(), $(o, "companion", { surface: "companion" }), o.once("ready-to-show", () => {
    o == null || o.showInactive(), M();
  }), o.webContents.on("did-finish-load", () => {
    y && o && !o.isDestroyed() && o.webContents.send("timer-state", y);
  }), o.on("moved", () => {
    K || fe();
  }), o.on("closed", () => {
    o = null;
  });
}
function ne() {
  o && !o.isDestroyed() && o.hide();
}
function U(n) {
  K = n;
  const e = { walking: n, facing: k };
  v && v.walking === e.walking && v.facing === e.facing || (v = e, o && !o.isDestroyed() && o.webContents.send("companion-walk", e));
}
function he() {
  if (!o || o.isDestroyed() || !o.isVisible()) return;
  if (W) {
    g && (o.setIgnoreMouseEvents(!1), g = !1);
    return;
  }
  const n = A.getCursorScreenPoint(), e = o.getBounds(), t = Z.some((r) => {
    const s = e.x + r.x, a = e.y + r.y;
    return n.x >= s && n.x <= s + r.width && n.y >= a && n.y <= a + r.height;
  });
  t !== !g && (g = !t, process.platform === "linux" ? o.setIgnoreMouseEvents(g) : o.setIgnoreMouseEvents(g, { forward: !0 }));
}
function pe() {
  I || (L = Date.now() + 1600, I = setInterval(() => {
    if (!o || o.isDestroyed() || !o.isVisible() || W || Y !== "idle") {
      U(!1);
      return;
    }
    const n = Date.now();
    if (n < L) {
      U(!1);
      return;
    }
    S <= 0 && (S = 280 + Math.round(Math.random() * 240), k = Math.random() > 0.5 ? 1 : -1);
    const e = o.getBounds(), t = A.getDisplayNearestPoint({ x: e.x, y: e.y }).workArea;
    let r = e.x + k * 4;
    r <= t.x + 8 && (r = t.x + 8, k = 1);
    const s = t.x + t.width - e.width - 8;
    r >= s && (r = s, k = -1), o.setPosition(Math.round(r), e.y), S -= 4, S <= 0 && (L = n + 5e3 + Math.round(Math.random() * 5e3)), U(!0);
  }, 140), setInterval(he, 40));
}
function we() {
  if (l && !l.isDestroyed()) {
    l.show(), l.focus();
    return;
  }
  l = new N({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    icon: D() ?? void 0,
    webPreferences: j
  }), V(l), $(l, "mini-timer", { surface: "mini" }), l.webContents.on("did-finish-load", () => {
    y && l && !l.isDestroyed() && l.webContents.send("timer-state", y);
  }), l.on("closed", () => {
    l = null;
  });
}
function be() {
  return new Promise((n) => {
    const e = (t) => {
      if (!t) {
        n(null);
        return;
      }
      const r = t.replace(/\s+/g, " ").trim();
      if (!r || /orion companion/i.test(r)) {
        n(null);
        return;
      }
      n(r.slice(0, 80));
    };
    if (process.platform === "darwin") {
      E(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (t, r) => e(t ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      E(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          `Add-Type -TypeDefinition 'using System; using System.Text; using System.Runtime.InteropServices; public class OrionForeground { [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count); }'; $handle = [OrionForeground]::GetForegroundWindow(); $builder = New-Object System.Text.StringBuilder 256; [void][OrionForeground]::GetWindowText($handle, $builder, 256); $builder.ToString()`
        ],
        { timeout: 2500 },
        (t, r) => e(t ? null : r)
      );
      return;
    }
    E("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (t, r) => {
      if (t || !r.trim()) {
        e(null);
        return;
      }
      const s = r.trim().split(" - ").map((a) => a.trim()).filter(Boolean);
      e(s[s.length - 1] ?? null);
    });
  });
}
function ye(n) {
  if (z = n, !n) {
    b && clearInterval(b), b = null;
    return;
  }
  b || (b = setInterval(() => {
    be().then((e) => {
      !z || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function q() {
  i = new N({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: D() ?? void 0,
    webPreferences: {
      ...j,
      backgroundThrottling: !1
    }
  }), V(i);
  const n = D();
  n && process.platform === "darwin" && d.dock && d.dock.setIcon(n), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (e) => {
    F || !O || (e.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !o || o.isDestroyed() || !o.isVisible() || (o.showInactive(), M());
  }), $(i, "app");
}
d.on("window-all-closed", () => {
  !O && process.platform !== "darwin" && (d.quit(), i = null);
});
d.on("activate", () => {
  !i || i.isDestroyed() ? q() : x();
});
d.on("before-quit", () => {
  F = !0;
});
d.on("will-quit", () => {
  G.unregisterAll(), b && clearInterval(b), I && clearInterval(I);
});
d.whenReady().then(() => {
  q(), ce(), T(), pe();
  try {
    G.register("CommandOrControl+Shift+Space", () => {
      x(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  ie.defaultSession.setPermissionRequestHandler((n, e, t) => {
    t(!1);
  }), u.on("update-tray-status", (n, e) => {
    c(n) && (R = B(e, 80) || "Ready", _());
  }), u.on("report-timer", (n, e) => {
    if (!c(n) || !e || e.session !== "focus" && e.session !== "break" || typeof e.remainingTime != "number" || !Number.isFinite(e.remainingTime)) return;
    y = e;
    const t = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${t}:${r.toString().padStart(2, "0")}`;
    R = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", _(), l && !l.isDestroyed() && l.webContents.send("timer-state", e), o && !o.isDestroyed() && o.webContents.send("timer-state", e);
  }), u.on("companion-activity", (n, e) => {
    c(n) && (((e == null ? void 0 : e.mode) === "idle" || (e == null ? void 0 : e.mode) === "focus" || (e == null ? void 0 : e.mode) === "break") && (Y = e.mode), W = !!(e != null && e.dragging));
  }), u.on("companion-nudge", (n, e, t) => {
    if (!o || o.isDestroyed() || n.sender.id !== o.webContents.id) return;
    const r = o;
    if (!Number.isFinite(e) || !Number.isFinite(t)) return;
    const s = r.getBounds(), a = A.getDisplayNearestPoint({ x: s.x, y: s.y }).workArea, m = Math.min(Math.max(a.x, s.x + e), a.x + a.width - s.width), h = Math.min(Math.max(a.y, s.y + t), a.y + a.height - s.height);
    r.setPosition(Math.round(m), Math.round(h));
  }), u.on("companion-hits", (n, e) => {
    !c(n) || !Array.isArray(e) || (Z = e.filter((t) => Number.isFinite(t == null ? void 0 : t.x) && Number.isFinite(t == null ? void 0 : t.y) && t.width > 0 && t.height > 0 && t.width < 2e3 && t.height < 2e3).slice(0, 12));
  }), u.on("companion-reminder-sync", (n) => {
    c(n) && i && !i.isDestroyed() && i.webContents.send("reminder-sync");
  }), u.on("companion-exit", (n) => {
    c(n) && (F = !0, d.quit());
  }), u.on("companion-show-main", (n) => {
    c(n) && x();
  }), u.on("companion-visibility", (n, e) => {
    c(n) && (e ? T() : ne(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e));
  }), u.on("mini-command", (n, e) => {
    c(n) && (e !== "start" && e !== "pause" && e !== "reset" || i == null || i.webContents.send("mini-command", e));
  }), u.on("watch-activity", (n, e) => {
    c(n) && ye(!!e);
  }), u.on("show-break-notification", (n) => {
    c(n) && new P({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), u.on("show-focus-notification", (n) => {
    c(n) && new P({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), u.on("show-reminder-notification", (n, e, t) => {
    if (!c(n)) return;
    const r = B(e, 80);
    r && new P({
      title: r,
      body: B(t, 180)
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
      const t = (await import("./index-BYV84ozA.js").then((s) => s.i)).default, r = new t({
        name: "Orion Companion",
        path: process.execPath
      });
      return e ? (await r.enable(), !0) : (await r.disable(), !1);
    } catch (t) {
      return console.error("Failed to toggle auto-launch:", t), !1;
    }
  }), w || (p.setFeedURL({
    url: "https://github.com/RohitSingh403/Orion-Companion/releases/latest",
    headers: { Accept: "application/json" }
  }), p.on("checking-for-update", () => {
    console.log("Checking for update...");
  }), p.on("update-available", (t) => {
    console.log("Update available:", t);
  }), p.on("update-not-available", (t) => {
    console.log("Update not available:", t);
  }), p.on("error", (t) => {
    console.error("Auto-updater error:", t);
  }), p.on("update-downloaded", (t) => {
    console.log("Update downloaded:", t), new P({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    p.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), p.checkForUpdates());
});
export {
  De as MAIN_DIST,
  Q as RENDERER_DIST,
  w as VITE_DEV_SERVER_URL
};
