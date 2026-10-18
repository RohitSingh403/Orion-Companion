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
    if (mode !== "walk") return undefined;
    const id = window.setInterval(() => setStep((frame) => (frame + 1) % 2), 180);
    return () => window.clearInterval(id);
  }, [mode]);

  const flip = mode === "walk" && facing < 0;
  const src = mode === "walk" && step === 1 ? "/companion/walk-2.png" : SPRITES[mode];

  return (
    <div className={`pet pet-${mode}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <img src={src} alt="" draggable={false} className="pet-body" />
      {mode === "idle" && <span className="pet-blink" />}
    </div>
  );
}
