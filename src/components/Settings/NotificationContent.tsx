"use client";

import React, { useState } from "react";
import { MessageSquare, ListChecks, ThumbsUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SystemBanner } from "../ui/SystemBanner";
import { NotificationItem } from "@/types/settingsTypes";



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
    description:
      "Get small in-app banners when tasks finish or workflow suggestions are available.",
    icon: ThumbsUp,
    type: "toggle",
  },
];

export default function NotificationContent() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [selectedEmailOption, setSelectedEmailOption] =
    useState<string>("Pinned Sessions");

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    setModalMessage(`${key} ${!toggles[key] ? "enabled" : "disabled"}`);
  };

  const handleBanner = (msg: string) => {
    setModalMessage(msg);
  };

  const handleSendEmail = () => {
    setModalMessage(
      `AI Session Summary Email will be sent for: ${selectedEmailOption}.`
    );
  };

  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-background p-4 space-y-3"
            >
              {modalMessage && (
                <SystemBanner
                  message={modalMessage}
                  onClose={() => setModalMessage(null)}
                />

              )}
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-card-foreground-600" />
                <span className="font-medium text-card-foreground-800">
                  {item.title}
                </span>
              </div>

              <p className="text-sm text-card-foreground-700">
                {item.description}
              </p>

     
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Enable Summary Email</span>
                    <Switch
                      checked={toggles[item.title]}
                      onCheckedChange={() => handleToggle(item.title)}
                    />
                  </div>

                  {toggles[item.title] && (
                    <>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {["Pinned Sessions", "Long Sessions", "Both"].map(
                          (option) => (
                            <button
                              key={option}
                              onClick={() => setSelectedEmailOption(option)}
                              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                                selectedEmailOption === option
                                  ? "bg-blue-600 text-white border-blue-600 font-medium shadow-sm"
                                  : "bg-card-100 dark:bg-card-700 text-card-foreground-700 dark:text-card-foreground-300 hover:bg-blue-50 dark:hover:bg-card-600 border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>

                      <button
                        onClick={handleSendEmail}
                        className="mt-3 w-full text-sm px-3 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
                      >
                        Send to email
                      </button>
                    </>
                  )}
                </div>
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
    </>
  );
}
