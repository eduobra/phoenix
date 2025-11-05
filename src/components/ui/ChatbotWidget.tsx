"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chat from "../chat-widgets/Chat";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-[500px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-primary text-white">
            <span className="font-semibold">Ascent A\</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat widget"
              className="p-1"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto">
            <Chat />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat widget"
          className="p-4 rounded-full shadow-lg bg-gradient-primary hover:shadow-glow"
        >
          <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
