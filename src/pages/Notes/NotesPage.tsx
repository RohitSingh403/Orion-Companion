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
      <Topbar subtitle="Capture ideas and link tasks to your focus sessions" />
      <div className="flex-1 p-8 flex gap-6 relative overflow-auto">
        {/* Quick Note Toast */}
        {showQuickNoteToast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 card border border-accent/40 text-accent px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg z-50">
            <FiZap className="w-4 h-4" />
            <span>Quick note created!</span>
          </div>
        )}

        {/* Left Note List Panel */}
        <div className="w-80 card-elevated rounded-xl p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-accent">Notes</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleQuickNote} 
                className="icon-btn"
                title="Quick note (Cmd/Ctrl + N)"
              >
                <FiZap className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleCreateNote} className="btn-primary text-sm font-medium flex items-center gap-1">
                <FiPlus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 input rounded-lg text-sm text-primary placeholder-muted"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {filteredNotes.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeNoteId === note.id
                      ? "bg-accent/15 border border-accent/40 text-primary"
                      : "card hover:bg-white/5 text-secondary"
                  }`}
                >
                  <h4 className="text-sm font-medium text-primary">{note.title}</h4>
                  <p className="text-[10px] text-muted mt-1">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Note Markdown Editor Panel */}
        <div className="flex-1 card-elevated rounded-xl p-6 flex flex-col gap-4 overflow-auto">
          {activeNote ? (
            <>
              {/* Editor Header Toolbar */}
              <div className="flex items-center justify-between border-b border-white/6 pb-3">
                <span className="text-sm font-medium text-secondary">
                  {new Date(activeNote.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={handleCancelEdit} className="px-2 py-1 text-sm text-secondary hover:text-primary transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSaveNote} className="px-2 py-1 btn-primary text-sm font-medium rounded">
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 card p-1 rounded-lg text-secondary">
                      <button 
                        onClick={() => setViewMode("preview")}
                        className={`icon-btn ${viewMode === "preview" ? "active" : ""}`}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setViewMode("edit")}
                        className={`icon-btn ${viewMode === "edit" ? "active" : ""}`}
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowTaskPicker(!showTaskPicker)}
                        className={`icon-btn ${activeNote?.linkedTaskId ? "active" : ""}`}
                        title={activeNote?.linkedTaskId ? "Linked task" : "Link task"}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>
                      {activeNote?.linkedTaskId && (
                        <button 
                          onClick={handleUnlinkTask}
                          className="icon-btn hover:text-red-400"
                          title="Unlink task"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={handleDeleteNote} 
                        className="icon-btn hover:text-red-400"
                        title="Delete note"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1 card p-1 rounded-lg text-secondary">
                    <button className="icon-btn">
                      <FiBold className="w-3.5 h-3.5" />
                    </button>
                    <button className="icon-btn">
                      <FiItalic className="w-3.5 h-3.5" />
                    </button>
                    <button className="icon-btn">
                      <FiList className="w-3.5 h-3.5" />
                    </button>
                    <button className="icon-btn">
                      <FiCheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button className="icon-btn">
                      <FiPaperclip className="w-3.5 h-3.5" />
                    </button>
                    <button className="icon-btn">
                      <FiLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Task Picker Modal */}
              {showTaskPicker && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl p-4 z-10 card-elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-accent">Link a Task</h4>
                    <button onClick={() => setShowTaskPicker(false)} className="text-secondary hover:text-primary transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {tasks.length === 0 ? (
                      <p className="text-sm text-muted text-center py-4">No tasks available</p>
                    ) : (
                      tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => handleLinkTask(task.id)}
                          className="w-full p-3 card rounded-lg text-left hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">{task.title}</span>
                            <span className="text-[10px] text-muted">
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
                    className="w-full h-full card border border-white/10 rounded-lg p-3 text-sm text-primary leading-relaxed outline-none resize-none font-mono no-scrollbar hover:border-white/20 transition-all"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="w-full h-full card border border-white/10 rounded-lg p-4 text-sm text-primary leading-relaxed overflow-y-auto no-scrollbar prose prose-invert prose-sm max-w-none prose-headings:text-primary prose-p:text-secondary prose-strong:text-primary prose-code:text-accent prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 hover:border-white/20 transition-all">
                    <ReactMarkdown>{activeNote?.content || ""}</ReactMarkdown>
                  </div>
                )}

                {/* Linked Task Display */}
                {activeNote?.linkedTaskId && (
                  <div className="absolute bottom-4 left-4 right-4 card border border-accent/30 rounded-lg p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiTarget className="w-3.5 h-3.5 text-accent" />
                      <span className="text-sm text-accent font-medium">
                        {tasks.find((t) => t.id === activeNote.linkedTaskId)?.title || "Linked Task"}
                      </span>
                    </div>
                    <button 
                      onClick={handleUnlinkTask}
                      className="text-secondary hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/6">
                {activeNote.tags.length === 0 ? (
                  <span className="text-[10px] text-muted">No tags</span>
                ) : (
                  activeNote.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded badge-success text-accent text-[10px] font-medium">
                      #{t}
                    </span>
                  ))
                )}
              </div>

              {/* Attachments Section */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted">Attachments</span>
                  <label className="flex items-center gap-1 text-[10px] text-accent hover:text-accent/80 cursor-pointer">
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
                  <span className="text-[10px] text-muted">No attachments</span>
                ) : (
                  <div className="space-y-1">
                    {(activeNote.attachments || []).map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 card border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiPaperclip className="w-3 h-3 text-muted flex-shrink-0" />
                          <span className="text-[10px] text-secondary truncate">{attachment.name}</span>
                          <span className="text-[10px] text-muted flex-shrink-0">
                            {formatFileSize(attachment.size)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="text-muted hover:text-red-400 transition flex-shrink-0"
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
                <p className="text-sm text-secondary mb-4">No note selected</p>
                <button onClick={handleCreateNote} className="px-4 py-2 btn-primary text-sm font-medium rounded-lg">
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
