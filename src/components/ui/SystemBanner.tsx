
import { motion, AnimatePresence } from "framer-motion";
import { ListChecks } from "lucide-react";

export const SystemBanner = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 
                     bg-blue-600 text-white shadow-lg px-5 py-3 
                     rounded-xl flex items-center gap-3"
        >
          <ListChecks className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{message}</span>

          <button
            onClick={onClose}
            className="ml-2 text-white/80 hover:text-white text-xs"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
