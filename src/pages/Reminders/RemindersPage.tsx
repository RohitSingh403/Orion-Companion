// src/pages/Reminders/RemindersPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useReminderStore } from "../../store/reminderStore";
import { useSettingsStore } from "../../store/settingsStore";
import { FiPlus, FiBell, FiClock, FiCheck, FiX, FiRepeat } from "react-icons/fi";
import type { ReminderFrequency } from "../../types/reminder";

export default function RemindersPage() {
  const { reminders, addReminder, completeReminder, dismissReminder, deleteReminder } = useReminderStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";
  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "",
    frequency: "once" as ReminderFrequency,
    customDays: [] as number[],
    customInterval: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder({
      ...newReminder,
      dueDate: new Date(newReminder.dueDate).toISOString(),
    });
    setShowModal(false);
    setNewReminder({
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      dueTime: "",
      frequency: "once",
      customDays: [],
      customInterval: 1,
    });
  };

  const pendingReminders = reminders.filter((r) => r.status === "pending");
  const completedReminders = reminders.filter((r) => r.status === "completed");

  const formatDueDate = (date: string, time?: string) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(d);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dateStr = "";
    if (diffDays === 0) dateStr = "Today";
    else if (diffDays === 1) dateStr = "Tomorrow";
    else if (diffDays === -1) dateStr = "Yesterday";
    else dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    if (time) {
      return `${dateStr} at ${time}`;
    }
    return dateStr;
  };

  const getFrequencyLabel = (frequency: ReminderFrequency) => {
    switch (frequency) {
      case "once": return "Once";
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "custom": return "Custom";
      default: return frequency;
    }
  };

  return (
    <AppLayout>
      <Topbar subtitle="Never forget important tasks and events" />
      <div className="flex-1 p-8 overflow-auto">
        <div className={`rounded-lg p-6 h-full flex flex-col border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${
              isDark ? "text-violet-400" : "text-violet-600"
            }`}>Your Reminders</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm font-medium"
            >
              <FiPlus className="w-4 h-4" />
              Add Reminder
            </button>
          </div>

          {/* Reminders List */}
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            {pendingReminders.length === 0 && completedReminders.length === 0 ? (
              <div className={`text-center py-12 border border-dashed rounded-lg ${
                isDark 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <FiBell className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`} />
                <p className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>No reminders yet</p>
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Create your first reminder to stay organized</p>
              </div>
            ) : (
              <>
                {/* Pending Reminders */}
                {pendingReminders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className={`text-sm font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>Pending</h3>
                    {pendingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`border rounded-lg p-4 transition-all ${
                          isDark 
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${
                                isDark ? "text-gray-100" : "text-gray-900"
                              }`}>{reminder.title}</h4>
                              {reminder.frequency !== "once" && (
                                <span className={`text-xs px-2 py-0.5 rounded border ${
                                  isDark 
                                    ? "bg-violet-500/10 text-violet-400 border-violet-500/30" 
                                    : "bg-violet-50 text-violet-600 border-violet-200"
                                }`}>
                                  <FiRepeat className="w-3 h-3 inline mr-1" />
                                  {getFrequencyLabel(reminder.frequency)}
                                </span>
                              )}
                            </div>
                            {reminder.description && (
                              <p className={`text-sm mb-2 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}>{reminder.description}</p>
                            )}
                            <div className={`flex items-center gap-2 text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}>
                              <FiClock className="w-3 h-3" />
                              {formatDueDate(reminder.dueDate, reminder.dueTime)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => completeReminder(reminder.id)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isDark 
                                  ? "text-violet-400 hover:bg-gray-600" 
                                  : "text-violet-600 hover:bg-gray-200"
                              }`}
                              title="Complete"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => dismissReminder(reminder.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark ? "hover:text-red-400" : "hover:text-red-600"
                              }`}
                              title="Dismiss"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Reminders */}
                {completedReminders.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className={`text-sm font-medium uppercase tracking-wider ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>Completed</h3>
                    {completedReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`border rounded-lg p-4 opacity-60 ${
                          isDark 
                            ? "bg-gray-700 border-gray-600" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium line-through ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}>{reminder.title}</h4>
                            {reminder.description && (
                              <p className={`text-sm line-through ${
                                isDark ? "text-gray-500" : "text-gray-500"
                              }`}>{reminder.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark ? "hover:text-red-400" : "hover:text-red-600"
                            }`}
                            title="Delete"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`border rounded-lg p-6 w-full max-w-md shadow-sm ${
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? "text-violet-400" : "text-violet-600"
            }`}>New Reminder</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`text-sm font-medium mb-1 block ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500 placeholder-gray-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500 placeholder-gray-400"
                  } border`}
                  placeholder="What do you need to remember?"
                  required
                />
              </div>
              <div>
                <label className={`text-sm font-medium mb-1 block ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Description (optional)</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className={`w-full h-20 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500 placeholder-gray-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500 placeholder-gray-400"
                  } border`}
                  placeholder="Add more details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>Date</label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                    } border`}
                    required
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>Time (optional)</label>
                  <input
                    type="time"
                    value={newReminder.dueTime}
                    onChange={(e) => setNewReminder({ ...newReminder, dueTime: e.target.value })}
                    className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                    } border`}
                  />
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium mb-1 block ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Repeat</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value as ReminderFrequency })}
                  className={`w-full h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                  } border`}
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Custom Days of Week */}
              {newReminder.frequency === "custom" && (
                <div>
                  <label className={`text-sm font-medium mb-2 block ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>Repeat on</label>
                  <div className="flex gap-2 flex-wrap">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const newDays = newReminder.customDays.includes(idx)
                            ? newReminder.customDays.filter((d) => d !== idx)
                            : [...newReminder.customDays, idx];
                          setNewReminder({ ...newReminder, customDays: newDays });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          newReminder.customDays.includes(idx)
                            ? "btn-primary"
                            : isDark 
                              ? "bg-gray-700 text-gray-400 hover:bg-gray-600" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {day.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Interval */}
              {newReminder.frequency === "custom" && (
                <div>
                  <label className={`text-sm font-medium mb-1 block ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>Repeat every</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={newReminder.customInterval}
                      onChange={(e) => setNewReminder({ ...newReminder, customInterval: Number(e.target.value) })}
                      className={`w-20 h-10 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                        isDark 
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500" 
                          : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500"
                      } border`}
                    />
                    <span className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}>days</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 btn-secondary rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 btn-primary rounded-lg text-sm font-medium"
                >
                  Create Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
