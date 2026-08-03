// src/pages/AICompanion/AICompanionPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useAICompanionStore } from "../../store/aiCompanionStore";
import { FiSun, FiMoon, FiCalendar, FiRefreshCw, FiZap, FiTarget } from "react-icons/fi";

export default function AICompanionPage() {
  const { suggestions, generateMorningSuggestion, generateEveningSuggestion, generateWeeklySuggestion, clearSuggestions } = useAICompanionStore();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (type: "morning" | "evening" | "weekly") => {
    setLoading(true);
    clearSuggestions();
    
    // Simulate AI processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    switch (type) {
      case "morning":
        generateMorningSuggestion();
        break;
      case "evening":
        generateEveningSuggestion();
        break;
      case "weekly":
        generateWeeklySuggestion();
        break;
    }
    
    setLoading(false);
  };

  const getCurrentHour = () => {
    return new Date().getHours();
  };

  const getTimeOfDay = () => {
    const hour = getCurrentHour();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const timeOfDay = getTimeOfDay();

  return (
    <AppLayout>
      <Topbar greeting="AI Companion 🤖" subtitle="Personalized productivity insights based on your patterns" />
      <div className="flex-1 overflow-hidden p-8">
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Your Personal Assistant</h2>
              <p className="text-xs text-zinc-500 mt-1">Get context-aware suggestions based on your work patterns</p>
            </div>
            <button
              onClick={() => clearSuggestions()}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              Clear
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleGenerate("morning")}
              disabled={loading}
              className="flex flex-col items-center gap-2 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-zinc-900/80 transition group"
            >
              <FiSun className="w-6 h-6 text-amber-400 group-hover:text-amber-300" />
              <span className="text-xs font-semibold text-zinc-300">Morning Plan</span>
            </button>
            <button
              onClick={() => handleGenerate("evening")}
              disabled={loading}
              className="flex flex-col items-center gap-2 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-purple-500/50 hover:bg-zinc-900/80 transition group"
            >
              <FiMoon className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
              <span className="text-xs font-semibold text-zinc-300">Evening Summary</span>
            </button>
            <button
              onClick={() => handleGenerate("weekly")}
              disabled={loading}
              className="flex flex-col items-center gap-2 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-zinc-900/80 transition group"
            >
              <FiCalendar className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
              <span className="text-xs font-semibold text-zinc-300">Weekly Review</span>
            </button>
          </div>

          {/* Suggestions Display */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                <p className="text-sm text-zinc-400">Analyzing your patterns...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <FiZap className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No suggestions yet</p>
                <p className="text-xs text-zinc-600 mt-1">
                  {timeOfDay === "morning" && "Generate your morning plan to start the day right"}
                  {timeOfDay === "afternoon" && "Generate insights to optimize your afternoon"}
                  {timeOfDay === "evening" && "Generate an evening summary to review your day"}
                </p>
                <button
                  onClick={() => handleGenerate(timeOfDay === "morning" ? "morning" : "evening")}
                  className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-xs font-semibold transition"
                >
                  Generate {timeOfDay === "morning" ? "Morning Plan" : "Evening Summary"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiTarget className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-600 text-center">
              Suggestions are based on your local focus patterns, task completion, and productivity data. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
