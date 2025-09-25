// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useSession } from "next-auth/react";
// import { useRouter, usePathname } from "next/navigation";

// interface Props {
//   children: ReactNode;
// }

// export const AuthGuard = ({ children }: Props) => {
//   const { user, loading: customLoading } = useAuth();
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();

//   const [showLoading, setShowLoading] = useState(true);

//   // Debug logs
//   // useEffect(() => {
//   //   console.log("AuthGuard Debug:");
//   //   console.log("pathname:", pathname);
//   //   console.log("custom user:", user);
//   //   console.log("custom loading:", customLoading);
//   //   console.log("next-auth session:", session);
//   //   console.log("next-auth status:", status);
//   // }, [user, customLoading, session, status, pathname]);

//   // Smooth loading animation
//   useEffect(() => {
//     const isLoading = customLoading || status === "loading";
//     if (!isLoading) {
//       const timer = setTimeout(() => setShowLoading(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [customLoading, status]);

//   const isAuthenticated = !!user || !!session?.user;
//   const isLoading = customLoading || status === "loading" || showLoading;

//   // Handle redirects
//   useEffect(() => {
//     if (isLoading) return;

//     if (!isAuthenticated && pathname !== "/login") {
//       console.log("Redirecting: Not authenticated, sending to /login");
//       router.replace("/login");
//       return;
//     }

//     if (isAuthenticated && pathname === "/login") {
//       console.log("Redirecting: Authenticated, sending to /chat");
//       router.replace("/chat");
//       return;
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   // Show loading animation
//   if (isLoading || (pathname === "/login" && isAuthenticated)) {
//     return (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100vw",
//           height: "100vh",
//           backgroundColor: "#ffffff",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
//           zIndex: 9999,
//         }}
//       >
//         <div style={{ display: "flex", gap: 8 }}>
//           <span style={dotStyle(0)} />
//           <span style={dotStyle(1)} />
//           <span style={dotStyle(2)} />
//         </div>
//         <p style={{ marginTop: 20, fontSize: 16, color: "#666" }}>

//         </p>

//         <style>
//           {`
//             @keyframes bounce {
//               0%, 80%, 100% { transform: scale(0); }
//               40% { transform: scale(1); }
//             }
//           `}
//         </style>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };
// const dotStyle = (index: number) => ({
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   backgroundColor: "#888",
//   display: "inline-block",
//   animation: `bounce 1.4s infinite ease-in-out`,
//   animationDelay: `${index * 0.2}s`,
// });

import { ReactNode } from "react";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  return children;
};

export default AuthGuard;
