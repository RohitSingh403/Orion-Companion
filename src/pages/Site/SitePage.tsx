import { Link } from "react-router-dom";
import OrionMark from "../../components/brand/OrionMark";

const FEATURES = [
  {
    title: "Focus timer",
    copy: "Start a session and keep it running while you move between tasks, notes, and the calendar.",
  },
  {
    title: "Tasks and projects",
    copy: "Estimate the work in sessions, then let finished sessions move the task forward.",
  },
  {
    title: "Calendar",
    copy: "Place meetings and focus blocks on a real day, and export the plan when you need it.",
  },
  {
    title: "Notes",
    copy: "Keep the thinking next to the task, with tags, markdown, and files stored on this machine.",
  },
  {
    title: "Analytics",
    copy: "See streaks, focus time, and whether the week is actually getting steadier.",
  },
  {
    title: "Achievements",
    copy: "A quiet progress layer for consistency. The work still comes first.",
  },
];

function PreviewBoard() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#14161c] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
      <div className="flex items-stretch">
        <div className="flex w-14 shrink-0 flex-col items-center gap-3 border-r border-white/5 bg-[#10131a] py-4">
          <OrionMark className="h-8 w-8" />
          <span className="h-8 w-8 rounded-2xl bg-white" />
          <span className="h-8 w-8 rounded-2xl bg-white/10" />
          <span className="h-8 w-8 rounded-2xl bg-white/10" />
          <span className="h-8 w-8 rounded-2xl bg-white/10" />
        </div>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0 truncate rounded-full border border-white/10 bg-[#1c212b] px-3 py-1.5 text-[11px] text-zinc-300">48:00 Focus Time Remaining</div>
            <div className="shrink-0 rounded-full border border-white/10 bg-[#1c212b] px-3 py-1.5 text-[11px] text-zinc-300">Coffee Shop</div>
          </div>
          <p className="text-[11px] text-zinc-500">A clear day to focus</p>
          <p className="mt-1 text-lg font-semibold text-white sm:text-xl">Thursday, 22 May</p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0 rounded-2xl bg-[#1a1e27] p-3">
              <p className="truncate text-[10px] text-zinc-500">Work Hours</p>
              <p className="mt-2 truncate text-sm font-semibold text-white">7 hr 30 min</p>
            </div>
            <div className="min-w-0 rounded-2xl bg-[#5DFFC2] p-3 text-[#10231c]">
              <p className="truncate text-[10px] font-medium">Percent of Target</p>
              <p className="mt-2 text-sm font-semibold">90%</p>
            </div>
            <div className="min-w-0 rounded-2xl bg-[#1a1e27] p-3">
              <p className="truncate text-[10px] text-zinc-500">Focus Percent</p>
              <p className="mt-2 text-sm font-semibold text-white">80%</p>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-[#1a1e27] p-3">
            <p className="text-[10px] text-zinc-400">Timeline</p>
            <div className="mt-2 flex h-10 items-end gap-1">
              {[20, 55, 40, 70, 48, 80, 36, 62, 28, 50, 74, 22].map((height, index) => (
                <span
                  key={height + index}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${height}%`,
                    background: index % 4 === 0 ? "#60A5FA" : index % 5 === 0 ? "#34D399" : "#7AF0FF",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">Preview of the Orion Companion day dashboard.</p>
    </div>
  );
}

export default function SitePage() {
  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-[#07080c] text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#07080c]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-2">
            <OrionMark className="h-9 w-9" />
            <span className="text-sm font-semibold tracking-tight">Orion Companion</span>
          </a>
          <nav aria-label="Site" className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#product" className="hover:text-white">Product</a>
            <a href="#workspace" className="hover:text-white">Workspace</a>
            <a href="#install" className="hover:text-white">Install</a>
          </nav>
          <Link
            to="/app"
            className="rounded-full bg-[#5DFFC2] px-4 py-2 text-sm font-semibold text-[#10231c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Open the app
          </Link>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="pointer-events-none absolute -right-16 -top-24 h-[420px] w-[420px] rounded-full bg-[#5DFFC2]/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5DFFC2]">Personal focus system</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              Your work, your focus, on your computer.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              Orion Companion is a private productivity workspace built around deep work. Plan the task, run the session, and read the day back without sending your history to an account.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DFFC2]"
              >
                Open companion
              </Link>
              <a
                href="#install"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5DFFC2]"
              >
                Install it for yourself
              </a>
            </div>
          </div>
          <PreviewBoard />
        </section>

        <section id="product" className="mx-auto max-w-6xl px-5 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Name the work", "Capture the task, the project, and how many focus sessions it should take."],
              ["02", "Stay with it", "The timer lives above every page, so changing screens does not drop the session."],
              ["03", "Read the day", "Work hours, target, timeline, and projects come from what you actually finished."],
            ].map(([step, title, copy]) => (
              <article key={step} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs text-[#5DFFC2]">{step}</p>
                <h2 className="mt-3 text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workspace" className="mx-auto max-w-6xl px-5 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">One workspace, not six disconnected tools.</h2>
            <p className="mt-3 text-zinc-400">
              The desktop app keeps the focus session at the center. Everything else reports back to it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-[24px] border border-white/10 bg-[#10131a] p-6">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="install" className="mx-auto max-w-6xl px-5 py-8 pb-20">
          <div className="grid gap-4 rounded-[32px] border border-white/10 bg-[#10131a] p-6 md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">A personal copy for anyone.</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Open the app in this browser, or package the desktop build for Windows, macOS, or Linux. Each installation keeps its tasks, notes, and sessions on that computer. There is no shared account and no requirement to sign in.
              </p>
              <Link
                to="/app"
                className="mt-6 inline-flex rounded-full bg-[#5DFFC2] px-5 py-3 text-sm font-semibold text-[#10231c]"
              >
                Use it on this computer
              </Link>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="rounded-2xl bg-white/5 px-4 py-3">Browser app for immediate use on this machine.</li>
              <li className="rounded-2xl bg-white/5 px-4 py-3">Desktop window with the same companion, timer, and local data.</li>
              <li className="rounded-2xl bg-white/5 px-4 py-3">Your dashboard fills in from real sessions, tasks, and meetings.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-5 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <OrionMark className="h-6 w-6" />
            Orion Companion
          </span>
          <span>Local-first focus system</span>
        </div>
      </footer>
    </div>
  );
}
