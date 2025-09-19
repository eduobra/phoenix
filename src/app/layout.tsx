import type { Metadata } from "next";
import Providers from "./providers";
import "../styles/globals.css";
import MSALProvider from "@/provider/MsalProvider";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Migrated to App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MSALProvider>
          <Providers>{children}</Providers>
        </MSALProvider>
      </body>
    </html>
  );
}
