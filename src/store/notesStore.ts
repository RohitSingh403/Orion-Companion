import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note, NoteAttachment } from "../types/note";

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  addNote: (title: string, content?: string) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  searchNotes: (query: string) => Note[];
  addAttachment: (noteId: string, file: File) => Promise<void>;
  removeAttachment: (noteId: string, attachmentId: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,

      addNote: (title, content = "") => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: title || "Untitled Note",
          content,
          tags: [],
          linkedTaskId: null,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },

      updateNote: (id, data) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...data, updatedAt: new Date().toISOString() }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        })),

      setActiveNote: (id) =>
        set({
          activeNoteId: id,
        }),

      searchNotes: (query) => {
        const { notes } = get();
        const lowerQuery = query.toLowerCase();
        return notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },

      addAttachment: async (noteId, file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        return new Promise<void>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            const attachment: NoteAttachment = {
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64,
              createdAt: new Date().toISOString(),
            };

            set((state) => ({
              notes: state.notes.map((note) =>
                note.id === noteId
                  ? { 
                      ...note, 
                      attachments: [...note.attachments, attachment],
                      updatedAt: new Date().toISOString()
                    }
                  : note
              ),
            }));
            resolve();
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
        });
      },

      removeAttachment: (noteId, attachmentId) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { 
                  ...note, 
                  attachments: note.attachments.filter((a) => a.id !== attachmentId),
                  updatedAt: new Date().toISOString()
                }
              : note
          ),
        }));
      },
    }),
    {
      name: "focus-companion-notes",
    }
  )
);
