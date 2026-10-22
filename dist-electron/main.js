import { app as f, globalShortcut as X, session as se, ipcMain as u, screen as A, Notification as C, autoUpdater as T, BrowserWindow as j, Tray as ae, nativeImage as I, Menu as le } from "electron";
import { execFile as L } from "node:child_process";
import J from "node:fs";
import { fileURLToPath as Q } from "node:url";
import d from "node:path";
function ue(n, e, o) {
  let r;
  try {
    r = new URL(n);
  } catch {
    return !1;
  }
  if (r.protocol === "file:") {
    let s;
    try {
      s = Q(r);
    } catch {
      return !1;
    }
    const a = d.resolve(e), m = d.resolve(s);
    return m === a || m.startsWith(`${a}${d.sep}`);
  }
  if (r.protocol !== "http:" && r.protocol !== "https:" || !o) return !1;
  try {
    return r.origin === new URL(o).origin;
  } catch {
    return !1;
  }
}
const Y = d.dirname(Q(import.meta.url));
f.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = d.join(Y, "..");
const h = process.env.VITE_DEV_SERVER_URL, De = d.join(process.env.APP_ROOT, "dist-electron"), V = d.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = h ? d.join(process.env.APP_ROOT, "public") : V;
let i = null, l = null, t = null, K = "idle", $ = !1, Z = !1, ee = !1, S = null, g = -1, P = 0, _ = 0, D = null, ne = [], b = !1, x = null, E = !1, O = !1, v = "Ready", z = !1, p = null, w = null;
function R() {
  const n = I.createFromPath(d.join(process.env.VITE_PUBLIC, "icon.png"));
  return n.isEmpty() ? null : n;
}
function ce() {
  const n = process.env.VITE_PUBLIC;
  if (process.platform === "darwin") {
    const o = I.createFromPath(d.join(n, "trayTemplate.png"));
    if (!o.isEmpty())
      return o.setTemplateImage(!0), o;
  }
  const e = I.createFromPath(d.join(n, "tray.png"));
  return e.isEmpty() ? I.createEmpty() : e;
}
function U(n) {
  n.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  const e = (o, r) => {
    ue(r, V, h) || o.preventDefault();
  };
  n.webContents.on("will-navigate", e), n.webContents.on("will-redirect", e), n.webContents.on("will-attach-webview", (o) => {
    o.preventDefault();
  });
}
function c(n) {
  return [i, l, t].some((e) => e && !e.isDestroyed() && e.webContents.id === n.sender.id);
}
function B(n, e) {
  return typeof n != "string" ? "" : [...n].map((o) => {
    const r = o.charCodeAt(0);
    return r < 32 || r === 127 ? " " : o;
  }).join("").trim().slice(0, e);
}
const q = {
  preload: d.join(Y, "preload.mjs"),
  contextIsolation: !0,
  nodeIntegration: !1,
  sandbox: !0,
  webSecurity: !0
};
function G(n, e, o = {}) {
  if (h) {
    const r = h.endsWith("/") ? h : `${h}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([a, m]) => s.searchParams.set(a, m)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(d.join(V, "index.html"), { query: o });
}
function y() {
  if (!i || i.isDestroyed()) {
    H();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function W() {
  x && (x.setToolTip(`Orion Companion — ${v}`), x.setContextMenu(
    le.buildFromTemplate([
      { label: v, enabled: !1 },
      { label: "Show Orion", click: () => y() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => be() },
      {
        label: t && !t.isDestroyed() && t.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          t && !t.isDestroyed() && t.isVisible() ? oe() : k();
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
          E = !0, f.quit();
        }
      }
    ])
  ));
}
function de() {
  try {
    x = new ae(ce()), O = !0, W(), x.on("click", () => y());
  } catch (n) {
    console.error("Tray unavailable:", n), O = !1;
  }
}
function te() {
  return d.join(f.getPath("userData"), "companion-position.json");
}
function fe() {
  try {
    const n = JSON.parse(J.readFileSync(te(), "utf8"));
    if (typeof n.x == "number" && typeof n.y == "number") return { x: n.x, y: n.y };
  } catch {
    return null;
  }
  return null;
}
function me() {
  if (!t || t.isDestroyed()) return;
  const [n, e] = t.getPosition();
  try {
    J.writeFileSync(te(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function pe(n) {
  const r = fe(), s = r ?? { x: 0, y: 0 }, a = A.getDisplayNearestPoint(s).workArea, m = a.x + a.width - 300 - 24, F = a.y + a.height - 360 - 24, re = r ? Math.min(Math.max(a.x, r.x), a.x + a.width - 300) : m, ie = r ? Math.min(Math.max(a.y, r.y), a.y + a.height - 360) : F;
  n.setBounds({ x: Math.round(re), y: Math.round(ie), width: 300, height: 360 });
}
function M() {
  !t || t.isDestroyed() || (t.setAlwaysOnTop(!0, "floating"), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function k() {
  if (t && !t.isDestroyed()) {
    t.isVisible() || t.showInactive(), M(), w && t.webContents.send("timer-state", w);
    return;
  }
  t = new j({
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
      ...q,
      backgroundThrottling: !1
    }
  }), U(t), pe(t), M(), G(t, "companion", { surface: "companion" }), t.once("ready-to-show", () => {
    t == null || t.showInactive(), M();
  }), t.webContents.on("did-finish-load", () => {
    w && t && !t.isDestroyed() && t.webContents.send("timer-state", w);
  }), t.on("moved", () => {
    ee || me();
  }), t.on("closed", () => {
    t = null;
  });
}
function oe() {
  t && !t.isDestroyed() && t.hide();
}
function N(n) {
  ee = n;
  const e = { walking: n, facing: g };
  D && D.walking === e.walking && D.facing === e.facing || (D = e, t && !t.isDestroyed() && t.webContents.send("companion-walk", e));
}
function he() {
  if (!t || t.isDestroyed() || !t.isVisible()) return;
  if ($) {
    b && (t.setIgnoreMouseEvents(!1), b = !1);
    return;
  }
  const n = A.getCursorScreenPoint(), e = t.getBounds(), o = ne.some((r) => {
    const s = e.x + r.x, a = e.y + r.y;
    return n.x >= s && n.x <= s + r.width && n.y >= a && n.y <= a + r.height;
  });
  o !== !b && (b = !o, process.platform === "linux" ? t.setIgnoreMouseEvents(b) : t.setIgnoreMouseEvents(b, { forward: !0 }));
}
function we() {
  S || (_ = Date.now() + 1600, S = setInterval(() => {
    if (!t || t.isDestroyed() || !t.isVisible() || $ || Z || K !== "idle") {
      N(!1);
      return;
    }
    const n = Date.now();
    if (n < _) {
      N(!1);
      return;
    }
    P <= 0 && (P = 280 + Math.round(Math.random() * 240), g = Math.random() > 0.5 ? 1 : -1);
    const e = t.getBounds(), o = A.getDisplayNearestPoint({ x: e.x, y: e.y }).workArea;
    let r = e.x + g * 4;
    r <= o.x + 8 && (r = o.x + 8, g = 1);
    const s = o.x + o.width - e.width - 8;
    r >= s && (r = s, g = -1), t.setPosition(Math.round(r), e.y), P -= 4, P <= 0 && (_ = n + 1800 + Math.round(Math.random() * 1200)), N(!0);
  }, 140), setInterval(he, 40));
}
function be() {
  if (l && !l.isDestroyed()) {
    l.show(), l.focus();
    return;
  }
  l = new j({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    icon: R() ?? void 0,
    webPreferences: q
  }), U(l), G(l, "mini-timer", { surface: "mini" }), l.webContents.on("did-finish-load", () => {
    w && l && !l.isDestroyed() && l.webContents.send("timer-state", w);
  }), l.on("closed", () => {
    l = null;
  });
}
function ye() {
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
function ge(n) {
  if (z = n, !n) {
    p && clearInterval(p), p = null;
    return;
  }
  p || (p = setInterval(() => {
    ye().then((e) => {
      !z || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function H() {
  i = new j({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: R() ?? void 0,
    webPreferences: {
      ...q,
      backgroundThrottling: !1
    }
  }), U(i);
  const n = R();
  n && process.platform === "darwin" && f.dock && f.dock.setIcon(n), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (e) => {
    E || !O || (e.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !t || t.isDestroyed() || !t.isVisible() || (t.showInactive(), M());
  }), G(i, "app");
}
f.on("window-all-closed", () => {
  !O && process.platform !== "darwin" && (f.quit(), i = null);
});
f.on("activate", () => {
  !i || i.isDestroyed() ? H() : y();
});
f.on("before-quit", () => {
  E = !0;
});
f.on("will-quit", () => {
  X.unregisterAll(), p && clearInterval(p), S && clearInterval(S);
});
f.whenReady().then(() => {
  H(), de(), k(), we();
  try {
    X.register("CommandOrControl+Shift+Space", () => {
      y(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  if (se.defaultSession.setPermissionRequestHandler((n, e, o) => {
    o(!1);
  }), u.on("update-tray-status", (n, e) => {
    c(n) && (v = B(e, 80) || "Ready", W());
  }), u.on("report-timer", (n, e) => {
    if (!c(n) || !e || e.session !== "focus" && e.session !== "break" || typeof e.remainingTime != "number" || !Number.isFinite(e.remainingTime)) return;
    w = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${o}:${r.toString().padStart(2, "0")}`;
    v = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", W(), l && !l.isDestroyed() && l.webContents.send("timer-state", e), t && !t.isDestroyed() && t.webContents.send("timer-state", e);
  }), u.on("companion-activity", (n, e) => {
    c(n) && (((e == null ? void 0 : e.mode) === "idle" || (e == null ? void 0 : e.mode) === "focus" || (e == null ? void 0 : e.mode) === "break") && (K = e.mode), $ = !!(e != null && e.dragging), typeof (e == null ? void 0 : e.reduceMotion) == "boolean" && (Z = e.reduceMotion));
  }), u.on("companion-nudge", (n, e, o) => {
    if (!t || t.isDestroyed() || n.sender.id !== t.webContents.id) return;
    const r = t;
    if (!Number.isFinite(e) || !Number.isFinite(o)) return;
    const s = r.getBounds(), a = A.getDisplayNearestPoint({ x: s.x, y: s.y }).workArea, m = Math.min(Math.max(a.x, s.x + e), a.x + a.width - s.width), F = Math.min(Math.max(a.y, s.y + o), a.y + a.height - s.height);
    r.setPosition(Math.round(m), Math.round(F));
  }), u.on("companion-hits", (n, e) => {
    !c(n) || !Array.isArray(e) || (ne = e.filter((o) => Number.isFinite(o == null ? void 0 : o.x) && Number.isFinite(o == null ? void 0 : o.y) && o.width > 0 && o.height > 0 && o.width < 2e3 && o.height < 2e3).slice(0, 12));
  }), u.on("companion-reminder-sync", (n) => {
    c(n) && i && !i.isDestroyed() && i.webContents.send("reminder-sync");
  }), u.on("companion-exit", (n) => {
    c(n) && (E = !0, f.quit());
  }), u.on("companion-show-main", (n) => {
    c(n) && y();
  }), u.on("companion-visibility", (n, e) => {
    c(n) && (e ? k() : oe(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e));
  }), u.on("mini-command", (n, e) => {
    c(n) && (e !== "start" && e !== "pause" && e !== "reset" || i == null || i.webContents.send("mini-command", e));
  }), u.on("watch-activity", (n, e) => {
    c(n) && ge(!!e);
  }), u.on("show-break-notification", (n) => {
    c(n) && new C({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), u.on("show-focus-notification", (n) => {
    c(n) && new C({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), u.on("show-reminder-notification", (n, e, o) => {
    if (!c(n)) return;
    const r = B(e, 80);
    r && new C({
      title: r,
      body: B(o, 180)
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
  }), !h && process.platform !== "linux")
    try {
      T.setFeedURL({
        url: "https://github.com/RohitSingh403/Orion-Companion/releases/latest",
        headers: { Accept: "application/json" }
      }), T.on("error", (r) => {
        console.error("Auto-updater error:", r);
      }), T.on("update-downloaded", () => {
        new C({
          title: "Update Available",
          body: "A new version is ready to install. Restart to apply."
        }).show();
      });
      const o = () => {
        try {
          T.checkForUpdates();
        } catch (r) {
          console.error("Auto-updater unavailable:", r);
        }
      };
      setInterval(o, 4 * 60 * 60 * 1e3), o();
    } catch (n) {
      console.error("Auto-updater unavailable:", n);
    }
});
export {
  De as MAIN_DIST,
  V as RENDERER_DIST,
  h as VITE_DEV_SERVER_URL
};
