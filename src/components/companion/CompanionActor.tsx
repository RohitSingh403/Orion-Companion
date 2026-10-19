import { useEffect, useState } from "react";
import "./companion.css";

const SPRITES = {
  idle: "/companion/front.png",
  walk: "/companion/walk.png",
  focus: "/companion/work.png",
  break: "/companion/coffee.png",
  react: "/companion/react.png",
  sleep: "/companion/sleep.png",
} as const;

const FOCUS_FRAMES = [
  "/companion/work.png",
  "/companion/work-2.png",
  "/companion/work-3.png",
  "/companion/work-4.png",
];

export type CompanionPose = keyof typeof SPRITES;

export default function CompanionActor({
  mode,
  facing = 1,
}: {
  mode: CompanionPose;
  facing?: 1 | -1;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (mode !== "walk" && mode !== "focus") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const frames = mode === "walk" ? 2 : FOCUS_FRAMES.length;
    const delay = mode === "walk" ? 180 : 150;
    const id = window.setInterval(() => setStep((frame) => (frame + 1) % frames), delay);
    return () => window.clearInterval(id);
  }, [mode]);

  const flip = mode === "walk" && facing < 0;
  const src =
    mode === "walk" && step % 2 === 1
      ? "/companion/walk-2.png"
      : mode === "focus"
        ? FOCUS_FRAMES[step % FOCUS_FRAMES.length]
        : SPRITES[mode];

  return (
    <div className={`pet pet-${mode}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <img src={src} alt="" draggable={false} className="pet-body" />
      {mode === "idle" && <span className="pet-blink" />}
    </div>
  );
}
