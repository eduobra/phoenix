"use client";
import React, { useState } from "react";
import {
  Paintbrush,
  Droplet,
  Globe,
  Mic,
  Volume2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Option = {
  title: string;
  icon: React.ReactNode;
  description?: string;
  options: string[];
};

const settingsOptions: Option[] = [
  {
    title: "Theme",
    icon: <Paintbrush className="w-4 h-4 text-gray-600" />,
    options: ["Light", "Dark", "System default"],
  },
  {
    title: "Accent color",
    icon: <Droplet className="w-4 h-4 text-gray-600" />,
    options: ["Blue", "Purple", "Green", "Orange"],
  },
  {
    title: "Language",
    icon: <Globe className="w-4 h-4 text-gray-600" />,
    options: ["English", "Spanish", "French", "Japanese"],
  },
  {
    title: "Spoken language",
    icon: <Mic className="w-4 h-4 text-gray-600" />,
    options: ["English (US)", "Filipino", "Spanish", "French"],
  },
  {
    title: "Voice",
    icon: <Volume2 className="w-4 h-4 text-gray-600" />,
    options: ["Default", "Soft Female", "Male", "AI Expressive"],
  },
];

export default function GeneralSettings() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleToggle = (title: string) => {
    setOpenDropdown((prev) => (prev === title ? null : title));
  };

  const handleSelect = (title: string, option: string) => {
    setSelected((prev) => ({ ...prev, [title]: option }));
    setOpenDropdown(null);
  };

  return (
    <div className="space-y-4">
      {settingsOptions.map((setting) => (
        <div
          key={setting.title}
          className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
        >
          <div
            onClick={() => handleToggle(setting.title)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {setting.icon}
              <div>
                <h4 className="text-gray-800 font-medium text-sm md:text-base">
                  {setting.title}
                </h4>
                <p className="text-gray-500 text-xs md:text-sm">
                  {selected[setting.title] || "Select an option"}
                </p>
              </div>
            </div>

            {openDropdown === setting.title ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>

          {/* Dropdown options */}
          {openDropdown === setting.title && (
            <div className="mt-3 space-y-2 border-t pt-2 animate-fadeIn">
              {setting.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(setting.title, option)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected[setting.title] === option
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
