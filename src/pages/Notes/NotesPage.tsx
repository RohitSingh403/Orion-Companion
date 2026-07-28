// src/pages/Notes/NotesPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useNotesStore } from "../../store/notesStore";
import {
  FiSearch,
  FiPlus,
  FiBold,
  FiItalic,
  FiList,
  FiPaperclip,
  FiLink,
  FiCheckSquare,
  FiTrash2,
} from "react-icons/fi";

export default function NotesPage() {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote, searchNotes } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  const handleCreateNote = () => {
    addNote("New Note", "# New Note\n\nStart writing here...");
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (activeNoteId) {
      updateNote(activeNoteId, {
        title: editTitle,
        content: editContent,
      });
    }
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const handleDeleteNote = () => {
    if (activeNoteId && confirm("Are you sure you want to delete this note?")) {
      deleteNote(activeNoteId);
      setIsEditing(false);
    }
  };

  return (
    <AppLayout>
      <Topbar greeting="Notes & Thoughts 📝" subtitle="Capture ideas and link tasks to your focus sessions" />
      <div className="flex-1 overflow-hidden p-8 flex gap-6">
        {/* Left Note List Panel */}
        <div className="w-80 glass-card rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">Notes</h3>
            <button onClick={handleCreateNote} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
              <FiPlus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    activeNoteId === note.id
                      ? "bg-emerald-500/15 border border-emerald-500/40 text-zinc-100 shadow-sm"
                      : "hover:bg-zinc-800/50 text-zinc-400"
                  }`}
                >
                  <h4 className="text-xs font-bold text-zinc-200">{note.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Note Markdown Editor Panel */}
        <div className="flex-1 glass-card rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
          {activeNote ? (
            <>
              {/* Editor Header Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-semibold text-zinc-400">
                  {new Date(activeNote.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={handleCancelEdit} className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200">
                        Cancel
                      </button>
                      <button onClick={handleSaveNote} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-semibold rounded">
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-zinc-400">
                      <button onClick={handleStartEdit} className="p-1.5 hover:text-zinc-200 rounded hover:bg-zinc-800">
                        Edit
                      </button>
                      <button onClick={handleDeleteNote} className="p-1.5 hover:text-red-400 rounded hover:bg-zinc-800">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
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
              </div>

              {/* Markdown Body Text Area */}
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 leading-relaxed outline-none resize-none font-mono no-scrollbar focus:border-emerald-500/50"
                  placeholder="Write your note here..."
                />
              ) : (
                <textarea
                  value={activeNote.content}
                  readOnly
                  className="w-full flex-1 bg-transparent text-sm text-zinc-200 leading-relaxed outline-none resize-none font-mono no-scrollbar"
                />
              )}

              {/* Tags Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                {activeNote.tags.length === 0 ? (
                  <span className="text-[10px] text-zinc-500">No tags</span>
                ) : (
                  activeNote.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                      #{t}
                    </span>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-zinc-400 mb-4">No note selected</p>
                <button onClick={handleCreateNote} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-semibold rounded-xl shadow">
                  Create your first note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
