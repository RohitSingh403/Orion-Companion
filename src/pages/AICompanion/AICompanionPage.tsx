// src/pages/AICompanion/AICompanionPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useAICompanionStore } from "../../store/aiCompanionStore";
import { useSettingsStore } from "../../store/settingsStore";
import { FiSun, FiMoon, FiCalendar, FiRefreshCw, FiZap, FiTarget } from "react-icons/fi";

export default function AICompanionPage() {
  const { suggestions, generateMorningSuggestion, generateEveningSuggestion, generateWeeklySuggestion, clearSuggestions } = useAICompanionStore();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";
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
      <Topbar subtitle="Personalized productivity insights based on your patterns" />
      <div className="flex-1 p-8 overflow-auto">
        <div className={`rounded-lg p-6 h-full flex flex-col border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-semibold ${
                isDark ? "text-violet-400" : "text-violet-600"
              }`}>Your Personal Assistant</h2>
              <p className={`text-sm mt-1 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}>Get context-aware suggestions based on your work patterns</p>
            </div>
            <button
              onClick={() => clearSuggestions()}
              className={`text-sm transition-colors ${
                isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Clear
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleGenerate("morning")}
              disabled={loading}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all group ${
                isDark 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FiSun className="w-6 h-6 text-amber-400 group-hover:text-amber-300" />
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>Morning Plan</span>
            </button>
            <button
              onClick={() => handleGenerate("evening")}
              disabled={loading}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all group ${
                isDark 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FiMoon className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>Evening Summary</span>
            </button>
            <button
              onClick={() => handleGenerate("weekly")}
              disabled={loading}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all group ${
                isDark 
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <FiCalendar className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
              <span className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>Weekly Review</span>
            </button>
          </div>

          {/* Suggestions Display */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <FiRefreshCw className={`w-8 h-8 animate-spin mb-3 ${
                  isDark ? "text-violet-400" : "text-violet-600"
                }`} />
                <p className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>Analyzing your patterns...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className={`text-center py-12 border border-dashed rounded-lg ${
                isDark 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-gray-50 border-gray-200"
              }`}>
                <FiZap className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`} />
                <p className={`text-sm ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>No suggestions yet</p>
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  {timeOfDay === "morning" && "Generate your morning plan to start the day right"}
                  {timeOfDay === "afternoon" && "Generate insights to optimize your afternoon"}
                  {timeOfDay === "evening" && "Generate an evening summary to review your day"}
                </p>
                <button
                  onClick={() => handleGenerate(timeOfDay === "morning" ? "morning" : "evening")}
                  className="mt-4 px-4 py-2 btn-primary rounded-lg text-sm font-medium"
                >
                  Generate {timeOfDay === "morning" ? "Morning Plan" : "Evening Summary"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isDark 
                        ? "bg-gray-800 border-violet-500/40" 
                        : "bg-white border-violet-200"
                    }`}>
                      <FiTarget className={`w-4 h-4 ${
                        isDark ? "text-violet-400" : "text-violet-600"
                      }`} />
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`mt-6 pt-4 border-t ${
            isDark 
              ? "border-gray-700" 
              : "border-gray-200"
          }`}>
            <p className={`text-xs text-center ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}>
              Suggestions are based on your local focus patterns, task completion, and productivity data. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
