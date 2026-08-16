# Focus Companion v1.0.0

A complete personal productivity operating system built around Focus Sessions (Pomodoro). Everything connects to the Focus Timer — tasks, reminders, analytics, achievements, projects, notes, and statistics.

![version](https://img.shields.io/badge/version-1.0.0--production--ready-brightgreen)
![platform](https://img.shields.io/badge/platform-desktop-lightgrey)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Overview

Focus Companion is a production-ready, single-user desktop application designed for deep work and productivity. Built with Electron, React, and TypeScript, it provides a complete productivity ecosystem with intelligent insights, local AI companion, and a modern professional UI design system.

**Key Features:**
- 🎯 Focus Timer with Pomodoro sessions
- 📋 Task Management with priority and session estimates
- 📅 Calendar with event scheduling and export
- 📝 Notes with markdown and attachments
- 📊 Advanced Analytics with pattern detection
- 🔔 Reminders with custom recurring schedules
- 🤖 Local AI Companion for personalized suggestions
- 🏆 Achievements and XP system
- ⚙️ Comprehensive Settings with real-time sync
- 🖥️ Desktop integration (system tray, global shortcuts, mini timer)
- 🔄 Auto-updates via GitHub releases
- 🎨 Modern professional UI design system

---

## Features

### Dashboard
- Daily productivity overview with personalized greeting
- Today's Goal tracker with real-time progress bar
- Focus Score sparkline widget with trend visualization
- Current Streak counter with visual day indicators
- Central Focus Timer widget with session controls
- Today's Tasks checklist with live session progress indicators
- Session History logs with detailed session records
- Responsive grid layout with mobile-first design

### Focus (Deep Work Mode)
- Dedicated distraction-free focus environment
- Focus Mode toggle for session type switching
- Large animated Focus Timer ring with smooth transitions
- Current Task progress card with priority badges, progress percentage, visual progress bar, and tags
- Today's Progress stats (sessions, time, tasks, productivity) with real-time calculations
- Background Sound player with visualizer controls
- "Select a task" link when no active task is present

### Workspace (Tasks)
- Workspace sub-sidebar with smart filters (Today, Upcoming, Important, Completed)
- Project support with color-coded project badges
- Tag filters (Work, Personal, Study, Health)
- Task creation with Priority selection (High/Medium/Low) with color indicators
- Estimated Focus Sessions selector (1-4 sessions)
- Active task selection for timer integration
- Task progress tracking (completed/estimated sessions) with visual progress
- Due date support with calendar integration

### Calendar
- Hourly scheduling timeline view (6 AM - 10 PM)
- Real date navigation with prev/next week controls
- Today button for quick navigation to current week
- Task calendar integration (weekly task filtering by due date)
- Interactive time slots with hover states and "+ Add" indicators
- Week view with day headers and active day highlighting
- Tasks This Week section showing scheduled tasks with priority indicators
- Drag-and-drop task scheduling to time slots
- Automatic due date update on task drop
- Calendar view filters (day/week/month) with full functionality
- Month view with calendar grid and task previews
- Day view with single-day hourly schedule
- Dynamic task filtering based on current view
- Event creation modal with time picker
- Event types: meeting, focus session, break, reminder, other
- Color-coded events by type
- Event filtering by date range for all views
- Events rendered in week, month, and day views
- Event store with persist middleware
- Export calendar to ICS/iCal format
- View-based export (week/day/month) with date range filtering
- Automatic file download with proper ICS formatting

### Notes
- Complete notesStore with full CRUD operations and persist middleware
- Rich text editor with markdown support
- Markdown preview rendering with proper styling
- Preview/edit mode toggle with icons
- Search functionality (title, content, tags) with real-time filtering
- Edit/Save/Delete note functionality with confirmation dialogs
- Auto-save in edit mode
- Empty state handling with "Create your first note" call-to-action
- Note list with timestamps and active state highlighting
- Tags display with emerald accent styling
- Custom prose styling for dark theme
- Quick notes capture with keyboard shortcut (Cmd/Ctrl + N)
- Quick note button with FiZap icon
- Toast notification for quick note creation
- Linked tasks integration with task picker modal
- FiTarget button to link/unlink tasks
- Visual indicator for linked tasks
- Linked task display overlay with task title and progress
- Attachments support with file upload
- Base64 encoding for file storage
- Attachment list with name, size, and delete option
- File size formatting (B/KB/MB)

### Analytics
- Daily statistics from real store data (total focus time, sessions, tasks completed)
- Weekly overview with avg sessions/day, avg focus/day, and best day metrics
- GitHub-style contribution heatmap with real session-based activity levels
- Focus time trend chart with recency-based data (last 7 days)
- Current streak display with day counter
- Task completion rate calculation
- Productivity score based on daily goal progress
- Monthly and yearly reports with time range selector
- Dynamic statistics calculation for week/month/year views
- Adaptive trend chart and heatmap based on selected time range
- Period-specific overview with dynamic labels
- Daily statistics tracking with date-based data storage
- Productivity comparison (e.g., "18% more productive than yesterday")
- Streak tracking with best streak record comparison
- Personalized insights based on focus patterns and history
- Advanced pattern detection (most productive day, focus drop-off trends)
- Session duration analysis and recommendations

### Reminders
- Desktop notifications with custom sounds
- Repeating tasks with intervals
- Recurring reminders (daily, weekly, monthly, custom)
- Custom days of week selection
- Custom interval configuration
- Snooze functionality
- Time-based triggers
- Reminder store with persist middleware
- Complete/dismiss/delete actions

### AI Companion
- Morning suggestions based on task patterns and yesterday's performance
- Evening summary with focus time, task completion, and streak insights
- Weekly productivity analysis with most productive day detection
- Pattern-based recommendations (no backend required)
- Context-aware suggestions based on time of day
- Local processing with no external API calls
- AI Companion store with persist middleware

### Achievements
- Expanded achievementStore with XP system and level progression
- Level progression system (1000 XP per level, 10 unique titles)
- Dynamic level titles (Novice → Zen Master)
- Real-time XP progress bar with percentage calculation
- Achievement unlock logic with XP rewards
- Achievement filtering (All, Unlocked, Locked)
- Achievement grid with unlock status indicators
- Persistent achievement state with local storage
- Achievement unlock triggers integrated into focus timer
- XP rewards (10 XP) for each completed focus session
- Level-up notifications with toast animations
- Error handling with reset button for corrupted data

### Settings
- Comprehensive settingsStore with persist middleware
- **Focus Settings**: Focus duration (15-60 min), break duration (3-15 min), daily session goal (4-12 sessions)
- **Sounds**: Sound enabled toggle, custom break/focus sound selection (Default Chime, Bell, Gentle Tone, Motivation, Subtle Tone)
- **Notifications**: Desktop notifications toggle, break reminder toggle
- **Appearance**: Theme selection (Dark/Light mode) with real-time application
- **General**: Auto-launch on startup toggle
- **Auto-start Features**: Auto-start break timer when focus completes, auto-start focus when break ends
- **Real-time Sync**: All settings immediately applied to timer behavior via usePomodoro hook
- Settings persist across app restarts with localStorage

### Desktop Features
- System Tray with right-click context menu (Start Focus, Pause, Resume, Quick Add Task, Today's Progress, Quit)
- Window minimizes to tray instead of closing
- Dynamic tray tooltip showing focus status and time
- Floating Mini Timer (always on top, frameless, transparent)
- Global Shortcut (Ctrl + Shift + Space for quick capture)
- Auto Launch (start with OS with toggle in Settings)
- Auto-updates via GitHub releases
- Code signing setup (macOS entitlements)

---

## Architecture

### Tech Stack

| Layer | Tech |
|---|---|
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 + PostCSS |
| Animation | Framer Motion |
| Icons | React Icons |
| Audio | Howler.js |
| Desktop shell | Electron v30 |
| State management | Zustand v5 + Persist |
| Routing | React Router DOM v7 |
| Build tool | Vite 5 + vite-plugin-electron |
| Auto-updates | electron-updater |

### Architecture Pattern

The app follows a modular, component-based architecture with a clear split between logic and presentation:

```
App.tsx
├── usePomodoro() (Global Timer Engine)
├── useReminders() (Reminder Notifications)
├── useTray() (System Tray Integration)
└── AppRouter
    └── AppLayout
        ├── Sidebar (Navigation)
        ├── Topbar (Global Header)
        └── Pages (9 Modules)
            └── Components
                └── Stores (Zustand)
```

### Directory Structure

```
src/
├── components/
│   ├── dashboard/      # Dashboard components
│   ├── timer/          # Focus timer & progress ring
│   ├── history/        # Session history
│   ├── companion/      # Visual companion widget
│   ├── overlay/        # Break overlay screen
│   ├── settings/       # Settings components
│   ├── topbar/         # Global header
│   ├── sidebar/        # Navigation sidebar
│   └── ui/             # Reusable components
├── pages/              # 9 application pages
│   ├── Dashboard/
│   ├── Focus/
│   ├── Tasks/
│   ├── Calendar/
│   ├── Notes/
│   ├── Analytics/
│   ├── Achievements/
│   ├── Settings/
│   ├── Reminders/
│   ├── AICompanion/
│   └── MiniTimer/
├── layouts/            # Layout wrappers
├── store/              # Zustand state management
│   ├── focusStore.ts
│   ├── taskStore.ts
│   ├── achievementStore.ts
│   ├── toastStore.ts
│   ├── settingsStore.ts
│   ├── notesStore.ts
│   ├── reminderStore.ts
│   └── aiCompanionStore.ts
├── hooks/              # Custom React hooks
│   ├── usePomodoro.ts
│   ├── useReminders.ts
│   └── useTray.ts
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── electron/           # Electron main process
│   ├── main.ts
│   ├── preload.ts
│   └── electron-env.d.ts
└── assets/             # Static assets
    └── icons/          # Application icons and logos
```

### Architecture Principles

- **Stores own the logic.** All business logic lives in Zustand stores, not in components.
- **Components stay presentational.** UI components render state and dispatch actions.
- **Global services at App level.** `usePomodoro`, `useReminders`, `useTray` run at App.tsx, not in pages.
- **One source of truth.** No duplicate logic or components.
- **Local-first approach.** All data stored locally with no backend dependency.

---

## Design System

The UI features a modern professional design system built for desktop-first experience with consistent styling across all components.

### Color Palette
- Base: `#0a0a0a` (dark background)
- Cards: `rgba(255, 255, 255, 0.05)` with subtle borders
- Accent: Emerald-500 (primary), Amber-500 (warnings), Blue-500 (breaks), Purple-400 (AI)
- Text: Zinc-100 (headings), Zinc-400 (body), Zinc-500 (muted)

### Design Tokens
- `.card` - Standard card with background and border
- `.card-elevated` - Elevated card with shadow
- `.btn-primary` - Primary action button with accent color
- `.btn-secondary` - Secondary action button
- `.btn-ghost` - Ghost button for subtle actions
- `.input` - Form input with consistent styling
- `.toggle` - Toggle switch component
- `.badge` - Small status badges
- `.icon-btn` - Icon-only buttons
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-muted` - Muted text color
- `.text-accent` - Accent text color

### Components
- Custom scrollbars with dark theme
- GitHub-style heatmap levels (0-4 intensity)
- Progress bars with smooth transitions
- Status dots for indicators
- Modal backdrops with blur
- Toast notifications
- Skeleton loaders

### Design Principles
- **Simplicity** — the next action should always be obvious
- **Positive reinforcement** — achievements, stats, and animations encourage consistency
- **Desktop-first** — built for focused desktop work, not a mobile port
- **Modular by default** — every feature is isolated for easy extension
- **Consistent styling** — design tokens ensure visual harmony across all pages

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/RohitSingh403/Orion-Companion.git
cd Orion-Companion

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production (Electron desktop app)
npm run build

# Build for web deployment
npm run build:web

# Platform-specific builds
npm run build:win    # Windows installer
npm run build:mac    # macOS DMG
npm run build:linux  # Linux AppImage/DEB
```

### Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Production Build

```bash
# Build for current platform
npm run build

# Build for specific platform
npm run build:win
npm run build:mac
npm run build:linux
```

Build artifacts are placed in the `release/` directory.

---

## Configuration

### Environment Variables

No environment variables required for local development. The app uses Electron's built-in environment detection.

### Build Configuration

Build configuration is defined in `package.json` under the `build` section:

- **App ID**: `com.focuscompanion.app`
- **Product Name**: `Focus Companion`
- **Output Directory**: `release/`
- **Update Provider**: GitHub Releases
- **Platforms**: macOS (x64, arm64), Windows, Linux

### Auto-Updates

The app automatically checks for updates every 4 hours via GitHub Releases. Updates are downloaded in the background and users are notified when ready to install.

---

## Application Flow

```
Launch → Dashboard → Start Focus → Timer Runs → Focus Completes
   → Task Progress Updated → History Updated → Streak Updated
   → Achievement Checked → XP Awarded → Desktop Notification → Break Starts
   → Break Ends → Next Focus Session
```

### Timer-Task Integration
1. User selects active task in Workspace
2. User starts Focus Timer
3. Focus session completes
4. `usePomodoro` automatically increments task's `completedFocusSessions`
5. Task progress updates (2/4 → 3/4)
6. If task reaches estimated sessions, it auto-completes
7. Achievement system checks for unlocks
8. XP is awarded for session completion

---

## State Management

The application uses Zustand for state management with persist middleware for local storage:

### Stores

1. **focusStore** - Timer, sessions, settings, streaks, history, progress
2. **taskStore** - Task management with session estimates, priorities, tags, due dates
3. **achievementStore** - Achievement unlock status, XP, level progression
4. **toastStore** - Transient notifications and achievement popups
5. **settingsStore** - App settings configuration
6. **notesStore** - Notes CRUD operations with search and tags
7. **reminderStore** - Reminder management with recurring logic
8. **aiCompanionStore** - AI suggestions and insights

### Persistence

All stores use `zustand/middleware/persist` to automatically save state to localStorage. Data persists across app restarts.

---

## Desktop Integration

### System Tray
- Right-click menu with quick actions
- Dynamic tooltip showing focus status
- Minimize to tray instead of close
- Start/Pause/Resume focus sessions
- Quick add task
- View today's progress

### Global Shortcuts
- **Ctrl + Shift + Space** - Quick task capture
- **Escape** - Close mini timer window

### Auto Launch
- Toggle in Settings to start app with OS
- Platform-specific implementation

### Mini Timer
- Always-on-top floating window
- Frameless and transparent
- Start/Pause/Reset controls
- Escape to close

---

## Deployment

### Vercel (Web)

The app can be deployed to Vercel as a web application:

1. Connect GitHub repository to Vercel
2. Build command: `npm run vercel-build`
3. Output directory: `dist`
4. The `vercel-build` script skips Electron-specific builds

### GitHub Releases (Desktop)

Desktop builds are published to GitHub Releases:

1. Create a new release on GitHub
2. Tag version (e.g., `v1.0.0`)
3. Electron Builder automatically uploads installers
4. Auto-updater checks GitHub releases for updates

---

## Troubleshooting

### Build Issues

**Issue**: Build fails on Vercel
- **Solution**: Ensure `vercel-build` script is used instead of `build`

**Issue**: Electron build fails
- **Solution**: Check that Electron is installed and platform-specific dependencies are available

### Runtime Issues

**Issue**: Data not persisting
- **Solution**: Check localStorage is enabled and not cleared by browser settings

**Issue**: Notifications not showing
- **Solution**: Enable desktop notifications in system settings and app settings

---

## Development Rules

The project follows strict development rules to maintain code quality and architecture:

1. **Senior Engineer + PM Role** - Focused engineering execution, clean single source of truth
2. **One File at a Time** - Never touch or generate multiple files in a single turn
3. **100% Complete Code** - No code snippets, no manual merge instructions
4. **No Assumptions** - Before modifying an existing file, inspect its current content
5. **Strict Response Format** - Follow the prescribed format for code delivery
6. **Never Change Architecture** - Without strong technical reason
7. **Avoid Duplicates** - One source of truth only
8. **Fix Critical Bugs First** - Before building new features
9. **Separate Feature from Polish** - Don't perfect spacing while core features are incomplete
10. **No God Components** - Split components >150-200 lines
11. **Optimize Development Speed** - Without sacrificing architecture quality
12. **Finish Functionality First** - Verify 0 errors, test manually, then move to next page
13. **Keep Explanations Concise** - Implementation-focused
14. **Explain Structural Changes** - Before making them

---

## Current Status

**Version:** v1.0.0 (Production Ready)

**Last Updated:** August 16, 2026

**Status:** Production-ready single-user desktop application with full feature set

**Recent Updates (August 2026):**
- ✅ UI Redesign: Complete migration to professional design system with consistent styling across all pages
- ✅ Settings Integration: Fixed critical bug where settings weren't applied to timer behavior
- ✅ Theme Support: Added dark/light theme toggle with real-time application
- ✅ Auto-start Features: Implemented auto-start break and auto-start focus functionality
- ✅ Sound Integration: Custom sound selection now properly integrated with timer
- ✅ Notification Control: Desktop notifications now controlled by settings
- ✅ All Pages Verified: Dashboard, Focus, Tasks, Calendar, Notes, Analytics, Achievements, Settings, Reminders, AI Companion, MiniTimer

**All Phases Complete:**
- ✅ Phase 1: Desktop Excellence
- ✅ Phase 2: Data Intelligence
- ✅ Phase 3: Reminder System
- ✅ Phase 4: Local AI Companion
- ✅ Phase 5: Production Release
- ✅ Phase 6: UI Redesign & Settings Integration

---

## License

MIT License - See LICENSE file for details

---

## Credits

Built by Rohit Singh

**Tech Stack:**
- React + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Zustand + React Router
- Electron + electron-builder

---

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/RohitSingh403/Orion-Companion).

