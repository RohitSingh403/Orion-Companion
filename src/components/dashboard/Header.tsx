import { FaBrain, FaCog, FaFire } from "react-icons/fa";

interface HeaderProps {
  completedSessions: number;
  onSettings: () => void;
}

export default function Header({
  completedSessions,
  onSettings,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
          <FaBrain className="text-white text-xl" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">
            Focus Companion
          </h1>

          <p className="text-zinc-400">
            Stay focused. Stay consistent.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2">
          <FaFire className="text-orange-500" />

          <span className="font-semibold">
            {completedSessions}
          </span>
        </div>

        <button
          onClick={onSettings}
          className="
            w-12
            h-12
            rounded-xl
            bg-zinc-900
            hover:bg-zinc-800
            transition
            flex
            items-center
            justify-center
          "
        >
          <FaCog className="text-xl" />
        </button>
      </div>
    </header>
  );
}