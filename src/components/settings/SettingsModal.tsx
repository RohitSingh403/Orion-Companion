import Card from "../ui/Card";
import SettingsPanel from "./SettingsPanel";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">⚙️ Settings</h2>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <SettingsPanel />
        </Card>
      </div>
    </div>
  );
}
