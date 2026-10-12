import "./companion.css";

function Laptop() {
  return (
    <div className="pet-laptop" aria-hidden="true">
      <div className="pet-screen">
        <span />
        <span />
        <span />
      </div>
      <div className="pet-keyboard">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="pet-deck" />
    </div>
  );
}

function Coffee() {
  return (
    <div className="pet-coffee" aria-hidden="true">
      <span className="pet-steam pet-steam-a" />
      <span className="pet-steam pet-steam-b" />
      <span className="pet-mug" />
    </div>
  );
}

export default function CompanionActor({ mode }: { mode: "idle" | "focus" | "break" }) {
  return (
    <div className={`pet pet-${mode}`}>
      <img
        src="/companion/front.png"
        alt=""
        draggable={false}
        className="pet-body"
      />
      {mode === "idle" && <span className="pet-blink" />}
      {mode === "focus" && <Laptop />}
      {mode === "break" && <Coffee />}
    </div>
  );
}
