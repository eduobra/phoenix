"use client";

import React, { useEffect, useRef, useState } from "react";
import {   Plus,
  Mic,
  ArrowUp,
  ChevronDown,
  MoveDown,
  ArrowDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  RotateCcw,
  MoreHorizontal,} from "lucide-react";
import { useConversationLists, useSendMessageMutation } from "@/query";

import { v4 as uuid } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@/contexts/ChatContext";
import Markdown from "@/components/mark-down";
import UsageLimitModal from "@/components/ui/UsageLimitModal";
import Modal from "@/components/ui/Modal";

const Page = () => {
  const queryClient = useQueryClient();
  const conversationId = useChat((state) => state.conversationId);
  const setConversationId = useChat((state) => state.setConversationId);
  const messages = useChat((state) => state.messages);
  const addMessage = useChat((state) => state.addMessage);
  const updateMessageAnswer = useChat((state) => state.updateMessageAnswer);
  const { mutateAsync } = useSendMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null); 
  const removeMessage = useChat((state) => state.removeMessage);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  
const sendMessage = async () => {
  if (!inputValue.trim()) return;
  const controller = new AbortController();
  setAbortController(controller);
  const id = uuid();
  addMessage({
    id,
    message: inputValue,
    answer: "",
    created_at: new Date().toISOString(),
  });
  setInputValue("");
  setLoading(true);

  try {
    const response = await mutateAsync({
      input: inputValue,
      session_id: conversationId ? conversationId : id,
      stream: false, 
      signal: controller.signal, 
    });

    // Extract the latest assistant reply
    const messages = response.response.messages;
    const lastMessage = messages[messages.length - 1];
    let answerText = "";

    // Some APIs wrap assistant content in JSON strings
    if (lastMessage.content.startsWith("{")) {
      const parsed = JSON.parse(lastMessage.content);
      answerText = parsed.content || "";
    } else {
      answerText = lastMessage.content;
    }

    // ✨ Simulate typing effect
    let simulatedText = "";
    for (const char of answerText) {
      simulatedText += char;
      updateMessageAnswer(id, simulatedText);
      await new Promise((r) => setTimeout(r, Math.random() * 20 + 10)); // varied typing speed
    }

    // ✅ Save conversation ID if new
    if (!conversationId) {
      window.history.replaceState(null, "", `/chat/${id}`);
      setConversationId(id);
    }

  } catch (err) {
    console.error("Send message error:", err);
    setErrorModal({
      isOpen: true,
      message: "Looks like the server isn’t responding right now. Try again later.",
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
    scrollToBottom();
  }, [messages, loading]);
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Show button if user scrolled up more than 100px from bottom
      const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
      removeMessage(lastMessage.id); // works now
    }
  }
};
  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
  {/* Chat messages container */}
  <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
    {messages.length === 0 ? (
      <div className="grid h-full place-items-center">
        <div className="px-6 text-center">
          {/* <div className="grid w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-2xl place-items-center">
            A\
          </div> */}
          <h2 className="mb-1 text-xl font-semibold text-gray-900">
            Whats on your mind?
          </h2>
          <p className="text-sm text-gray-500">Type a message below to begin.</p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-2">
           {m.message && (
              <div className="flex justify-end group">
                <div className="relative px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-black">
                  <p className="text-sm whitespace-pre-wrap">{m.message}</p>

                  {/* Action buttons (show on hover) */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy button */}
                    <button
                      onClick={() => navigator.clipboard.writeText(m.message)}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/30"
                      title="Copy"
                    >
                      📋
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => setInputValue(m.message)}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/30"
                      title="Edit & Resend"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            )}

            {m.answer ? (
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="px-4 py-2 rounded-2xl max-w-[100%]  text-gray-900">
                  <Markdown content={m.answer} />
                </div>

                 {/* Action icons */}
                    <div className="flex items-center gap-3 px-2">
                      {/* Copy */}
                      <button
                        className="p-1 rounded hover:bg-gray-300"
                        title="Copy"
                        onClick={() => navigator.clipboard.writeText(m.answer)}
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Like */}
                      <button className="p-1 rounded hover:bg-gray-300" title="Like">
                        <ThumbsUp className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Dislike */}
                      <button className="p-1 rounded hover:bg-gray-300" title="Dislike">
                        <ThumbsDown className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Share */}
                      <button className="p-1 rounded hover:bg-gray-300" title="Share">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Try Again */}
                      <button
                        className="p-1 rounded hover:bg-gray-300"
                        title="Try Again"
                        onClick={() => sendMessage()}
                      >
                        <RotateCcw className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* More Options */}
                      <button className="p-1 rounded hover:bg-gray-300" title="More">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                     {/* Timestamp for bot answer */}
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
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
                  <div className="px-4 py-2 text-gray-900 bg-gray-200 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
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

  {/* Scroll to bottom button */}
  {showScrollButton && (
      <button
            onClick={scrollToBottom}
            className="absolute left-1/2 bottom-24 transform -translate-x-1/2 p-2 text-black bg-white rounded-full shadow-md mb-4 hover:bg-gray-100"
          >
            {/* <ChevronDown className="w-5 h-5" /> */}
            {/* <MoveDown strokeWidth={1} className="w-4 h-4"  /> */}
            <ArrowDown size={18} absoluteStrokeWidth />
          </button>
  )}

  {/* Input box */}
  <div className="sticky bottom-0 z-20 px-1 pt-2 pb-4 bg-gray-50">
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-end gap-2"
      >
        <div className="flex w-full items-end gap-2 bg-white border border-gray-300 shadow-sm rounded-3xl px-3 py-2 m-2">
          {/* Left buttons */}
          <div className="flex flex-col justify-end">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100">
              <Plus className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Textarea (auto-growing upward) */}
          <div className="flex-1 flex flex-col justify-end">
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
              placeholder="Ask Ascent AI"
              className="w-full bg-transparent pt-3 resize-none outline-none px-3  max-h-[200px] min-h-[44px] placeholder:text-gray-400 overflow-y-auto"
            />
          </div>

          {/* Right buttons */}
          <div className="flex items-end gap-1">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>

            {loading ? (
              <button
                type="button"
                onClick={cancelMessage}
                className="flex items-center  justify-center w-10 h-10 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <div className="w-3.5 h-3.5 bg-black rounded-sm" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`grid rounded-full shadow-md size-10 place-items-center transition-colors ${
                  inputValue.trim()
                    ? "bg-black text-white hover:bg-blue-800 cursor-pointer"
                    : "bg-gray-300 text-white cursor-not-allowed"
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
    <UsageLimitModal onUpgrade={() => console.log("Upgrade clicked")} />
    <Modal
        isOpen={errorModal.isOpen}
        title="Oops! Something went wrong."
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
      />
  </div>
   
</div>

  );
};

export default Page;
