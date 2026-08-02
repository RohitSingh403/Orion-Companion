// src/pages/Reminders/RemindersPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useReminderStore } from "../../store/reminderStore";
import { FiPlus, FiBell, FiClock, FiCheck, FiX, FiRepeat } from "react-icons/fi";
import type { ReminderFrequency } from "../../types/reminder";

export default function RemindersPage() {
  const { reminders, addReminder, completeReminder, dismissReminder, deleteReminder } = useReminderStore();
  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "",
    frequency: "once" as ReminderFrequency,
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
      <Topbar greeting="Reminders 🔔" subtitle="Never forget important tasks and events" />
      <div className="flex-1 overflow-hidden p-8">
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-100">Your Reminders</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-xs font-semibold transition"
            >
              <FiPlus className="w-4 h-4" />
              Add Reminder
            </button>
          </div>

          {/* Reminders List */}
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            {pendingReminders.length === 0 && completedReminders.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <FiBell className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No reminders yet</p>
                <p className="text-xs text-zinc-600 mt-1">Create your first reminder to stay organized</p>
              </div>
            ) : (
              <>
                {/* Pending Reminders */}
                {pendingReminders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending</h3>
                    {pendingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-zinc-100">{reminder.title}</h4>
                              {reminder.frequency !== "once" && (
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  <FiRepeat className="w-3 h-3 inline mr-1" />
                                  {getFrequencyLabel(reminder.frequency)}
                                </span>
                              )}
                            </div>
                            {reminder.description && (
                              <p className="text-xs text-zinc-400 mb-2">{reminder.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                              <FiClock className="w-3 h-3" />
                              {formatDueDate(reminder.dueDate, reminder.dueTime)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => completeReminder(reminder.id)}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition"
                              title="Complete"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => dismissReminder(reminder.id)}
                              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition"
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
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Completed</h3>
                    {completedReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 opacity-60"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-zinc-400 line-through">{reminder.title}</h4>
                            {reminder.description && (
                              <p className="text-xs text-zinc-500 line-through">{reminder.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex items-center justify-center transition"
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
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-zinc-100 mb-4">New Reminder</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="What do you need to remember?"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Description (optional)</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full h-20 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Add more details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                    className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">Time (optional)</label>
                  <input
                    type="time"
                    value={newReminder.dueTime}
                    onChange={(e) => setNewReminder({ ...newReminder, dueTime: e.target.value })}
                    className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Repeat</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value as ReminderFrequency })}
                  className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-xs font-semibold transition"
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
