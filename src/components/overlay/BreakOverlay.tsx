interface BreakOverlayProps {
  visible: boolean;
}

export default function BreakOverlay({
  visible,
}: BreakOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center z-50">

      <div className="text-center">

        <div className="text-8xl mb-8">
          ☕
        </div>

        <h1 className="text-5xl font-bold">
          Great Work!
        </h1>

        <p className="text-zinc-400 mt-4 text-xl">
          Take a short break.
        </p>

      </div>

    </div>
  );
}