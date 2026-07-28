# Focus Companion v2.0

A complete personal productivity operating system built around Focus Sessions (Pomodoro). Everything connects to the Focus Timer — tasks, reminders, analytics, achievements, projects, notes, and statistics.

![version](https://img.shields.io/badge/version-2.0.0--in--development-blue)
![platform](https://img.shields.io/badge/platform-desktop-lightgrey)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Core Philosophy

**Normal Todo App:** Task → Complete

**Focus Companion:** Task → Estimated Focus Sessions → Focus Timer → Session Completed → Task Progress Updated → Analytics Updated → Heatmap Updated → Achievements Updated

Everything is connected. The Focus Timer is the core engine of the application.

---

## Vision

Focus Companion is inspired by Apple Reminders, TickTick, Todoist, Notion, GitHub Contributions, Forest, Obsidian, and Raycast — but with one unique idea: everything revolves around Focus Sessions.

The goal is not to build another Pomodoro timer or another Todo app. The goal is to build a complete personal productivity operating system.

## Current Build Status (v2.0 In Development)

### ✅ Completed Modules

**Module 1: Dashboard**
- Daily productivity overview with greeting
- Today's Goal tracker with progress bar
- Focus Score sparkline widget
- Current Streak counter with visual indicators
- Central Focus Timer widget
- Today's Tasks checklist with live session indicators
- Session History logs

**Module 2: Focus (Deep Work Mode)**
- Dedicated distraction-free focus environment
- Focus Mode toggle
- Large animated Focus Timer ring
- Current Task progress card
- Today's Progress stats (sessions, time, tasks, productivity)
- Background Sound player with visualizer

**Module 3: Workspace (Tasks)**
- Workspace sub-sidebar (Today, Upcoming, Important, Completed)
- Project support (Project Apollo)
- Tag filters (Work, Personal, Study, Health)
- Task creation with Priority selection (High/Medium/Low)
- Estimated Focus Sessions selector (1-4 sessions)
- Active task selection for timer integration
- Task progress tracking (completed/estimated sessions)

**Module 4: Calendar**
- Initial page structure created
- Placeholder for hourly scheduling timeline

**Module 5: Notes**
- Initial page structure created
- Placeholder for rich notes and markdown editor

**Module 6: Analytics**
- Initial page structure created
- Placeholder for charts, heatmaps, and productivity reports

**Module 7: Achievements**
- Basic achievement system implemented
- Milestone unlocks (First Session, 10, 50, 100 sessions)
- Animated toast notifications on unlock
- Achievement view page structure

**Module 8: Settings**
- Initial page structure created
- Placeholder for timer settings and preferences

### 🏗 Architecture & Design System

**Global Design System**
- Ultra-dark glassmorphism theme (#09090b base)
- Custom glass-card components with backdrop blur
- Ambient glow effects (glow-emerald, glow-blue)
- GitHub-style heatmap color levels
- Custom scrollbars
- Responsive grid layouts

**Navigation & Layout**
- Fixed left Sidebar with 8 module navigation
- Global Topbar with search, quick add, notifications
- AppLayout wrapper for consistent page structure
- Client-side routing with React Router v7

**State Management (Zustand)**
- `focusStore` — Timer, sessions, settings, streaks, history, progress
- `taskStore` — Task management with session estimates, priorities, tags
- `achievementStore` — Achievement unlock status and persistence
- `toastStore` — Transient notifications and achievement popups
- `settingsStore` — App settings configuration

**Integration Engine**
- `usePomodoro` hook — Central timer engine at App level
- Automatic task progress increment on focus session completion
- Desktop notifications via Electron IPC
- Audio cues on session transitions

### 🚧 In Progress / Planned Features

**Task Management**
- TaskCard and TaskList components
- Due dates and reminders
- Project organization
- Advanced filtering and sorting

**Calendar**
- Hourly scheduling timeline
- Task calendar integration
- Recurring events

**Notes**
- Rich text editor
- Markdown support
- Linked tasks
- Search and tags

**Analytics**
- Daily/Weekly/Monthly/Yearly statistics
- GitHub-style contribution heatmap
- Focus trends and productivity charts
- Advanced insights

**Reminder System**
- Desktop notifications
- Repeating tasks
- Recurring reminders
- Snooze functionality

**AI Companion**
- Task suggestions
- Daily summary
- Motivation
- Smart planning
- Focus advice

**Desktop Features**
- Auto start
- Tray icon
- Global shortcuts
- Mini timer
- Quick add task
- Floating focus widget

## Tech Stack

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

## Architecture

The app follows a modular, component-based architecture with a clear split between logic and presentation:

```
App.tsx
├── usePomodoro() (Global Timer Engine)
└── AppRouter
    └── AppLayout
        ├── Sidebar (Navigation)
        ├── Topbar (Global Header)
        └── Pages (8 Modules)
            └── Components
                └── Stores (Zustand)
```

**Directory Structure:**
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
├── pages/              # 8 application pages
├── layouts/            # Layout wrappers
├── store/              # Zustand state management
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── data/               # Static data
```

**Architecture Principles:**
- **Stores own the logic.** All business logic lives in Zustand stores, not in components.
- **Components stay presentational.** UI components render state and dispatch actions.
- **Global services at App level.** `usePomodoro` runs at App.tsx, not in pages.
- **One source of truth.** No duplicate logic or components.

## Application Flow

```
Launch → Dashboard → Start Focus → Timer Runs → Focus Completes
   → Task Progress Updated → History Updated → Streak Updated
   → Achievement Checked → Desktop Notification → Break Starts
   → Break Ends → Next Focus Session
```

**Timer-Task Integration:**
1. User selects active task in Workspace
2. User starts Focus Timer
3. Focus session completes
4. `usePomodoro` automatically increments task's `completedFocusSessions`
5. Task progress updates (2/4 → 3/4)
6. If task reaches estimated sessions, it auto-completes

## Design System

The UI features an ultra-dark glassmorphism theme built for desktop-first experience:

**Color Palette:**
- Base: `#09090b` (zinc-950)
- Cards: `rgba(18, 18, 21, 0.75)` with backdrop blur
- Accent: Emerald-500 (primary), Amber-500 (warnings), Blue-500 (breaks)
- Text: Zinc-100 (headings), Zinc-400 (body), Zinc-500 (muted)

**Components:**
- `.glass-card` - Standard card with backdrop blur
- `.glass-card-hover` - Hover state with subtle lift
- `.glow-emerald` / `.glow-blue` - Ambient glow effects
- Custom scrollbars (6px width, zinc-900 track)
- GitHub-style heatmap levels (0-4 intensity)

**Design Principles:**
- **Simplicity** — the next action should always be obvious
- **Positive reinforcement** — achievements, stats, and animations encourage consistency
- **Desktop-first** — built for focused desktop work, not a mobile port
- **Modular by default** — every feature is isolated for easy extension

## Development Roadmap

### ✅ Phase 1: Foundation (Complete)
- Folder structure finalized
- Routing configured (8 modules)
- Sidebar navigation
- Dashboard with metrics and timer
- Focus Timer with progress ring
- Store architecture (Zustand)
- AppLayout wrapper

### ✅ Phase 2: Workspace Foundation (Complete)
- Task type definitions
- TaskStore with full CRUD
- TaskInput component
- TaskCard component
- TaskList component
- Priority badges (High/Medium/Low)
- Estimated Focus Sessions selector
- Due dates support
- Tags support
- Project support
- Timer-Task integration (auto-increment on session complete)

### 🚧 Phase 3: Workspace Completion (In Progress)
- **Sprint 1: Component Cleanup** ✅ Complete
  - SessionHistory redesign ✅
  - Companion widget redesign ✅
  - ProgressRing polish ✅
  - Removed 8 unused dashboard components ✅

- **Sprint 2: Integration & Deep Connections** (Next)
  - Connect TasksPage active task → auto-shown on FocusPage right panel
  - Wire up real daily stats to Analytics charts
  - Expand settingsStore + connect to Settings page sliders
  - Implement real focus time calculations

- **Sprint 3: UI Polish Sprint** (Planned)
  - Dashboard spacing refinement
  - Responsive scaling improvements
  - Sidebar hover animations
  - Framer Motion page transitions
  - Final scrollbar behavior tuning
  - Animation timing adjustments

### 📋 Phase 4: Calendar Module (Planned)
- Hourly scheduling timeline view
- Task calendar integration
- Drag-and-drop task scheduling
- Recurring events support
- Calendar view filters (day/week/month)

### 📋 Phase 5: Notes Module (Planned)
- Rich text editor
- Markdown support
- Quick notes
- Attachments support
- Linked tasks
- Search functionality
- Tags and organization

### 📋 Phase 6: Analytics Module (Planned)
- Daily statistics
- Weekly reports
- Monthly reports
- Yearly overview
- GitHub-style contribution heatmap
- Focus trends charts
- Productivity insights
- Advanced analytics

### 📋 Phase 7: Reminder System (Planned)
- Desktop notifications
- Repeating tasks
- Recurring reminders
- Snooze functionality
- Reminder scheduling
- Time-based triggers

### 📋 Phase 8: AI Companion (Planned)
- Task suggestions
- Daily summary generation
- Motivation messages
- Smart planning assistance
- Focus advice
- Productivity coaching

### 📋 Phase 9: Desktop Features (Planned)
- Auto start on login
- System tray icon
- Global keyboard shortcuts
- Mini timer widget
- Quick add task shortcut
- Floating focus widget
- Window management

### 📋 Phase 10: Polish & Launch (Planned)
- Comprehensive testing
- Performance optimization
- Accessibility improvements
- Documentation completion
- Beta testing
- v2.0 launch

## Getting Started

```bash
# clone the repo
git clone https://github.com/RohitSingh403/focus-companion.git
cd focus-companion

# install dependencies
npm install

# run in development
npm run dev

# build for production
npm run build
```

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

## Current Status

**Version:** v2.0.0 (In Development)

**Last Updated:** July 28, 2026

**Active Sprint:** Sprint 2 - Integration & Deep Connections

**Next Priority:** Connect TasksPage active task → auto-shown on FocusPage right panel
