import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScaleIn from "../animations/ScaleIn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = "md" 
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <ScaleIn duration={0.3}>
              <div 
                className={`w-full ${sizeClasses[size]} card-elevated rounded-xl p-6 pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar`}
              >
                {title && (
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/6">
                    <h3 className="text-lg font-semibold text-accent">{title}</h3>
                    <button
                      onClick={onClose}
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {children}
              </div>
            </ScaleIn>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
