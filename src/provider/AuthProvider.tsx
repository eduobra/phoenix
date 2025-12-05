"use client";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/utils/cookies";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const isLoading = useAuth((state) => state.isLoading);
  const setUserData = useAuth((state) => state.setUserData);
  const userData = useAuth((state) => state.userData);
  const getCookie = getToken();
  const router = useRouter();
  const pathName = usePathname();
 const timeoutSetting = typeof window !== "undefined"
  ? localStorage.getItem("sessionTimeout")
  : null;

const timeoutMinutes = timeoutSetting
  ? parseInt(timeoutSetting.replace(/\D/g, ""), 10)
  : 0;
  useEffect(() => {
    if (!timeoutMinutes || timeoutMinutes <= 0) return;

    const TIMEOUT_MS = timeoutMinutes * 60 * 1000;
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Auto-logout after inactivity:", timeoutMinutes);
        setUserData(null);
        router.replace("/");
      }, TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeoutMinutes]);

  useEffect(() => {
    if (getCookie && userData) {
      if (pathName === "/" || pathName === "/login") {
        router.replace("/chat");
      }
    } else {
      setUserData(null);

      if (pathName !== "/" && pathName !== "/login") {
        router.replace("/");
      }
    }
  }, [getCookie, userData, pathName, router, setUserData]);

  if (isLoading) {
    return <>loading..</>;
  }

  return children;
};

export default AuthProvider;
