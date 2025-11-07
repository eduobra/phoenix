// components/ui/Modal.tsx
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function Modal({ isOpen, title, message, onClose }: ModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
    <div className="bg-background rounded-3xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-modalIn">
        {title && (
          <h2 className="text-lg font-semibold text-card-foreground-900 mb-3 text-center">{title}</h2>
        )}
        <p className="text-card-foreground-700 text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-card-100 hover:bg-card-200 text-card-foreground-900 rounded-full font-medium transition-colors duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
