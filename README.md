# Focus Companion v2.0

A complete personal productivity operating system built around Focus Sessions (Pomodoro). Everything connects to the Focus Timer — tasks, reminders, analytics, achievements, projects, notes, and statistics.

![version](https://img.shields.io/badge/version-2.0.0--in--development-blue)
![platform](https://img.shields.io/badge/platform-desktop-lightgrey)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Current Progress

Focus Companion v2.0 is currently in active development with significant progress across all core modules. The application features a complete productivity ecosystem with real-time data integration, persistent state management, and a polished dark glassmorphism UI.

### ✅ Fully Implemented Modules

**Dashboard**
- Daily productivity overview with personalized greeting
- Today's Goal tracker with real-time progress bar
- Focus Score sparkline widget with trend visualization
- Current Streak counter with visual day indicators
- Central Focus Timer widget with session controls
- Today's Tasks checklist with live session progress indicators
- Session History logs with detailed session records
- Responsive grid layout with mobile-first design

**Focus (Deep Work Mode)**
- Dedicated distraction-free focus environment
- Focus Mode toggle for session type switching
- Large animated Focus Timer ring with smooth transitions
- Current Task progress card with priority badges, progress percentage, visual progress bar, and tags
- Today's Progress stats (sessions, time, tasks, productivity) with real-time calculations
- Background Sound player with visualizer controls
- "Select a task" link when no active task is present

**Workspace (Tasks)**
- Workspace sub-sidebar with smart filters (Today, Upcoming, Important, Completed)
- Project support with color-coded project badges
- Tag filters (Work, Personal, Study, Health)
- Task creation with Priority selection (High/Medium/Low) with color indicators
- Estimated Focus Sessions selector (1-4 sessions)
- Active task selection for timer integration
- Task progress tracking (completed/estimated sessions) with visual progress
- Due date support with calendar integration

**Calendar**
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

**Notes**
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

**Analytics**
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

**Achievements**
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

**Settings**
- Comprehensive settingsStore with persist middleware
- Focus Settings tab (focus duration, break duration, daily goal)
- Sounds tab (sound enabled toggle, break/focus sound selection)
- Notifications tab (desktop notifications, break reminder toggles)
- Appearance tab (theme selection)
- All settings persist across app restarts
- Real-time UI updates on setting changes

### 🏗 Architecture & Design System

**Global Design System**
- Ultra-dark glassmorphism theme (#09090b base)
- Custom glass-card components with backdrop blur (12px)
- Ambient glow effects (glow-emerald, glow-blue)
- GitHub-style heatmap color levels (0-4 intensity)
- Custom scrollbars (8px width, rounded, active state)
- Responsive grid layouts with mobile breakpoints
- Smooth animations with cubic-bezier easing (0.3s duration)

**Navigation & Layout**
- Fixed left Sidebar with 8 module navigation and hover animations
- Global Topbar with search, quick add, notifications
- AppLayout wrapper with Framer Motion page transitions
- Client-side routing with React Router v7
- Sub-sidebar navigation for Settings and Workspace

**State Management (Zustand)**
- `focusStore` — Timer, sessions, settings, streaks, history, progress
- `taskStore` — Task management with session estimates, priorities, tags, due dates
- `achievementStore` — Achievement unlock status, XP, level progression
- `toastStore` — Transient notifications and achievement popups
- `settingsStore` — App settings configuration with persist middleware
- `notesStore` — Notes CRUD operations with search and tags

**Integration Engine**
- `usePomodoro` hook — Central timer engine at App level
- Automatic task progress increment on focus session completion
- Real-time focus time calculations (hours/minutes display)
- Productivity score calculation based on daily goal
- Desktop notifications via Electron IPC
- Audio cues on session transitions

---

## Roadmap

###  Planned Features

**Calendar Enhancements**
- (All planned features completed)

**Notes Enhancements**
- Advanced search with filters

**Analytics Enhancements**
- (All planned features completed)

**Reminder System**
- Desktop notifications with custom sounds
- Repeating tasks with intervals
- Recurring reminders (daily, weekly, monthly)
- Snooze functionality
- Time-based triggers

**AI Companion**
- Task suggestions based on productivity patterns
- Daily summary generation
- Motivation messages
- Smart planning assistance
- Focus advice and productivity coaching

**Desktop Features**
- Auto start on login
- System tray icon with quick actions
- Global keyboard shortcuts
- Mini timer widget (always on top)
- Quick add task shortcut
- Floating focus widget
- Window management and multi-monitor support

### 🎯 Future Phases

**Phase 8: AI Companion**
- Task suggestions
- Daily summary generation
- Motivation messages
- Smart planning assistance
- Focus advice
- Productivity coaching

**Phase 9: Desktop Features**
- Auto start on login
- System tray icon
- Global keyboard shortcuts
- Mini timer widget
- Quick add task shortcut
- Floating focus widget
- Window management

**Phase 10: Polish & Launch**
- Comprehensive testing
- Performance optimization
- Accessibility improvements
- Documentation completion
- Beta testing
- v2.0 launch

---

## Completed Work

### Core Features Implemented

**Timer System**
- Complete Pomodoro timer with focus/break sessions
- Visual progress ring with smooth animations
- Session state management (idle, focus, break, complete)
- Auto-start options for focus and break sessions
- Sound notifications on session transitions
- Desktop notification integration
- Session history logging with timestamps

**Task Management**
- Full CRUD operations for tasks
- Priority system (High/Medium/Low) with color coding
- Estimated focus sessions per task
- Automatic task progress tracking
- Task completion on session completion
- Due date support
- Tag system for organization
- Project support with grouping
- Active task selection for timer integration

**Achievement System**
- Achievement definitions with XP rewards
- Unlock status tracking
- Level progression system (1000 XP per level)
- 10 unique level titles (Novice → Zen Master)
- Achievement filtering and display
- Toast notifications on unlock
- Persistent achievement state

**Notes System**
- Note creation with markdown support
- Note editing with auto-save
- Note deletion with confirmation
- Search across titles, content, and tags
- Tag system for organization
- Timestamp tracking (created/updated)
- Empty state handling
- Markdown preview rendering with proper styling
- Preview/edit mode toggle
- Auto-save in edit mode
- Custom prose styling for dark theme

**Calendar System**
- Weekly calendar view with day headers
- Hourly time slot grid (6 AM - 10 PM)
- Date navigation (prev/next week, today)
- Task filtering by due date
- Interactive time slots
- Week date range display
- Drag-and-drop task scheduling to time slots
- Automatic due date update on task drop

**Analytics System**
- Real-time statistics from store data
- Total focus time calculation
- Session count tracking
- Task completion rate
- GitHub-style contribution heatmap
- Weekly trend charts
- Streak tracking
- Productivity scoring

**Settings System**
- Focus duration configuration (15-60 minutes)
- Break duration configuration (3-15 minutes)
- Daily goal setting (4-12 sessions)
- Auto-start toggles (focus/break)
- Sound enabled toggle
- Sound selection (break/focus sounds)
- Desktop notification toggles
- Theme selection
- All settings persisted

### Architecture Achievements

**Modular Architecture**
- Clear separation between UI and business logic
- Zustand stores as single source of truth
- Component-based design with reusable elements
- Consistent layout patterns across pages

**State Management**
- 6 Zustand stores with persist middleware
- Reactive state updates across components
- Local storage persistence for all user data
- Type-safe state management with TypeScript

**Design System**
- Ultra-dark glassmorphism theme
- Custom CSS utilities for glass effects
- Consistent color palette (emerald, amber, blue accents)
- Custom scrollbar styling
- Responsive grid layouts
- Smooth animations and transitions

**Integration Engine**
- Central timer engine at App level
- Automatic task progress updates
- Real-time UI synchronization
- Cross-module data flow
- Event-driven architecture

### Major Milestones

**Sprint 1: Component Cleanup** ✅
- Removed 8 unused dashboard components
- Cleaned up redundant code
- Streamlined component structure

**Sprint 2: Integration & Deep Connections** ✅
- Enhanced FocusPage active task integration
- Expanded settingsStore with comprehensive settings
- Connected Settings page to store
- Wired up real daily stats to Analytics
- Implemented real focus time calculations

**Sprint 3: UI Polish Sprint** ✅
- Dashboard spacing refinement with responsive breakpoints
- Sidebar hover animations with smooth transitions
- Framer Motion page transitions
- Scrollbar behavior tuning
- Animation timing adjustments

**Phase 4: Calendar Module** ✅
- Hourly scheduling timeline view
- Real date navigation
- Task calendar integration
- Interactive time slots

**Phase 5: Notes Module** ✅
- Created notesStore with full CRUD
- Rich text editor implementation
- Search functionality
- Edit/Save/Delete operations

**Phase 6: Analytics Module** ✅
- Daily statistics from real data
- Weekly overview calculations
- GitHub-style heatmap with real activity levels
- Focus time trend charts

**Phase 14: Analytics Monthly/Yearly Reports** ✅
- Time range selector (week/month/year) in Analytics page
- Dynamic statistics calculation based on selected time range
- Updated stat cards with range-specific data
- Period-specific overview with dynamic labels
- Adaptive trend chart (7 days/4 weeks/12 months)
- Scaled heatmap based on time range (1 week/4 weeks/52 weeks)
- Multiplier-based calculations for longer periods

**Phase 7: Achievements Module** ✅
- XP system implementation
- Level progression
- Dynamic level titles
- Achievement unlock logic
- Real-time progress display
- Achievement unlock triggers integrated into focus timer
- XP rewards (10 XP) for each completed focus session
- Error handling with reset button for corrupted data

**Phase 8: Notes Module Enhancement** ✅
- Markdown preview rendering with react-markdown
- Tailwind typography plugin for prose styling
- Preview/edit mode toggle with icons
- Auto-save in edit mode
- Custom dark theme prose styling

**Phase 9: Calendar Module Enhancement** ✅
- Drag-and-drop task scheduling to time slots
- Native HTML5 drag-and-drop implementation
- Automatic due date update on task drop
- Visual feedback for draggable tasks
- Calendar view filters (day/week/month) with full functionality
- Month view with calendar grid and task previews
- Day view with single-day hourly schedule
- Dynamic task filtering based on current view

**Phase 11: Calendar Event Management** ✅
- Event creation modal with time picker
- Event types: meeting, focus session, break, reminder, other
- Color-coded events by type (purple, emerald, blue, amber, gray)
- Event store with full CRUD operations and persist middleware
- Event filtering by date range for all calendar views
- Events rendered in week view time slots
- Events rendered in month view grid cells
- Events rendered in day view hourly schedule
- Add Event buttons in week and day views
- Modal with backdrop blur and glassmorphism styling
- Form validation and reset on cancel/create

**Phase 12: Calendar Export** ✅
- Export calendar to ICS/iCal format
- ICS format generation with proper VCALENDAR structure
- Date range filtering for export (week/day/month views)
- Event title and description escaping for ICS compliance
- Export button in calendar header with FiDownload icon
- Automatic file download with view-specific naming
- Blob-based file generation for browser compatibility

**Phase 10: Notes Module Enhancement** ✅
- Markdown preview rendering with react-markdown
- Tailwind typography plugin for prose styling
- Preview/edit mode toggle with icons
- Auto-save in edit mode
- Custom dark theme prose styling
- Quick notes capture with keyboard shortcut (Cmd/Ctrl + N)
- Quick note button with FiZap icon
- Toast notification for quick note creation
- Linked tasks integration with task picker modal
- FiTarget button to link/unlink tasks
- Visual indicator for linked tasks
- Linked task display overlay with task title and progress

**Phase 13: Notes Attachments** ✅
- Attachments support with file upload
- NoteAttachment type with id, name, type, size, data (base64), createdAt
- Updated Note interface to include attachments array
- addAttachment function with FileReader for base64 encoding
- removeAttachment function to delete attachments
- File upload handler with loading state
- Attachments section in NotesPage with Add button
- Attachment list display with name, size, and delete button
- File size formatting helper (B/KB/MB)
- Persist middleware stores attachments in localStorage

---

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

---

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

---

## Application Flow

```
Launch → Dashboard → Start Focus → Timer Runs → Focus Completes
   → Task Progress Updated → History Updated → Streak Updated
   → Achievement Checked → XP Awarded → Desktop Notification → Break Starts
   → Break Ends → Next Focus Session
```

**Timer-Task Integration:**
1. User selects active task in Workspace
2. User starts Focus Timer
3. Focus session completes
4. `usePomodoro` automatically increments task's `completedFocusSessions`
5. Task progress updates (2/4 → 3/4)
6. If task reaches estimated sessions, it auto-completes
7. Achievement system checks for unlocks
8. XP is awarded for session completion

---

## Design System

The UI features an ultra-dark glassmorphism theme built for desktop-first experience:

**Color Palette:**
- Base: `#09090b` (zinc-950)
- Cards: `rgba(18, 18, 21, 0.75)` with backdrop blur
- Accent: Emerald-500 (primary), Amber-500 (warnings), Blue-500 (breaks)
- Text: Zinc-100 (headings), Zinc-400 (body), Zinc-500 (muted)

**Components:**
- `.glass-card` - Standard card with backdrop blur
- `.glass-card-hover` - Hover state with subtle lift and shadow
- `.glow-emerald` / `.glow-blue` - Ambient glow effects
- Custom scrollbars (8px width, zinc-900 track, rounded)
- GitHub-style heatmap levels (0-4 intensity)

**Design Principles:**
- **Simplicity** — the next action should always be obvious
- **Positive reinforcement** — achievements, stats, and animations encourage consistency
- **Desktop-first** — built for focused desktop work, not a mobile port
- **Modular by default** — every feature is isolated for easy extension

---

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

**Version:** v2.0.0 (In Development)

**Last Updated:** July 29, 2026

**Active Phase:** Phase 14 - Analytics Monthly/Yearly Reports (Complete)

**Next Priority:** Advanced search filters for Notes or Reminder System
