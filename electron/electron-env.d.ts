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
    reportTimer: (snapshot: { remainingTime: number; running: boolean; session: "focus" | "break" }) => void;
    watchActivity: (enabled: boolean) => void;
    onMiniCommand: (callback: (command: "start" | "pause" | "reset") => void) => () => void;
    onActivitySample: (callback: (name: string) => void) => () => void;
    onTimerState: (
      callback: (snapshot: { remainingTime: number; running: boolean; session: "focus" | "break" }) => void
    ) => () => void;
    sendMiniCommand: (command: "start" | "pause" | "reset") => void;
    nudgeCompanion: (dx: number, dy: number) => void;
    showMainWindow: () => void;
    setCompanionVisible: (visible: boolean) => void;
    setCompanionMousePassthrough: (ignore: boolean) => void;
    setCompanionHits: (rects: Array<{ x: number; y: number; width: number; height: number }>) => void;
    syncReminders: () => void;
    exitCompanion: () => void;
    onReminderSync: (callback: () => void) => () => void;
    setCompanionActivity: (activity: { mode: "idle" | "focus" | "break"; dragging: boolean; reduceMotion?: boolean }) => void;
    onCompanionWalk: (callback: (state: { walking: boolean; facing: 1 | -1 }) => void) => () => void;
    onCompanionVisibility: (callback: (visible: boolean) => void) => () => void;
    getAutoLaunchStatus: () => Promise<boolean>;
    toggleAutoLaunch: (enabled: boolean) => Promise<boolean>;
  }
}
