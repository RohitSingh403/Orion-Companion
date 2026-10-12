import { useState } from "react";
import { Link } from "react-router-dom";
import OrionMark from "../../components/brand/OrionMark";
import ProductDemo, { type DemoView } from "./ProductDemo";

const NAV = [
  { href: "#preview", label: "Product" },
  { href: "#tour", label: "Tour" },
  { href: "#workspace", label: "Workspace" },
  { href: "#questions", label: "Questions" },
  { href: "#install", label: "Install" },
];

const STEPS = [
  {
    title: "Name the work",
    copy: "Capture the task, the project, and how many focus sessions it should take.",
    detail: "A task can carry an estimate in sessions. When a focus block finishes, that task moves forward on this computer.",
  },
  {
    title: "Stay with it",
    copy: "The timer lives above every page, so changing screens does not drop the session.",
    detail: "Start from the command bar or the Focus page. Tasks, notes, and the calendar stay available while the clock keeps running.",
  },
  {
    title: "Read the day",
    copy: "Work hours, target, timeline, and projects come from what you actually finished.",
    detail: "The dashboard uses completed sessions, meetings, and tasks. Empty charts stay empty until the work is real.",
  },
];

const FEATURES: { title: string; copy: string; view: DemoView; points: string[] }[] = [
  {
    title: "Focus timer",
    copy: "Run a 15, 25, or 50 minute block and keep it while you move through the workspace.",
    view: "timer",
    points: ["Start, pause, and reset without leaving the session", "Break follows focus when you want it to", "A mini timer is available in the desktop app"],
  },
  {
    title: "Tasks and projects",
    copy: "Estimate the work in sessions, then let finished sessions move the task forward.",
    view: "tasks",
    points: ["Today, upcoming, and completed lists", "Projects group the work", "Quick Add from the command bar"],
  },
  {
    title: "Calendar",
    copy: "Place meetings and focus blocks on a real day, and export the plan when you need it.",
    view: "day",
    points: ["Month, week, and day views", "Meetings sit next to focus time", "Export the plan from the calendar"],
  },
  {
    title: "Notes",
    copy: "Keep the thinking next to the task, with tags and markdown stored on this machine.",
    view: "notes",
    points: ["Markdown notes on this computer", "Tags for finding them later", "Files stay with the local note"],
  },
  {
    title: "Analytics",
    copy: "See streaks, focus time, and whether the week is actually getting steadier.",
    view: "day",
    points: ["Week, month, and year from real history", "No invented multipliers", "A target based on the goal you set"],
  },
  {
    title: "Achievements",
    copy: "A quiet progress layer for consistency. The work still comes first.",
    view: "day",
    points: ["Sessions, streaks, and time unlock the marks", "They start locked", "Nothing is shared off this computer"],
  },
];

const QUESTIONS = [
  {
    q: "Does Orion create an account?",
    a: "No. The name on the dashboard is stored on this computer. There is no sign-in and no shared profile.",
  },
  {
    q: "Will the timer stop if I change pages?",
    a: "No. The session sits above the pages, so opening tasks, notes, or the calendar does not reset the clock.",
  },
  {
    q: "Where does the data live?",
    a: "Tasks, notes, sessions, reminders, and settings stay in this browser, or in the desktop install. Settings can download a JSON backup and import it on the same computer.",
  },
  {
    q: "What gets recorded during focus?",
    a: "While a desktop focus session is running, the app in front can be recorded locally and shown on the dashboard. The browser preview does not record other apps.",
  },
  {
    q: "Can I install it for myself?",
    a: "Yes. Open the app in this browser, or run the desktop window from the project. Packaged builds are available for macOS, Windows, and Linux.",
  },
];

const DESKTOP_COMMANDS = `git clone https://github.com/RohitSingh403/Orion-Companion.git
cd Orion-Companion
npm install
npm run dev`;

