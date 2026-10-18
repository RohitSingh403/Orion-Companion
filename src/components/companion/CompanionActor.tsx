import "./companion.css";

const SPRITES = {
  idle: "/companion/front.png",
  walk: "/companion/walk.png",
  focus: "/companion/work.png",
  break: "/companion/coffee.png",
} as const;

export type CompanionPose = keyof typeof SPRITES;

export default function CompanionActor({
  mode,
  facing = 1,
}: {
  mode: CompanionPose;
  facing?: 1 | -1;
}) {
  const flip = mode === "walk" && facing < 0;
  return (
    <div className={`pet pet-${mode}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <img
        src={SPRITES[mode]}
        alt=""
        draggable={false}
        className="pet-body"
      />
      {mode === "idle" && <span className="pet-blink" />}
    </div>
  );
}
