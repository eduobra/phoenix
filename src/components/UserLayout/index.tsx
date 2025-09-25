"use client"; 

import React, { ReactNode ,useState } from "react";
import Header from "@/components/header/header";
import Sidenav from "./Sidenav";

const Userlayout = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
     
        <Sidenav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Userlayout;
