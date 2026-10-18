import { app as f, globalShortcut as V, ipcMain as l, BrowserWindow as I, screen as O, Notification as C, autoUpdater as m, Tray as K, nativeImage as Z, Menu as ee } from "electron";
import { execFile as A } from "node:child_process";
import $ from "node:fs";
import { fileURLToPath as te } from "node:url";
import u from "node:path";
const R = u.dirname(te(import.meta.url));
f.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = u.join(R, "..");
const b = process.env.VITE_DEV_SERVER_URL, be = u.join(process.env.APP_ROOT, "dist-electron"), z = u.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = b ? u.join(process.env.APP_ROOT, "public") : z;
let i = null, c = null, t = null, q = "idle", L = !1, G = !1, M = null, g = -1, v = 0, E = 0, T = null, H = [], w = !1, x = null, F = !1, P = !1, S = "Ready", N = !1, h = null, p = null;
function ne() {
  const e = Buffer.alloc(1024);
  for (let o = 0; o < 16; o += 1)
    for (let r = 0; r < 16; r += 1) {
      const s = r - 7.5, a = o - 7.5;
      if (Math.sqrt(s * s + a * a) >= 6.5) continue;
      const d = (o * 16 + r) * 4;
      e[d] = 245, e[d + 1] = 215, e[d + 2] = 122, e[d + 3] = 255;
    }
  return Z.createFromBitmap(e, { width: 16, height: 16 });
}
function U(n, e, o = {}) {
  if (b) {
    const r = b.endsWith("/") ? b : `${b}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([a, d]) => s.searchParams.set(a, d)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(u.join(z, "index.html"), { query: o });
}
function y() {
  if (!i || i.isDestroyed()) {
    W();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function j() {
  x && (x.setToolTip(`Orion Companion — ${S}`), x.setContextMenu(
    ee.buildFromTemplate([
      { label: S, enabled: !1 },
      { label: "Show Orion", click: () => y() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => ce() },
      {
        label: t && !t.isDestroyed() && t.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          t && !t.isDestroyed() && t.isVisible() ? J() : k();
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
          i == null || i.hide(), k();
        }
      },
      {
        label: "Quit completely",
        click: () => {
          i == null || i.hide(), k();
        }
      },
      {
        label: "Exit Orion",
        click: () => {
          F = !0, f.quit();
        }
      }
    ])
  ));
}
function oe() {
  try {
    x = new K(ne()), P = !0, j(), x.on("click", () => y());
  } catch (n) {
    console.error("Tray unavailable:", n), P = !1;
  }
}
function X() {
  return u.join(f.getPath("userData"), "companion-position.json");
}
function ie() {
  try {
    const n = JSON.parse($.readFileSync(X(), "utf8"));
    if (typeof n.x == "number" && typeof n.y == "number") return { x: n.x, y: n.y };
  } catch {
    return null;
  }
  return null;
}
function re() {
  if (!t || t.isDestroyed()) return;
  const [n, e] = t.getPosition();
  try {
    $.writeFileSync(X(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function se(n) {
  const r = ie(), s = r ?? { x: 0, y: 0 }, a = O.getDisplayNearestPoint(s).workArea, d = a.x + a.width - 300 - 24, _ = a.y + a.height - 360 - 24, Q = r ? Math.min(Math.max(a.x, r.x), a.x + a.width - 300) : d, Y = r ? Math.min(Math.max(a.y, r.y), a.y + a.height - 360) : _;
  n.setBounds({ x: Math.round(Q), y: Math.round(Y), width: 300, height: 360 });
}
function D() {
  !t || t.isDestroyed() || (t.setAlwaysOnTop(!0, "floating"), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function k() {
  if (t && !t.isDestroyed()) {
    t.isVisible() || t.showInactive(), D(), p && t.webContents.send("timer-state", p);
    return;
  }
  t = new I({
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
      preload: u.join(R, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), se(t), D(), U(t, "companion", { surface: "companion" }), t.once("ready-to-show", () => {
    t == null || t.showInactive(), D();
  }), t.webContents.on("did-finish-load", () => {
    p && t && !t.isDestroyed() && t.webContents.send("timer-state", p);
  }), t.on("moved", () => {
    G || re();
  }), t.on("closed", () => {
    t = null;
  });
}
function J() {
  t && !t.isDestroyed() && t.hide();
}
function B(n) {
  G = n;
  const e = { walking: n, facing: g };
  T && T.walking === e.walking && T.facing === e.facing || (T = e, t && !t.isDestroyed() && t.webContents.send("companion-walk", e));
}
function ae() {
  if (!t || t.isDestroyed() || !t.isVisible()) return;
  if (L) {
    w && (t.setIgnoreMouseEvents(!1), w = !1);
    return;
  }
  const n = O.getCursorScreenPoint(), e = t.getBounds(), o = H.some((r) => {
    const s = e.x + r.x, a = e.y + r.y;
    return n.x >= s && n.x <= s + r.width && n.y >= a && n.y <= a + r.height;
  });
  o !== !w && (w = !o, process.platform === "linux" ? t.setIgnoreMouseEvents(w) : t.setIgnoreMouseEvents(w, { forward: !0 }));
}
function le() {
  M || (E = Date.now() + 1600, M = setInterval(() => {
    if (!t || t.isDestroyed() || !t.isVisible() || L || q !== "idle") {
      B(!1);
      return;
    }
    const n = Date.now();
    if (n < E) {
      B(!1);
      return;
    }
    v <= 0 && (v = 280 + Math.round(Math.random() * 240), g = Math.random() > 0.5 ? 1 : -1);
    const e = t.getBounds(), o = O.getDisplayNearestPoint({ x: e.x, y: e.y }).workArea;
    let r = e.x + g * 4;
    r <= o.x + 8 && (r = o.x + 8, g = 1);
    const s = o.x + o.width - e.width - 8;
    r >= s && (r = s, g = -1), t.setPosition(Math.round(r), e.y), v -= 4, v <= 0 && (E = n + 5e3 + Math.round(Math.random() * 5e3)), B(!0);
  }, 140), setInterval(ae, 40));
}
function ce() {
  if (c && !c.isDestroyed()) {
    c.show(), c.focus();
    return;
  }
  c = new I({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    webPreferences: {
      preload: u.join(R, "preload.mjs")
    }
  }), U(c, "mini-timer", { surface: "mini" }), c.webContents.on("did-finish-load", () => {
    p && c && !c.isDestroyed() && c.webContents.send("timer-state", p);
  }), c.on("closed", () => {
    c = null;
  });
}
function ue() {
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
      A(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      A(
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
    A("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, r) => {
      if (o || !r.trim()) {
        e(null);
        return;
      }
      const s = r.trim().split(" - ").map((a) => a.trim()).filter(Boolean);
      e(s[s.length - 1] ?? null);
    });
  });
}
function de(n) {
  if (N = n, !n) {
    h && clearInterval(h), h = null;
    return;
  }
  h || (h = setInterval(() => {
    ue().then((e) => {
      !N || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function W() {
  i = new I({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: u.join(process.env.VITE_PUBLIC, "orion.svg"),
    webPreferences: {
      preload: u.join(R, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (n) => {
    F || !P || (n.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !t || t.isDestroyed() || !t.isVisible() || (t.showInactive(), D());
  }), U(i, "app");
}
f.on("window-all-closed", () => {
  !P && process.platform !== "darwin" && (f.quit(), i = null);
});
f.on("activate", () => {
  !i || i.isDestroyed() ? W() : y();
});
f.on("before-quit", () => {
  F = !0;
});
f.on("will-quit", () => {
  V.unregisterAll(), h && clearInterval(h), M && clearInterval(M);
});
f.whenReady().then(() => {
  W(), oe(), k(), le();
  try {
    V.register("CommandOrControl+Shift+Space", () => {
      y(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  l.on("update-tray-status", (n, e) => {
    S = e || "Ready", j();
  }), l.on("report-timer", (n, e) => {
    if (!e) return;
    p = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${o}:${r.toString().padStart(2, "0")}`;
    S = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", j(), c && !c.isDestroyed() && c.webContents.send("timer-state", e), t && !t.isDestroyed() && t.webContents.send("timer-state", e);
  }), l.on("companion-activity", (n, e) => {
    ((e == null ? void 0 : e.mode) === "idle" || (e == null ? void 0 : e.mode) === "focus" || (e == null ? void 0 : e.mode) === "break") && (q = e.mode), L = !!(e != null && e.dragging);
  }), l.on("companion-nudge", (n, e, o) => {
    const r = I.fromWebContents(n.sender);
    if (!r || r.isDestroyed() || !Number.isFinite(e) || !Number.isFinite(o)) return;
    const s = r.getBounds(), a = O.getDisplayNearestPoint({ x: s.x, y: s.y }).workArea, d = Math.min(Math.max(a.x, s.x + e), a.x + a.width - s.width), _ = Math.min(Math.max(a.y, s.y + o), a.y + a.height - s.height);
    r.setPosition(Math.round(d), Math.round(_));
  }), l.on("companion-hits", (n, e) => {
    Array.isArray(e) && (H = e.filter(
      (o) => Number.isFinite(o.x) && Number.isFinite(o.y) && o.width > 0 && o.height > 0
    ));
  }), l.on("companion-reminder-sync", () => {
    i && !i.isDestroyed() && i.webContents.send("reminder-sync");
  }), l.on("companion-exit", () => {
    F = !0, f.quit();
  }), l.on("companion-show-main", () => {
    y();
  }), l.on("companion-visibility", (n, e) => {
    e ? k() : J(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e);
  }), l.on("mini-command", (n, e) => {
    i == null || i.webContents.send("mini-command", e);
  }), l.on("watch-activity", (n, e) => {
    de(!!e);
  }), l.on("show-break-notification", () => {
    new C({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), l.on("show-focus-notification", () => {
    new C({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), l.on("show-reminder-notification", (n, e, o) => {
    new C({
      title: `🔔 ${e}`,
      body: o
    }).show();
  }), l.handle("get-auto-launch-status", async () => {
    try {
      const n = (await import("./index-BYV84ozA.js").then((r) => r.i)).default;
      return await new n({
        name: "Orion Companion",
        path: process.execPath
      }).isEnabled();
    } catch (n) {
      return console.error("Failed to get auto-launch status:", n), !1;
    }
  }), l.handle("toggle-auto-launch", async (n, e) => {
    try {
      const o = (await import("./index-BYV84ozA.js").then((s) => s.i)).default, r = new o({
        name: "Orion Companion",
        path: process.execPath
      });
      return e ? (await r.enable(), !0) : (await r.disable(), !1);
    } catch (o) {
      return console.error("Failed to toggle auto-launch:", o), !1;
    }
  }), b || (m.setFeedURL({
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
    console.log("Update downloaded:", o), new C({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    m.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), m.checkForUpdates());
});
export {
  be as MAIN_DIST,
  z as RENDERER_DIST,
  b as VITE_DEV_SERVER_URL
};
