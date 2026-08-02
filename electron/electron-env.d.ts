/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

//Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  focusAPI: {
    showBreakNotification: () => void;
    showFocusNotification: () => void;
    showReminderNotification: (title: string, body: string) => void;
    updateTrayStatus: (status: string) => void;
    onTrayStartFocus: (callback: () => void) => void;
    onTrayPauseFocus: (callback: () => void) => void;
    onTrayResumeFocus: (callback: () => void) => void;
    onTrayQuickAddTask: (callback: () => void) => void;
    onTrayShowProgress: (callback: () => void) => void;
    onGlobalShortcutQuickCapture: (callback: () => void) => void;
    getAutoLaunchStatus: () => Promise<boolean>;
    toggleAutoLaunch: (enabled: boolean) => Promise<boolean>;
  }
}
