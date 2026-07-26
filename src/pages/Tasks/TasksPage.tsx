// src/pages/Tasks/TasksPage.tsx

export default function TasksPage() {
  return (
    <div className="flex h-full bg-zinc-950 text-white">
      {/* Left Panel */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold mb-6">
          ✅ Workspace
        </h1>

        <div className="space-y-3">
          <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-left font-medium transition hover:bg-emerald-600">
            📅 Today
          </button>

          <button className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-left transition hover:bg-zinc-700">
            ⏳ Upcoming
          </button>

          <button className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-left transition hover:bg-zinc-700">
            ⭐ Important
          </button>

          <button className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-left transition hover:bg-zinc-700">
            ✅ Completed
          </button>
        </div>

        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">
            Projects
          </h2>

          <div className="space-y-2">
            <div className="rounded-lg bg-zinc-800 p-3">
              📚 Study
            </div>

            <div className="rounded-lg bg-zinc-800 p-3">
              💼 Freelance
            </div>

            <div className="rounded-lg bg-zinc-800 p-3">
              🏠 Personal
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel */}
      <main className="flex-1 p-10">
        <h2 className="mb-8 text-4xl font-bold">
          Today's Tasks
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 p-16 text-center">
          <h3 className="text-2xl font-semibold">
            No Tasks Yet
          </h3>

          <p className="mt-3 text-zinc-400">
            Your tasks will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}