"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Search,
  MessageCircle,
  LogOut,
  Settings,
  HelpCircle,
  ArrowUpCircle,
  AlignEndVertical
} from "lucide-react";
import { Chat, SessionChat, SideNavProps } from "@/types/user";
import { useRouter } from "next/navigation";


const getRandomColor = (name: string) => {
  const colors = [
    "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
    "#EC4899", "#EF4444", "#14B8A6", "#F97316"
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function SideNav({
  collapsed,
  setCollapsed,
  user: authUser,
  logout,
  conversationId,
  setSelectedId,
  setSessionId,
}: SideNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<SessionChat[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"BusinessCentral" | "SAP" | "SQL">("BusinessCentral");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  type CurrentUser = {
    name: string;
    email: string;
    image: string | null;
  };
  // Merge auth user and session user
  const currentUser: CurrentUser = useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image ?? null,
      };
    }
    if (authUser) {
      return {
        name: authUser.name || "",
        email: authUser.email || "",
        image: authUser.image ?? null,
      };
    }
    return { name: "Administrator", email: "", image: null };
  }, [session, authUser]);

  const avatarData = useMemo(() => {
  const email = currentUser.email || "";
  const loginName = email.split("@")[0] || "Admin";
  const initial = loginName.charAt(0).toUpperCase();
  const color = getRandomColor(loginName);

  return { initial, color, email };
}, [currentUser]);

  // Fetch chat history
  useEffect(() => {
    if (!conversationId) return;
    const fetchChats = async () => {
      try {
        sessionStorage.getItem("jwt_token")
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/conversations/users/sessions`, {
            method: "GET", // or POST depending on your backend
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
            },
            credentials: "include",
          });

        if (!res.ok) {
          console.warn(`Failed to fetch chats. Status: ${res.status}`);
          setChatHistory([]);
          return;
        }
        const data = await res.json();
        setChatHistory(Array.isArray(data) ? data : []); // ✅ don't wrap in [ ]
      } catch (err) {
        console.error("Failed to fetch chats", err);
        setChatHistory([]);
      }
    };
    fetchChats();
  }, [conversationId]);

 const handleSelectSession = (id: string) => {
  console.log("Selected session:", id);
  setSelectedSession(id);   // local highlight
  setSessionId(id);         // parent updates session
  //router.replace(`/chat/${id}`); // sync URL
};
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen border-r bg-white flex flex-col justify-between transition-all duration-300 z-40
        ${collapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between p-4">
            {!collapsed ? (
              <img src="/fin_sales_logo.jpg" alt="Clicktek Logo" className="h-25 w-140" />
            ) : (
              <img src="/fin_sales_logo.jpg" alt="FR Icon" className="h-8 w-8" />
            )}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="p-4 flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2" size={collapsed ? "icon" : "default"}>
              <MessageSquare className="w-4 h-4" />
              {!collapsed && "New Chat"}
            </Button>
            <Button variant="ghost" className="justify-start gap-2" size={collapsed ? "icon" : "default"}>
              <Search className="w-4 h-4" />
              {!collapsed && "Search Chats"}
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {!collapsed && <p className="text-sm font-semibold mb-2">Chats</p>}
            <div className="flex flex-col gap-1">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.session_id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  size={collapsed ? "icon" : "default"}
                  onClick={() => handleSelectSession(chat.session_id)} 
                >
                  <MessageCircle className="w-4 h-4" />
                  {!collapsed && (
                    <span className="truncate max-w-[150px]">{chat.topic || "Untitled"}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative p-4 border-t">
         <div
          className="flex items-center gap-2 cursor-pointer max-w-full"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          {currentUser.image ? (
            <img
              src={currentUser.image}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: avatarData.color }}
            >
              {avatarData.initial}
            </div>
          )}

          {!collapsed && (
            <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
              {currentUser.email || "Administrator"}
            </span>
          )}
        </div>


          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute bottom-16 left-4 w-48 bg-white shadow-lg rounded-md border z-50">
              <ul className="flex flex-col">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setShowConfigModal(true);
                      setProfileOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4" /> Configuration
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <HelpCircle className="w-4 h-4" /> Help
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ArrowUpCircle className="w-4 h-4" /> Upgrade Plan
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full">
            <h2 className="text-lg font-semibold mb-4">Configuration</h2>

            {/* Tool Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Tool</label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value as "BusinessCentral" | "SAP" | "SQL")}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="BusinessCentral">Business Central</option>
                <option value="SAP">SAP</option>
                <option value="SQL">SQL</option>
              </select>
            </div>

            {/* Dynamic Fields */}
            {selectedTool === "BusinessCentral" && (
              <div className="space-y-2">
                <input className="border rounded px-3 py-2 w-full" placeholder="Client ID" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Tool Name" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Client Token" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Client Name" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Client Secret" />
                <input type="file" className="border rounded px-3 py-2 w-full" placeholder="KB of DB Schema" />
              </div>
            )}

            {selectedTool === "SAP" && (
              <div className="space-y-2">
                <input className="border rounded px-3 py-2 w-full" placeholder="Client ID" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Bearer Token" />
              </div>
            )}

            {selectedTool === "SQL" && (
              <div className="space-y-2">
                <input className="border rounded px-3 py-2 w-full" placeholder="Client ID" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Host" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Username" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Password" type="password" />
                <input className="border rounded px-3 py-2 w-full" placeholder="Port" />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="destructive" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <AlignEndVertical className="w-5 h-5 mb-4" />
      </Button>
    </>
  );
}
