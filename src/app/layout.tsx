import type { Metadata } from "next";
import "../styles/globals.css";
import MSALProvider from "@/provider/MsalProvider";
import { AuthContextProvider } from "@/contexts/AuthContext";
import AuthProvider from "@/provider/AuthProvider";
import QueryProvider from "@/provider/QueryProvider";

export const metadata: Metadata = {
  title: "Ascent AI Agent Suite",
  description: "Orchestrate, deploy, and scale AI agents with enterprise-grade control.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <QueryProvider>
          <MSALProvider>
            <AuthContextProvider>
              <AuthProvider>{children}</AuthProvider>
            </AuthContextProvider>
          </MSALProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
