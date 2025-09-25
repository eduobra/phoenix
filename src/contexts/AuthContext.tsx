"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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

          set({
            userData: {
              email: response.account.username,
              name: response.account.name || "",
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
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  // const [user, setUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();
  // const { data: session } = useSession();

  // useEffect(() => {
  //   const initializeUser = async () => {
  //     // NextAuth session
  //     if (session?.user) {
  //       setUser({
  //         email: session.user.email || "",
  //         id: 0,
  //         name: session.user.name || "",
  //       });
  //       setLoading(false);
  //       return;
  //     }

  //     // Local storage fallback for manual login
  //     const token = localStorage.getItem("token");
  //     const email = localStorage.getItem("email");
  //     if (token && email) {
  //       setUser({ email, id: 0, name: "" });
  //     }
  //     setLoading(false);
  //   };

  //   initializeUser();
  // }, [session]);

  // const login = async (email: string, password: string) => {
  //   const data = await loginApi(email, password);
  //   localStorage.setItem("token", data.access_token);
  //   localStorage.setItem("email", email);
  //   setUser({ email, id: 0, name: "" });
  //   setAuthToken(data.access_token);

  //   const conversationId = await getLatestConversation(email);
  //   router.replace(`/chat/${conversationId || "default"}`);
  // };

  // const loginWithGoogle = async (googleData: { email: string; google_id: string; full_name: string }) => {
  //   const response = await fetch("/auth/google-login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(googleData),
  //   });
  //   const data = await response.json();
  //   localStorage.setItem("token", data.access_token);
  //   localStorage.setItem("email", googleData.email);
  //   setUser({ email: googleData.email, id: 0, name: "" });
  //   setAuthToken(data.access_token);

  //   const conversationId = await getLatestConversation(googleData.email);
  //   router.replace(`/chat/${conversationId || "default"}`);
  // };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("email");
  //   router.replace("/login");
  //   signOut({ callbackUrl: "/login/" })
  // };

  // return (
  //   <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, setUser }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
};

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthContextProvider");
//   return context;
// };

export const useAuth = <T,>(selector: (state: ContextState) => T) => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error("useAuth must be used within a useAuth");
  }
  return useStore(store, selector);
};
