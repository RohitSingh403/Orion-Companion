import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useNotesStore } from "../../store/notesStore";
import { useReminderStore } from "../../store/reminderStore";
import { useTaskStore } from "../../store/taskStore";

type Hit = {
  id: string;
  kind: "Task" | "Note" | "Reminder";
  title: string;
  path: string;
};

export default function CommandSearch() {
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const setActiveTask = useTaskStore((state) => state.setActiveTask);
  const notes = useNotesStore((state) => state.notes);
  const setActiveNote = useNotesStore((state) => state.setActiveNote);
  const reminders = useReminderStore((state) => state.reminders);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [] as Hit[];
    const found: Hit[] = [];
    for (const task of tasks) {
      if (`${task.title} ${task.description ?? ""}`.toLowerCase().includes(needle)) {
        found.push({ id: task.id, kind: "Task", title: task.title, path: "/tasks" });
      }
      if (found.length >= 8) return found;
    }
    for (const note of notes) {
      if (`${note.title} ${note.content}`.toLowerCase().includes(needle)) {
        found.push({ id: note.id, kind: "Note", title: note.title, path: "/notes" });
      }
      if (found.length >= 8) return found;
    }
    for (const reminder of reminders) {
      if (`${reminder.title} ${reminder.description ?? ""}`.toLowerCase().includes(needle)) {
        found.push({ id: reminder.id, kind: "Reminder", title: reminder.title, path: "/reminders" });
      }
      if (found.length >= 8) return found;
    }
    return found;
  }, [notes, query, reminders, tasks]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing && target !== inputRef.current) return;
      event.preventDefault();
      inputRef.current?.focus();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const openHit = (hit: Hit) => {
    if (hit.kind === "Task") setActiveTask(hit.id);
    if (hit.kind === "Note") setActiveNote(hit.id);
    navigate(hit.path);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="relative" ref={boxRef}>
      <label className="sr-only" htmlFor="orion-search">
        Search tasks, notes, and reminders
      </label>
      <div className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#1c212b] px-3">
        <FiSearch className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        <input
          id="orion-search"
          ref={inputRef}
          value={query}
          placeholder="Search"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
            if (event.key === "Enter" && hits[0]) openHit(hits[0]);
          }}
          className="w-28 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none md:w-40"
        />
      </div>
      {open && query.trim() ? (
        <div role="listbox" aria-label="Search results" className="absolute left-0 z-40 mt-2 w-72 max-w-[calc(100vw-6rem)] rounded-2xl border border-white/10 bg-[#20242d] p-1.5 shadow-2xl">
          {hits.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-400">Nothing on this computer matches that.</p>
          ) : (
            hits.map((hit) => (
              <button
                key={`${hit.kind}-${hit.id}`}
                type="button"
                role="option"
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/5"
                onClick={() => openHit(hit)}
              >
                <span className="truncate text-sm text-zinc-100">{hit.title}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-[#7CFFD4]">{hit.kind}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
