// src/pages/Notes/NotesPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import {
  FiSearch,
  FiPlus,
  FiBold,
  FiItalic,
  FiList,
  FiPaperclip,
  FiLink,
  FiCheckSquare,
} from "react-icons/fi";

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export default function NotesPage() {
  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Daily Plan",
      date: "Today - 10:30 AM",
      content: `# Daily Plan\n\n## Top Priorities\n- Build Workspace UI\n- Fix Timer Bug\n- Write Documentation\n\n## Notes\nFocus on creating a beautiful and intuitive workspace for better productivity.\n\n#plan #work`,
      tags: ["plan", "work"],
    },
    {
      id: "2",
      title: "Project Ideas",
      date: "Yesterday",
      content: `# Project Ideas\n- AI Productivity Assistant integration\n- Custom color themes`,
      tags: ["ideas"],
    },
    {
      id: "3",
      title: "Meeting Notes",
      date: "May 18",
      content: `# Meeting Notes\nReviewed Phase 2 features and design system.`,
      tags: ["meeting"],
    },
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>("1");
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  return (
    <AppLayout>
      <Topbar greeting="Notes & Thoughts 📝" subtitle="Capture ideas and link tasks to your focus sessions" />
      <div className="flex-1 overflow-hidden p-8 flex gap-6">
        {/* Left Note List Panel */}
        <div className="w-80 glass-card rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">Notes</h3>
            <button className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
              <FiPlus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-xl cursor-pointer transition ${
                  activeNoteId === note.id
                    ? "bg-emerald-500/15 border border-emerald-500/40 text-zinc-100 shadow-sm"
                    : "hover:bg-zinc-800/50 text-zinc-400"
                }`}
              >
                <h4 className="text-xs font-bold text-zinc-200">{note.title}</h4>
                <p className="text-[10px] text-zinc-500 mt-1">{note.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Note Markdown Editor Panel */}
        <div className="flex-1 glass-card rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
          {/* Editor Header Toolbar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-semibold text-zinc-400">{activeNote.date}</span>
            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-zinc-400">
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiBold className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiItalic className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiList className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiCheckSquare className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiPaperclip className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                <FiLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Markdown Body Text Area */}
          <textarea
            value={activeNote.content}
            readOnly
            className="w-full flex-1 bg-transparent text-sm text-zinc-200 leading-relaxed outline-none resize-none font-mono no-scrollbar"
          />

          {/* Tags Footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
            {activeNote.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
