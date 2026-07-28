// src/pages/Calendar/CalendarPage.tsx

import { useState, useMemo } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useTaskStore } from "../../store/taskStore";
import { FiChevronLeft, FiChevronRight, FiClock, FiPlus, FiMoreVertical } from "react-icons/fi";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const { tasks, updateTask } = useTaskStore();

  // Generate week dates
  const weekDates = useMemo(() => {
    const dates = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      const isToday = new Date().toDateString() === date.toDateString();
      
      dates.push({
        day: days[i],
        date: date.getDate(),
        fullDate: date,
        active: isToday,
      });
    }
    return dates;
  }, [currentWeekStart]);

  // Generate time slots (6 AM to 10 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 ${ampm}`);
    }
    return slots;
  }, []);

  // Format date range for header
  const formatDateRange = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${currentWeekStart.toLocaleDateString("en-US", options)} – ${endOfWeek.toLocaleDateString("en-US", options)}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    // Calculate the target date based on the day index
    const targetDate = new Date(currentWeekStart);
    targetDate.setDate(targetDate.getDate() + dayIndex);
    targetDate.setHours(hour, 0, 0, 0);

    // Update the task's due date
    updateTask(taskId, { dueDate: targetDate.toISOString() });
  };

  // Filter tasks for the current week
  const weeklyTasks = useMemo(() => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= currentWeekStart && dueDate < endOfWeek;
    });
  }, [tasks, currentWeekStart]);

  return (
    <AppLayout>
      <Topbar greeting="Calendar Schedule 📅" subtitle="Plan your focus sessions & meetings" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Header Controls */}
        <div className="flex items-center justify-between glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {(["month", "week", "day"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  viewMode === mode
                    ? "bg-emerald-500 text-zinc-950 shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigateWeek("prev")} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-zinc-100">
              {formatDateRange()}
            </span>
            <button onClick={() => navigateWeek("next")} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={goToToday} className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition">
            Today
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-3 text-center">
          {weekDates.map((d) => (
            <div
              key={d.date}
              className={`p-3 rounded-2xl border transition cursor-pointer ${
                d.active
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 glow-emerald"
                  : "glass-card text-zinc-400 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <p className="text-xs font-medium">{d.day}</p>
              <p className="text-lg font-bold text-zinc-100 mt-0.5">{d.date}</p>
            </div>
          ))}
        </div>

        {/* Interactive Timeline Grid */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <FiClock className="text-emerald-400" /> Hourly Schedule
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-semibold transition">
              <FiPlus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
          <div className="space-y-3">
            {timeSlots.map((time, timeIdx) => (
              <div key={time} className="flex items-start gap-4 pt-2 border-t border-zinc-800/50">
                <span className="w-16 text-xs text-zinc-500 font-medium">{time}</span>
                <div className="flex-1 min-h-[48px] rounded-xl bg-zinc-900/40 border border-dashed border-zinc-800/80 p-2 relative hover:border-zinc-700/60 transition cursor-pointer group">
                  {weekDates.map((_, dayIdx) => (
                    <div
                      key={`${dayIdx}-${timeIdx}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, dayIdx, timeIdx + 6)}
                      className="absolute inset-0"
                    />
                  ))}
                  {timeIdx === 2 && (
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-lg text-xs font-medium shadow-sm">
                      🎯 Deep Focus Session — Build Workspace UI (9:00 AM - 11:00 AM)
                    </div>
                  )}
                  {timeIdx === 4 && (
                    <div className="bg-purple-500/20 border border-purple-500/40 text-purple-300 p-2.5 rounded-lg text-xs font-medium shadow-sm">
                      🎨 Design Review Meeting (11:00 AM - 12:00 PM)
                    </div>
                  )}
                  {timeIdx === 5 && (
                    <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 p-2 rounded-lg text-xs font-medium shadow-sm">
                      ☕ Scheduled Rest Break (1:00 PM - 1:15 PM)
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-[10px] text-zinc-500">+ Add</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks This Week */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <FiClock className="text-emerald-400" /> Tasks This Week
          </h3>
          {weeklyTasks.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No tasks scheduled for this week.</p>
          ) : (
            <div className="space-y-2">
              {weeklyTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                  className="flex items-center justify-between p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition cursor-move"
                >
                  <div className="flex items-center gap-3">
                    <FiMoreVertical className="w-4 h-4 text-zinc-500" />
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === "high" ? "bg-red-500" : 
                      task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    <span className="text-xs font-medium text-zinc-200">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.dueDate && (
                      <span className="text-[10px] text-zinc-500">
                        {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                      {task.completedFocusSessions}/{task.estimatedFocusSessions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
