"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type UsageLimitModalProps = {
  onUpgrade?: () => void;
};

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ onUpgrade }) => {
  const [visible, setVisible] = useState(false);

  // Show modal on page load
  useEffect(() => {
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 "
        onClick={() => setVisible(false)}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-md p-4 mb-22 m-4 bg-background rounded-[16px] shadow-lg z-50">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 p-1 rounded hover:bg-card-200"
        >
          <X className="w-4 h-4 text-card-foreground-600" />
        </button>

        {/* Content */}
        <p className="mb-4 text-sm text-card-foreground-900 p-3">
          You reach the limit of free usage on Ascent AI Business Suite
        </p>

        {/* Upgrade button */}
        <button
          onClick={onUpgrade}
          className="w-full px-4 py-2 text-white bg-black rounded-full hover:bg-card-900"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default UsageLimitModal;
