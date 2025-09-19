// components/TypingIndicator.tsx
import { motion } from "framer-motion";

export default function TypingIndicator({ message }: { message?: string }) {
  const isAnalyzing = !!message;

  return (
    <div className="flex items-center gap-2 text-sm mt-2 px-2">
      {/* Animated dots */}
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>
        <span
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></span>
      </motion.div>

      {/* Animated message with heartbeat + color cycle + fade-in delay */}
      {isAnalyzing && (
        <motion.span
          className="font-medium inline-block"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1], // heartbeat scale
            color: [
              "#ec4899", // pink
              "#8b5cf6", // violet
              "#a855f7", // purple
              "#ec4899",
            ],
          }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            scale: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            },
            color: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {message}
        </motion.span>
      )}
    </div>
  );
}
