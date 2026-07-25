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
});