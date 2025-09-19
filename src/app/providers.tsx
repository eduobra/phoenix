'use client';

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";


const theme = createTheme({ palette: { mode: "light" } });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
