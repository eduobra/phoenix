// // utils/msalConfig.ts
// import { PublicClientApplication, Configuration } from "@azure/msal-browser";

// if (!process.env.NEXT_PUBLIC_AZURE_CLIENT_ID) {
//   throw new Error("Missing NEXT_PUBLIC_AZURE_CLIENT_ID in environment");
// }

// const config: Configuration = {
//   auth: {
//     clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
//     //authority: "https://login.microsoftonline.com/common",
//     authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
//     redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI
//   },
//   cache: {
//     cacheLocation: "memoryStorage",
//     storeAuthStateInCookie: false,
//   },
// };

// export const msalInstance = new PublicClientApplication(config);

// export const loginRequest = {
//   scopes: ["openid", "profile", "email", "User.Read"],
// };

// export const apiRequest = {
//   scopes: [
//     `api://${process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID}/.default`,
//   ],
// };

export async function getMsalInstance() {
  if (typeof window === "undefined") return null;

  const { PublicClientApplication } = await import("@azure/msal-browser");

  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
      authority: "https://login.microsoftonline.com/common",
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // or "localStorage" if needed
      storeAuthStateInCookie: false,
    },
  });

  await msalInstance.initialize(); // optional, but good practice

  return msalInstance;
}
