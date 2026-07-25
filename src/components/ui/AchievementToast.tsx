import { FaTrophy } from "react-icons/fa";

import { useToastStore } from "../../store/toastStore";

export default function AchievementToast() {
  const { visible, title, message } = useToastStore();

  if (!visible) return null;

  return (
    <div
      className="
      fixed
      bottom-8
      right-8
      z-50
      w-80
      rounded-2xl
      border
      border-yellow-500/30
      bg-zinc-900
      p-5
      shadow-2xl
      animate-in
      slide-in-from-bottom
      duration-300
    "
    >
      <div className="flex items-center gap-3">
        <FaTrophy className="text-yellow-400 text-2xl" />

        <div>
          <h3 className="font-bold">
            {title}
          </h3>

          <p className="text-sm text-zinc-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}