import { FaBrain, FaCog, FaFire } from "react-icons/fa";

interface HeaderProps {
  completedSessions: number;
  onSettings: () => void;
}

export default function Header({ completedSessions, onSettings }: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg">
            <FaBrain className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Focus Companion
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Stay focused. Stay consistent.
            </p>
          </div>
        </div>

        <button
          onClick={onSettings}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            transition-all
            duration-200
            hover:bg-zinc-800
            hover:scale-105
          "
        >
          <FaCog className="text-lg text-zinc-300" />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
        <FaFire className="text-orange-500" />

        <span className="font-semibold text-white">{completedSessions}</span>

        <span className="text-zinc-400">Sessions Today</span>
      </div>
    </div>
  );
}
