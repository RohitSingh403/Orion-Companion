# Orion Companion

A local productivity app for focus sessions. Tasks, notes, reminders, and the day log stay on this computer. A pixel character walks the desktop, sits while a timer runs, and rests when you leave it alone.

**Version:** 1.0.1  
**Updated:** 24 Oct 2026

Orion does not create an account. The name on the dashboard is stored on this computer. Suggestions are calculated here from sessions and tasks.

The marketing site is `/`. The workspace is `/app`. The same workspace runs in the browser and inside the Electron app.

## Workspace

- **Dashboard.** Greeting, today's intention, sessions done against the guess, hours spent against the hour guess, the day timeline, and saved day notes.
- **Focus.** A 15, 25, 30, 45, or 60 minute block. The default is 25. Short breaks are 3, 5, 10, or 15 minutes. A long break (10, 15, 20, or 30 minutes) follows every 2, 3, 4, or 6 finished blocks. The default is 15 minutes after 4 blocks. Focus Settings holds these choices. The timer stays running when you change pages.
- **Tasks.** Priority, tags, projects, subtasks, and an estimate in sessions and minutes. Templates: Study (two 50-minute blocks), Writing (25 minutes), and Meeting prep (15 minutes). Quick Add can become a task, a note, or a reminder. Place at sets a date and time, and an unscheduled task can be dropped onto a week-hour or day-hour to create a focus block of the current length.
- **Calendar.** Day, week, and month. Hours run from 6 AM to 10 PM. Events can be a meeting, focus session, break, reminder, or other. Export the visible range as ICS.
- **Notes.** Markdown, tags, linked tasks, and attachments stored with the note. Cmd/Ctrl+N captures a quick note.
- **Analytics.** Week, month, year, and a custom range, from the history on this computer. Includes a contribution heatmap and a JSON export.
- **Reminders.** Daily, weekly, monthly, or a custom interval. Done and Snooze are on the reminder and on the character.
- **Suggestions.** Morning, evening, and weekly notes from local session and task patterns.
- **Achievements.** 24 marks across streak, sessions, time, tasks, and special, with Common, Rare, Epic, and Legendary tiers and an XP level.
- **Settings.** Sounds, desktop notifications, launch at startup, the screen companion and its size, a JSON backup, and reset of focus stats. The workspace is dark on every page.

## A day of focus

- Write today's intention on the dashboard.
- Mark a rest day when you are off. A marked rest day keeps the streak.
- During a block, the desktop app records the foreground app on this computer. In the browser, write what pulled you away. The review lists those names. **Belongs** keeps a name off later reviews.
- When a block ends, keep one line with **Keep this block** or choose **Leave it**.
- The break checklist is Water, Stretch, and Look away. The ticks reset the next day.
- **Save today's note** downloads a markdown file and keeps that day on the dashboard under Saved days.
- The companion names the next action. A planned block that is about to start is named first. **Begin timer** starts it.

## Desktop

The desktop window adds the tray, a walking companion, a mini timer, launch at startup, and update checks.

- **Tray.** Show Orion, start or pause focus, open the mini timer, show or hide the companion, and quick add. **Close dashboard** and **Quit completely** hide the workspace and leave the character running. **Exit Orion** quits both. **Restart Orion** relaunches the app.
- **Companion.** Walks the desktop, works while a timer runs, waves, and rests when left alone. Sizes are small, medium, and large. Due reminders can be marked done or snoozed on the character.
- **Mini timer.** Always on top, frameless, and tied to the main timer. Escape closes it.
- **Shortcut.** Ctrl+Shift+Space, or Cmd+Shift+Space on Mac, opens quick add.
- **Browser Float.** In a browser that supports Document Picture-in-Picture, Float opens the character in a small window owned by that browser.

Packaged builds check GitHub Releases every 4 hours. A downloaded update is installed from **Install update and restart** in the tray, and also when you choose **Exit Orion**. macOS updates use the zip. The DMG is the installer you open by hand. The Linux AppImage checks for updates. The deb package is installed with the package manager.

Installers are unsigned. Windows and macOS show the system first-open warning until `CSC_LINK` and `CSC_KEY_PASSWORD` are set as repository secrets. macOS notarization also needs `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and `APPLE_TEAM_ID`.

A second launch of the same build focuses the window that is already open. A newer build asks the running copy to quit and then takes over. If that handoff cannot finish, the dialog says to choose Exit Orion in the tray and open Orion again.

## Stack

| Layer | Tech |
|---|---|
| UI | React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Motion | Framer Motion |
| State | Zustand 5 with persist |
| Routing | React Router 7 |
| Desktop | Electron 30, vite-plugin-electron |
| Packages | electron-builder 24 |
| Updates | electron-updater |
| Build | Vite 5 |
| Tests | Vitest, Playwright |

App id: `com.focuscompanion.app`. Product name: Orion Companion.

## Layout

```
electron/                 Main process, preload, navigation, protocol, handoff
src/
  components/             Dashboard, timer, companion, focus review, shell
  pages/                  Site, Focus, Tasks, Calendar, Notes, Analytics,
                          Achievements, Settings, Reminders, Suggestions, Mini timer
  store/                  focus, tasks, day, notes, reminders, events, projects,
                          achievements, analytics, suggestions, settings, toast, ui
  hooks/                  usePomodoro, useReminders, useTray
  utils/                  Day loop, activity, backup, safe links
  data/                   Achievement definitions
  router/                 Routes. / is the site, /app is the workspace
public/                   Icons
```

The timer runs in the main window. The mini timer and the desktop companion follow that clock.

## Run it

Node.js 22 and npm.

```bash
git clone https://github.com/RohitSingh403/Orion-Companion.git
cd Orion-Companion
npm install
npm run dev
```

```bash
npm run lint
npm test
npx tsc --noEmit
npm run test:e2e
```

## Build

```bash
npm run build:web      # dist/ for the site and the browser workspace
npm run build          # current platform, output in release/
npm run build:win      # Windows NSIS, x64
npm run build:mac      # macOS DMG and zip, x64 and arm64
npm run build:linux    # Linux AppImage and deb
```

Vercel uses `npm run vercel-build` and publishes `dist`.

A push to `main` runs `.github/workflows/desktop-installers.yml`. That workflow builds the three installers and uploads them to the GitHub release `v<version>` from `package.json`. The builder itself uses `--publish never`. The release upload is a separate step on `main`.

## Data

Stores persist in the browser profile, or in the desktop app's profile on this computer. Settings can download a JSON backup and import one. A valid import reloads the page.

Notes only open `https` and `mailto` links. Note images are `data:image` only. Attachments are capped at 1.5 MB.

Built by Rohit Singh.
