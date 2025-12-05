"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { create, StoreApi, useStore, StateCreator } from "zustand";
import { useMsal } from "@azure/msal-react";
import { AuthenticationResult, AuthError, InteractionRequiredAuthError } from "@azure/msal-browser";
import axios from "axios";
import { removeToken, setToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import { persist } from "zustand/middleware";
type UserDataType = {
  name: string;
  email: string;
   accessToken?: string;
};

type ContextState = {
  userData: UserDataType | null;
  handleMicrosoftSignIn: () => void;
  isLoading: boolean;
  setUserData: (userData: UserDataType | null) => void;
  handleLogout: () => void;
};

const AuthContext = createContext<StoreApi<ContextState> | null>(null);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { instance } = useMsal();
  const router = useRouter();

  const [value] = useState(() => {
    const store: StateCreator<ContextState> = (set) => ({
      userData: null,
      isLoading: false,
      setUserData: (userData) => {
        set({ userData });
      },
      handleMicrosoftSignIn: async () => {
        try {
          const response: AuthenticationResult = await instance.loginPopup({
            scopes: ["openid", "profile", "email", "User.Read"],
          });

          const idToken = response.idToken;
          const graphToken = response.accessToken;
       
          const { data } = await axios.post<{ access_token: string }>(process.env.NEXT_PUBLIC_LOGIC_APPS_URL!, {
            id_token: idToken,
            graph_token: graphToken,
          });

          setToken(data.access_token);
             console.log("token",data.access_token)
          set({
            userData: {
              email: response.account.username,
              name: response.account.name || "",
              accessToken: data.access_token, 
            },
          });

          router.replace("/chat");
        } catch (error: unknown) {
          if (error instanceof AuthError) {
            console.error("MSAL AuthError:", error.errorCode, error.message);

            if (error instanceof InteractionRequiredAuthError) {
              console.warn("User interaction required:", error);
            }
          } else {
            console.error("Unexpected error:", error);
          }
        }
      },
      handleLogout: () => {
        set({ userData: null });
        removeToken();
        router.push("/");
      },
    });

    return create<ContextState>()(
      persist(store, {
        name: "authData",
        partialize: (state) => ({ userData: state.userData }),
      })
    );
  });

  // ---------- SESSION TIMEOUT ----------
    useEffect(() => {
      const storedTimeout = localStorage.getItem("sessionTimeout") || "30 minutes";

      const timeoutMap: Record<string, number> = {
        "1 minute": 1,
        "15 minutes": 15,
        "30 minutes": 30,
        "60 minutes": 60,
      };

      const timeoutMinutes = timeoutMap[storedTimeout];
      if (!timeoutMinutes) return;

      const logoutFn = value.getState().handleLogout;
      if (!logoutFn) return;

      const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
      let timer: NodeJS.Timeout;

      const resetTimer = () => {
        const now = Date.now();
        localStorage.setItem("lastActivity", now.toString());

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          console.log("Idle timeout reached — logging out!");
          logoutFn();
        }, timeoutMinutes * 60 * 1000);
      };

      // Check immediately on mount if we already exceeded timeout
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const elapsedMinutes = (Date.now() - parseInt(lastActivity, 10)) / 1000 / 60;
        if (elapsedMinutes >= timeoutMinutes) {
          console.log("Idle timeout already exceeded — logging out immediately!");
          logoutFn();
        }
      }
      resetTimer();

      events.forEach((e) => window.addEventListener(e, resetTimer));

      return () => {
        events.forEach((e) => window.removeEventListener(e, resetTimer));
        if (timer) clearTimeout(timer);
      };
    }, [value]);





  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;


};



export const useAuth = <T,>(selector: (state: ContextState) => T) => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error("useAuth must be used within a useAuth");
  }
  return useStore(store, selector);
};
