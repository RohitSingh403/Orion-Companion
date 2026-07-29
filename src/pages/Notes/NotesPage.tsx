// src/pages/Notes/NotesPage.tsx

import { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useNotesStore } from "../../store/notesStore";
import { useTaskStore } from "../../store/taskStore";
import ReactMarkdown from "react-markdown";
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
  FiEye,
  FiEdit3,
  FiZap,
  FiTarget,
} from "react-icons/fi";

export default function NotesPage() {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote, searchNotes, addAttachment, removeAttachment } = useNotesStore();
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");
  const [showQuickNoteToast, setShowQuickNoteToast] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  // Keyboard shortcut for quick note capture (Cmd/Ctrl + N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        handleQuickNote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuickNote = () => {
    addNote("Quick Note", "# Quick Note\n\nCapture your thoughts...");
    setViewMode("edit");
    setShowQuickNoteToast(true);
    setTimeout(() => setShowQuickNoteToast(false), 2000);
  };

  const handleLinkTask = (taskId: string) => {
    if (activeNoteId) {
      updateNote(activeNoteId, { linkedTaskId: taskId });
      setShowTaskPicker(false);
    }
  };

  const handleUnlinkTask = () => {
    if (activeNoteId) {
      updateNote(activeNoteId, { linkedTaskId: null });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeNoteId) return;

    setIsUploading(true);
    try {
      await addAttachment(activeNoteId, file);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (activeNoteId) {
      removeAttachment(activeNoteId, attachmentId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleCreateNote = () => {
    addNote("New Note", "# New Note\n\nStart writing here...");
    setViewMode("edit");
  };

  const handleSaveNote = () => {
    if (activeNoteId) {
      updateNote(activeNoteId, {
        title: editTitle,
        content: editContent,
      });
    }
    setIsEditing(false);
    setViewMode("preview");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setViewMode("preview");
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
      <div className="flex-1 overflow-hidden p-8 flex gap-6 relative">
        {/* Quick Note Toast */}
        {showQuickNoteToast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg z-50 animate-pulse">
            <FiZap className="w-4 h-4" />
            <span>Quick note created!</span>
          </div>
        )}

        {/* Left Note List Panel */}
        <div className="w-80 glass-card rounded-2xl p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">Notes</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleQuickNote} 
                className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                title="Quick note (Cmd/Ctrl + N)"
              >
                <FiZap className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleCreateNote} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
                <FiPlus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
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
        <div className="flex-1 glass-card rounded-2xl p-6 flex flex-col gap-4">
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
                      <button 
                        onClick={() => setViewMode("preview")}
                        className={`p-1.5 rounded hover:bg-zinc-800 ${viewMode === "preview" ? "text-emerald-400 bg-zinc-800" : "hover:text-zinc-200"}`}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setViewMode("edit")}
                        className={`p-1.5 rounded hover:bg-zinc-800 ${viewMode === "edit" ? "text-emerald-400 bg-zinc-800" : "hover:text-zinc-200"}`}
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowTaskPicker(!showTaskPicker)}
                        className={`p-1.5 rounded hover:bg-zinc-800 ${activeNote?.linkedTaskId ? "text-emerald-400 bg-zinc-800" : "hover:text-zinc-200"}`}
                        title={activeNote?.linkedTaskId ? "Linked task" : "Link task"}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>
                      {activeNote?.linkedTaskId && (
                        <button 
                          onClick={handleUnlinkTask}
                          className="p-1.5 hover:text-red-400 rounded hover:bg-zinc-800"
                          title="Unlink task"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={handleDeleteNote} 
                        className="p-1.5 hover:text-red-400 rounded hover:bg-zinc-800"
                        title="Delete note"
                      >
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

              {/* Task Picker Modal */}
              {showTaskPicker && (
                <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm rounded-xl p-4 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-zinc-100">Link a Task</h4>
                    <button onClick={() => setShowTaskPicker(false)} className="text-zinc-400 hover:text-zinc-200">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {tasks.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4">No tasks available</p>
                    ) : (
                      tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => handleLinkTask(task.id)}
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left hover:border-emerald-500/50 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-200">{task.title}</span>
                            <span className="text-[10px] text-zinc-500">
                              {task.completedFocusSessions}/{task.estimatedFocusSessions}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Markdown Body */}
              <div className="relative flex-1 min-h-0">
                {viewMode === "edit" ? (
                  <textarea
                    value={isEditing ? editContent : (activeNote?.content || "")}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      if (!isEditing && activeNoteId) {
                        updateNote(activeNoteId, { content: e.target.value });
                      }
                    }}
                    className="w-full h-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 leading-relaxed outline-none resize-none font-mono no-scrollbar focus:border-emerald-500/50"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 leading-relaxed overflow-y-auto no-scrollbar prose prose-invert prose-sm max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-code:text-emerald-400 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
                    <ReactMarkdown>{activeNote?.content || ""}</ReactMarkdown>
                  </div>
                )}

                {/* Linked Task Display */}
                {activeNote?.linkedTaskId && (
                  <div className="absolute bottom-4 left-4 right-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiTarget className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-300 font-medium">
                        {tasks.find((t) => t.id === activeNote.linkedTaskId)?.title || "Linked Task"}
                      </span>
                    </div>
                    <button 
                      onClick={handleUnlinkTask}
                      className="text-zinc-400 hover:text-red-400 transition"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

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

              {/* Attachments Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">Attachments</span>
                  <label className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer">
                    <FiPaperclip className="w-3 h-3" />
                    <span>Add</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {activeNote.attachments?.length === 0 ? (
                  <span className="text-[10px] text-zinc-600">No attachments</span>
                ) : (
                  <div className="space-y-1">
                    {(activeNote.attachments || []).map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiPaperclip className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                          <span className="text-[10px] text-zinc-300 truncate">{attachment.name}</span>
                          <span className="text-[10px] text-zinc-500 flex-shrink-0">
                            {formatFileSize(attachment.size)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="text-zinc-400 hover:text-red-400 transition flex-shrink-0"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
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
