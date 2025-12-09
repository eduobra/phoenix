"use client";
import React, { useState, useEffect } from "react";
import {
  Paintbrush,
  Droplet,
  Globe,
  ChevronDown,
  ChevronUp,
  CalendarCog,
  Cog,
  Clock,
} from "lucide-react";
import { useTheme, Language, SessionTimeout } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useGetSettings, useUpdateSettings } from "@/query";
import { SettingsPayload } from "@/types/queryType";

// Simple inline spinner
const Spinner = () => (
  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
);

export default function GeneralSettings() {
  const { t, i18n } = useTranslation();
  const { theme, updateTheme, accent, updateAccent, language, updateLanguage, sessionTimeout, updateSessionTimeout } = useTheme();
  const token = useAuth((state) => state.userData?.accessToken);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({
    Theme: theme,
    "Accent color": accent,
    Language: language,
    "Session Timeout Control": sessionTimeout,
    "Time Zone & Format": localStorage.getItem("timezone") || "",
  });

  const [timezones, setTimezones] = useState<string[]>([]);
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem("timeFormat") || "24-hour");

  const { data } = useGetSettings(token);
  const updateSettings = useUpdateSettings(token);
  const [loadingSetting, setLoadingSetting] = useState<string | null>(null);

  const accentColorMap: Record<string, string> = {
    Blue: "#3b82f6",
    Violet: "#8b5cf6",
    "Slate Gray": "#64748b",
  };

  const translationKeyMap: Record<string, string> = {
    Theme: "theme",
    "Accent color": "accent_color",
    Language: "language",
    "Time Zone & Format": "Time_Zone_Format",
    "Session Timeout Control": "Session_Timeout_Control",
  };

  // Load timezones
  useEffect(() => {
    try {
      if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
        setTimezones(Intl.supportedValuesOf("timeZone"));
      } else {
        fetch("https://worldtimeapi.org/api/timezone")
          .then((res) => res.json())
          .then((data) => setTimezones(data))
          .catch(() => setTimezones(["Asia/Manila", "UTC"]));
      }
    } catch {
      setTimezones(["Asia/Manila", "UTC"]);
    }
  }, []);

  // Sync selected state with hooks
  useEffect(() => {
    setSelected({
      Theme: theme,
      "Accent color": accent,
      Language: language,
      "Session Timeout Control": sessionTimeout,
      "Time Zone & Format": localStorage.getItem("timezone") || "",
    });
  }, [theme, accent, language, sessionTimeout]);

  // Initialize from API
  useEffect(() => {
    if (data) {
      const timeoutMap: Record<number, SessionTimeout> = {
        1: "1 minute",
        15: "15 minutes",
        30: "30 minutes",
        60: "60 minutes",
      };

      setSelected({
        Theme: data.theme,
        "Accent color": data.accent_color,
        Language: data.language,
        "Session Timeout Control": timeoutMap[data.session_timeout_control] || "60 minutes",
        "Time Zone & Format": data.time_zone,
      });

      updateTheme(data.theme);
      updateAccent(data.accent_color);
      applyLanguage(data.language as Language);
      updateSessionTimeout(
        (timeoutMap[data.session_timeout_control] || "60 minutes") as SessionTimeout
      );
      localStorage.setItem("timezone", data.time_zone);
    }
  }, [data]);

  const settingsOptions = [
    { title: "Theme", icon: <Paintbrush className="w-4 h-4" />, options: ["Light", "Dark", "System default"] },
    { title: "Accent color", icon: <Droplet className="w-4 h-4" />, options: ["Blue", "Violet", "Slate Gray"] },
    { title: "Language", icon: <Globe className="w-4 h-4" />, options: ["English", "Spanish", "French", "Japanese"] as Language[] },
    { title: "Time Zone & Format", icon: <CalendarCog className="w-4 h-4" />, options: timezones.length ? timezones : ["Loading time zones..."], formats: ["24-hour", "12-hour"] },
    { title: "Session Timeout Control", icon: <Cog className="w-4 h-4" />, options: ["1 minute", "15 minutes", "30 minutes", "60 minutes"] },
  ];

  const handleToggle = (title: string) => setOpenDropdown(prev => (prev === title ? null : title));

  const applyLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    updateLanguage(lang);
  };

  const handleSelect = (title: string, option: string) => {
    setSelected(prev => ({ ...prev, [title]: option }));
    setOpenDropdown(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (title === "Theme") updateTheme(option as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (title === "Accent color") updateAccent(option as any);
    if (title === "Language") applyLanguage(option as Language);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (title === "Session Timeout Control") updateSessionTimeout(option as any);
    if (title === "Time Zone & Format") localStorage.setItem("timezone", option);

    // Prepare payload
    const payload: SettingsPayload = {
        theme: title === "Theme" ? option : selected.Theme,
        accent_color: title === "Accent color" ? option : selected["Accent color"],
        language: title === "Language" ? option : selected.Language,
        session_timeout_control:
          title === "Session Timeout Control"
            ? parseInt(option.replace(/\D/g, ""), 10)
            : parseInt(selected["Session Timeout Control"].replace(/\D/g, ""), 10),
        time_zone: title === "Time Zone & Format" ? option : selected["Time Zone & Format"],
      };

    // Override only the changed value
    switch (title) {
      case "Theme": payload.theme = option; break;
      case "Accent color": payload.accent_color = option; break;
      case "Language": payload.language = option; break;
      case "Session Timeout Control": payload.session_timeout_control = parseInt(option.replace(/\D/g, ""), 10); break;
      case "Time Zone & Format": payload.time_zone = option; break;
    }

    setLoadingSetting(title);
    updateSettings.mutate(payload, { onSettled: () => setLoadingSetting(null) });
  };

  const handleTimeFormatChange = (format: string) => {
    setTimeFormat(format);
    localStorage.setItem("timeFormat", format);
  };
  const DotLoader = () => (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></span>
      ))}
    </div>
  );
  return (
    <div className="space-y-4 transition-colors duration-300">
     {loadingSetting && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <DotLoader />
        </div>
      )}
      {settingsOptions.map(setting => (
        <div
          key={setting.title}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-background dark:bg-card-800 hover:border-gray-300 dark:hover:border-gray-600 relative transition"
        >
          <div className="flex items-center justify-between cursor-pointer" onClick={() => handleToggle(setting.title)}>
            <div className="flex items-center gap-3">
              {setting.icon}
              <span className="text-sm md:text-base font-medium">{t(translationKeyMap[setting.title] || setting.title)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              {setting.title === "Accent color" && (
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColorMap[selected["Accent color"]] }} />
              )}
              <span className="flex items-center gap-1">
                {setting.title === "Time Zone & Format"
                  ? `${selected["Time Zone & Format"] || ""} — ${t(timeFormat)}`
                  : t(selected[setting.title])}
                
              </span>
              {openDropdown === setting.title ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {openDropdown === setting.title && (
            <div className="absolute right-4 top-full mt-1 w-56 bg-background dark:bg-card-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              {setting.title === "Time Zone & Format" ? (
                <>
                  <div className="max-h-48 overflow-y-auto">
                    {setting.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleSelect(setting.title, option)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selected[setting.title] === option ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-xs uppercase font-semibold text-gray-500 flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> {t("time_format")}
                    </h5>
                    <div className="flex gap-2">
                      {setting.formats?.map(format => (
                        <button
                          key={format}
                          onClick={() => handleTimeFormatChange(format)}
                          className={`flex-1 py-1.5 text-sm rounded-lg ${
                            timeFormat === format
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {t(format)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                setting.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleSelect(setting.title, option)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selected[setting.title] === option ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
                    }`}
                  >
                    {setting.title === "Accent color" && (
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColorMap[option] }} />
                    )}
                    {t(option)}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
