import { useEffect, useState } from "react";
import { useDayStore } from "../../store/dayStore";
import { useFocusStore } from "../../store/focusStore";
import { interruptionNames } from "../../utils/dayLoop";

export default function SessionReviewCard() {
  const review = useFocusStore((state) => state.sessionReview);
  const settleReview = useFocusStore((state) => state.settleReview);
  const dismissReview = useFocusStore((state) => state.dismissReview);
  const allowedApps = useDayStore((state) => state.allowedApps);
  const allowApp = useDayStore((state) => state.allowApp);
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [review?.historyId]);

  if (!review) return null;
  const interruptions = interruptionNames(review.apps, allowedApps);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#1b1f27] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7CFFD4]">Block finished</p>
      <h2 className="mt-1 text-base font-semibold text-white">
        {review.taskTitle ? review.taskTitle : "Keep one line about that block"}
      </h2>
      <p className="mt-1 text-sm text-zinc-400">The break is already running. This note stays with the session.</p>
      <label className="mt-3 block text-xs text-zinc-500" htmlFor="session-note">
        One line
      </label>
      <input
        id="session-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="What moved forward?"
        className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#121418] px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      {interruptions.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs text-zinc-500">Other apps during this block</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {interruptions.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => allowApp(name)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200 hover:bg-white/5"
                >
                  {name} belongs
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            settleReview(note);
            setNote("");
          }}
          className="rounded-full bg-[#7CFFD4] px-4 py-2 text-sm font-semibold text-[#14161c]"
        >
          Keep this block
        </button>
        <button
          type="button"
          onClick={() => {
            dismissReview();
            setNote("");
          }}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300"
        >
          Leave it
        </button>
      </div>
    </section>
  );
}
