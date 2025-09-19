"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { Message, RawMessage, RawSession } from "@/types/user";
import ChatArea from "@/components/chatArea/chatArea";
import Header from "@/components/header/header";
import SideNav from "@/components/sideNav/sideNav";
import { signOut, useSession } from "next-auth/react";
import { getLatestConversation, getLatestSessionsByUserID } from "@/lib/api";

export default function ChatPage() {
  const { data: session } = useSession();
  const { user: localUser, logout: localLogout } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sessions_id, setSessionId] = useState<string | null>(null);
  // const params = useParams();
  // const conversationId = params?.conversationId as string | null;
  const params = useParams();
  const sessionFromUrl = params?.conversationId as string | null;

  useEffect(() => {
    const manualToken = localStorage.getItem("token"); // manual login
    const msalToken = sessionStorage.getItem("msal_access_token"); // msal login
    const googleUser = session?.user; // google login

    if (manualToken || msalToken || googleUser) {
      setToken(manualToken || msalToken || null);
    } else {
      console.warn("No valid auth found, redirecting to login");
      router.replace("/login");
    }
  }, [router, session]);

  useEffect(() => {
    if (sessionFromUrl) {
      setSessionId(sessionFromUrl); // if URL already has session id, sync it
    }
  }, [sessionFromUrl]);
  useEffect(() => {
    if (sessions_id) return;

    getLatestConversation(localUser?.email || "user")
      .then(async (user_id) => {
        setSelectedId(user_id); // store user_id
        const latestSession = await getLatestSessionsByUserID(user_id);
        setSessionId(latestSession);
        router.replace(`/chat/${latestSession}`);
      })
      .catch(() => console.log("No latest session found"));
  }, [localUser?.email, sessions_id, router]);

  useEffect(() => {
    const msalUser = sessionStorage.getItem("msal_user");

    if (!loading && !localUser && !session?.user && !msalUser) {
      router.replace("/login");
    }
  }, [loading, localUser, session, router]);

  // Fetch messages whenever sessions_id changes
  useEffect(() => {
    if (!sessions_id) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/conversations/sessions/${sessions_id}/messages`,
          {
            method: "GET", // or POST depending on your backend
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.warn(`Failed to fetch messages. Status: ${res.status}`);
          setMessages([]);
          return;
        }

        const data = await res.json();

        const rawMessages: RawMessage[] = Array.isArray(data)
          ? data
          : Array.isArray(data.messages)
            ? data.messages
            : [];

        const msgsWithTimestamp: Message[] = rawMessages.flatMap((msg: RawMessage) => {
          const result: Message[] = [];

          // user message (right side)
          if (msg.message) {
            result.push({
              id: `${msg.id}-user`,
              sender: "user",
              content: msg.message,
              timestamp: msg.created_at || new Date().toISOString(),
            });
          }

          // bot answer (left side)
          if (msg.answer) {
            result.push({
              id: `${msg.id}-bot`,
              sender: "bot",
              content: msg.answer,
              timestamp: msg.updated_at || msg.created_at || new Date().toISOString(),
              animated: true,
            });
          }

          return result;
        });

        setMessages(msgsWithTimestamp);
        console.log("messages", messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sessions_id, localUser?.id]);

  //  useEffect(() => {
  //   if (!conversationId && !selectedId) return;
  //   const fetchMessages = async () => {
  //     setLoading(true);
  //     getLatestConversation(localUser?.email || "user")
  //           .then( async user_id => {
  //                 setSelectedId(user_id)
  //                 console.log("id chat page",user_id)
  //                 const session_id  = await getLatestSessionsByUserID(user_id)
  //                 setSessionId(session_id)
  //                 try {
  //                         const res = await fetch(
  //                           `http://127.0.0.1:8000/conversations/sessions/${sessions_id}/messages`,
  //                           { method: "GET" }
  //                         );

  //                         if (!res.ok) {
  //                           console.warn(`Failed to fetch messages. Status: ${res.status}`);
  //                           setMessages([]);
  //                           return;
  //                         }

  //                     const data = await res.json();

  //                       // Determine if the response contains messages
  //                       const rawMessages: RawMessage[] = Array.isArray(data)
  //                         ? data
  //                         : Array.isArray(data.messages)
  //                         ? data.messages
  //                         : [];

  //                       // Map to Message[] properly
  //                       const msgsWithTimestamp: Message[] = rawMessages.map((msg: RawMessage) => ({
  //                         id: msg.session_id,
  //                         sender: msg.user_id === String(localUser?.id) ? "message" : "answer",
  //                         content: msg.message,
  //                         timestamp: msg.updated_at || new Date().toISOString(),
  //                       }));
  //                         setMessages(msgsWithTimestamp);
  //                   } catch (err) {
  //                     console.error("Error fetching messages:", err);
  //                     setMessages([]);
  //                   } finally {
  //                     setLoading(false);
  //                   }
  //           })
  //           .catch(() => {
  //             console.log("id from login catch")

  //           });
  //     };
  //     fetchMessages();
  //   }, [conversationId, selectedId]);

  const handleLogout = async () => {
    try {
      if (session) await signOut({ redirect: false }); // google
      if (localUser) await localLogout(); // manual
      sessionStorage.removeItem("msal_user"); // msal
      sessionStorage.removeItem("msal_access_token");
      localStorage.removeItem("token");
      router.replace("http://localhost:3000/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthGuard>
      <div className="flex w-screen h-screen overflow-hidden">
        {/* Sidebar */}
        <SideNav
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSelectedId={setSelectedId}
          setSessionId={setSessionId}
          user={
            localUser ||
            (session?.user
              ? {
                  id: Number(session.user.id), // Convert string to number
                  name: session.user.name || "",
                  email: session.user.email || "",
                }
              : null)
          }
          conversationId={selectedId || ""}
          logout={handleLogout}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 h-full">
          <Header
            logout={handleLogout}
            user={
              localUser ||
              (session?.user
                ? {
                    id: Number(session.user.id), // Convert string to number
                    name: session.user.name || "",
                    email: session.user.email || "",
                  }
                : null)
            }
          />
          <div className="flex-1 overflow-y-auto">
            <ChatArea
              messages={messages}
              conversationId={sessionFromUrl || ""}
              logout={handleLogout}
              sessionToken={token || ""}
              user={
                localUser ||
                (session?.user
                  ? {
                      id: Number(session.user.id), // Convert string → number
                      name: session.user.name || "",
                      email: session.user.email || "",
                    }
                  : null)
              }
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
