import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useFocusStore } from "./focusStore";
import { useTaskStore } from "./taskStore";

interface AICompanionState {
  suggestions: string[];
  lastSuggestionTime: string;
  
  // Generate suggestions
  generateMorningSuggestion: () => void;
  generateEveningSuggestion: () => void;
  generateWeeklySuggestion: () => void;
  clearSuggestions: () => void;
}

export const useAICompanionStore = create<AICompanionState>()(
  persist(
    (set) => ({
      suggestions: [],
      lastSuggestionTime: "",
      
      generateMorningSuggestion: () => {
        const focusStore = useFocusStore.getState();
        const taskStore = useTaskStore.getState();
        
        const suggestions: string[] = [];
        
        // Get today's tasks
        const todayTasks = taskStore.tasks.filter((t) => !t.completed);
        const pendingTasksCount = todayTasks.length;
        
        // Get yesterday's stats
        const yesterdayStats = focusStore.getYesterdayStats();
        
        // Morning suggestion based on tasks
        if (pendingTasksCount > 0) {
          const highPriorityTasks = todayTasks.filter((t) => t.priority === "high").length;
          if (highPriorityTasks > 0) {
            suggestions.push(`You have ${pendingTasksCount} tasks today, including ${highPriorityTasks} high-priority items. Start with the highest-priority task before noon for maximum productivity.`);
          } else {
            suggestions.push(`You have ${pendingTasksCount} tasks today. Based on your patterns, tackle the most challenging task first while your energy is high.`);
          }
        }
        
        // Morning suggestion based on yesterday's performance
        if (yesterdayStats) {
          if (yesterdayStats.sessions >= focusStore.dailyGoal) {
            suggestions.push(`Yesterday you completed ${yesterdayStats.sessions} sessions - you exceeded your daily goal! Keep that momentum going today.`);
          } else if (yesterdayStats.sessions > 0) {
            const remaining = focusStore.dailyGoal - yesterdayStats.sessions;
            suggestions.push(`Yesterday you completed ${yesterdayStats.sessions} sessions. Aim for ${remaining} more today to reach your goal.`);
          }
        }
        
        // Morning suggestion based on most productive day
        const dayStats: { [key: number]: { sessions: number; focusMinutes: number } } = {};
        focusStore.dailyStats.forEach((stat) => {
          const day = new Date(stat.date).getDay();
          if (!dayStats[day]) {
            dayStats[day] = { sessions: 0, focusMinutes: 0 };
          }
          dayStats[day].sessions += stat.sessions;
          dayStats[day].focusMinutes += stat.focusMinutes;
        });
        
        const currentDay = new Date().getDay();
        const currentDayStats = dayStats[currentDay];
        
        if (currentDayStats && currentDayStats.focusMinutes > 0) {
          suggestions.push(`Your average focus time on ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay]} is ${Math.round(currentDayStats.focusMinutes)} minutes. Today's a great day to maintain that pattern.`);
        }
        
        // Default suggestion
        if (suggestions.length === 0) {
          suggestions.push("Good morning! Start with a focus session to set a productive tone for the day.");
        }
        
        set({
          suggestions,
          lastSuggestionTime: new Date().toISOString(),
        });
      },
      
      generateEveningSuggestion: () => {
        const focusStore = useFocusStore.getState();
        const taskStore = useTaskStore.getState();
        
        const suggestions: string[] = [];
        const today = new Date().toISOString().split("T")[0];
        
        // Get today's stats
        const todayStats = focusStore.dailyStats.find((s) => s.date === today);
        
        // Get today's completed tasks
        const completedTasks = taskStore.tasks.filter((t) => t.completed);
        const totalTasks = taskStore.tasks.length;
        
        // Evening summary
        if (todayStats) {
          const hours = Math.floor(todayStats.focusMinutes / 60);
          const minutes = Math.round(todayStats.focusMinutes % 60);
          const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
          
          suggestions.push(`You completed ${todayStats.sessions} focus sessions today, totaling ${timeStr} of focused work.`);
          
          if (todayStats.sessions >= focusStore.dailyGoal) {
            suggestions.push("🎉 Daily goal achieved! Excellent work today.");
          } else {
            const remaining = focusStore.dailyGoal - todayStats.sessions;
            suggestions.push(`You completed ${todayStats.sessions} of ${focusStore.dailyGoal} planned sessions. ${remaining} session${remaining > 1 ? 's' : ''} remaining.`);
          }
        }
        
        // Task completion summary
        if (totalTasks > 0) {
          const completionRate = Math.round((completedTasks.length / totalTasks) * 100);
          suggestions.push(`You completed ${completedTasks.length} of ${totalTasks} tasks (${completionRate}% completion rate).`);
          
          const remainingTasks = totalTasks - completedTasks.length;
          if (remainingTasks > 0) {
            suggestions.push(`${remainingTasks} task${remainingTasks > 1 ? 's' : ''} remaining. Tomorrow looks like a good opportunity to finish ${remainingTasks > 1 ? 'them' : 'it'}.`);
          }
        }
        
        // Streak insight
        if (focusStore.currentStreak > 0) {
          suggestions.push(`Current streak: ${focusStore.currentStreak} day${focusStore.currentStreak > 1 ? 's' : ''}. ${focusStore.currentStreak >= 7 ? "You're building a strong habit!" : "Keep it going!"}`);
        }
        
        // Tomorrow's preview
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        
        const tomorrowReminders = taskStore.tasks.filter((t) => t.dueDate === tomorrowStr);
        if (tomorrowReminders.length > 0) {
          suggestions.push(`Tomorrow you have ${tomorrowReminders.length} task${tomorrowReminders.length > 1 ? 's' : ''} due. Plan your focus sessions accordingly.`);
        }
        
        // Default suggestion
        if (suggestions.length === 0) {
          suggestions.push("Good evening! Take some time to rest and recharge for tomorrow.");
        }
        
        set({
          suggestions,
          lastSuggestionTime: new Date().toISOString(),
        });
      },
      
      generateWeeklySuggestion: () => {
        const focusStore = useFocusStore.getState();
        const taskStore = useTaskStore.getState();
        
        const suggestions: string[] = [];
        
        // Get last 7 days of stats
        const last7Days = focusStore.dailyStats.slice(-7);
        
        if (last7Days.length > 0) {
          const totalSessions = last7Days.reduce((sum, day) => sum + day.sessions, 0);
          const totalFocus = last7Days.reduce((sum, day) => sum + day.focusMinutes, 0);
          const avgSessions = totalSessions / last7Days.length;
          
          suggestions.push(`This week you completed ${totalSessions} focus sessions, averaging ${avgSessions.toFixed(1)} sessions per day.`);
          suggestions.push(`Total focus time: ${Math.round(totalFocus)} minutes (${Math.round(totalFocus / 60)} hours).`);
          
          // Most productive day
          const dayStats: { [key: number]: { sessions: number; focusMinutes: number } } = {};
          last7Days.forEach((stat) => {
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
            suggestions.push(`Your most productive day was ${mostProductiveDay} with ${Math.round(maxFocus)} minutes of focus.`);
          }
          
          // Streak insight
          if (focusStore.currentStreak >= 7) {
            suggestions.push(`${focusStore.currentStreak} day streak! You're building excellent consistency.`);
          }
          
          // Best streak comparison
          if (focusStore.bestStreak > focusStore.currentStreak) {
            const daysToRecord = focusStore.bestStreak - focusStore.currentStreak;
            suggestions.push(`${daysToRecord} days until you beat your best streak of ${focusStore.bestStreak} days.`);
          }
          
          // Task completion
          const completedTasks = taskStore.tasks.filter((t) => t.completed).length;
          const totalTasks = taskStore.tasks.length;
          if (totalTasks > 0) {
            const completionRate = Math.round((completedTasks / totalTasks) * 100);
            suggestions.push(`Task completion rate: ${completionRate}% (${completedTasks}/${totalTasks} tasks).`);
          }
        }
        
        // Default suggestion
        if (suggestions.length === 0) {
          suggestions.push("Start tracking your focus sessions to see weekly productivity insights.");
        }
        
        set({
          suggestions,
          lastSuggestionTime: new Date().toISOString(),
        });
      },
      
      clearSuggestions: () => {
        set({ suggestions: [] });
      },
    }),
    {
      name: "ai-companion-storage",
    }
  )
);
