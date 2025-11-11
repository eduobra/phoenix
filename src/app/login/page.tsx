"use client";

import { useEffect, useState } from "react";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import axios, { AxiosError } from "axios";
import { getLatestConversation, getLatestSessionsByUserID } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import { signIn } from "next-auth/react";

import { useMsal } from "@azure/msal-react";
import { useAuth } from "@/contexts/AuthContext";
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: string) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const handleMicrosoftSignIn = useAuth((state) => state.handleMicrosoftSignIn);
  // const { login, setUser, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { instance, accounts } = useMsal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [conversationIdHis, setConversationIdHis] = useState<string | null>(null);

  // useEffect(() => {
  //   if (loading || redirecting) return;

  //   // Check both MSAL sessionStorage + our own token
  //   const msalToken = sessionStorage.getItem("msal_access_token");
  //   const localToken = localStorage.getItem("token");
  //   if (user && (msalToken || localToken) && pathname === "/login") {
  //     setRedirecting(true);
  //     getLatestConversation(user.email)
  //       .then(async (conversationId) => {
  //         //get the latest session_id here
  //         const latest_session_id_first = await getLatestSessionsByUserID(conversationId);

  //         router.replace(`/chat/${latest_session_id_first || uuidv4()}`);
  //       })
  //       .catch(() => {
  //         console.log("id from login catch");
  //         router.replace(`/chat/${uuidv4()}`);
  //       });
  //   }
  // }, [user, loading, pathname, router, redirecting]);

  // const handleMicrosoftSignIn = async () => {
  //   try {
  //     const response = await instance.loginPopup({
  //       scopes: ["openid", "profile", "email", "User.Read"],
  //     });
  //     console.log("response", response);
  //     const idToken = response.idToken;
  //     const graphToken = response.accessToken;

  //     const logicApps = await fetch(
  //       "https://prod-11.southeastasia.logic.azure.com:443/workflows/518352056f1347f2804327c009788137/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=l2BMnO4PdosXmHkH-qDVOH4DUB2jf9-OEZiZGFo_BmU",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id_token: idToken, graph_token: graphToken }),
  //       }
  //     );

  //     if (!logicApps.ok) throw new Error("Backend login failed");
  //     const data = await logicApps.json();
  //     console.log("logicApps", logicApps);
  //     sessionStorage.setItem("msal_access_token", idToken);
  //     sessionStorage.setItem("jwt_token", data.access_token);
  //     const userEmail = data?.email || response.account?.username || "admin@outlook.com";
  //     console.log({ data });
  //     return;
  //     sessionStorage.setItem(
  //       "msal_user",
  //       JSON.stringify({
  //         email: userEmail,
  //         name: data.firstname ? `${data.firstname} ${data.lastname}` : userEmail,
  //       })
  //     );

  //     // update AuthContext
  //     setUser({
  //       id: data.id,
  //       email: userEmail,
  //       name: data.firstname ? `${data.firstname} ${data.lastname}` : userEmail,
  //     });
  //   } catch (err) {
  //     console.error("Microsoft login error:", err);
  //     setError("Microsoft login failed");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // await login(email, password);
      const conversationId = await getLatestConversation(email);
      console.log("id from login", conversationId);
      router.replace(`/chat/${conversationId || uuidv4()}`);
    } catch (err) {
      let message = "Invalid credentials";
      if (err instanceof AxiosError) {
        message = err.response?.data?.detail || message;
      }
      setError(message);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      prompt: "select_account",
      callbackUrl: `${window.location.origin}/chat/${conversationIdHis}`,
    });
  };

  // if (loading || redirecting) {
  //   return (
  //     <div className="flex items-center justify-center w-screen h-screen bg-background">
  //       <div className="flex space-x-2">
  //         <span className="w-3 h-3 bg-card-500 rounded-full animate-bounce delay-0"></span>
  //         <span className="w-3 h-3 delay-200 bg-card-500 rounded-full animate-bounce"></span>
  //         <span className="w-3 h-3 bg-card-500 rounded-full animate-bounce delay-400"></span>
  //         <span className="w-3 h-3 bg-card-500 rounded-full animate-bounce delay-600"></span>
  //       </div>
  //     </div>
  //   );
  // }

  // if (user) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl">
        <div className="flex justify-center mb-4">
          <Image src="/login_logo.png" alt="Logo" width={220} height={120} />
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900">Welcome back</h2>
        <p className="mb-6 text-sm text-center text-gray-900">Please enter your details to login.</p>

        {error && <p className="py-2 mb-2 text-sm text-center text-red-600 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded-lg  focus:border-black focus:outline-none  cursor-not-allowed opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded-lg focus:border-black focus:outline-none  cursor-not-allowed opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled
            />
            <div className="mt-1 text-right">
              <a href="" className="text-xs font-medium text-blue-600 hover:underline  cursor-not-allowed opacity-50" >
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className="w-full py-2 text-white bg-black rounded-lg hover:bg-black  cursor-not-allowed opacity-50" disabled>
            Login
          </button>

          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-xs text-gray-900">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            id="googleSignInDiv"
            type="button"
            className="flex items-center justify-center w-full py-2 text-sm border text-gray-900 border-gray-300 rounded-lg cursor-not-allowed opacity-50"
            disabled
          >
            <FcGoogle className="mr-2 text-lg" />
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={handleMicrosoftSignIn}
            className="flex items-center justify-center w-full py-2 mt-2 text-sm border text-gray-900 border-gray-300 rounded-lg cursor-pointer hover:bg-card-50"
            
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
              <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-900">
          Don’t have an account?{" "}
          <a href="/register" className="font-medium text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
