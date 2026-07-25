# Focus Companion

A desktop productivity app for building consistent focus habits — structured work sessions, progress tracking, achievements, and productivity insights, all in one distraction-free workspace.

![version](https://img.shields.io/badge/version-1.0.0-blue)
![platform](https://img.shields.io/badge/platform-desktop-lightgrey)
![license](https://img.shields.io/badge/license-MIT-green)

---

## Why Focus Companion?

Most Pomodoro apps stop at the timer. Focus Companion treats the timer as a starting point instead of the whole product — it's meant to grow into a centralized productivity workspace where you can track sessions, review history, and actually see your progress build up over time instead of resetting to zero every day.

v1.0.0 lays that foundation: timer management, progress tracking, achievements, session history, notifications, and a dashboard that ties it all together.

## Features

**Focus Timer**
- Automatic Focus → Break → Focus cycling, no manual switching required
- Start / pause / reset controls
- Custom animated SVG progress ring with a glowing stroke and pulse animation
- Ring color shifts as time runs down (green → orange → red for focus, blue for breaks) so urgency is visible at a glance

**Progress & Tracking**
- Daily session count and total focus minutes tracked live on the dashboard
- Configurable daily session goal, with progress shown against it
- Streak system — one productive day builds a streak, missing a day resets it

**Session History**
- Every completed session is logged with a timestamp and session type
- History persists across app restarts

**Achievements**
- Milestones for First Focus Session, 10 Sessions, 50 Sessions, and 100 Sessions
- Unlocks happen automatically during normal use
- Animated toast notifications on unlock, plus a dashboard view of locked/unlocked achievements

**Notifications & Audio**
- Native desktop notifications when a focus session ends or a break starts (and vice versa) — these fire independently of the app window
- Contextual sound cues on session transitions, so you don't have to keep an eye on the timer

**Companion**
- A panel that reacts visually to the current timer state (focus / break / idle)
- Currently presentational — planned to evolve into an AI productivity assistant in a future release

**Settings & Persistence**
- Focus duration, break duration, and daily goal are all configurable
- Everything (settings, history, achievements, streaks) persists locally via Zustand's persist middleware, so nothing resets when you close the app

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Desktop shell | Electron |
| State management | Zustand |
| Build tool | Vite |

## Architecture

The app follows a modular, component-based architecture with a clear split between logic and presentation:

```
src/
├── components/
│   ├── dashboard/
│   ├── timer/
│   ├── history/
│   ├── companion/
│   ├── overlay/
│   ├── settings/
│   ├── ui/
│   └── animations/
├── hooks/
├── layouts/
├── store/
└── utils/
```

- **Stores own the logic.** All business logic — timer state, session recording, streak calculation, achievement checks — lives in Zustand stores, not in components.
- **Components stay presentational.** UI components render state and dispatch actions; they don't own business rules.
- **Three stores today:**
  - `focusStore` — timer, sessions, settings, streaks, history, progress
  - `achievementStore` — achievement unlock status and persistence
  - `toastStore` — transient notifications and achievement popups

This separation is deliberate — it keeps the codebase easy to extend as new productivity modules get added, without having to untangle UI code from logic later.

## Application Flow

```
Launch → Dashboard → Start Focus → Timer Runs → Focus Completes
   → History Updated → Progress Updated → Streak Updated
   → Achievement Checked → Desktop Notification → Break Starts
   → Break Ends → Next Focus Session
```

## Design Notes

The UI leans into a glassmorphism-style dark theme — blurred cards, rounded corners, soft shadows — built primarily around a MacBook Air M2, 13" Retina display. It's responsive, but the priority is a polished desktop-first experience over adapting to every screen size.

Design principles guiding the app:

- **Simplicity** — the next action should always be obvious
- **Positive reinforcement** — achievements, stats, and animations encourage consistency instead of guilt-tripping missed days
- **Desktop-first** — built for focused desktop work, not a mobile port
- **Modular by default** — every feature is isolated so it can be extended without a rewrite

## What's in v1.0.0

- Configurable focus/break timer with automatic cycling
- Session history
- Daily goals and progress tracking
- Streaks
- Achievement system with toast notifications
- Native desktop notifications
- Audio feedback on transitions
- Dashboard with statistics and history views
- Local persistence — no account or cloud sync required

## Roadmap

The architecture is intentionally built to support these without major rework:

- Task management and daily planner
- Project organization
- GitHub-style productivity heatmap
- Weekly/monthly analytics and advanced insights
- Markdown notes
- Task reminders
- AI productivity coach (the Companion's next evolution)
- Data export
- Cloud sync
- Custom themes

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

## Vision

Focus Companion's long-term goal is to grow past being "another Pomodoro app" into a full desktop productivity platform — one place for focus sessions, task planning, progress visualization, and productivity insight, built with the same attention to polish and feedback from day one.
