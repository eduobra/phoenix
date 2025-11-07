"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import GeneralSettings from "../Settings/general-settings";
import NotificationContent from "../Settings/NotificationContent";
import PersonalizationContent from "../Settings/PersonalizationContent";
import AppsConnectorsContent from "../Settings/AppsConnectorsContent";
import DataControlsContent from "../Settings/DataControlsContent";
import SecuritySettings from "../Settings/SecuritySettings";
import ParentalControlsSection from "../Settings/ParentalControlsSection";
import AccountSection from "../Settings/AccountSection";

const menuItems = [
  "General",
  "Notification",
  "Personalization",
  "Apps & Connectors",
  "Data controls",
  "Security",
  "Account",
];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeMenu, setActiveMenu] = useState("General");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
      <div className="bg-background rounded-3xl shadow-xl w-full max-w-[800px] h-[90vh] md:h-[500px] flex flex-col md:flex-row overflow-hidden animate-modalIn">
        {/* Sidebar / Top menu (responsive) */}
        <aside className="bg-card-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:w-1/3">
          <div className="flex justify-between items-center md:block">
            <h2 className="text-lg font-semibold text-card-foreground-800 mb-0 md:mb-4">
              Settings
            </h2>
            {/* Hamburger toggle for mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-card-foreground-600 hover:text-card-foreground-800 text-xl"
            >
              ☰
            </button>
          </div>

          <ul
            className={`space-y-2 mt-4 md:mt-0 transition-all duration-300 ease-in-out ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100 overflow-hidden"
            }`}
          >
            {menuItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => {
                    setActiveMenu(item);
                    if (window.innerWidth < 768) setMenuOpen(false); // auto close menu on mobile
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeMenu === item
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-card-foreground-700 hover:bg-card-100"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-card-foreground-800">
              {activeMenu}
            </h3>
            <button
              onClick={onClose}
              className="text-card-foreground-500 hover:text-card-foreground-700 text-xl md:text-2xl"
            >
              ✖
            </button>
          </div>

          <div className="text-card-foreground-600 text-sm md:text-base space-y-2">
            {activeMenu === "General" && <GeneralSettings />}
            {activeMenu === "Notification" && (<NotificationContent />)}
            {activeMenu === "Personalization" && <PersonalizationContent />}
            {activeMenu === "Apps & Connectors" && <AppsConnectorsContent />}
            {activeMenu === "Data controls" && <DataControlsContent />}
            {activeMenu === "Security" &&  <SecuritySettings />}
            {/* {activeMenu === "Parental controls" && <ParentalControlsSection />} */}
            {activeMenu === "Account" && <AccountSection />}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
