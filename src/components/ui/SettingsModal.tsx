"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import {
  Settings,
  Bell,
  Palette,
  Plug,
  Database,
  Shield,
  User,
} from "lucide-react";

import GeneralSettings from "../Settings/general-settings";
import NotificationContent from "../Settings/NotificationContent";
import PersonalizationContent from "../Settings/PersonalizationContent";
import AppsConnectorsContent from "../Settings/AppsConnectorsContent";
import DataControlsContent from "../Settings/DataControlsContent";
import SecuritySettings from "../Settings/SecuritySettings";
import AccountSection from "../Settings/AccountSection";

const menuItems = [
  { name: "General", icon: <Settings size={16} />, key: "general" },
  { name: "Notification", icon: <Bell size={16} />, key: "notification" },
  { name: "Personalization", icon: <Palette size={16} />, key: "personalization" },
  { name: "Apps & Connectors", icon: <Plug size={16} />, key: "apps_connectors" },
  { name: "Data controls", icon: <Database size={16} />, key: "data_controls" },
  { name: "Security", icon: <Shield size={16} />, key: "security" },
  { name: "Account", icon: <User size={16} />, key: "account" },
];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t, i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState("General");
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentLang, setCurrentLang] = useState(i18n.language);
  useEffect(() => {
    const handleLanguageChange = () => setCurrentLang(i18n.language);
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
      <div className="bg-background rounded-3xl shadow-xl w-full max-w-[800px] h-[90vh] md:h-[500px] flex flex-col md:flex-row overflow-hidden animate-modalIn">

        {/* Sidebar */}
        <aside className="bg-background border-b md:border-b-0 md:border-r border-gray-900 p-3 md:w-1/3">
          <div className="flex justify-between items-center md:block">
            <button
              onClick={onClose}
              className="
                flex items-center justify-center
                h-12 w-12 md:h-8 md:w-8
                text-gray-400 hover:text-gray-900
                rounded-sm hover:bg-gray-200
                transition-all
              "
            >
              <span className="text-2xl md:text-2xl leading-none">×</span>
            </button>

            <h2 className="text-base font-semibold text-card-foreground-800 mb-0 md:mb-4">
              {t("Settings")}
            </h2>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-card-foreground-600 hover:text-card-foreground-800 text-xl"
            >
              ☰
            </button>
          </div>

          {/* Menu */}
          <ul
            className={`space-y-2 mt-4 md:mt-0 transition-all duration-300 ease-in-out ${
              menuOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 md:max-h-none md:opacity-100 overflow-hidden"
            }`}
          >
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveMenu(item.name);
                    if (window.innerWidth < 768) setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-all text-sm ${
                    activeMenu === item.name
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-card-foreground-700 hover:bg-card-100"
                  }`}
                >
                  <span className="opacity-80">{item.icon}</span>
                  {t(item.key)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div key={currentLang} className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-card-foreground-800">
              {t(menuItems.find(m => m.name === activeMenu)?.key || activeMenu.toLowerCase())}
            </h3>
          </div>

          <div className="text-card-foreground-600 text-sm md:text-base space-y-2">
            {activeMenu === "General" && <GeneralSettings />}
            {activeMenu === "Notification" && <NotificationContent />}
            {activeMenu === "Personalization" && <PersonalizationContent />}
            {activeMenu === "Apps & Connectors" && <AppsConnectorsContent />}
            {activeMenu === "Data controls" && <DataControlsContent />}
            {activeMenu === "Security" && <SecuritySettings />}
            {activeMenu === "Account" && <AccountSection />}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null;
}
