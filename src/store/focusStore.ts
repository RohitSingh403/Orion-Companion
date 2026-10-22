import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayString, getYesterdayString } from "../utils/date";
import { gapIsRest, isLongBreak, type AppSample } from "../utils/dayLoop";
import { useTaskStore } from "./taskStore";

export type SessionType = "focus" | "break";

export interface SessionHistoryItem {
  id: string;
  time: string;
  type: "Focus Session";
  date: string; // YYYY-MM-DD format
  duration: number; // in seconds
  completedAt: string; // ISO timestamp
  taskId?: string | null;
  taskTitle?: string;
  note?: string;
}

export interface SessionReview {
  historyId: string;
  taskId: string | null;
  taskTitle: string;
  note: string;
  apps: AppSample[];
}

export interface DailyStats {
  date: string;
  sessions: number;
  focusMinutes: number;
  averageSessionDuration: number; // in seconds
}

export interface ActivitySample {
  name: string;
  seconds: number;
  date: string;
}

// ----------------------
// Default Values
// ----------------------

const DEFAULT_FOCUS_DURATION = 25 * 60;
const DEFAULT_BREAK_DURATION = 5 * 60;
const DEFAULT_LONG_BREAK_DURATION = 15 * 60;
const DEFAULT_DAILY_GOAL = 8;
const DEFAULT_SESSIONS_BEFORE_LONG_BREAK = 4;

interface FocusState {
  session: SessionType;

  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  breakKind: "short" | "long";

  dailyGoal: number;

  remainingTime: number;

  running: boolean;

  completedSessions: number;

  sessionReview: SessionReview | null;
  sessionApps: AppSample[];
  restDates: string[];

  // Session History
  history: SessionHistoryItem[];

  // Streak
  currentStreak: number;
  lastCompletedDate: string | null;
  bestStreak: number;

  // Daily Statistics
  dailyStats: DailyStats[];
  activityLog: ActivitySample[];

  start: () => void;
  pause: () => void;
  reset: () => void;

  tick: () => void;

  addHistory: () => string;
  updateStreak: () => void;
  updateDailyStats: () => void;
  recordActivity: (name: string, seconds: number) => void;
  noteDistraction: (name: string) => void;
  getYesterdayStats: () => DailyStats | undefined;
  getProductivityComparison: () => { percentage: number; label: string };
  getFocusInsights: () => string[];

  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setLongBreakDuration: (minutes: number) => void;
  setSessionsBeforeLongBreak: (count: number) => void;
  setDailyGoal: (goal: number) => void;
  settleReview: (note: string) => void;
  dismissReview: () => void;
  toggleRestDay: (date: string) => void;

  // ----------------------
  // Reset Actions
  // ----------------------

  resetHistory: () => void;
  resetTodayProgress: () => void;
  resetStreak: () => void;
  resetSettings: () => void;
  resetAllData: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      session: "focus",

      focusDuration: DEFAULT_FOCUS_DURATION,
      breakDuration: DEFAULT_BREAK_DURATION,
      longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
      sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
      breakKind: "short",

      dailyGoal: DEFAULT_DAILY_GOAL,

      remainingTime: DEFAULT_FOCUS_DURATION,

      running: false,

      completedSessions: 0,
      sessionReview: null,
      sessionApps: [],
      restDates: [],

      history: [],

      currentStreak: 0,
      lastCompletedDate: null,
      bestStreak: 0,

      dailyStats: [],
      activityLog: [],

      start: () =>
        set({
          running: true,
        }),

      pause: () =>
        set({
          running: false,
        }),

      reset: () =>
        set((state) => ({
          session: "focus",
          breakKind: "short",
          running: false,
          remainingTime: state.focusDuration,
          sessionApps: [],
        })),

      tick: () => {
        const state = get();

        if (!state.running) return;

        if (state.remainingTime > 1) {
          set({
            remainingTime: state.remainingTime - 1,
          });
          return;
        }

        // Focus completed
        if (state.session === "focus") {
          const historyId = get().addHistory();
          get().updateStreak();
          const count = state.completedSessions + 1;
          const long = isLongBreak(count, state.sessionsBeforeLongBreak);
          const taskState = useTaskStore.getState();
          const active = taskState.tasks.find((task) => task.id === taskState.activeTaskId);

          set({
            session: "break",
            breakKind: long ? "long" : "short",
            remainingTime: long ? state.longBreakDuration : state.breakDuration,
            completedSessions: count,
            sessionApps: [],
            sessionReview: {
              historyId,
              taskId: active?.id ?? null,
              taskTitle: active?.title ?? "",
              note: "",
              apps: state.sessionApps,
            },
          });

          return;
        }

        // Break completed
        set({
          session: "focus",
          breakKind: "short",
          remainingTime: state.focusDuration,
        });
      },

