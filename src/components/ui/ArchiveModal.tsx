"use client";

import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useArchivedConversations ,useRestoreConversation} from "@/query";

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ArchiveModal({ open, onClose }: ArchiveModalProps) {
  const { data, isLoading, isError } = useArchivedConversations();
  const restoreMutation = useRestoreConversation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-neutral-900 w-[450px] rounded-lg shadow-xl p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Archived Conversations
        </h2>

        {isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Loading...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-500 dark:text-red-400 text-center">
            Failed to load archived conversations.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {data?.length ? (
              <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {data.map((item, idx) => (
                  <li
                    key={item.session_id || idx}
                    className="border border-gray-200 dark:border-neutral-700 p-3 rounded-md flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    <div>
                      <p className="text-sm dark:text-neutral-200">
                        {item.topic}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(item.updated_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Restore Button (no action yet) */}
                   <button
                    onClick={() => restoreMutation.mutate({ session_id: item.session_id })}
                    disabled={restoreMutation.isPending}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {restoreMutation.isPending ? "Restoring..." : "Restore"}
                  </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                No archived conversations found.
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
