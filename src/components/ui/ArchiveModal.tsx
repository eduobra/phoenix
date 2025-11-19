"use client";

import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useArchivedConversations, useRestoreConversation } from "@/query";

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ArchiveModal({ open, onClose }: ArchiveModalProps) {
  const { data, isLoading, isError, refetch } = useArchivedConversations();
  const restoreMutation = useRestoreConversation();

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // 🔁 Automatically refetch data every time modal opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background dark:bg-neutral-900 w-[450px] rounded-lg shadow-xl p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-card-foreground-500 hover:text-card-foreground-700 dark:hover:text-card-foreground-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Archived Conversations
        </h2>

        {isLoading && (
          <p className="text-sm text-card-foreground-500 dark:text-card-foreground-400 text-center">
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
                {data.map(
                  (
                    item: { session_id: string; topic: string; updated_at: string },
                    idx: number
                  ) => (
                    <li
                      key={item.session_id || idx}
                      className="border border-gray-200 dark:border-neutral-700 p-3 rounded-md flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                      <div>
                        <p className="text-sm dark:text-neutral-200">{item.topic}</p>
                        <p className="text-xs text-card-foreground-400 dark:text-card-foreground-500 mt-1">
                          {new Date(item.updated_at).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          restoreMutation.mutate({ session_id: item.session_id })
                        }
                        disabled={restoreMutation.isPending}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {restoreMutation.isPending ? "Restoring..." : "Restore"}
                      </button>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-card-foreground-500 dark:text-card-foreground-400 text-sm text-center">
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
