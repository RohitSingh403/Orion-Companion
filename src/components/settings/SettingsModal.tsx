import { AnimatePresence, motion } from "framer-motion";

import Card from "../ui/Card";
import SettingsPanel from "./SettingsPanel";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <Card>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">⚙️ Settings</h2>

                  <p className="text-sm text-secondary">
                    Customize your focus experience
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="text-3xl text-secondary transition hover:text-primary"
                >
                  ×
                </button>
              </div>

              <SettingsPanel />
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
