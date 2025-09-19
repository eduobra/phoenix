'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { loginApi } from "@/lib/auth";
import { AuthContextType, User } from "@/types/user";
import { useRouter } from "next/navigation";
import { getLatestConversation, setAuthToken } from "@/lib/api";
import { signOut, useSession } from "next-auth/react";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const initializeUser = async () => {
      // NextAuth session
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          id: 0,
          name: session.user.name || "",
        });
        setLoading(false);
        return;
      }

      // Local storage fallback for manual login
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        setUser({ email, id: 0, name: "" });
      }
      setLoading(false);
    };

    initializeUser();
  }, [session]);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("email", email);
    setUser({ email, id: 0, name: "" });
    setAuthToken(data.access_token);

    const conversationId = await getLatestConversation(email);
    router.replace(`/chat/${conversationId || "default"}`);
  };

  const loginWithGoogle = async (googleData: { email: string; google_id: string; full_name: string }) => {
    const response = await fetch("/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleData),
    });
    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("email", googleData.email);
    setUser({ email: googleData.email, id: 0, name: "" });
    setAuthToken(data.access_token);

    const conversationId = await getLatestConversation(googleData.email);
    router.replace(`/chat/${conversationId || "default"}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.replace("/login");
    signOut({ callbackUrl: "/login/" })
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
