"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("focusAPI", {
  showBreakNotification() {
    electron.ipcRenderer.send("show-break-notification");
  },
  showFocusNotification() {
    electron.ipcRenderer.send("show-focus-notification");
  },
  updateTrayStatus(status) {
    electron.ipcRenderer.send("update-tray-status", status);
  },
  onTrayStartFocus(callback) {
    electron.ipcRenderer.on("tray-start-focus", callback);
  },
  onTrayPauseFocus(callback) {
    electron.ipcRenderer.on("tray-pause-focus", callback);
  },
  onTrayResumeFocus(callback) {
    electron.ipcRenderer.on("tray-resume-focus", callback);
  },
  onTrayQuickAddTask(callback) {
    electron.ipcRenderer.on("tray-quick-add-task", callback);
  },
  onTrayShowProgress(callback) {
    electron.ipcRenderer.on("tray-show-progress", callback);
  },
  onGlobalShortcutQuickCapture(callback) {
    electron.ipcRenderer.on("global-shortcut-quick-capture", callback);
  },
  getAutoLaunchStatus() {
    return electron.ipcRenderer.invoke("get-auto-launch-status");
  },
  toggleAutoLaunch(enabled) {
    return electron.ipcRenderer.invoke("toggle-auto-launch", enabled);
  }
});
