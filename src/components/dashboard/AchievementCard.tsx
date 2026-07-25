import Card from "../ui/Card";
import { FaLock, FaTrophy } from "react-icons/fa";

import { useAchievementStore } from "../../store/achievementStore";

export default function AchievementCard() {
  const achievements = useAchievementStore((state) => state.achievements);

  return (
    <Card>
      <div className="flex items-center gap-3 mb-5">
        <FaTrophy className="text-yellow-400 text-xl" />

        <div>
          <h2 className="text-xl font-bold">Achievements</h2>

          <p className="text-sm text-zinc-400">
            Unlock milestones as you focus
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              bg-zinc-800/60
              px-4
              py-3
            "
          >
            <div>
              <p className="font-medium">{achievement.title}</p>

              <p className="text-xs text-zinc-400">{achievement.description}</p>
            </div>

            {achievement.unlocked ? (
              <FaTrophy className="text-yellow-400" />
            ) : (
              <FaLock className="text-zinc-500" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
