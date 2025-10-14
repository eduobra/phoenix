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
   MoreHorizontal, Share2, Edit3, Archive, Trash2
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
import { useChatHistoryLists, useSoftDeleteConversation } from "@/query";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
type SidenavProps = {
  isOpen: boolean;
  onClose: () => void;
};
type ChatMessage = {
  id: string;
  content: string;
  type?: string;
  name?: string | null;
  example?: boolean;
  session_id?: string;
  topic?: string;
};

const Sidenav = ({ isOpen, onClose }: SidenavProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userData = useAuth((state) => state.userData);
  const handleLogout = useAuth((state) => state.handleLogout);
  const displayEmail = userData?.email || "admin@example.com";
  const avatarInitial = (displayEmail.split("@")[0] || "A")
    .charAt(0)
    .toUpperCase();

  const { data, isLoading } = useChatHistoryLists();
  const resetMessages = useChat((state) => state.resetMessages);
  const conId = useChat((state) => state.conversationId);

  const router = useRouter();
  const pathName = usePathname();
  const { conversationId } = useParams();
  const { mutate: softDeleteConversation, isPending: deleting } = useSoftDeleteConversation();
  // Safely extract messages from the API response
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const chatList: ChatMessage[] = Array.isArray((data as any)?.sessions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? (data as any).sessions
  : [];


  // Safely filter without crashing when null or undefined
  const filteredData = chatList.filter(
    (item) =>
      item?.topic?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false
  );

  const handleNewChatRoute = () => {
    resetMessages();
    if (pathName !== "/chat") router.push("/chat");
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
        {/* TOP (logo + toggle) */}
        <div className="shrink-0">
          <div className="flex items-center justify-between p-4">
            {!collapsed ? (
              <img
                src="/login_logo.png"
                alt="Clicktek Logo"
                className="h-20 w-auto"
              />
            ) : (
              <img src="/agent_logo.png" alt="FR Icon" className="w-8 h-8" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-600 border border-gray-200 rounded-full shrink-0 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* New Chat + Search */}
          <div className="flex flex-col gap-2 p-4">
            <Button
              onClick={handleNewChatRoute}
              variant="ghost"
              className={`gap-2 h-9 ${
                collapsed ? "justify-center" : "justify-start"
              } cursor-pointer`}
              size={collapsed ? "icon" : "default"}
            >
              <MessageSquare className="w-4 h-4" />
              {!collapsed && <span className="truncate">New Chat</span>}
            </Button>
            <div
              className={`flex items-center gap-2 h-9 px-2 rounded-md hover:bg-gray-100 ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <Search className="w-4 h-4" />
              {!collapsed && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chat..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE (scrollable content) */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          <div className="px-2 mb-3">
            {!collapsed && (
              <div className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Pinned
              </div>
            )}
            <div className="flex flex-col gap-1">
              {[
                { id: "p1", title: "Quarterly KPI summary" },
                { id: "p2", title: "Write email to procurement" },
              ]?.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full h-9 cursor-pointer gap-2 ${
                    collapsed ? "justify-center" : "justify-start"
                  }`}
                  size={collapsed ? "icon" : "default"}
                  title={item.title}
                >
                  <MessageCircle className="w-4 h-4" />
                  {!collapsed && (
                    <span className="truncate max-w-[180px]">{item.title}</span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {!collapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Chat History
            </div>
          )}

          {!collapsed && (
            <div className="flex flex-col gap-1 px-2 pb-3">
              {isLoading && (
                <>
                  <Button
                    variant="ghost"
                    size="default"
                    className="w-full h-9 justify-start"
                  >
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-40 h-3 rounded" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="w-full h-9 justify-start"
                  >
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-3 rounded w-52" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="w-full h-9 justify-start"
                  >
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-32 h-3 rounded" />
                  </Button>
                </>
              )}
              {!isLoading &&
              filteredData?.map((item) => {
                const isActive =
                  conversationId === item.session_id || item.session_id === conId;

                return (
                  <div
                    key={item.session_id}
                    className={`group flex items-center justify-between w-full h-9 px-2 rounded-md  hover:bg-gray-100 ${
                      isActive ? "bg-gray-100" : ""
                    }`}
                  >
                    {/* Left side (clickable chat item) */}
                    <button
                      onClick={() => handleRouteHistory(`${item.session_id}`)}
                      className="flex items-center gap-2 w-full text-left flex-1 cursor-pointer"
                      title={item.topic}
                    >
                      <MessageCircle className="w-4 h-4 text-gray-600" />
                      <span className="truncate text-sm max-w-[150px] text-gray-800">
                        {item.topic}
                      </span>
                    </button>

                    {/* Right side (3 dots on hover) */}
                    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl shadow-md"
                        >
                          <DropdownMenuItem className="cursor-pointer">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                          </DropdownMenuItem>

                          <DropdownMenuItem className="cursor-pointer">
                            <Edit3 className="w-4 h-4 mr-2" /> Rename
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="cursor-pointer">
                            <Archive className="w-4 h-4 mr-2" /> Archive
                          </DropdownMenuItem>

                         <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            if (deleting) return;
                            if (!item.session_id) return; // ✅ Prevent undefined
                            if (!confirm("Are you sure you want to delete this conversation?")) return;

                            softDeleteConversation(
                              { session_id: item.session_id as string }, 
                              
                            );
                          }}
                        >
                          {deleting ? (
                            <>
                              <Trash2 className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Delete
                            </>
                          )}
                        </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM (account menu pinned) */}
        <div className="relative px-1 py-2 border-t shrink-0 dark:border-neutral-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex justify-start w-full gap-3 cursor-pointer rounded-md border bg-gray-100 hover:bg-gray-200/70 px-3 py-5 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 ${
                  collapsed ? "justify-center px-1" : ""
                }`}
                title="Account"
                aria-label="Account menu"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar>
                    <AvatarFallback className="text-white bg-amber-700 uppercase">
                      {displayEmail[0]}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-col items-start min-w-0">
                      <div className="text-sm font-medium truncate max-w-[160px] md:max-w-[180px] dark:text-neutral-200">
                        {userData?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">
                        Free
                      </div>
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
                    <div className="text-sm font-medium truncate dark:text-neutral-200">
                      {displayEmail}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      Free
                    </div>
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
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};

export default Sidenav;
