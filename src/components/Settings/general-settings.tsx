"use client";
import React, { useState, useEffect } from "react";
import {
  Paintbrush,
  Droplet,
  Globe,
  ChevronDown,
  ChevronUp,
  CalendarCog,
  Cog
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function GeneralSettings() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { theme, updateTheme } = useTheme();
  const [timezones, setTimezones] = useState<string[]>([]);

  // ✅ Load available time zones dynamically
  useEffect(() => {
    try {
      if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
        setTimezones(Intl.supportedValuesOf("timeZone"));
      } else {
        // fallback if browser doesn't support it
        fetch("https://worldtimeapi.org/api/timezone")
          .then((res) => res.json())
          .then((data) => setTimezones(data))
          .catch(() => setTimezones(["Asia/Manila", "UTC"]));
      }
    } catch {
      setTimezones(["Asia/Manila", "UTC"]);
    }
  }, []);

  const settingsOptions = [
    {
      title: "Theme",
      icon: (
        <Paintbrush className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
      ),
      options: ["Light", "Dark", "System default"],
    },
    {
      title: "Accent color",
      icon: (
        <Droplet className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
      ),
      options: ["Blue", "Violet", "Slate Gray"],
    },
    {
      title: "Language",
      icon: (
        <Globe className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
      ),
      options: ["English", "Spanish", "French", "Japanese"],
    },
    {
      title: "Time Zone & Date Format",
      icon: (
        <CalendarCog className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
      ),
      options: timezones.length > 0 ? timezones : ["Loading time zones..."],
      dateFormats: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
    },
    {
      title: "Session Timeout Control",
      icon: <Cog className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />,
      options: ["15 minutes", "30 minutes", "60 minutes"],
      description: "Auto-logout after idle time for enhanced security.",
    }
  ];

  const handleToggle = (title: string) => {
    setOpenDropdown((prev) => (prev === title ? null : title));
  };

  const handleSelect = (title: string, option: string) => {
    setSelected((prev) => ({ ...prev, [title]: option }));
    setOpenDropdown(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (title === "Theme") updateTheme(option as any);
  };

  return (
    <div className="space-y-4 transition-colors duration-300">
      {settingsOptions.map((setting) => (
        <div
          key={setting.title}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-background dark:bg-card-800"
        >
          <div
            onClick={() => handleToggle(setting.title)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {setting.icon}
              <div>
                <h4 className="text-card-foreground-800 dark:text-card-foreground-100 font-medium text-sm md:text-base">
                  {setting.title}
                </h4>
                <p className="text-card-foreground-500 dark:text-card-foreground-400 text-xs md:text-sm">
                  {selected[setting.title] ||
                    (setting.title === "Theme" ? theme : "Select an option")}
                </p>
              </div>
            </div>

            {openDropdown === setting.title ? (
              <ChevronUp className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-card-foreground-600 dark:text-card-foreground-300" />
            )}
          </div>

          {openDropdown === setting.title && (
            <div className="mt-3 max-h-60 overflow-y-auto space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2 animate-fadeIn">
              {setting.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(setting.title, option)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected[setting.title] === option
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium"
                      : "hover:bg-card-100 dark:hover:bg-card-700 text-card-foreground-700 dark:text-card-foreground-300"
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
