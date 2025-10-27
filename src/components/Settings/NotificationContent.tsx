"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Bell, MessageSquare, ListChecks, ThumbsUp } from "lucide-react";

interface DropdownItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

const dropdowns: DropdownItem[] = [
  {
    title: "Responses",
    description: "Manage how you receive alerts for new responses or replies.",
    icon: MessageSquare,
  },
  {
    title: "Task",
    description: "Choose when to be notified about assigned or completed tasks.",
    icon: ListChecks,
  },
  {
    title: "Recommendations",
    description: "Get suggestions for improving workflow and productivity.",
    icon: ThumbsUp,
  },
];

export default function NotificationContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {dropdowns.map((item, index) => {
        const Icon = item.icon;
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 bg-white"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-800">{item.title}</span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {isOpen && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-700">
                {item.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
