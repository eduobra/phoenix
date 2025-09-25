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

  useEffect(() => {
    if (getCookie && userData) {
      if (pathName === "/" || pathName === "/login") {
        router.replace("/home");
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
