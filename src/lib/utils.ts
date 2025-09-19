import { AuthToken } from "@/types/user";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getAuthToken = (): { token: string; type: "manual" | "msal" | "google" } => {
  // 1. Check manual login token in localStorage
  const manualToken = localStorage.getItem("access_token");
  if (manualToken) return { token: manualToken, type: "manual" };

  // 2. Check MSAL token
  const msalToken = localStorage.getItem("msal_access_token");
  if (msalToken) return { token: msalToken, type: "msal" };

  // 3. Check Google login token
  const googleToken = localStorage.getItem("google_token");
  if (googleToken) return { token: googleToken, type: "google" };

  throw new Error("No auth token found");
};