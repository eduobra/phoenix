"use client";

import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({ palette: { mode: "dark" } });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
