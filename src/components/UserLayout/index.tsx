"use client";

import React, { ReactNode, useState } from "react";
import Header from "@/components/header/header";
import Sidenav from "./Sidenav";

const Userlayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar (hidden on mobile) */}
      <div
        // className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-md transition-transform duration-300 ease-in-out
        // ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        // md:static md:translate-x-0`}
      >
        <Sidenav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
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
