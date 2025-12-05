"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Mic,
  ArrowUp,
  ArrowDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import { useSendMessageMutation } from "@/query";
import { motion, AnimatePresence } from "framer-motion";

import { v4 as uuid } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@/contexts/ChatContext";
import Markdown from "@/components/mark-down";
import Modal from "@/components/ui/Modal";
import TraceHistory from "@/components/trace-history";
import { TraceContextProvider } from "@/contexts/TraceContext";
import { useTranslation } from "react-i18next";

const Page = () => {
  const queryClient = useQueryClient();
  const conversationId = useChat((state) => state.conversationId);
  const setConversationId = useChat((state) => state.setConversationId);
  const messages = useChat((state) => state.messages);
  const addMessage = useChat((state) => state.addMessage);
  const updateMessageAnswer = useChat((state) => state.updateMessageAnswer);
  const { mutateAsync } = useSendMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const removeMessage = useChat((state) => state.removeMessage);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const topics = [
    t("Quarterly KPI Summary"),
    t("Expense Breakdown"),
    t("Variance Analysis"),
    t("Revenue Forecast"),
    t("Cashflow Review"),
    t("Procurement Report Email")
  ];

  // 🧠 Change this function so it can accept a topic directly
const sendMessage = async (customInput?: string) => {
  const messageText = customInput || inputValue;
  if (!messageText.trim()) return;
  if (inputRef.current) {
    inputRef.current.style.height = "44px";
  }
  const sanitizedInput = messageText
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    // Replace various dashes with a simple hyphen
    .replace(/[–—−]/g, '-')  // en dash, em dash, minus sign
    // Replace bullets and list markers with a dash or space
    .replace(/[•◦‣⁃▪▫]/g, '-') 
    // Replace numbered list markers like "1." or "1)"
    .replace(/\b\d+[\.\)]\s*/g, '') 
    // Replace extra whitespace
    .replace(/\s+/g, ' ')
    // Trim leading/trailing spaces
    .trim()
    // Normalize Unicode
    .normalize("NFC");

  const controller = new AbortController();
  setAbortController(controller);
  const id = uuid();

  addMessage({
    id,
    message: sanitizedInput,
    answer: "",
    created_at: new Date().toISOString(),
  });

  setInputValue("");
  setLoading(true);

  try {
    const response = await mutateAsync({
      input: sanitizedInput,
      session_id: conversationId ? conversationId : id,
      stream: false,
      signal: controller.signal,
    });

    const messages = response.response.messages;
    const lastMessage = messages[messages.length - 1];
    let answerText = "";

    if (lastMessage.content.startsWith("{")) {
      const parsed = JSON.parse(lastMessage.content);
      answerText = parsed.content || "";
    } else {
      answerText = lastMessage.content;
    }

    updateMessageAnswer(id, answerText);
    if (!conversationId) {
      window.history.replaceState(null, "", `/chat/${id}`);
      setConversationId(id);
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        // Ignore canceled or aborted requests
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
      
        } else {
          setErrorModal({
            isOpen: true,
            message: "Looks like the server isn’t responding right now. Try again later.",
          });
        }
    } finally {
      setLoading(false);
    }
   
};

  // ✅ Auto-send topic when clicked
  const handleTopicClick = (topic: string) => {
    setShowSuggestions(false);
    sendMessage(topic); // <-- Directly sends the topic
  };

  // ✅ Scroll to bottom whenever new messages come in
  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
    scrollToBottom();
  }, [messages, loading]);

   

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputGrow = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "44px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
  };

  const cancelMessage = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);

      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.answer) {
        removeMessage(lastMessage.id);
      }
    }
  };
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.run_id) {
      setActiveRunId(lastMessage.run_id);
    }
  }, [messages]);

  return (
    <TraceContextProvider>
      <div className="relative flex flex-col w-full h-full bg-card-50">
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
         {messages.length === 0 ? (
            <div className="grid h-full place-items-center-safe">
              <div className="px-6 text-center max-w-md">
             <h2 className="mb-2 flex items-center justify-center gap-2 text-xl font-semibold text-card-foreground-900 leading-none">
                <span
                  role="img"
                  aria-label="wave"
                  className="text-2xl animate-wave origin-[70%_70%] inline-block translate-y-[2px]"
                >
                  👋
                </span>
                {t("Welcome to Ascent AI Finance Agent")}
              </h2>
                <p className="text-sm text-card-foreground-600 mb-4">
                  {t("I’m your intelligent finance co-pilot — built to help you analyze reports, generate KPI insights,and simplify financial decision-making.")}
                </p>
                
                <p className="text-sm text-card-foreground-700 mb-6 leading-relaxed text-left max-w-sm mx-auto">
                  
                  {t("You can ask me to:")}<br/>
                  {t("• Summarize your company’s monthly financials")}<br />
                  {t("• Analyze expenses or revenue trends")}<br />
                  {t("• Generate variance reports")}<br />
                  {t("• Forecast your next quarter’s performance")}
                </p>
                <p className="mt-6 mb-3 text-sm text-black bg-indigo-50 border border-indigo-200 rounded-lg p-3 max-w-sm mx-auto shadow-sm">
                  💡 <span className="font-semibold italic">Tip: </span>{t("You can also upload an Excel or CSV report, and I’ll generate insights instantly.")}
                </p>
                <span className="font-semibold ">{t("What would you like to do first?")}</span>
                {/* ✅ Always show topics when there’s no conversation */}
                <AnimatePresence>
                  <motion.div
                    className="flex flex-wrap justify-center gap-3 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {topics.map((topic) => (
                      <motion.button
                        key={topic}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTopicClick(topic)}
                        className="px-4 py-2 text-sm font-medium text-card-foreground-800 bg-background border border-gray-200 rounded-full shadow-sm hover:bg-card-100 transition-all"
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  {m.message && (
                    <div className="flex justify-end group">
                      <div className="relative px-4 py-2 rounded-2xl max-w-[80%] bg-blue-500 text-white">
                        <p className="text-sm whitespace-pre-wrap">{m.message}</p>

                        <div className="absolute flex gap-1 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
                          <button
                            onClick={() => navigator.clipboard.writeText(m.message)}
                            className="p-1 rounded-md bg-background hover:bg-background"
                            title="Copy"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => setInputValue(m.message)}
                            className="p-1 rounded-md bg-background hover:bg-background"
                            title="Edit & Resend"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {m.answer ? (
                    <div className="flex flex-col items-start w-full gap-1">
                      <div className="px-4 py-2 rounded-2xl max-w-[100%] text-card-foreground-900">
                        <Markdown content={m.answer} />
                      </div>

                      <div className="flex items-center gap-3 px-2">
                        <button className="p-1 rounded hover:bg-card-300" title="Copy">
                          <Copy className="w-4 h-4 text-card-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Like">
                          <ThumbsUp className="w-4 h-4 text-card-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Dislike">
                          <ThumbsDown className="w-4 h-4 text-card-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Share">
                          <Share2 className="w-4 h-4 text-card-foreground-600" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-card-300"
                          title="Try Again"
                          onClick={() => sendMessage()}
                        >
                          <RotateCcw className="w-4 h-4 text-card-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="More">
                          <MoreHorizontal className="w-4 h-4 text-card-foreground-600" />
                        </button>

                        {m.run_id && (
                            <TraceHistory key={activeRunId} traceId={m.run_id} /> 
                        )}
                        

                      </div>

                      <span className="text-[10px] text-card-foreground-500 whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ) : (
                    loading &&
                    m.id === messages[messages.length - 1].id && (
                      <div className="flex justify-start">
                        <div
                          className="px-4 py-2 rounded-2xl bg-card-200 dark:bg-[#2B2B2B] text-card-foreground-900 
                                    border border-border/30 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse"></span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute p-2 mb-4 text-foreground transform -translate-x-1/2 bg-background rounded-full shadow-md left-1/2 bottom-24 hover:bg-card-100"
          >
            <ArrowDown size={18} absoluteStrokeWidth />
          </button>
        )}

        {/* Input area (kept unchanged) */}
        <div className="sticky bottom-0 z-20 px-1 pt-2 pb-4 bg-card-50">
          <div className="w-full max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex items-end w-full gap-2 px-3 py-2 m-2 bg-background border border-gray-300 shadow-sm rounded-3xl">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-card-100"
                  aria-label="Add new item"
                >
                  <Plus className="w-5 h-5 text-card-foreground-500" />
                </button>
              
               <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onInput={handleInputGrow}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  maxLength={10000}
                  placeholder={t("Ask me about your financial performance, budgets, or forecasts…")}
                  className="flex-1 bg-transparent pt-3 resize-none outline-none px-3 max-h-[200px] min-h-[44px] placeholder:text-[0.875rem] placeholder:text-card-foreground-400 overflow-y-auto"
                />

                <div className="flex items-end gap-1">
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-card-100"
                    aria-label="Start voice input"
                  >
                    <Mic className="w-5 h-5 text-card-foreground-500" />
                  </button>

                 {loading ? (
                  <button
                    type="button"
                    onClick={cancelMessage}
                    aria-label="Cancel message"
                    className="flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-colors 
                              bg-card hover:bg-border dark:bg-[#2C2C2C] dark:hover:bg-[#3A3A3A] cursor-pointer"
                  >
                    {/* small square loader/cancel indicator */}
                    <div className="w-3.5 h-3.5 rounded-sm bg-foreground dark:bg-gray-100" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                    className={`grid size-10 place-items-center rounded-full shadow-md transition-all duration-200 
                      ${
                        inputValue.trim()
                          ? "bg-primary text-white hover:opacity-90 cursor-pointer"
                          : "bg-card text-gray-400 dark:bg-[#2C2C2C] cursor-not-allowed"
                      }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                )}


                </div>
              </div>
            </form>
          </div>

          <Modal
            isOpen={errorModal.isOpen}
            title="Oops! Something went wrong."
            message={errorModal.message}
            onClose={() => setErrorModal({ isOpen: false, message: "" })}
          />
        </div>
      </div>
    </TraceContextProvider>
  );
};

export default Page;
