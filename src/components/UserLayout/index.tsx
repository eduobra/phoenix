"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Header from "@/components/header/header";
import Sidenav from "./Sidenav";

const Userlayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👇 Ensure dark mode is applied by default (and remembered)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <div>
        <Sidenav
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-card-50 dark:bg-background">
          {children}
        </main>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Userlayout;
