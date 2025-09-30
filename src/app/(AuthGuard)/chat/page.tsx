"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp, ChevronDown ,Square } from "lucide-react";
import { useConversationLists, useSendMessageMutation } from "@/query";

import { v4 as uuid } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@/contexts/ChatContext";
import Markdown from "@/components/mark-down";

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

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const id = uuid();
    addMessage({
      id,
      message: inputValue,
      answer: "",
    });
    setInputValue("");
    setLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await mutateAsync({
        input: inputValue,
        session_id: conversationId ? conversationId : id,
        stream: false,
        signal: controller.signal,
      });

      updateMessageAnswer(
        id,
        res.response.messages[res.response.messages.length - 1].content
      );

      if (!conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["chat-history"],
        });
        window.history.replaceState(null, "", `/chat/${id}`);
        setConversationId(id);
      }

      if (inputRef.current) inputRef.current.style.height = "0px";

      setLoading(false);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request aborted"); 
      } else {
        setLoading(false); 
      }
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
          <div className="grid w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-2xl place-items-center">
            AI
          </div>
          <h2 className="mb-1 text-xl font-semibold text-gray-900">
            Start a new conversation
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
                <div className="relative px-4 py-2 rounded-2xl max-w-[80%] bg-blue-600 text-white">
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
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-gray-900">
                  <Markdown content={m.answer} />
                </div>
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
      className="absolute z-50 p-3 text-white transition-all duration-300 bg-blue-900 rounded-full shadow-lg bottom-24 right-6 hover:bg-blue-800 animate-bounce"
    >
      <ChevronDown className="w-5 h-5" />
    </button>
  )}

  {/* Input box */}
  <div className="sticky bottom-0 z-20 px-4 pt-2 pb-4 bg-gray-50">
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-end gap-2"
      >
        {/* Input + icons */}
        <div className="flex items-center flex-1 gap-2 px-2 py-2 bg-white border border-gray-300 shadow-sm rounded-2xl">
          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <Plus className="w-5 h-5 text-gray-500" />
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
            placeholder="Type your message..."
            className="flex-1 bg-transparent resize-none outline-none px-3 py-2 leading-6 max-h-[200px] min-h-[44px] placeholder:text-gray-400"
          />

          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <Mic className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Send / Stop button */}
        {loading ? (
          <button
            type="button"
            onClick={cancelMessage}
          //     className="grid mb-3 text-white bg-gray-800 rounded-full shadow-md size-10 place-items-center hover:bg-red-500 animate-pulse cursor-pointer"
          //   >
          //     <div className="w-3.5 h-3.5 bg-white rounded-sm" />
          // </button>
            className="flex mb-3 items-center justify-center w-10 h-10 bg-gray-800 rounded-full shadow-md hover:bg-gray-900 transition-colors"
            >
              <div className="w-3.5 h-3.5 bg-white rounded-sm" />
            </button>
        ) : (
          <button
            type="submit"
            className="grid mb-3 text-white bg-blue-900 rounded-full shadow-md size-10 place-items-center hover:bg-blue-800 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  </div>
</div>

  );
};

export default Page;
