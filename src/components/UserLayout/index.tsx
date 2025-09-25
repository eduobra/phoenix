import React, { ReactNode } from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";

const Userlayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidenav />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        <Header />
        {/* <div className="flex-1 overflow-y-auto">
          <ChatArea
            messages={messages}
            conversationId={sessionFromUrl || ""}
            logout={handleLogout}
            sessionToken={token || ""}
            user={
              localUser ||
              (session?.user
                ? {
                    id: Number(session.user.id), // Convert string → number
                    name: session.user.name || "",
                    email: session.user.email || "",
                  }
                : null)
            }
          />
          
        </div> */}
        {children}
      </div>
    </div>
  );
};

export default Userlayout;
