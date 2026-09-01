// src/pages/Notes/NotesPage.tsx

import { useState, useEffect, useCallback } from "react";
import AppLayout from "../../layouts/AppLayout";
import Topbar from "../../components/topbar/Topbar";
import { useNotesStore } from "../../store/notesStore";
import { useTaskStore } from "../../store/taskStore";
import { useSettingsStore } from "../../store/settingsStore";
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
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === "dark";
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
  const handleQuickNote = useCallback(() => {
    addNote("Quick Note", "# Quick Note\n\nCapture your thoughts...");
    setViewMode("edit");
    setShowQuickNoteToast(true);
    setTimeout(() => setShowQuickNoteToast(false), 2000);
  }, [addNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        handleQuickNote();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleQuickNote]);

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
          <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg z-50 border ${
            isDark 
              ? "bg-gray-800 border-violet-500/40 text-violet-300" 
              : "bg-white border-violet-200 text-violet-600"
          }`}>
            <FiZap className="w-4 h-4" />
            <span>Quick note created!</span>
          </div>
        )}

        {/* Left Note List Panel */}
        <div className={`w-80 rounded-xl p-4 flex flex-col gap-4 flex-shrink-0 border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${
              isDark ? "text-violet-300" : "text-violet-600"
            }`}>Notes</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleQuickNote} 
                className={`p-1.5 rounded-lg transition-all ${
                  isDark 
                    ? "text-gray-500 hover:text-gray-100 hover:bg-gray-700" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
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
            <FiSearch className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-8 pl-8 pr-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500 placeholder-gray-500" 
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:border-violet-500 placeholder-gray-400"
              } border`}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {filteredNotes.length === 0 ? (
              <p className={`text-sm text-center py-6 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}>No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeNoteId === note.id
                      ? isDark 
                        ? "bg-violet-500/15 border border-violet-500/40 text-gray-100" 
                        : "bg-violet-50 border border-violet-200 text-gray-900"
                      : isDark 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-400" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <h4 className={`text-sm font-medium ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>{note.title}</h4>
                  <p className={`text-[10px] mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>
                    {new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Note Markdown Editor Panel */}
        <div className={`flex-1 rounded-xl p-6 flex flex-col gap-4 overflow-auto border shadow-sm ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {activeNote ? (
            <>
              {/* Editor Header Toolbar */}
              <div className={`flex items-center justify-between border-b pb-3 ${
                isDark 
                  ? "border-gray-700" 
                  : "border-gray-200"
              }`}>
                <span className={`text-sm font-medium ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>
                  {new Date(activeNote.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button onClick={handleCancelEdit} className={`px-2 py-1 text-sm transition-colors ${
                        isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
                      }`}>
                        Cancel
                      </button>
                      <button onClick={handleSaveNote} className="px-2 py-1 btn-primary text-sm font-medium rounded">
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1 p-1 rounded-lg ${
                      isDark 
                        ? "bg-gray-700 text-gray-400" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <button 
                        onClick={() => setViewMode("preview")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "preview"
                            ? isDark 
                              ? "bg-violet-500/10 text-violet-300" 
                              : "bg-violet-50 text-violet-600"
                            : isDark 
                              ? "hover:text-gray-100 hover:bg-gray-600" 
                              : "hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setViewMode("edit")}
                        className={`p-1.5 rounded-lg transition-all ${
                          viewMode === "edit"
                            ? isDark 
                              ? "bg-violet-500/10 text-violet-300" 
                              : "bg-violet-50 text-violet-600"
                            : isDark 
                              ? "hover:text-gray-100 hover:bg-gray-600" 
                              : "hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowTaskPicker(!showTaskPicker)}
                        className={`p-1.5 rounded-lg transition-all ${
                          activeNote?.linkedTaskId
                            ? isDark 
                              ? "bg-violet-500/10 text-violet-300" 
                              : "bg-violet-50 text-violet-600"
                            : isDark 
                              ? "hover:text-gray-100 hover:bg-gray-600" 
                              : "hover:text-gray-900 hover:bg-gray-200"
                        }`}
                        title={activeNote?.linkedTaskId ? "Linked task" : "Link task"}
                      >
                        <FiTarget className="w-3.5 h-3.5" />
                      </button>
                      {activeNote?.linkedTaskId && (
                        <button 
                          onClick={handleUnlinkTask}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? "hover:text-red-400" : "hover:text-red-600"
                          }`}
                          title="Unlink task"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={handleDeleteNote} 
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? "hover:text-red-400" : "hover:text-red-600"
                        }`}
                        title="Delete note"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className={`flex items-center gap-1 p-1 rounded-lg ${
                    isDark 
                      ? "bg-gray-700 text-gray-400" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiBold className="w-3.5 h-3.5" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiItalic className="w-3.5 h-3.5" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiList className="w-3.5 h-3.5" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiCheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiPaperclip className="w-3.5 h-3.5" />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${
                      isDark ? "hover:text-gray-100 hover:bg-gray-600" : "hover:text-gray-900 hover:bg-gray-200"
                    }`}>
                      <FiLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Task Picker Modal */}
              {showTaskPicker && (
                <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl p-4 z-10 border shadow-sm ${
                  isDark 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-semibold ${
                      isDark ? "text-violet-300" : "text-violet-600"
                    }`}>Link a Task</h4>
                    <button onClick={() => setShowTaskPicker(false)} className={`transition-colors ${
                      isDark ? "text-gray-500 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"
                    }`}>
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {tasks.length === 0 ? (
                      <p className={`text-sm text-center py-4 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}>No tasks available</p>
                    ) : (
                      tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => handleLinkTask(task.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            isDark 
                              ? "bg-gray-700 hover:bg-gray-600" 
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                              isDark ? "text-gray-100" : "text-gray-900"
                            }`}>{task.title}</span>
                            <span className={`text-[10px] ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}>
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
                    className={`w-full h-full rounded-lg p-3 text-sm leading-relaxed outline-none resize-none font-mono no-scrollbar transition-all border ${
                      isDark 
                        ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-violet-500 hover:border-gray-500" 
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500 hover:border-gray-300"
                    }`}
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className={`w-full h-full rounded-lg p-4 text-sm leading-relaxed overflow-y-auto no-scrollbar prose prose-invert prose-sm max-w-none border transition-all ${
                    isDark 
                      ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500 prose-headings:text-gray-100 prose-p:text-gray-400 prose-strong:text-gray-100 prose-code:text-violet-300 prose-pre:bg-gray-800 prose-pre:border-gray-600" 
                      : "bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300 prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-code:text-violet-600 prose-pre:bg-white prose-pre:border-gray-200"
                  }`}>
                    <ReactMarkdown>{activeNote?.content || ""}</ReactMarkdown>
                  </div>
                )}

                {/* Linked Task Display */}
                {activeNote?.linkedTaskId && (
                  <div className={`absolute bottom-4 left-4 right-4 rounded-lg p-2 flex items-center justify-between border ${
                    isDark 
                      ? "bg-gray-700 border-violet-500/30" 
                      : "bg-gray-50 border-violet-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <FiTarget className={`w-3.5 h-3.5 ${
                        isDark ? "text-violet-300" : "text-violet-600"
                      }`} />
                      <span className={`text-sm font-medium ${
                        isDark ? "text-violet-300" : "text-violet-600"
                      }`}>
                        {tasks.find((t) => t.id === activeNote.linkedTaskId)?.title || "Linked Task"}
                      </span>
                    </div>
                    <button 
                      onClick={handleUnlinkTask}
                      className={`transition-colors ${
                        isDark ? "text-gray-500 hover:text-red-400" : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Footer */}
              <div className={`flex items-center gap-2 pt-2 border-t ${
                isDark 
                  ? "border-gray-700" 
                  : "border-gray-200"
              }`}>
                {activeNote.tags.length === 0 ? (
                  <span className={`text-[10px] ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>No tags</span>
                ) : (
                  activeNote.tags.map((t) => (
                    <span key={t} className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      isDark 
                        ? "bg-violet-500/10 text-violet-300 border border-violet-500/30" 
                        : "bg-violet-50 text-violet-600 border border-violet-200"
                    }`}>
                      #{t}
                    </span>
                  ))
                )}
              </div>

              {/* Attachments Section */}
              <div className={`flex flex-col gap-2 pt-2 border-t ${
                isDark 
                  ? "border-gray-700" 
                  : "border-gray-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>Attachments</span>
                  <label className={`flex items-center gap-1 text-[10px] cursor-pointer ${
                    isDark ? "text-violet-300 hover:text-violet-200" : "text-violet-600 hover:text-violet-500"
                  }`}>
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
                  <span className={`text-[10px] ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}>No attachments</span>
                ) : (
                  <div className="space-y-1">
                    {(activeNote.attachments || []).map((attachment) => (
                      <div
                        key={attachment.id}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                          isDark 
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiPaperclip className={`w-3 h-3 flex-shrink-0 ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`} />
                          <span className={`text-[10px] truncate ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}>{attachment.name}</span>
                          <span className={`text-[10px] flex-shrink-0 ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}>
                            {formatFileSize(attachment.size)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className={`transition flex-shrink-0 ${
                            isDark ? "text-gray-500 hover:text-red-400" : "text-gray-500 hover:text-red-600"
                          }`}
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
                <p className={`text-sm mb-4 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}>No note selected</p>
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
