/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useConversationLists, useSendMessageMutation } from "@/query";
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";

import Markdown from "@/components/mark-down";
import UsageLimitModal from "@/components/ui/UsageLimitModal";
import Modal from "@/components/ui/Modal";
import TraceHistory from "@/components/trace-history";
import { TraceContextProvider } from "@/contexts/TraceContext";
import { useAccentColor } from "@/hooks/useAccentColor";

type Msg = { id: string; message: string; answer: string; created_at: string; run_id?: string | null };

const Page = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data, isLoading } = useConversationLists();
  const { mutateAsync } = useSendMessageMutation();

  const [loading, setLoading] = useState(false); // shows stop/send button
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const MAX_CHARACTERS = 10000;
  const WARNING_THRESHOLD = 0.9; // 90%

  const [charCount, setCharCount] = useState(0);
  const { accent, updateAccent } = useAccentColor();
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // or "fil-PH" for Tagalog
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputValue(transcript);
      handleInputGrow();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("data to check", data);
  }, [data, messages, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputGrow = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "44px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
  };

  // Send message with abort support
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const id = uuid();
    const sanitizedInput = inputValue.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').normalize("NFC");
    setMessages((prev) => [...prev, { id, message: inputValue, answer: "", created_at: new Date().toISOString() }]);

    setInputValue("");

    if (inputRef.current) inputRef.current.style.height = "44px";

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    try {
      const res = await mutateAsync({
        input: sanitizedInput,
        session_id: conversationId,
        stream: false,
        signal: controller.signal,
      });

      setMessages((prev) =>
        prev.map((value) =>
          value.id === id
            ? {
                ...value,
                answer: res?.response?.messages?.[res.response.messages.length - 1]?.content ?? "",
              }
            : value
        )
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        setErrorModal({
          isOpen: false,
          message: err.message,
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: "Looks like the server isn’t responding right now. Try again later.",
        });
      }
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
      if (inputRef.current) inputRef.current.style.height = "0px";
    }
  };

  const cancelMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        if (last.answer) return prev;
        return prev.slice(0, -1);
      });

      setLoading(false);
    }
  };

  return (
    <TraceContextProvider>
      <div className="relative flex flex-col w-full h-full bg-card">
        {/* Scrollable messages container */}
        <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto scroll-smooth">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 animate-pulse">
                  <div className="flex justify-end">
                    <div className="px-4 py-3 rounded-2xl max-w-[60%] bg-blue-200/60">
                      <div className="w-24 h-3 mb-2 bg-blue-300 rounded"></div>
                      <div className="w-16 h-3 bg-blue-300 rounded"></div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl max-w-[70%] bg-card-200/80">
                      <div className="w-32 h-3 mb-2 bg-card-300 rounded"></div>
                      <div className="w-20 h-3 bg-card-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.messages?.length ? (
            <div className="grid h-full place-items-center">
              <div className="px-6 text-center">
                <div className="grid w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-2xl place-items-center">
                  AI
                </div>
                <h2 className="mb-1 text-xl font-semibold text-foreground-900">Start a new conversation</h2>
                <p className="text-sm text-foreground-500">Type a message below to begin.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Array.isArray(data?.messages) &&
                data.messages.map((m: any) => (
                  <div key={m.id} className="flex flex-col gap-2">
                   {m.role === "user" && (
                      <div className="flex justify-end">
                        <div
                          className={`px-4 py-2 rounded-2xl max-w-[80%] text-white ${
                            accent === "Blue"
                              ? "bg-blue-500"
                              : accent === "Violet"
                              ? "bg-violet-500"
                              : accent === "Slate Gray"
                              ? "bg-slate-500"
                              : "bg-primary"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    )}

                    {m.role === "assistant" && (
                      <div className="flex flex-col items-start w-full gap-1">
                        <div className="relative px-4 py-2 rounded-2xl max-w-[100%] text-foreground-900 overflow-x-auto   ">
                          <Markdown content={m.content} />
                        </div>
                        <div className="flex flex-col justify-between w-full gap-1 px-2 md:flex-row md:items-center">
                          <div className="flex items-center gap-3">
                            <button
                              className="p-1 rounded hover:bg-card-300"
                              title="Copy"
                              onClick={() => navigator.clipboard.writeText(m.content ?? "")}
                            >
                              <Copy className="w-4 h-4 text-foreground-600" />
                            </button>

                            <button className="p-1 rounded hover:bg-card-300" title="Like">
                              <ThumbsUp className="w-4 h-4 text-foreground-600" />
                            </button>

                            <button className="p-1 rounded hover:bg-card-300" title="Dislike">
                              <ThumbsDown className="w-4 h-4 text-foreground-600" />
                            </button>

                            <button className="p-1 rounded hover:bg-card-300" title="Share">
                              <Share2 className="w-4 h-4 text-foreground-600" />
                            </button>

                            <button
                              className="p-1 rounded hover:bg-card-300"
                              title="Try Again"
                              onClick={() => sendMessage()}
                            >
                              <RotateCcw className="w-4 h-4 text-foreground-600" />
                            </button>

                            <button className="p-1 rounded hover:bg-card-300" title="More">
                              <MoreHorizontal className="w-4 h-4 text-foreground-600" />
                            </button>
                            {m.run_id && <TraceHistory traceId={m.run_id} />}
                          </div>

                          <span className="relative right-0 bottom-0 text-[10px] text-foreground-500 whitespace-nowrap">
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
                      </div>
                    )}
                  </div>
                ))}

              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-2 ">
                  {m.message && (
                    <div className="flex justify-end ">
                      <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-blue-500 text-foreground">
                        <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  )}

                  {m.answer && (
                    <div className="flex flex-col items-start w-full gap-1">
                      <div className="px-4 py-2 rounded-2xl max-w-[100%] text-foreground-900 overflow-x-auto">
                        <Markdown content={m.answer} />
                      </div>

                      <div className="flex items-center gap-3 px-2">
                        <button
                          className="p-1 rounded hover:bg-card-300"
                          title="Copy"
                          onClick={() => navigator.clipboard.writeText(m.answer)}
                        >
                          <Copy className="w-4 h-4 text-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Like">
                          <ThumbsUp className="w-4 h-4 text-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Dislike">
                          <ThumbsDown className="w-4 h-4 text-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="Share">
                          <Share2 className="w-4 h-4 text-foreground-600" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-card-300"
                          title="Try Again"
                          onClick={() => sendMessage()}
                        >
                          <RotateCcw className="w-4 h-4 text-foreground-600" />
                        </button>
                        <button className="p-1 rounded hover:bg-card-300" title="More">
                          <MoreHorizontal className="w-4 h-4 text-foreground-600" />
                        </button>
                      </div>

                      <span className="text-[10px] text-foreground-500 whitespace-nowrap">
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
                  )}
                </div>
              ))}

             {loading && (
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
                      <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                      </span>
                    </div>
                  </div>
                </div>
              )}

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

        <div className="sticky bottom-0 z-20 px-1 pt-2 pb-4 bg-card-50">
          <div className="w-full max-w-3xl mx-auto ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex items-end w-full gap-2 px-2 py-2 m-2 bg-background border border-gray-300 shadow-sm rounded-3xl">
                <div className="flex flex-col justify-end">
                  <button type="button" className="p-2 rounded-full hover:bg-card-100">
                    <Plus className="w-5 h-5 text-foreground-500" />
                  </button>
                </div>

                <div className="flex flex-col justify-end flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInputValue(val);
                      setCharCount(val.length);
                    }}
                    onInput={handleInputGrow}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (inputValue.trim() && inputValue.length <= MAX_CHARACTERS) {
                          sendMessage();
                        }
                      }
                    }}
                    rows={1}
                    maxLength={MAX_CHARACTERS}
                  placeholder="Ask me about your financial performance, budgets, or forecasts…"
                  className="flex-1 bg-transparent pt-3 resize-none outline-none px-3 max-h-[200px] min-h-[44px] placeholder:text-[0.875rem] placeholder:text-card-foreground-400 overflow-y-auto"
                />
                </div>

                <div className="flex items-end gap-1">
                  <button type="button" className="p-2 rounded-full hover:bg-card-100">
                    <Mic className="w-5 h-5 text-foreground-500" />
                  </button>

                  {loading ? (
                    <button
                      type="button"
                      onClick={cancelMessage}
                      className="flex items-center justify-center  w-10 h-10 transition-colors bg-card-800 rounded-full shadow-md cursor-pointer hover:bg-card-300"
                    >
                      <div className="w-3.5 h-3.5 bg-background rounded-sm" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`grid rounded-full  shadow-md size-10 place-items-center  transition-colors ${
                        inputValue.trim()
                          ? "bg-primary text-white hover:bg-blue-800 cursor-pointer"
                          : "bg-white text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <UsageLimitModal onUpgrade={() => console.log("Upgrade clicked")} /> */}
        <Modal
          isOpen={errorModal.isOpen}
          title="Oops! Something went wrong."
          message={errorModal.message}
          onClose={() => setErrorModal({ isOpen: false, message: "" })}
        />
      </div>
    </TraceContextProvider>
  );
};

export default Page;
