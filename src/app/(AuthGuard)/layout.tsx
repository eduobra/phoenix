import Userlayout from "@/components/UserLayout";
import { ChatContextProvider } from "@/contexts/ChatContext";
import { ReactNode } from "react";

const AuthGuardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ChatContextProvider>
      <Userlayout>{children}</Userlayout>
    </ChatContextProvider>
  );
};

export default AuthGuardLayout;
