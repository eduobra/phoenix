"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useChatHistoryLists } from "@/query";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";

type SidenavProps = {
  isOpen: boolean;        // ✅ parent-controlled open state
  onClose: () => void;    // ✅ parent can close sidebar
};
const Sidenav = ({ isOpen, onClose }: SidenavProps)  => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const userData = useAuth((state) => state.userData);
  const handleLogout = useAuth((state) => state.handleLogout);
  const displayEmail = userData?.email || "admin@example.com";
  const avatarInitial = (displayEmail.split("@")[0] || "A").charAt(0).toUpperCase();
  const { data, isLoading } = useChatHistoryLists();
  const resetMessages = useChat((state) => state.resetMessages);
  const conId = useChat((state) => state.conversationId);
  const router = useRouter();
  const pathName = usePathname();
  const { conversationId } = useParams();

  const handleNewChatRoute = () => {
    resetMessages();

    if (pathName !== "/chat") {
      router.push("/chat");
    }
    onClose();
  };

  const handleRouteHistory = (session_id: string) => {
    if (conId !== session_id) {
      resetMessages();
      router.push(`/chat/${session_id}`);
    }
     onClose(); 
  };

  return (
    <>
      {/* Overlay for mobile */}
  {isOpen && (
    <div
      className="fixed inset-0 z-30 bg-black/50 md:hidden"
      onClick={onClose}
    />
  )}

  <aside
    className={`fixed md:static top-0 left-0 h-screen border-r bg-white flex flex-col transition-all duration-300 z-40
      ${collapsed ? "w-16" : "w-64"}
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
  >
        {/* TOP (logo + buttons) */}
        <div className="shrink-0">
          <div className="flex items-center justify-between p-4">
            {!collapsed ? (
              <img src="/login_logo.png" alt="Clicktek Logo" className="h-20 w-120" />
            ) : (
              <img src="/agent_logo.png" alt="FR Icon" className="w-8 h-8" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-600 border border-gray-200 rounded-full shrink-0 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <Button
              onClick={handleNewChatRoute}
              variant="ghost"
              className={`gap-2 h-9 ${collapsed ? "justify-center" : "justify-start"} cursor-pointer`}
              size={collapsed ? "icon" : "default"}
            >
              <MessageSquare className="w-4 h-4" />
              {!collapsed && <span className="truncate">New Chat</span>}
            </Button>
            <Button
              variant="ghost"
              className={`gap-2 h-9 ${collapsed ? "justify-center" : "justify-start"}`}
              size={collapsed ? "icon" : "default"}
            >
              <Search className="w-4 h-4" />
              {!collapsed && <span className="truncate">Search</span>}
            </Button>
          </div>
        </div>

        <div className="px-2 mb-3">
          {!collapsed && (
            <div className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Pinned</div>
          )}
          <div className="flex flex-col gap-1 ">
            {[
              { id: "p1", title: "Quarterly KPI summary" },
              { id: "p2", title: "Write email to procurement" },
            ]?.map((item) => {
              return (
                <Button
                  key={item.id}
                  variant={"ghost"}
                  className={`w-full h-9 cursor-pointer gap-2 ${collapsed ? "justify-center" : "justify-start"}`}
                  size={collapsed ? "icon" : "default"}
                  title={item.title}
                >
                  <MessageCircle className="w-4 h-4" />
                  {!collapsed && <span className="truncate max-w-[180px]">{item.title}</span>}
                </Button>
              );
            })}
          </div>
        </div>

        {!collapsed && (
          <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Chat History</div>
        )}

        <div className="flex-1 p-2 overflow-y-auto thin-scrollbar">
          <div className="flex flex-col gap-1 ">
            {isLoading && (
              <>
                <Button
                  variant="ghost"
                  className={`w-full h-9 ${collapsed ? "justify-center" : "justify-start"}`}
                  size={collapsed ? "icon" : "default"}
                >
                  <Skeleton className="w-4 h-4 rounded-full" />
                  {!collapsed && <Skeleton className="w-40 h-3 rounded" />}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full h-9 ${collapsed ? "justify-center" : "justify-start"}`}
                  size={collapsed ? "icon" : "default"}
                >
                  <Skeleton className="w-4 h-4 rounded-full" />
                  {!collapsed && <Skeleton className="h-3 rounded w-52" />}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full h-9 ${collapsed ? "justify-center" : "justify-start"}`}
                  size={collapsed ? "icon" : "default"}
                >
                  <Skeleton className="w-4 h-4 rounded-full" />
                  {!collapsed && <Skeleton className="w-32 h-3 rounded" />}
                </Button>
              </>
            )}
            {!isLoading &&
              data?.map((item) => {
                const isActive = conversationId === item.session_id || item.session_id === conId;

                return (
                  <Button
                    onClick={() => handleRouteHistory(`${item.session_id}`)}
                    key={item.session_id}
                    variant={"ghost"}
                    className={`w-full h-9 cursor-pointer gap-2 ${collapsed ? "justify-center" : "justify-start"} ${isActive ? "bg-gray-100" : ""}`}
                    size={collapsed ? "icon" : "default"}
                    title={item.topic}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {!collapsed && <span className="truncate max-w-[180px]">{item.topic}</span>}
                  </Button>
                );
              })}
          </div>
        </div>

        {/* BOTTOM (account menu) */}
        <div className="relative px-1 py-2 border-t shrink-0 dark:border-neutral-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex justify-start    w-full gap-3 cursor-pointer rounded-md border bg-gray-100 hover:bg-gray-200/70 px-3 py-5 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 ${
                  collapsed ? "justify-center px-1" : ""
                }`}
                title="Account"
                aria-label="Account menu"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar>
                    <AvatarFallback className={`text-white bg-amber-700 uppercase`}>{displayEmail[0]}</AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start min-w-0">
                      <div className="text-sm font-medium truncate max-w-[160px] md:max-w-[180px] dark:text-neutral-200">
                        {userData?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">Free</div>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="w-64 rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
            >
              <DropdownMenuLabel className="px-4 py-3 dark:text-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 text-white border border-white rounded-full shadow-sm bg-amber-700 aspect-square dark:border-neutral-800">
                    {avatarInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate dark:text-neutral-200">{displayEmail}</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">Free</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-neutral-700" />
              <DropdownMenuItem className="cursor-pointer dark:text-neutral-200">
                <ArrowUpCircle className="w-4 h-4 mr-2" /> Upgrade plan
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer dark:text-neutral-200">
                <Settings className="w-4 h-4 mr-2" /> Configuration
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer dark:text-neutral-200">
                <HelpCircle className="w-4 h-4 mr-2" /> Help
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-neutral-700" />
              <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* <Button
        variant="ghost"
        size="icon"
        className="fixed z-50 top-4 left-4 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <AlignEndVertical className="w-5 h-5 mb-4" />
      </Button> */}
    </>
  );
};

export default Sidenav;