function scrollToId(id: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export default function SitePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<DemoView>("day");
  const [step, setStep] = useState(0);
  const [feature, setFeature] = useState(0);
  const [question, setQuestion] = useState(0);
  const [installTab, setInstallTab] = useState<"browser" | "desktop">("browser");
  const [copied, setCopied] = useState(false);
  const selected = FEATURES[feature];

  function showPreview(next: DemoView) {
    setView(next);
    scrollToId("preview");
  }

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(DESKTOP_COMMANDS);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-[#07080c] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#07080c]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a href="#top" className="flex shrink-0 items-center gap-2">
            <OrionMark className="h-9 w-9" />
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">Orion Companion</span>
          </a>
          <nav aria-label="Site" className="hidden items-center gap-6 text-sm text-zinc-400 lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">{item.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="shrink-0 whitespace-nowrap rounded-full bg-[#7CFFD4] px-3 py-2 text-sm font-semibold text-[#10231c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4"
            >
              Open the app
            </Link>
            <button
              type="button"
              className="shrink-0 whitespace-nowrap rounded-full border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="site-menu" aria-label="Site mobile" className="border-t border-white/5 px-5 py-3 lg:hidden">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-zinc-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative mx-auto grid max-w-6xl items-center gap-12 overflow-hidden px-5 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent 80%)",
              WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent 80%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7CFFD4]">Personal focus system</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
              Your work, your focus, on your computer.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              Orion Companion is a private productivity workspace built around deep work. Plan the task, run the session, and read the day back without sending your history to an account.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Open companion
              </Link>
              <a
                href="#install"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Install it for yourself
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-xs text-zinc-300">
              {["Local data", "No account", "Timer stays with you"].map((item) => (
                <li key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative min-w-0">
            <ProductDemo view={view} onViewChange={setView} />
          </div>
        </section>

        <section id="tour" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7CFFD4]">Tour</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Three moves, then the day is readable.</h2>
          </div>
          <div className="mt-8 grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-2" role="list">
              {STEPS.map((item, index) => {
                const selectedStep = step === index;
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-pressed={selectedStep}
                    onClick={() => setStep(index)}
                    className={`w-full rounded-[24px] border p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                      selectedStep ? "border-[#7CFFD4]/40 bg-[#7CFFD4]/10" : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-xs text-[#7CFFD4]">0{index + 1}</p>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.copy}</p>
                  </button>
                );
              })}
            </div>
            <article className="rounded-[28px] border border-white/10 bg-[#10131a] p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Step 0{step + 1}</p>
              <h3 className="mt-3 text-3xl font-semibold">{STEPS[step].title}</h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">{STEPS[step].detail}</p>
              <button
                type="button"
                onClick={() => showPreview(step === 1 ? "timer" : step === 2 ? "day" : "tasks")}
                className="mt-8 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14161c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
              >
                Try this in the preview
              </button>
            </article>
          </div>
        </section>

        <section id="workspace" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7CFFD4]">Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">One workspace, not six disconnected tools.</h2>
            <p className="mt-3 text-zinc-400">
              The desktop app keeps the focus session at the center. Pick a part of it and the preview above follows.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-pressed={feature === index}
                  onClick={() => {
                    setFeature(index);
                    setView(item.view);
                  }}
                  className={`rounded-[24px] border p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                    feature === index ? "border-[#7CFFD4]/40 bg-[#10131a]" : "border-white/10 bg-[#10131a]/70"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.copy}</p>
                </button>
              ))}
            </div>
            <aside className="rounded-[28px] border border-white/10 bg-[#10131a] p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">In the product</p>
              <h3 className="mt-3 text-2xl font-semibold">{selected.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                {selected.points.map((point) => (
                  <li key={point} className="rounded-2xl bg-white/5 px-4 py-3">{point}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => showPreview(selected.view)}
                className="mt-5 rounded-full bg-[#7CFFD4] px-4 py-2 text-sm font-semibold text-[#10231c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Show {selected.title.toLowerCase()}
              </button>
            </aside>
          </div>
        </section>

        <section id="questions" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7CFFD4]">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">What this product does, and what it leaves alone.</h2>
          </div>
          <div className="mt-8 divide-y divide-white/10 rounded-[28px] border border-white/10">
            {QUESTIONS.map((item, index) => {
              const open = question === index;
              return (
                <div key={item.q} className="px-5 py-2">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setQuestion(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                  >
                    <span className="text-base font-semibold">{item.q}</span>
                    <span className="text-zinc-500" aria-hidden="true">{open ? "–" : "+"}</span>
                  </button>
                  {open && <p className="pb-4 text-sm leading-relaxed text-zinc-400">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section id="install" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 pb-20">
          <div className="rounded-[32px] border border-white/10 bg-[#10131a] p-6 md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7CFFD4]">Install</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">A personal copy for anyone.</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Use the browser app now, or run the desktop window. Each installation keeps its tasks, notes, and sessions on that computer.
                </p>
              </div>
              <div className="flex rounded-full border border-white/10 p-1" role="tablist" aria-label="Install options">
                {([
                  ["browser", "This browser"],
                  ["desktop", "Desktop"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={installTab === id}
                    onClick={() => {
                      setInstallTab(id);
                      setCopied(false);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4] ${
                      installTab === id ? "bg-white text-[#14161c]" : "text-zinc-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {installTab === "browser" ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2" role="tabpanel">
                <div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    The app in this browser uses local storage. Open it, set the name in Settings, and the dashboard fills in from sessions you finish.
                  </p>
                  <Link
                    to="/app"
                    className="mt-6 inline-flex rounded-full bg-[#7CFFD4] px-5 py-3 text-sm font-semibold text-[#10231c]"
                  >
                    Use it on this computer
                  </Link>
                </div>
                <ul className="space-y-3 text-sm text-zinc-300">
                  <li className="rounded-2xl bg-white/5 px-4 py-3">Browser app for immediate use on this machine.</li>
                  <li className="rounded-2xl bg-white/5 px-4 py-3">Backup and import from Settings, as a JSON file.</li>
                  <li className="rounded-2xl bg-white/5 px-4 py-3">Your dashboard fills in from real sessions, tasks, and meetings.</li>
                </ul>
              </div>
            ) : (
              <div className="mt-8" role="tabpanel">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-zinc-400">From a terminal, on the computer that should own the data.</p>
                  <button
                    type="button"
                    onClick={copyCommands}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CFFD4]"
                  >
                    {copied ? "Copied" : "Copy commands"}
                  </button>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/40 p-4 text-sm leading-relaxed text-zinc-200">
                  <code>{DESKTOP_COMMANDS}</code>
                </pre>
                <p className="mt-4 text-sm text-zinc-400">
                  Packaged installers: <code className="text-zinc-200">npm run build:mac</code>, <code className="text-zinc-200">npm run build:win</code>, or <code className="text-zinc-200">npm run build:linux</code>.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-2">
            <OrionMark className="h-6 w-6" />
            Orion Companion
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-4">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">{item.label}</a>
            ))}
          </nav>
          <span>Local-first focus system</span>
        </div>
      </footer>
    </div>
  );
}
