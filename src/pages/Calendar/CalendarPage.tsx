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
  const [currentDay, setCurrentDay] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    now.setDate(1);
    now.setHours(0, 0, 0, 0);
    return now;
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
    if (viewMode === "week") {
      const endOfWeek = new Date(currentWeekStart);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
      return `${currentWeekStart.toLocaleDateString("en-US", options)} – ${endOfWeek.toLocaleDateString("en-US", options)}`;
    } else if (viewMode === "day") {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric", year: "numeric" };
      return currentDay.toLocaleDateString("en-US", options);
    } else if (viewMode === "month") {
      const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
      return currentMonth.toLocaleDateString("en-US", options);
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDay);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setCurrentDay(newDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setCurrentWeekStart(new Date(now));
    setCurrentDay(new Date(now));
    setCurrentMonth(new Date(now));
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

  // Filter tasks for the current view
  const filteredTasks = useMemo(() => {
    if (viewMode === "week") {
      const endOfWeek = new Date(currentWeekStart);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= currentWeekStart && dueDate < endOfWeek;
      });
    } else if (viewMode === "day") {
      const endOfDay = new Date(currentDay);
      endOfDay.setHours(23, 59, 59, 999);
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= currentDay && dueDate <= endOfDay;
      });
    } else if (viewMode === "month") {
      const endOfMonth = new Date(currentMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      return tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= currentMonth && dueDate <= endOfMonth;
      });
    }
    return tasks;
  }, [tasks, viewMode, currentWeekStart, currentDay, currentMonth]);

  // Generate month calendar grid
  const monthGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    let week = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
      week.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      week.push({ day, date, isToday });

      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }

    // Add remaining cells to complete the last week
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      days.push(week);
    }

    return days;
  }, [currentMonth]);

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
            <button 
              onClick={() => {
                if (viewMode === "week") navigateWeek("prev");
                else if (viewMode === "day") navigateDay("prev");
                else if (viewMode === "month") navigateMonth("prev");
              }} 
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-zinc-100">
              {formatDateRange()}
            </span>
            <button 
              onClick={() => {
                if (viewMode === "week") navigateWeek("next");
                else if (viewMode === "day") navigateDay("next");
                else if (viewMode === "month") navigateMonth("next");
              }} 
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={goToToday} className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition">
            Today
          </button>
        </div>

        {/* Week View */}
        {viewMode === "week" && (
          <>
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
          </>
        )}

        {/* Month View */}
        {viewMode === "month" && (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-xs font-semibold text-zinc-500 uppercase">
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {monthGrid.map((week, weekIdx) => (
                <div key={weekIdx} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`p-2 rounded-xl border transition cursor-pointer min-h-[60px] ${
                        day
                          ? day.isToday
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 glow-emerald"
                            : "glass-card text-zinc-400 border-zinc-800/80 hover:border-zinc-700"
                          : "border-transparent"
                      }`}
                    >
                      {day && (
                        <>
                          <p className="text-xs font-bold text-zinc-100">{day.day}</p>
                          <div className="mt-1 space-y-1">
                            {filteredTasks
                              .filter((task) => {
                                if (!task.dueDate) return false;
                                const dueDate = new Date(task.dueDate);
                                return dueDate.toDateString() === day.date.toDateString();
                              })
                              .slice(0, 2)
                              .map((task) => (
                                <div
                                  key={task.id}
                                  className="text-[9px] truncate bg-zinc-800/80 px-1 py-0.5 rounded text-zinc-300"
                                >
                                  {task.title}
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day View */}
        {viewMode === "day" && (
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <FiClock className="text-emerald-400" /> Daily Schedule
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
                    {filteredTasks
                      .filter((task) => {
                        if (!task.dueDate) return false;
                        const dueDate = new Date(task.dueDate);
                        return dueDate.getDate() === currentDay.getDate() &&
                               dueDate.getMonth() === currentDay.getMonth() &&
                               dueDate.getFullYear() === currentDay.getFullYear() &&
                               dueDate.getHours() === timeIdx + 6;
                      })
                      .map((task) => (
                        <div
                          key={task.id}
                          className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-lg text-xs font-medium shadow-sm"
                        >
                          {task.title}
                        </div>
                      ))}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-[10px] text-zinc-500">+ Add</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks for Current View */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <FiClock className="text-emerald-400" /> Tasks {viewMode === "week" ? "This Week" : viewMode === "day" ? "Today" : "This Month"}
          </h3>
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">No tasks scheduled for this period.</p>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
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
