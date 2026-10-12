import { app as d, globalShortcut as F, ipcMain as l, Notification as g, autoUpdater as u, BrowserWindow as D, Tray as A, screen as L, nativeImage as j, Menu as U } from "electron";
import { execFile as k } from "node:child_process";
import { fileURLToPath as M } from "node:url";
import c from "node:path";
const C = c.dirname(M(import.meta.url));
d.commandLine.appendSwitch("force-gpu-mem-available-mb", "1024");
process.env.APP_ROOT = c.join(C, "..");
const w = process.env.VITE_DEV_SERVER_URL, Q = c.join(process.env.APP_ROOT, "dist-electron"), x = c.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = w ? c.join(process.env.APP_ROOT, "public") : x;
let t = null, a = null, i = null, y = null, P = !1, v = !1, T = "Ready", I = !1, f = null, m = null;
function $() {
  const e = Buffer.alloc(1024);
  for (let o = 0; o < 16; o += 1)
    for (let r = 0; r < 16; r += 1) {
      const s = r - 7.5, p = o - 7.5;
      if (Math.sqrt(s * s + p * p) >= 6.5) continue;
      const h = (o * 16 + r) * 4;
      e[h] = 245, e[h + 1] = 215, e[h + 2] = 122, e[h + 3] = 255;
    }
  return j.createFromBitmap(e, { width: 16, height: 16 });
}
function O(n, e, o = {}) {
  if (w) {
    const r = w.endsWith("/") ? w : `${w}/`, s = new URL(e.replace(/^\//, ""), r);
    Object.entries(o).forEach(([p, h]) => s.searchParams.set(p, h)), n.loadURL(s.toString());
    return;
  }
  n.loadFile(c.join(x, "index.html"), { query: o });
}
function b() {
  if (!t || t.isDestroyed()) {
    _();
    return;
  }
  t.isMinimized() && t.restore(), t.show(), t.focus();
}
function S() {
  y && (y.setToolTip(`Orion Companion — ${T}`), y.setContextMenu(
    U.buildFromTemplate([
      { label: T, enabled: !1 },
      { label: "Show Orion", click: () => b() },
      { label: "Start focus", click: () => t == null ? void 0 : t.webContents.send("tray-start-focus") },
      { label: "Pause", click: () => t == null ? void 0 : t.webContents.send("tray-pause-focus") },
      { label: "Mini timer", click: () => z() },
      {
        label: i && !i.isDestroyed() && i.isVisible() ? "Hide companion" : "Show companion",
        click: () => {
          i && !i.isDestroyed() && i.isVisible() ? E() : R();
        }
      },
      {
        label: "Quick add",
        click: () => {
          b(), t == null || t.webContents.send("tray-quick-add-task");
        }
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          P = !0, d.quit();
        }
      }
    ])
  ));
}
function B() {
  try {
    y = new A($()), v = !0, S(), y.on("click", () => b());
  } catch (n) {
    console.error("Tray unavailable:", n), v = !1;
  }
}
function R() {
  if (i && !i.isDestroyed()) {
    i.isVisible() || i.showInactive(), m && i.webContents.send("timer-state", m);
    return;
  }
  const n = L.getPrimaryDisplay().workArea, e = 260, o = 280;
  i = new D({
    width: e,
    height: o,
    x: n.x + n.width - e - 24,
    y: n.y + n.height - o - 24,
    frame: !1,
    transparent: !0,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    title: "Orion Companion",
    backgroundColor: "#00000000",
    webPreferences: {
      preload: c.join(C, "preload.mjs")
    }
  }), O(i, "companion", { surface: "companion" }), i.once("ready-to-show", () => i == null ? void 0 : i.showInactive()), i.webContents.on("did-finish-load", () => {
    m && i && !i.isDestroyed() && i.webContents.send("timer-state", m);
  }), i.on("closed", () => {
    i = null;
  });
}
function E() {
  i && !i.isDestroyed() && i.hide();
}
function z() {
  if (a && !a.isDestroyed()) {
    a.show(), a.focus();
    return;
  }
  a = new D({
    width: 280,
    height: 188,
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    title: "Orion Mini Timer",
    backgroundColor: "#121418",
    webPreferences: {
      preload: c.join(C, "preload.mjs")
    }
  }), O(a, "mini-timer", { surface: "mini" }), a.webContents.on("did-finish-load", () => {
    m && a && !a.isDestroyed() && a.webContents.send("timer-state", m);
  }), a.on("closed", () => {
    a = null;
  });
}
function V() {
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
      k(
        "osascript",
        ["-e", 'tell application "System Events" to get name of first application process whose frontmost is true'],
        { timeout: 2e3 },
        (o, r) => e(o ? null : r)
      );
      return;
    }
    if (process.platform === "win32") {
      k(
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
    k("xdotool", ["getactivewindow", "getwindowname"], { timeout: 2e3 }, (o, r) => {
      if (o || !r.trim()) {
        e(null);
        return;
      }
      const s = r.trim().split(" - ").map((p) => p.trim()).filter(Boolean);
      e(s[s.length - 1] ?? null);
    });
  });
}
function W(n) {
  if (I = n, !n) {
    f && clearInterval(f), f = null;
    return;
  }
  f || (f = setInterval(() => {
    V().then((e) => {
      !I || !e || !t || t.isDestroyed() || t.webContents.send("activity-sample", e);
    });
  }, 15e3));
}
function _() {
  t = new D({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    title: "Orion Companion",
    backgroundColor: "#121418",
    autoHideMenuBar: !0,
    icon: c.join(process.env.VITE_PUBLIC, "orion.svg"),
    webPreferences: {
      preload: c.join(C, "preload.mjs")
    }
  }), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), t.on("close", (n) => {
    P || !v || (n.preventDefault(), t == null || t.hide());
  }), O(t, "app");
}
d.on("window-all-closed", () => {
  !v && process.platform !== "darwin" && (d.quit(), t = null);
});
d.on("activate", () => {
  !t || t.isDestroyed() ? _() : b();
});
d.on("before-quit", () => {
  P = !0;
});
d.on("will-quit", () => {
  F.unregisterAll(), f && clearInterval(f);
});
d.whenReady().then(() => {
  _(), B(), R();
  try {
    F.register("CommandOrControl+Shift+Space", () => {
      b(), t == null || t.webContents.send("global-shortcut-quick-capture");
    });
  } catch (n) {
    console.error("Shortcut unavailable:", n);
  }
  l.on("update-tray-status", (n, e) => {
    T = e || "Ready", S();
  }), l.on("report-timer", (n, e) => {
    if (!e) return;
    m = e;
    const o = Math.floor(e.remainingTime / 60), r = e.remainingTime % 60, s = `${o}:${r.toString().padStart(2, "0")}`;
    T = e.running ? `${e.session === "focus" ? "Focus" : "Break"} ${s}` : "Ready", S(), a && !a.isDestroyed() && a.webContents.send("timer-state", e), i && !i.isDestroyed() && i.webContents.send("timer-state", e);
  }), l.on("companion-nudge", (n, e, o) => {
    if (!i || i.isDestroyed() || !Number.isFinite(e) || !Number.isFinite(o)) return;
    const [r, s] = i.getPosition();
    i.setPosition(Math.round(r + e), Math.round(s + o));
  }), l.on("companion-show-main", () => {
    b();
  }), l.on("companion-visibility", (n, e) => {
    e ? R() : E(), t && !t.isDestroyed() && t.webContents.send("companion-visibility", !!e);
  }), l.on("mini-command", (n, e) => {
    t == null || t.webContents.send("mini-command", e);
  }), l.on("watch-activity", (n, e) => {
    W(!!e);
  }), l.on("show-break-notification", () => {
    new g({
      title: "☕ Break Time!",
      body: "Great work! Stand up, stretch, and drink some water."
    }).show();
  }), l.on("show-focus-notification", () => {
    new g({
      title: "🧠 Focus Time!",
      body: "Your break is over. Ready for another deep focus session?"
    }).show();
  }), l.on("show-reminder-notification", (n, e, o) => {
    new g({
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
  }), w || (u.setFeedURL({
    url: "https://github.com/RohitSingh403/Orion-Companion/releases/latest",
    headers: { Accept: "application/json" }
  }), u.on("checking-for-update", () => {
    console.log("Checking for update...");
  }), u.on("update-available", (o) => {
    console.log("Update available:", o);
  }), u.on("update-not-available", (o) => {
    console.log("Update not available:", o);
  }), u.on("error", (o) => {
    console.error("Auto-updater error:", o);
  }), u.on("update-downloaded", (o) => {
    console.log("Update downloaded:", o), new g({
      title: "Update Available",
      body: "A new version is ready to install. Restart to apply."
    }).show();
  }), setInterval(() => {
    u.checkForUpdates();
  }, 4 * 60 * 60 * 1e3), u.checkForUpdates());
});
export {
  Q as MAIN_DIST,
  x as RENDERER_DIST,
  w as VITE_DEV_SERVER_URL
};
