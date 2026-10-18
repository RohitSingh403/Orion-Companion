import { app as f, globalShortcut as U, ipcMain as c, BrowserWindow as k, screen as E, Notification as x, autoUpdater as m, Tray as Q, nativeImage as Y, Menu as K } from "electron";
import { execFile as R } from "node:child_process";
import V from "node:fs";
import { fileURLToPath as Z } from "node:url";
import u from "node:path";
const O = u.dirname(Z(import.meta.url));
f.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = u.join(O, "..");
const w = process.env.VITE_DEV_SERVER_URL, he = u.join(process.env.APP_ROOT, "dist-electron"), $ = u.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = w ? u.join(process.env.APP_ROOT, "public") : $;
let i = null, l = null, t = null, N = "idle", z = !1, q = !1, v = null, g = -1, C = 0, _ = 0, T = null, y = null, B = !1, P = !1, S = "Ready", W = !1, h = null, p = null;
function ee() {
  const e = Buffer.alloc(1024);
  for (let o = 0; o < 16; o += 1)
    for (let r = 0; r < 16; r += 1) {
      const a = r - 7.5, s = o - 7.5;
      if (Math.sqrt(a * a + s * s) >= 6.5) continue;
      const d = (o * 16 + r) * 4;
      e[d] = 245, e[d + 1] = 215, e[d + 2] = 122, e[d + 3] = 255;
    }
  return Y.createFromBitmap(e, { width: 16, height: 16 });
}
function j(n, e, o = {}) {
  if (w) {
    const r = w.endsWith("/") ? w : `${w}/`, a = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([s, d]) => a.searchParams.set(s, d)), n.loadURL(a.toString());
    return;
  }
  n.loadFile(u.join($, "index.html"), { query: o });
}
function b() {
  if (!i || i.isDestroyed()) {
    L();
    return;
  }
  i.isMinimized() && i.restore(), i.show(), i.focus();
}
function A() {
  y && (y.setToolTip(`Orion Companion — ${S}`), y.setContextMenu(
    K.buildFromTemplate([
      { label: S, enabled: !1 },
      { label: "Show Orion", click: () => b() },
      { label: "Start focus", click: () => i == null ? void 0 : i.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => i == null ? void 0 : i.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => ae() },
      {
        label: t && !t.isDestroyed() && t.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          t && !t.isDestroyed() && t.isVisible() ? H() : M();
        }
      },
      {
        label: "Quick add",
        click: () => {
          b(), i == null || i.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      {
        label: "Close dashboard",
        click: () => {
          i == null || i.hide(), M();
        }
      },
      {
        label: "Quit completely",
        click: () => {
          B = !0, f.quit();
        }
      }
    ])
  ));
}
function te() {
  try {
    y = new Q(ee()), P = !0, A(), y.on("click", () => b());
  } catch (n) {
    console.error("Tray unavailable:", n), P = !1;
  }
}
function G() {
  return u.join(f.getPath("userData"), "companion-position.json");
}
function ne() {
  try {
    const n = JSON.parse(V.readFileSync(G(), "utf8"));
    if (typeof n.x == "number" && typeof n.y == "number") return { x: n.x, y: n.y };
  } catch {
    return null;
  }
  return null;
}
function oe() {
  if (!t || t.isDestroyed()) return;
  const [n, e] = t.getPosition();
  try {
    V.writeFileSync(G(), JSON.stringify({ x: n, y: e }));
  } catch {
  }
}
function ie(n) {
  const r = ne(), a = r ?? { x: 0, y: 0 }, s = E.getDisplayNearestPoint(a).workArea, d = s.x + s.width - 300 - 24, I = s.y + s.height - 360 - 24, X = r ? Math.min(Math.max(s.x, r.x), s.x + s.width - 300) : d, J = r ? Math.min(Math.max(s.y, r.y), s.y + s.height - 360) : I;
  n.setBounds({ x: Math.round(X), y: Math.round(J), width: 300, height: 360 });
}
function D() {
  !t || t.isDestroyed() || (t.setAlwaysOnTop(!0, "floating"), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function M() {
  if (t && !t.isDestroyed()) {
    t.isVisible() || t.showInactive(), D(), p && t.webContents.send("timer-state", p);
    return;
  }
  t = new k({
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
      preload: u.join(O, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), ie(t), D(), j(t, "companion", { surface: "companion" }), t.once("ready-to-show", () => {
    t == null || t.showInactive(), D();
  }), t.webContents.on("did-finish-load", () => {
    p && t && !t.isDestroyed() && t.webContents.send("timer-state", p);
  }), t.on("moved", () => {
    q || oe();
  }), t.on("closed", () => {
    t = null;
  });
}
function H() {
  t && !t.isDestroyed() && t.hide();
}
function F(n) {
  q = n;
  const e = { walking: n, facing: g };
  T && T.walking === e.walking && T.facing === e.facing || (T = e, t && !t.isDestroyed() && t.webContents.send("companion-walk", e));
}
function re() {
  v || (_ = Date.now() + 1600, v = setInterval(() => {
    if (!t || t.isDestroyed() || !t.isVisible() || z || N !== "idle") {
      F(!1);
      return;
    }
    const n = Date.now();
    if (n < _) {
      F(!1);
      return;
    }
    C <= 0 && (C = 280 + Math.round(Math.random() * 240), g = Math.random() > 0.5 ? 1 : -1);
    const e = t.getBounds(), o = E.getDisplayNearestPoint({ x: e.x, y: e.y }).workArea;
    let r = e.x + g * 4;
    r <= o.x + 8 && (r = o.x + 8, g = 1);
    const a = o.x + o.width - e.width - 8;
    r >= a && (r = a, g = -1), t.setPosition(Math.round(r), e.y), C -= 4, C <= 0 && (_ = n + 5e3 + Math.round(Math.random() * 5e3)), F(!0);
  }, 140));
}
function ae() {
  if (l && !l.isDestroyed()) {
    l.show(), l.focus();
    return;
  }
  l = new k({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    webPreferences: {
      preload: u.join(O, "preload.mjs")
    }
  }), j(l, "mini-timer", { surface: "mini" }), l.webContents.on("did-finish-load", () => {
    p && l && !l.isDestroyed() && l.webContents.send("timer-state", p);
  }), l.on("closed", () => {
    l = null;
  });
}
function se() {
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
      R(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      R(
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
    R("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, r) => {
      if (o || !r.trim()) {
        e(null);
        return;
      }
      const a = r.trim().split(" - ").map((s) => s.trim()).filter(Boolean);
      e(a[a.length - 1] ?? null);
    });
  });
}
function le(n) {
  if (W = n, !n) {
    h && clearInterval(h), h = null;
    return;
  }
  h || (h = setInterval(() => {
    se().then((e) => {
      !W || !e || !i || i.isDestroyed() || i.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function L() {
  i = new k({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: u.join(process.env.VITE_PUBLIC, "orion.svg"),
    webPreferences: {
      preload: u.join(O, "preload.mjs"),
      backgroundThrottling: !1
    }
  }), i.webContents.on("did-finish-load", () => {
    i == null || i.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i.on("close", (n) => {
    B || !P || (n.preventDefault(), i == null || i.hide());
  }), i.on("hide", () => {
    !t || t.isDestroyed() || !t.isVisible() || (t.showInactive(), D());
  }), j(i, "app");
}
f.on("window-all-closed", () => {
  !P && process.platform !== "darwin" && (f.quit(), i = null);
});
f.on("activate", () => {
  !i || i.isDestroyed() ? L() : b();
});
f.on("before-quit", () => {
  B = !0;
});
f.on("will-quit", () => {
  U.unregisterAll(), h && clearInterval(h), v && clearInterval(v);
});
f.whenReady().then(() => {
  L(), te(), M(), re();
  try {
    U.register("CommandOrControl+Shift+Space", () => {
      b(), i == null || i.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  c.on("update-tray-status", (n, e) => {
    S = e || "Ready", A();
  }), c.on("report-timer", (n, e) => {
    if (!e) return;
    p = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, a = `${o}:${r.toString().padStart(2, "0")}`;
    S = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${a}` : "Ready", A(), l && !l.isDestroyed() && l.webContents.send("timer-state", e), t && !t.isDestroyed() && t.webContents.send("timer-state", e);
  }), c.on("companion-activity", (n, e) => {
    ((e == null ? void 0 : e.mode) === "idle" || (e == null ? void 0 : e.mode) === "focus" || (e == null ? void 0 : e.mode) === "break") && (N = e.mode), z = !!(e != null && e.dragging);
  }), c.on("companion-nudge", (n, e, o) => {
    const r = k.fromWebContents(n.sender);
    if (!r || r.isDestroyed() || !Number.isFinite(e) || !Number.isFinite(o)) return;
    const a = r.getBounds(), s = E.getDisplayNearestPoint({ x: a.x, y: a.y }).workArea, d = Math.min(Math.max(s.x, a.x + e), s.x + s.width - a.width), I = Math.min(Math.max(s.y, a.y + o), s.y + s.height - a.height);
    r.setPosition(Math.round(d), Math.round(I));
  }), c.on("companion-mouse-passthrough", (n, e) => {
    if (process.platform === "linux") return;
    const o = k.fromWebContents(n.sender);
    !o || o.isDestroyed() || o.setIgnoreMouseEvents(!!e, { forward: !0 });
  }), c.on("companion-show-main", () => {
    b();
  }), c.on("companion-visibility", (n, e) => {
    e ? M() : H(), i && !i.isDestroyed() && i.webContents.send("companion-visibility", !!e);
  }), c.on("mini-command", (n, e) => {
    i == null || i.webContents.send("mini-command", e);
  }), c.on("watch-activity", (n, e) => {
    le(!!e);
  }), c.on("show-break-notification", () => {
    new x({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), c.on("show-focus-notification", () => {
    new x({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), c.on("show-reminder-notification", (n, e, o) => {
    new x({
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
      const o = (await import("./index-BYV84ozA.js").then((a) => a.i)).default, r = new o({
        name: "Orion Companion",
        path: process.execPath
      });
      return e ? (await r.enable(), !0) : (await r.disable(), !1);
    } catch (o) {
      return console.error("Failed to toggle auto-launch:", o), !1;
    }
  }), w || (m.setFeedURL({
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
    console.log("Update downloaded:", o), new x({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    m.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), m.checkForUpdates());
});
export {
  he as MAIN_DIST,
  $ as RENDERER_DIST,
  w as VITE_DEV_SERVER_URL
};
