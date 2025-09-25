// app/providers/MSALProvider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { EventType, AuthenticationResult, PublicClientApplication } from "@azure/msal-browser";
import { createMsalInstance } from "@/lib/msal/msal";

export default function MSALProvider({ children }: { children: ReactNode }) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const instance = createMsalInstance();

    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
    }

    instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        instance.setActiveAccount(account);
      }
    });

    setMsalInstance(instance);
  }, []);

  if (!msalInstance) return null; // or a loading spinner

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