      addHistory: () => {
        const state = get();

        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const today = getTodayString();
        const completedAt = new Date().toISOString();
        const duration = state.focusDuration; // Duration in seconds
        const id = crypto.randomUUID();
        const taskState = useTaskStore.getState();
        const task = taskState.tasks.find((item) => item.id === taskState.activeTaskId);

        set({
          history: [
            {
              id,
              time: currentTime,
              type: "Focus Session",
              date: today,
              duration,
              completedAt,
              taskId: task?.id ?? null,
              taskTitle: task?.title ?? "",
              note: "",
            },
            ...state.history,
          ],
        });
        return id;
      },

      updateStreak: () => {
        const state = get();

        const today = getTodayString();
        const yesterday = getYesterdayString();

        if (state.lastCompletedDate === today) return;

        if (state.lastCompletedDate === yesterday || (state.lastCompletedDate && gapIsRest(state.lastCompletedDate, today, state.restDates))) {
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            bestStreak: Math.max(state.bestStreak, newStreak),
            lastCompletedDate: today,
          });
        } else {
          set({
            currentStreak: 1,
            bestStreak: Math.max(state.bestStreak, 1),
            lastCompletedDate: today,
          });
        }
      },

      updateDailyStats: () => {
        const state = get();
        const today = getTodayString();

        const existingStats = state.dailyStats.find((s) => s.date === today);

        if (existingStats) {
          const newSessions = existingStats.sessions + 1;
          const newFocusMinutes = existingStats.focusMinutes + state.focusDuration / 60;
          const averageSessionDuration = (newFocusMinutes * 60) / newSessions;

          set({
            dailyStats: state.dailyStats.map((s) =>
              s.date === today
                ? {
                    ...s,
                    sessions: newSessions,
                    focusMinutes: newFocusMinutes,
                    averageSessionDuration,
                  }
                : s
            ),
          });
        } else {
          set({
            dailyStats: [
              ...state.dailyStats,
              {
                date: today,
                sessions: 1,
                focusMinutes: state.focusDuration / 60,
                averageSessionDuration: state.focusDuration,
              },
            ],
          });
        }
      },

      noteDistraction: (name) => {
        const label = name.trim().slice(0, 80);
        if (!label) return;
        set((state) => {
          if (state.session !== "focus") return {};
          const current = state.sessionApps.find((item) => item.name.toLowerCase() === label.toLowerCase());
          const sessionApps = current
            ? state.sessionApps.map((item) =>
                item.name.toLowerCase() === label.toLowerCase() ? { ...item, seconds: item.seconds + 1 } : item
              )
            : [...state.sessionApps, { name: label, seconds: 1 }];
          return { sessionApps };
        });
      },

      recordActivity: (name, seconds) => {
        const trimmed = name.trim();
        if (!trimmed || seconds <= 0) return;
        const today = getTodayString();
        const label = trimmed.slice(0, 80);
        set((state) => {
          const existing = state.activityLog.find((item) => item.date === today && item.name === label);
          const activityLog = existing
            ? state.activityLog.map((item) => (item === existing ? { ...item, seconds: item.seconds + seconds } : item))
            : [...state.activityLog, { name: label, seconds, date: today }];
          if (!state.running || state.session !== "focus") return { activityLog };
          const current = state.sessionApps.find((item) => item.name === label);
          const sessionApps = current
            ? state.sessionApps.map((item) => (item.name === label ? { ...item, seconds: item.seconds + seconds } : item))
            : [...state.sessionApps, { name: label, seconds }];
          return { activityLog, sessionApps };
        });
      },

      settleReview: (note) => {
        const review = get().sessionReview;
        if (!review) return;
        const text = note.trim().slice(0, 280);
        set({
          sessionReview: null,
          history: get().history.map((item) => (item.id === review.historyId ? { ...item, note: text } : item)),
        });
      },

      dismissReview: () => set({ sessionReview: null }),

      toggleRestDay: (date) =>
        set((state) => ({
          restDates: state.restDates.includes(date)
            ? state.restDates.filter((item) => item !== date)
            : [...state.restDates, date],
        })),

      getYesterdayStats: () => {
        const state = get();
        const yesterday = getYesterdayString();
        return state.dailyStats.find((s) => s.date === yesterday);
      },

      getProductivityComparison: () => {
        const state = get();
        const today = getTodayString();
        const yesterday = getYesterdayString();

        const todayStats = state.dailyStats.find((s) => s.date === today);
        const yesterdayStats = state.dailyStats.find((s) => s.date === yesterday);

        if (!todayStats || !yesterdayStats) {
          return { percentage: 0, label: "No data" };
        }

        const percentage = ((todayStats.focusMinutes - yesterdayStats.focusMinutes) / yesterdayStats.focusMinutes) * 100;

        if (percentage > 0) {
          return { percentage: Math.round(percentage), label: "more productive" };
        } else if (percentage < 0) {
          return { percentage: Math.round(Math.abs(percentage)), label: "less productive" };
        } else {
          return { percentage: 0, label: "same productivity" };
        }
      },

      getFocusInsights: () => {
        const state = get();
        const insights: string[] = [];

        // Analyze daily stats for patterns
        if (state.dailyStats.length >= 2) {
          const avgSessions = state.dailyStats.reduce((sum, day) => sum + day.sessions, 0) / state.dailyStats.length;
          const avgFocus = state.dailyStats.reduce((sum, day) => sum + day.focusMinutes, 0) / state.dailyStats.length;
          const avgSessionDuration = state.dailyStats.reduce((sum, day) => sum + day.averageSessionDuration, 0) / state.dailyStats.length;

          // Insight about session completion rate
          if (avgSessions > 4) {
            insights.push(`You average ${avgSessions.toFixed(1)} sessions per day. Great consistency!`);
          } else if (avgSessions > 0) {
            insights.push(`Try to complete at least 4 sessions daily for better results.`);
          }

          // Insight about focus duration
          if (avgFocus > 120) {
            insights.push(`Your average daily focus time is ${Math.round(avgFocus)} minutes. Excellent dedication!`);
          } else if (avgFocus > 0) {
            insights.push(`Aim for 2+ hours of focus time daily for optimal productivity.`);
          }

          // Insight about average session duration (pattern detection)
          if (avgSessionDuration > 0) {
            const avgMinutes = Math.round(avgSessionDuration / 60);
            if (avgMinutes > 35) {
              insights.push(`Your average session is ${avgMinutes} minutes. Consider shorter breaks to maintain focus.`);
            } else if (avgMinutes < 20) {
              insights.push(`Your average session is ${avgMinutes} minutes. Try extending focus sessions for deeper work.`);
            } else {
              insights.push(`Your average session duration is ${avgMinutes} minutes - a sweet spot for productivity.`);
            }
          }

          // Insight about streak
          if (state.currentStreak >= 7) {
            insights.push(`${state.currentStreak} day streak! You're building a strong habit.`);
          } else if (state.currentStreak > 0) {
            insights.push(`${state.currentStreak} day streak. Keep it going!`);
          }

          // Insight about best streak
          if (state.bestStreak > state.currentStreak && state.currentStreak > 0) {
            const daysToRecord = state.bestStreak - state.currentStreak;
            insights.push(`${daysToRecord} days until you beat your best streak of ${state.bestStreak} days.`);
          }

          // Pattern detection: most productive day
          const dayStats: { [key: number]: { sessions: number; focusMinutes: number } } = {};
          state.dailyStats.forEach((stat) => {
            const day = new Date(stat.date).getDay();
            if (!dayStats[day]) {
              dayStats[day] = { sessions: 0, focusMinutes: 0 };
            }
            dayStats[day].sessions += stat.sessions;
            dayStats[day].focusMinutes += stat.focusMinutes;
          });

          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          let mostProductiveDay = "";
          let maxFocus = 0;

          Object.entries(dayStats).forEach(([day, stats]) => {
            if (stats.focusMinutes > maxFocus) {
              maxFocus = stats.focusMinutes;
              mostProductiveDay = dayNames[Number(day)];
            }
          });

          if (mostProductiveDay && maxFocus > 0) {
            insights.push(`Your most productive day is ${mostProductiveDay} with ${Math.round(maxFocus)} minutes of focus.`);
          }

          // Pattern detection: focus drop-off
          const recentStats = state.dailyStats.slice(-5);
          if (recentStats.length >= 3) {
            const firstHalf = recentStats.slice(0, Math.floor(recentStats.length / 2));
            const secondHalf = recentStats.slice(Math.floor(recentStats.length / 2));
            
            const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.focusMinutes, 0) / firstHalf.length;
            const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.focusMinutes, 0) / secondHalf.length;
            
            if (secondHalfAvg < firstHalfAvg * 0.7) {
              insights.push("Your focus time has decreased recently. Consider reviewing your schedule or taking a rest day.");
            } else if (secondHalfAvg > firstHalfAvg * 1.3) {
              insights.push("Your focus time has improved recently. Keep up the momentum!");
            }
          }
        }

        // Insight about today's progress
        const today = getTodayString();
        const todayStats = state.dailyStats.find((s) => s.date === today);
        if (todayStats) {
          if (todayStats.sessions >= state.dailyGoal) {
            insights.push("Daily goal achieved! Great work today.");
          } else {
            const remaining = state.dailyGoal - todayStats.sessions;
            insights.push(`${remaining} more session${remaining > 1 ? 's' : ''} to reach your daily goal.`);
          }

          // Session duration insight for today
          if (todayStats.averageSessionDuration > 0) {
            const todayAvg = Math.round(todayStats.averageSessionDuration / 60);
            const overallAvg = state.dailyStats.length > 0 
              ? Math.round(state.dailyStats.reduce((sum, s) => sum + s.averageSessionDuration, 0) / state.dailyStats.length / 60)
              : 25;

            if (todayAvg > overallAvg + 5) {
              insights.push(`Today's sessions are longer than usual (${todayAvg} vs ${overallAvg} min avg). Great focus!`);
            } else if (todayAvg < overallAvg - 5) {
              insights.push(`Today's sessions are shorter than usual. Consider extending your next session.`);
            }
          }
        }

        // Default insight if no data
        if (insights.length === 0) {
          insights.push("Start your first focus session to see personalized insights.");
        }

        return insights;
      },

      setFocusDuration: (minutes) =>
        set((state) => ({
          focusDuration: minutes * 60,
          remainingTime:
            state.session === "focus" ? minutes * 60 : state.remainingTime,
        })),

      setBreakDuration: (minutes) =>
        set((state) => ({
          breakDuration: minutes * 60,
          remainingTime:
            state.session === "break" && state.breakKind !== "long" ? minutes * 60 : state.remainingTime,
        })),

      setLongBreakDuration: (minutes) =>
        set((state) => ({
          longBreakDuration: minutes * 60,
          remainingTime:
            state.session === "break" && state.breakKind === "long" ? minutes * 60 : state.remainingTime,
        })),

      setSessionsBeforeLongBreak: (count) =>
        set({
          sessionsBeforeLongBreak: Math.max(1, Math.round(count)),
        }),

      setDailyGoal: (goal) =>
        set({
          dailyGoal: goal,
        }),

      // ----------------------
      // Reset Actions
      // ----------------------

      resetHistory: () =>
        set({
          history: [],
        }),

      resetTodayProgress: () =>
        set({
          completedSessions: 0,
        }),

      resetStreak: () =>
        set({
          currentStreak: 0,
          lastCompletedDate: null,
        }),

      resetSettings: () =>
        set({
          focusDuration: DEFAULT_FOCUS_DURATION,
          breakDuration: DEFAULT_BREAK_DURATION,
          longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
          sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
          dailyGoal: DEFAULT_DAILY_GOAL,
          remainingTime: DEFAULT_FOCUS_DURATION,
        }),

      resetAllData: () =>
        set({
          session: "focus",
          running: false,

          focusDuration: DEFAULT_FOCUS_DURATION,
          breakDuration: DEFAULT_BREAK_DURATION,
          longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
          sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
          breakKind: "short",

          dailyGoal: DEFAULT_DAILY_GOAL,

          remainingTime: DEFAULT_FOCUS_DURATION,

          completedSessions: 0,
          sessionReview: null,
          sessionApps: [],
          restDates: [],

          history: [],
          dailyStats: [],
          activityLog: [],

          currentStreak: 0,
          bestStreak: 0,
          lastCompletedDate: null,
        }),
    }),
    {
      name: "focus-companion-storage",

      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsBeforeLongBreak: state.sessionsBeforeLongBreak,
        dailyGoal: state.dailyGoal,

        completedSessions: state.completedSessions,
        history: state.history,
        dailyStats: state.dailyStats,
        activityLog: state.activityLog,
        sessionReview: state.sessionReview,
        restDates: state.restDates,

        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        lastCompletedDate: state.lastCompletedDate,
      }),
    },
  ),
);
