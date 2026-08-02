import { ipcRenderer, contextBridge } from "electron";

// -----------------------------
// Existing Electron IPC API
// -----------------------------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },

  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },

  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },

  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

// -----------------------------
// Focus Companion API
// -----------------------------
contextBridge.exposeInMainWorld("focusAPI", {
  showBreakNotification() {
    ipcRenderer.send("show-break-notification");
  },

  showFocusNotification() {
    ipcRenderer.send("show-focus-notification");
  },

  showReminderNotification(title: string, body: string) {
    ipcRenderer.send("show-reminder-notification", title, body);
  },

  updateTrayStatus(status: string) {
    ipcRenderer.send("update-tray-status", status);
  },

  onTrayStartFocus(callback: () => void) {
    ipcRenderer.on("tray-start-focus", callback);
  },

  onTrayPauseFocus(callback: () => void) {
    ipcRenderer.on("tray-pause-focus", callback);
  },

  onTrayResumeFocus(callback: () => void) {
    ipcRenderer.on("tray-resume-focus", callback);
  },

  onTrayQuickAddTask(callback: () => void) {
    ipcRenderer.on("tray-quick-add-task", callback);
  },

  onTrayShowProgress(callback: () => void) {
    ipcRenderer.on("tray-show-progress", callback);
  },

  onGlobalShortcutQuickCapture(callback: () => void) {
    ipcRenderer.on("global-shortcut-quick-capture", callback);
  },

  getAutoLaunchStatus() {
    return ipcRenderer.invoke("get-auto-launch-status");
  },

  toggleAutoLaunch(enabled: boolean) {
    return ipcRenderer.invoke("toggle-auto-launch", enabled);
  },
});