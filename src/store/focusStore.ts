import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayString, getYesterdayString } from "../utils/date";

export type SessionType = "focus" | "break";

export interface SessionHistoryItem {
  id: string;
  time: string;
  type: "Focus Session";
  date: string; // YYYY-MM-DD format
  duration: number; // in seconds
  completedAt: string; // ISO timestamp
}

export interface DailyStats {
  date: string;
  sessions: number;
  focusMinutes: number;
  averageSessionDuration: number; // in seconds
}

// ----------------------
// Default Values
// ----------------------

const DEFAULT_FOCUS_DURATION = 25 * 60;
const DEFAULT_BREAK_DURATION = 5 * 60;
const DEFAULT_DAILY_GOAL = 8;

interface FocusState {
  session: SessionType;

  focusDuration: number;
  breakDuration: number;

  dailyGoal: number;

  remainingTime: number;

  running: boolean;

  completedSessions: number;

  // Session History
  history: SessionHistoryItem[];

  // Streak
  currentStreak: number;
  lastCompletedDate: string | null;
  bestStreak: number;

  // Daily Statistics
  dailyStats: DailyStats[];

  start: () => void;
  pause: () => void;
  reset: () => void;

  tick: () => void;

  addHistory: () => void;
  updateStreak: () => void;
  updateDailyStats: () => void;
  getYesterdayStats: () => DailyStats | undefined;
  getProductivityComparison: () => { percentage: number; label: string };
  getFocusInsights: () => string[];

  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
  setDailyGoal: (goal: number) => void;

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

      dailyGoal: DEFAULT_DAILY_GOAL,

      remainingTime: DEFAULT_FOCUS_DURATION,

      running: false,

      completedSessions: 0,

      history: [],

      currentStreak: 0,
      lastCompletedDate: null,
      bestStreak: 0,

      dailyStats: [],

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
          running: false,
          remainingTime: state.focusDuration,
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
          get().addHistory();
          get().updateStreak();

          set({
            session: "break",
            remainingTime: state.breakDuration,
            completedSessions: state.completedSessions + 1,
          });

          return;
        }

        // Break completed
        set({
          session: "focus",
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

        set({
          history: [
            {
              id: crypto.randomUUID(),
              time: currentTime,
              type: "Focus Session",
              date: today,
              duration,
              completedAt,
            },
            ...state.history,
          ],
        });
      },

      updateStreak: () => {
        const state = get();

        const today = getTodayString();
        const yesterday = getYesterdayString();

        if (state.lastCompletedDate === today) return;

        if (state.lastCompletedDate === yesterday) {
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
            state.session === "break" ? minutes * 60 : state.remainingTime,
        })),

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
          dailyGoal: DEFAULT_DAILY_GOAL,
          remainingTime: DEFAULT_FOCUS_DURATION,
        }),

      resetAllData: () =>
        set({
          session: "focus",
          running: false,

          focusDuration: DEFAULT_FOCUS_DURATION,
          breakDuration: DEFAULT_BREAK_DURATION,

          dailyGoal: DEFAULT_DAILY_GOAL,

          remainingTime: DEFAULT_FOCUS_DURATION,

          completedSessions: 0,

          history: [],

          currentStreak: 0,
          lastCompletedDate: null,
        }),
    }),
    {
      name: "focus-companion-storage",

      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        dailyGoal: state.dailyGoal,

        completedSessions: state.completedSessions,
        history: state.history,

        currentStreak: state.currentStreak,
        lastCompletedDate: state.lastCompletedDate,
      }),
    },
  ),
);
