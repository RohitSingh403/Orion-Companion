"use strict";

// electron/preload.ts
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return import_electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return import_electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return import_electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return import_electron.ipcRenderer.invoke(channel, ...omit);
  }
});
import_electron.contextBridge.exposeInMainWorld("focusAPI", {
  showBreakNotification() {
    import_electron.ipcRenderer.send("show-break-notification");
  },
  showFocusNotification() {
    import_electron.ipcRenderer.send("show-focus-notification");
  },
  showReminderNotification(title, body) {
    import_electron.ipcRenderer.send("show-reminder-notification", title, body);
  },
  updateTrayStatus(status) {
    import_electron.ipcRenderer.send("update-tray-status", status);
  },
  onTrayStartFocus(callback) {
    import_electron.ipcRenderer.on("tray-start-focus", callback);
  },
  onTrayPauseFocus(callback) {
    import_electron.ipcRenderer.on("tray-pause-focus", callback);
  },
  onTrayResumeFocus(callback) {
    import_electron.ipcRenderer.on("tray-resume-focus", callback);
  },
  onTrayQuickAddTask(callback) {
    import_electron.ipcRenderer.on("tray-quick-add-task", callback);
  },
  onTrayShowProgress(callback) {
    import_electron.ipcRenderer.on("tray-show-progress", callback);
  },
  onGlobalShortcutQuickCapture(callback) {
    import_electron.ipcRenderer.on("global-shortcut-quick-capture", callback);
  },
  reportTimer(snapshot) {
    import_electron.ipcRenderer.send("report-timer", snapshot);
  },
  watchActivity(enabled) {
    import_electron.ipcRenderer.send("watch-activity", enabled);
  },
  onMiniCommand(callback) {
    const listener = (_event, command) => callback(command);
    import_electron.ipcRenderer.on("mini-command", listener);
    return () => import_electron.ipcRenderer.removeListener("mini-command", listener);
  },
  onActivitySample(callback) {
    const listener = (_event, name) => callback(name);
    import_electron.ipcRenderer.on("activity-sample", listener);
    return () => import_electron.ipcRenderer.removeListener("activity-sample", listener);
  },
  onTimerState(callback) {
    const listener = (_event, snapshot) => callback(snapshot);
    import_electron.ipcRenderer.on("timer-state", listener);
    return () => import_electron.ipcRenderer.removeListener("timer-state", listener);
  },
  sendMiniCommand(command) {
    import_electron.ipcRenderer.send("mini-command", command);
  },
  getAutoLaunchStatus() {
    return import_electron.ipcRenderer.invoke("get-auto-launch-status");
  },
  toggleAutoLaunch(enabled) {
    return import_electron.ipcRenderer.invoke("toggle-auto-launch", enabled);
  }
});
