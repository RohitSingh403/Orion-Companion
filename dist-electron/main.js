import { protocol as K, app as d, globalShortcut as Z, dialog as de, session as fe, ipcMain as m, screen as B, Notification as D, BrowserWindow as H, net as me, Tray as pe, nativeImage as O, Menu as he } from "electron";
import { execFile as W } from "node:child_process";
import w from "node:fs";
import { fileURLToPath as ee, pathToFileURL as we } from "node:url";
import u from "node:path";
import te from "node:net";
function ye(t, r) {
  let o;
  try {
    o = new URL(r);
  } catch {
    return null;
  }
  if (o.protocol !== "app:" || o.hostname !== "orion" || r.split(/[?#]/, 1)[0].split("/").includes("..")) return null;
  const e = u.resolve(t);
  let n = "";
  try {
    n = decodeURIComponent(o.pathname).replace(/^\/+/, "");
  } catch {
    return null;
  }
  if (n.includes("\0")) return null;
  const s = u.resolve(e, n);
  return s !== e && !s.startsWith(`${e}${u.sep}`) ? null : s;
}
function be(t, r) {
  return r === "win32" ? "\\\\.\\pipe\\orion-companion-handoff" : u.join(t, "orion-handoff.sock");
}
function ge(t) {
  return `${JSON.stringify({
    execPath: t.execPath.slice(0, 400),
    version: t.version.slice(0, 40)
  })}
`;
}
function ke(t) {
  const r = t.trim().slice(0, 500);
  if (!r) return null;
  try {
    const o = JSON.parse(r);
    if (typeof o.execPath != "string" || typeof o.version != "string") return null;
    const e = o.execPath.trim(), n = o.version.trim();
    return !e || !n ? null : { execPath: e, version: n };
  } catch {
    return null;
  }
}
function xe(t, r) {
  const o = ke(r);
  return o && (o.execPath !== t.execPath || o.version !== t.version) ? "bye" : "stay";
}
function Pe(t) {
  return new Promise((r) => setTimeout(r, t));
}
async function Ce(t) {
  var r;
  t.platform !== "win32" && w.mkdirSync(u.dirname(t.socketPath), { recursive: !0 });
  for (let o = 0; o < 8; o += 1) {
    const e = await Se(t);
    if (e)
      return (r = t.onOwned) == null || r.call(t, () => ve(e, t.socketPath, t.platform)), "owner";
    const n = await Te(t.socketPath, t.incoming);
    if (n === "stay") return "visible";
    if (n === "absent" && t.platform !== "win32")
      try {
        w.unlinkSync(t.socketPath);
      } catch {
      }
    await Pe(250);
  }
  return "blocked";
}
function Se(t) {
  return new Promise((r) => {
    const o = te.createServer((n) => {
      let s = "";
      n.on("data", (l) => {
        if (s += l.toString("utf8"), !s.includes(`
`) && s.length < 600) return;
        const c = xe(t.incoming, s.slice(0, 600));
        n.end(c, () => {
          c === "bye" ? t.onReplace() : t.onFocus();
        });
      });
    }), e = (n) => {
      o.close(), r((n.code === "EADDRINUSE", null));
    };
    o.once("error", e), o.listen(t.socketPath, () => {
      if (o.off("error", e), t.platform !== "win32")
        try {
          w.chmodSync(t.socketPath, 384);
        } catch {
        }
      r(o);
    });
  });
}
function Te(t, r) {
  return new Promise((o) => {
    const e = te.connect(t);
    let n = "", s = !1;
    const l = (h) => {
      s || (s = !0, clearTimeout(c), e.destroy(), o(h));
    }, c = setTimeout(() => l("absent"), 1500);
    e.on("connect", () => e.end(ge(r))), e.on("data", (h) => {
      n += h.toString("utf8");
    }), e.on("close", () => l(n.includes("bye") ? "bye" : n.includes("stay") ? "stay" : "absent")), e.on("error", () => l("absent"));
  });
}
function ve(t, r, o) {
  return new Promise((e) => {
    t.close(() => {
      if (o !== "win32")
        try {
          w.unlinkSync(r);
        } catch {
        }
      e();
    });
  });
}
function Ie(t, r, o) {
  let e;
  try {
    e = new URL(t);
  } catch {
    return !1;
  }
  if (e.protocol === "app:") return e.hostname === "orion";
  if (e.protocol === "file:") {
    let n;
    try {
      n = ee(e);
    } catch {
      return !1;
    }
    const s = u.resolve(r), l = u.resolve(n);
    return l === s || l.startsWith(`${s}${u.sep}`);
  }
  if (e.protocol !== "http:" && e.protocol !== "https:" || !o) return !1;
  try {
    return e.origin === new URL(o).origin;
  } catch {
    return !1;
  }
}
K.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: { standard: !0, secure: !0, supportFetchAPI: !0, corsEnabled: !0 }
  }
]);
const ne = u.dirname(ee(import.meta.url));
d.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = u.join(ne, "..");
const b = process.env.VITE_DEV_SERVER_URL, Je = u.join(process.env.APP_ROOT, "dist-electron"), E = u.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = b ? u.join(process.env.APP_ROOT, "public") : E;
let a = null, f = null, i = null, re = "idle", G = !1, oe = !1, ie = !1, F = null, C = -1, v = 0, j = 0, I = null, se = [], P = !1, S = null, x = !1, L = !1, N = "Ready", Y = !1, y = null, g = null, ae = !1, M = null, R = null;
function _() {
  const t = O.createFromPath(u.join(process.env.VITE_PUBLIC, "icon.png"));
  return t.isEmpty() ? null : t;
}
function De() {
  const t = process.env.VITE_PUBLIC;
  if (process.platform === "darwin") {
    const o = O.createFromPath(u.join(t, "trayTemplate.png"));
    if (!o.isEmpty())
      return o.setTemplateImage(!0), o;
  }
  const r = O.createFromPath(u.join(t, "tray.png"));
  return r.isEmpty() ? O.createEmpty() : r;
}
function J(t) {
  t.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  const r = (o, e) => {
    Ie(e, E, b) || o.preventDefault();
  };
  t.webContents.on("will-navigate", r), t.webContents.on("will-redirect", r), t.webContents.on("will-attach-webview", (o) => {
    o.preventDefault();
  });
}
function p(t) {
  return [a, f, i].some((r) => r && !r.isDestroyed() && r.webContents.id === t.sender.id);
}
function V(t, r) {
  return typeof t != "string" ? "" : [...t].map((o) => {
    const e = o.charCodeAt(0);
    return e < 32 || e === 127 ? " " : o;
  }).join("").trim().slice(0, r);
}
const z = {
  preload: u.join(ne, "preload.mjs"),
  contextIsolation: !0,
  nodeIntegration: !1,
  sandbox: !0,
  webSecurity: !0
};
function Q(t, r, o = {}) {
  if (b) {
    const n = b.endsWith("/") ? b : `${b}/`, s = new URL(r.replace(/^\//, ""), n);
    Object.entries(o).forEach(([l, c]) => s.searchParams.set(l, c)), t.loadURL(s.toString());
    return;
  }
  const e = new URL(`app://orion/${r.replace(/^\//, "") || "app"}`);
  Object.entries(o).forEach(([n, s]) => e.searchParams.set(n, s)), t.loadURL(e.toString());
}
function k() {
  if (!a || a.isDestroyed()) {
    X();
    return;
  }
  a.isMinimized() && a.restore(), a.show(), a.focus();
}
function $() {
  S && (S.setToolTip(`Orion Companion — ${N}`), S.setContextMenu(
    he.buildFromTemplate([
      { label: N, enabled: !1 },
      { label: "Show Orion", click: () => k() },
      { label: "Start focus", click: () => a == null ? void 0 : a.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => a == null ? void 0 : a.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => Le() },
      {
        label: i && !i.isDestroyed() && i.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          i && !i.isDestroyed() && i.isVisible() ? ce() : T();
        }
      },
      {
        label: "Quick add",
        click: () => {
          k(), a == null || a.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      ...ae ? [{
        label: "Install update and restart",
        click: () => M == null ? void 0 : M()
      }] : [],
      {
        label: "Restart Orion",
        click: () => {
          d.relaunch(), x = !0, d.quit();
        }
      },
      {
        label: "Close dashboard",
        click: () => {
          a == null || a.hide(), T();
        }
      },
      {
        label: "Quit completely",
        click: () => {
          a == null || a.hide(), T();
        }
      },
      {
        label: "Exit Orion",
        click: () => {
          x = !0, d.quit();
        }
      }
    ])
  ));
}
function Oe() {
  try {
    S = new pe(De()), L = !0, $(), S.on("click", () => k());
  } catch (t) {
    console.error("Tray unavailable:", t), L = !1;
  }
}
function le() {
  return u.join(d.getPath("userData"), "companion-position.json");
}
function Me() {
  try {
    const t = JSON.parse(w.readFileSync(le(), "utf8"));
    if (typeof t.x == "number" && typeof t.y == "number") return { x: t.x, y: t.y };
  } catch {
    return null;
  }
  return null;
}
function Re() {
  if (!i || i.isDestroyed()) return;
  const [t, r] = i.getPosition();
  try {
    w.writeFileSync(le(), JSON.stringify({ x: t, y: r }));
  } catch {
  }
}
function Ae(t) {
  const e = Me(), n = e ?? { x: 0, y: 0 }, s = B.getDisplayNearestPoint(n).workArea, l = s.x + s.width - 300 - 24, c = s.y + s.height - 360 - 24, h = e ? Math.min(Math.max(s.x, e.x), s.x + s.width - 300) : l, U = e ? Math.min(Math.max(s.y, e.y), s.y + s.height - 360) : c;
  t.setBounds({ x: Math.round(h), y: Math.round(U), width: 300, height: 360 });
}
function A() {
  !i || i.isDestroyed() || (i.setAlwaysOnTop(!0, "floating"), i.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
}
function T() {
  if (i && !i.isDestroyed()) {
    i.isVisible() || i.showInactive(), A(), g && i.webContents.send("timer-state", g);
    return;
  }
  i = new H({
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
    icon: _() ?? void 0,
    webPreferences: {
      ...z,
      backgroundThrottling: !1
    }
  }), J(i), Ae(i), A(), Q(i, "companion", { surface: "companion" }), i.once("ready-to-show", () => {
    i == null || i.showInactive(), A();
  }), i.webContents.on("did-finish-load", () => {
    g && i && !i.isDestroyed() && i.webContents.send("timer-state", g);
  }), i.on("moved", () => {
    ie || Re();
  }), i.on("closed", () => {
    i = null;
  });
}
function ce() {
  i && !i.isDestroyed() && i.hide();
}
function q(t) {
  ie = t;
  const r = { walking: t, facing: C };
  I && I.walking === r.walking && I.facing === r.facing || (I = r, i && !i.isDestroyed() && i.webContents.send("companion-walk", r));
}
function Ee() {
  if (!i || i.isDestroyed() || !i.isVisible()) return;
  if (G) {
    P && (i.setIgnoreMouseEvents(!1), P = !1);
    return;
  }
  const t = B.getCursorScreenPoint(), r = i.getBounds(), o = se.some((e) => {
    const n = r.x + e.x, s = r.y + e.y;
    return t.x >= n && t.x <= n + e.width && t.y >= s && t.y <= s + e.height;
  });
  o !== !P && (P = !o, process.platform === "linux" ? i.setIgnoreMouseEvents(P) : i.setIgnoreMouseEvents(P, { forward: !0 }));
}
function Fe() {
  F || (j = Date.now() + 1600, F = setInterval(() => {
    if (!i || i.isDestroyed() || !i.isVisible() || G || oe || re !== "idle") {
      q(!1);
      return;
    }
    const t = Date.now();
    if (t < j) {
      q(!1);
      return;
    }
    v <= 0 && (v = 280 + Math.round(Math.random() * 240), C = Math.random() > 0.5 ? 1 : -1);
    const r = i.getBounds(), o = B.getDisplayNearestPoint({ x: r.x, y: r.y }).workArea;
    let e = r.x + C * 4;
    e <= o.x + 8 && (e = o.x + 8, C = 1);
    const n = o.x + o.width - r.width - 8;
    e >= n && (e = n, C = -1), i.setPosition(Math.round(e), r.y), v -= 4, v <= 0 && (j = t + 1800 + Math.round(Math.random() * 1200)), q(!0);
  }, 140), setInterval(Ee, 40));
}
function Le() {
  if (f && !f.isDestroyed()) {
    f.show(), f.focus();
    return;
  }
  f = new H({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    icon: _() ?? void 0,
    webPreferences: z
  }), J(f), Q(f, "mini-timer", { surface: "mini" }), f.webContents.on("did-finish-load", () => {
    g && f && !f.isDestroyed() && f.webContents.send("timer-state", g);
  }), f.on("closed", () => {
    f = null;
  });
}
function Ne() {
  return new Promise((t) => {
    const r = (o) => {
      if (!o) {
        t(null);
        return;
      }
      const e = o.replace(/\s+/g, " ").trim();
      if (!e || /orion companion/i.test(e)) {
        t(null);
        return;
      }
      t(e.slice(0, 80));
    };
    if (process.platform === "darwin") {
      W(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, e) => r(o ? null : e)
      );
      return;
    }
    if (process.platform === "win32") {
      W(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          `Add-Type -TypeDefinition 'using System; using System.Text; using System.Runtime.InteropServices; public class OrionForeground { [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count); }'; $handle = [OrionForeground]::GetForegroundWindow(); $builder = New-Object System.Text.StringBuilder 256; [void][OrionForeground]::GetWindowText($handle, $builder, 256); $builder.ToString()`
        ],
        { timeout: 2500 },
        (o, e) => r(o ? null : e)
      );
      return;
    }
    W("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, e) => {
      if (o || !e.trim()) {
        r(null);
        return;
      }
      const n = e.trim().split(" - ").map((s) => s.trim()).filter(Boolean);
      r(n[n.length - 1] ?? null);
    });
  });
}
function _e(t) {
  if (Y = t, !t) {
    y && clearInterval(y), y = null;
    return;
  }
  y || (y = setInterval(() => {
    Ne().then((r) => {
      !Y || !r || !a || a.isDestroyed() || a.webContents.send("activity-sample", r);
    });
  }, 15e3));
}
function X() {
  a = new H({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: _() ?? void 0,
    webPreferences: {
      ...z,
      backgroundThrottling: !1
    }
  }), J(a);
  const t = _();
  t && process.platform === "darwin" && d.dock && d.dock.setIcon(t), a.webContents.on("did-finish-load", () => {
    a == null || a.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), a.on("close", (r) => {
    x || !L || (r.preventDefault(), a == null || a.hide());
  }), a.on("hide", () => {
    !i || i.isDestroyed() || !i.isVisible() || (i.showInactive(), A());
  }), Q(a, "app");
}
d.on("window-all-closed", () => {
  !L && process.platform !== "darwin" && (d.quit(), a = null);
});
d.on("activate", () => {
  !a || a.isDestroyed() ? X() : k();
});
d.on("before-quit", () => {
  x = !0;
});
d.on("will-quit", () => {
  Z.unregisterAll(), y && clearInterval(y), F && clearInterval(F), R == null || R();
});
function $e() {
  K.handle("app", (t) => {
    const r = ye(E, t.url);
    if (!r) return new Response("forbidden", { status: 403 });
    const o = w.existsSync(r) && w.statSync(r).isFile() ? r : u.join(E, "index.html");
    return me.fetch(we(o).toString());
  });
}
function Be() {
  return { execPath: process.execPath, version: d.getVersion() };
}
async function Ue() {
  if (!b)
    try {
      const r = (await import("electron-updater")).autoUpdater;
      if (!r) return;
      r.autoDownload = !0, r.autoInstallOnAppQuit = !0, r.on("error", (...e) => {
        console.error("Auto-updater unavailable:", e[0]);
      }), r.on("update-downloaded", () => {
        ae = !0, M = () => {
          x = !0, r.quitAndInstall(!1, !0);
        }, $(), new D({
          title: "Update ready",
          body: "Install update and restart is in the tray menu."
        }).show();
      });
      const o = () => {
        r.checkForUpdates().catch((e) => {
          console.error("Auto-updater unavailable:", e);
        });
      };
      setInterval(o, 4 * 60 * 60 * 1e3), o();
    } catch (t) {
      console.error("Auto-updater unavailable:", t);
    }
}
d.whenReady().then(async () => {
  const t = be(d.getPath("userData"), process.platform), r = Be(), o = await Ce({
    socketPath: t,
    platform: process.platform,
    incoming: r,
    onFocus: () => k(),
    onReplace: () => {
      x = !0, d.quit();
    },
    onOwned: (e) => {
      R = e;
    }
  });
  if (o !== "owner") {
    o === "blocked" && de.showErrorBox("Orion is already open", "Choose Exit Orion in the tray, then open Orion again."), d.quit();
    return;
  }
  $e(), X(), Oe(), T(), Fe();
  try {
    Z.register("CommandOrControl+Shift+Space", () => {
      k(), a == null || a.webContents.send("global-shortcut-quick-capture");
    });
  } catch (e) {
    console.error("Shortcut unavailable:", e);
  }
  fe.defaultSession.setPermissionRequestHandler((e, n, s) => {
    s(!1);
  }), m.on("update-tray-status", (e, n) => {
    p(e) && (N = V(n, 80) || "Ready", $());
  }), m.on("report-timer", (e, n) => {
    if (!p(e) || !n || n.session !== "focus" && n.session !== "break" || typeof n.remainingTime != "number" || !Number.isFinite(n.remainingTime)) return;
    g = n;
    const s = Math.floor(n.remainingTime / 60), l = n.remainingTime % 60, c = `${s}:${l.toString().padStart(2, "0")}`;
    N = n.running ? `${n.session === "focus" ? "Focus" : "Break"} ${c}` : "Ready", $(), f && !f.isDestroyed() && f.webContents.send("timer-state", n), i && !i.isDestroyed() && i.webContents.send("timer-state", n);
  }), m.on("companion-activity", (e, n) => {
    p(e) && (((n == null ? void 0 : n.mode) === "idle" || (n == null ? void 0 : n.mode) === "focus" || (n == null ? void 0 : n.mode) === "break") && (re = n.mode), G = !!(n != null && n.dragging), typeof (n == null ? void 0 : n.reduceMotion) == "boolean" && (oe = n.reduceMotion));
  }), m.on("companion-nudge", (e, n, s) => {
    if (!i || i.isDestroyed() || e.sender.id !== i.webContents.id) return;
    const l = i;
    if (!Number.isFinite(n) || !Number.isFinite(s)) return;
    const c = l.getBounds(), h = B.getDisplayNearestPoint({ x: c.x, y: c.y }).workArea, U = Math.min(Math.max(h.x, c.x + n), h.x + h.width - c.width), ue = Math.min(Math.max(h.y, c.y + s), h.y + h.height - c.height);
    l.setPosition(Math.round(U), Math.round(ue));
  }), m.on("companion-hits", (e, n) => {
    !p(e) || !Array.isArray(n) || (se = n.filter((s) => Number.isFinite(s == null ? void 0 : s.x) && Number.isFinite(s == null ? void 0 : s.y) && s.width > 0 && s.height > 0 && s.width < 2e3 && s.height < 2e3).slice(0, 12));
  }), m.on("companion-reminder-sync", (e) => {
    p(e) && a && !a.isDestroyed() && a.webContents.send("reminder-sync");
  }), m.on("companion-exit", (e) => {
    p(e) && (x = !0, d.quit());
  }), m.on("companion-show-main", (e) => {
    p(e) && k();
  }), m.on("companion-visibility", (e, n) => {
    p(e) && (n ? T() : ce(), a && !a.isDestroyed() && a.webContents.send("companion-visibility", !!n));
  }), m.on("mini-command", (e, n) => {
    p(e) && (n !== "start" && n !== "pause" && n !== "reset" || a == null || a.webContents.send("mini-command", n));
  }), m.on("watch-activity", (e, n) => {
    p(e) && _e(!!n);
  }), m.on("show-break-notification", (e) => {
    p(e) && new D({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), m.on("show-focus-notification", (e) => {
    p(e) && new D({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), m.on("show-reminder-notification", (e, n, s) => {
    if (!p(e)) return;
    const l = V(n, 80);
    l && new D({
      title: l,
      body: V(s, 180)
    }).show();
  }), m.handle("get-auto-launch-status", async (e) => {
    if (!p(e)) return !1;
    try {
      const n = (await import("./index-BYV84ozA.js").then((c) => c.i)).default;
      return await new n({
        name: "Orion Companion",
        path: process.execPath
      }).isEnabled();
    } catch (n) {
      return console.error("Failed to get auto-launch status:", n), !1;
    }
  }), m.handle("toggle-auto-launch", async (e, n) => {
    if (!p(e)) return !1;
    try {
      const s = (await import("./index-BYV84ozA.js").then((c) => c.i)).default, l = new s({
        name: "Orion Companion",
        path: process.execPath
      });
      return n ? (await l.enable(), !0) : (await l.disable(), !1);
    } catch (s) {
      return console.error("Failed to toggle auto-launch:", s), !1;
    }
  }), Ue();
});
export {
  Je as MAIN_DIST,
  E as RENDERER_DIST,
  b as VITE_DEV_SERVER_URL
};
