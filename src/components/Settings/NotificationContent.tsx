"use client";

import React, { useState } from "react";
import { MessageSquare, ListChecks, ThumbsUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationItem {
  title: string;
  description: string;
  icon: React.ElementType;
  type: "toggle" | "banner" | "email";
}

const items: NotificationItem[] = [
  {
    title: "AI Session Summary Email",
    description: "Send optional summary after pinned or long sessions.",
    icon: MessageSquare,
    type: "email",
  },
  {
    title: "System Alerts",
    description:
      "Notify user of plan updates or maintenance. Displays a small banner like 'Agent update completed'.",
    icon: ListChecks,
    type: "banner",
  },
  {
    title: "In-App Activity Banner",
    description: "Get small in-app banners when tasks finish or workflow suggestions are available.",
    icon: ThumbsUp,
    type: "toggle",
  },
];

export default function NotificationContent() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setModalMessage(`${key} ${!toggles[key] ? "enabled" : "disabled"}`);
  };

  const handleBanner = (msg: string) => {
    setModalMessage(msg);
  };

  const handleSendEmail = () => {
    // Here you can call your API to send email if needed
    setModalMessage("AI Session Summary Email has been sent successfully.");
  };

  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden bg-background p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-card-foreground-600" />
                <span className="font-medium text-card-foreground-800">{item.title}</span>
              </div>

              <p className="text-sm text-card-foreground-700">{item.description}</p>

              {item.type === "toggle" && (
                <div className="flex items-center justify-between">
                  <span>Enable</span>
                  <Switch
                    checked={toggles[item.title]}
                    onCheckedChange={() => handleToggle(item.title)}
                  />
                </div>
              )}

              {item.type === "email" && (
                <button
                  onClick={handleSendEmail}
                  className="text-sm px-3 py-1.5 bg-primary text-white rounded-md hover:opacity-90 transition"
                >
                  Send Test Email
                </button>
              )}

              {item.type === "banner" && (
                <button
                  onClick={() => handleBanner(item.description)}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:opacity-90 transition"
                >
                  Show Banner Example
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-80 text-center space-y-4">
            <h2 className="text-lg text-foreground font-medium">Notification</h2>
            <p className="text-sm text-foreground">{modalMessage}</p>
            <button
              onClick={() => setModalMessage(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
