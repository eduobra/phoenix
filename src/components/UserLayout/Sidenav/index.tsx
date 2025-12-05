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

import { createPortal } from "react-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useChatHistoryLists, useSoftDeleteConversation } from "@/query";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useChat } from "@/contexts/ChatContext";
import ArchiveModal from "@/components/ui/ArchiveModal";
import SettingsModal from "@/components/ui/SettingsModal";
import { Telemetry } from "next/dist/telemetry/storage";
import TelemetryModal from "@/components/ui/Telemetry";
import { useTranslation } from "react-i18next";

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
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    sessionId?: string;
  } | null>(null);
  const { t, i18n } = useTranslation();
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
        className={`fixed md:static top-0 left-0 h-screen border-r bg-background flex flex-col transition-all duration-300 z-40
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
            className="w-8 h-8 text-card-foreground-600 border border-gray-200 rounded-full shrink-0 hover:text-card-foreground-900 hover:bg-card-100"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
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
              {!collapsed && <span className="truncate">{t("New Chat")}</span>}
            </Button>
            <div
              className={`flex items-center gap-2 h-9 px-2 rounded-md hover:bg-card-100 ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <Search className="w-4 h-4" />
              {!collapsed && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("Search chat...")}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-card-foreground"
                />
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE (scrollable content) */}
        <div className="flex-1 overflow-y-auto thin-scrollbar">
          <div className="px-2 mb-3">
            {!collapsed && (
              <div className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-card-foreground-500">
                 {t("Pinned")}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {[
                { id: "p1", title: "Quarterly KPI summary" },
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
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-card-foreground-500">
              {t("Chat History")}
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
                      aria-label="skeleton"
                    title="skeleton"
                  >
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-40 h-3 rounded" />
                    
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="w-full h-9 justify-start"
                      aria-label="skeleton"
                    title="skeleton"
                  >
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-3 rounded w-52" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="w-full h-9 justify-start"
                    aria-label="skeleton"
                    title="skeleton"
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
                    className={`group flex items-center justify-between w-full h-9 px-2 rounded-md  hover:bg-card-100 ${
                      isActive ? "bg-card-100" : ""
                    }`}
                  >
                    {/* Left side (clickable chat item) */}
                    <button
                      onClick={() => handleRouteHistory(`${item.session_id}`)}
                      className="flex items-center gap-2 w-full text-left flex-1 cursor-pointer"
                      title={item.topic}
                    >
                      <MessageCircle className="w-4 h-4 text-card-foreground-600" />
                      <span className="truncate text-sm max-w-[150px] text-card-foreground-800">
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
                              className="w-6 h-6 p-0 text-card-foreground-500 hover:text-card-foreground-800 cursor-pointer"
                              aria-label="Open conversation options"
                              title="More options"
                            >
                              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl shadow-md"
                          >
                            <DropdownMenuItem className="cursor-pointer">
                              <Share2 className="w-4 h-4 mr-2" /> {t("Share")}
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer">
                              <Edit3 className="w-4 h-4 mr-2" /> {t("Rename")}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                if (deleting) return;
                                if (!item.session_id) return;

                                // Open confirmation modal instead of using confirm()
                                setConfirmDelete({ open: true, sessionId: item.session_id });
                              }}
                            >
                              {deleting ? (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2 text-card-foreground-400 animate-pulse" />
                                  {t("Deleting...")}
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2 text-red-600" /> {t("Delete")}
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
              className={`flex justify-start w-full gap-3 cursor-pointer rounded-md border bg-card-100 hover:bg-card-200/70 px-3 py-5 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 ${
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
                    <div className="text-xs text-card-foreground-500 dark:text-neutral-300">
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
                  <div className="text-xs text-card-foreground-500 dark:text-neutral-400">
                    Free
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="dark:bg-neutral-700" />

            <DropdownMenuItem className="cursor-pointer dark:text-neutral-200">
              <ArrowUpCircle className="w-4 h-4 mr-2" /> {t("Upgrade plan")}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer dark:text-neutral-200"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings className="w-4 h-4 mr-2" /> {t("Settings")}
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer dark:text-neutral-200">
              <HelpCircle className="w-4 h-4 mr-2" /> {t("Help")}
            </DropdownMenuItem>

    
            <DropdownMenuItem
              className="cursor-pointer dark:text-neutral-200"
              onClick={() => setShowArchiveModal(true)}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" /> {t("Archive")}
            </DropdownMenuItem>

            <DropdownMenuItem
                className="cursor-pointer dark:text-neutral-200"
                onClick={() => setShowTelemetryModal(true)}
              >
                <ArrowUpCircle className="w-4 h-4 mr-2" /> {t("Telemetry")}
              </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-neutral-700" />

            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> {t("Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ Move the modal HERE — outside of DropdownMenu */}
        <ArchiveModal
          open={showArchiveModal}
          onClose={() => setShowArchiveModal(false)} // replace later with API data
        />

        <SettingsModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />

        <TelemetryModal
          open={showTelemetryModal}
          onClose={() => setShowTelemetryModal(false)}
        />
       {successModalMessage &&
          typeof window !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
              <div className="bg-background rounded-3xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-card-foreground-800 mb-4">
                  {t("Success")}
                </h3>
                <p className="text-sm text-card-foreground-700 mb-6">{successModalMessage}</p>
                <Button
                  onClick={() => setSuccessModalMessage(null)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {t("OK")}
                </Button>
              </div>
            </div>,
            document.body
          )
        }
        {confirmDelete?.open &&
          typeof window !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
              <div className="bg-background rounded-3xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-card-foreground-800 mb-4">
                  {t("Confirm Delete")}
                </h3>
                <p className="text-sm text-card-foreground-700 mb-6">
                  {t("Are you sure you want to delete this conversation?")}
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(null)}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      if (!confirmDelete?.sessionId) return;

                      softDeleteConversation(
                        { session_id: confirmDelete.sessionId },
                        {
                          onSuccess: () => {
                            setSuccessModalMessage(
                              "Conversation deleted successfully"
                            );
                            if (conversationId === confirmDelete.sessionId) {
                              router.push("/chat");
                            }
                          },
                          onError: (err) => {
                            setSuccessModalMessage(err.message);
                          },
                        }
                      );

                      setConfirmDelete(null);
                    }}
                  >
                    {t("Delete")}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
      </aside>
    </>
  );
};

export default Sidenav;
