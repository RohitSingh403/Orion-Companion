import { useEffect, useState } from "react";
import "./companion.css";

const FRAMES: Record<string, string[]> = {
  idle: ["/companion/front.png", "/companion/front-blink.png"],
  walk: ["/companion/walk.png", "/companion/walk-2.png"],
  focus: [
    "/companion/work.png",
    "/companion/work-2.png",
    "/companion/work-3.png",
    "/companion/work-4.png",
  ],
  break: [
    "/companion/coffee.png",
    "/companion/coffee-2.png",
    "/companion/coffee.png",
    "/companion/coffee-3.png",
  ],
  react: [
    "/companion/react.png",
    "/companion/react-2.png",
    "/companion/react.png",
    "/companion/react-3.png",
  ],
  sleep: ["/companion/sleep.png", "/companion/sleep-2.png"],
};

const DELAY: Record<string, number> = {
  walk: 160,
  focus: 140,
  break: 320,
  react: 130,
  sleep: 1100,
};

export type CompanionPose = "idle" | "walk" | "focus" | "break" | "react" | "sleep";

export default function CompanionActor({
  mode,
  facing = 1,
}: {
  mode: CompanionPose;
  facing?: 1 | -1;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    if (mode === "idle") {
      let alive = true;
      let timer = 0;
      const blink = () => {
        if (!alive) return;
        setStep(1);
        timer = window.setTimeout(() => {
          if (!alive) return;
          setStep(0);
          timer = window.setTimeout(blink, 2400 + Math.round(Math.random() * 900));
        }, 140);
      };
      timer = window.setTimeout(blink, 1200);
      return () => {
        alive = false;
        window.clearTimeout(timer);
      };
    }

    const frames = FRAMES[mode];
    const id = window.setInterval(() => {
      setStep((frame) => (frame + 1) % frames.length);
    }, DELAY[mode]);
    return () => window.clearInterval(id);
  }, [mode]);

  const flip = mode === "walk" && facing < 0;
  const frames = FRAMES[mode];
  const src = frames[step % frames.length];

  return (
    <div className={`pet pet-${mode}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <img src={src} alt="" draggable={false} className="pet-body" />
    </div>
  );
}
