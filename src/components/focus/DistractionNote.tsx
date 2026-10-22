import { useState, type FormEvent } from "react";
import { useFocusStore } from "../../store/focusStore";

export default function DistractionNote({ compact = false }: { compact?: boolean }) {
  const noteDistraction = useFocusStore((state) => state.noteDistraction);
  const [text, setText] = useState("");
  const fieldId = compact ? "companion-distraction" : "focus-distraction";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    noteDistraction(text);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className={compact ? "mt-2 flex gap-1.5" : "rounded-2xl border border-white/10 bg-[#1b1f27] p-4"}
    >
      {compact ? null : (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">This block</p>
          <p className="mt-1 text-sm text-zinc-400">Write what pulled you away. It shows when the block ends.</p>
        </>
      )}
      <label className="sr-only" htmlFor={fieldId}>
        Distraction
      </label>
      <input
        id={fieldId}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What pulled you away"
        className={`rounded-xl border border-white/10 bg-[#121418] px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 ${
          compact ? "h-8 min-w-0 flex-1" : "mt-3 h-10 w-full"
        }`}
      />
      <button
        type="submit"
        className={`rounded-full bg-white font-semibold text-[#14161c] ${
          compact ? "px-2.5 py-1 text-[11px]" : "mt-2 px-4 py-2 text-sm"
        }`}
      >
        Note
      </button>
    </form>
  );
}
