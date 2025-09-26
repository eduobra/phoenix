"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp, ChevronDown } from "lucide-react";
import { useConversationLists, useSendMessageMutation } from "@/query";
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import "@/styles/TypingIndicator.css";
type Msg = { id: string; message: string; answer: string };

const Page = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data, isLoading } = useConversationLists();
  const { mutateAsync } = useSendMessageMutation();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto scroll when data/messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, messages, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    try {
      if (!inputValue.trim()) return;
      const id = uuid();
      setMessages((prev) => [...prev, { id, message: inputValue, answer: "" }]);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.style.height = "44px"; // reset height
      }
      const res = await mutateAsync({
        input: inputValue,
        session_id: conversationId,
        stream: false,
      });
      setLoading(true);

      setMessages((prev) =>
        prev.map((value) => {
          if (value.id == id) {
            return {
              ...value,
              message: inputValue,
              answer:
                res.response.messages[res.response.messages.length - 1].content,
            };
          }
          return value;
        })
      );
      if (inputRef.current) inputRef.current.style.height = "0px";
    } finally {
      setLoading(false);
    }
  };

  const handleInputGrow = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "44px";
    inputRef.current.style.height = `${Math.min(
      inputRef.current.scrollHeight,
      200
    )}px`;
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      {/* Scrollable messages container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto scroll-smooth"
      >
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
                  <div className="px-4 py-3 rounded-2xl max-w-[70%] bg-gray-200/80">
                    <div className="w-32 h-3 mb-2 bg-gray-300 rounded"></div>
                    <div className="w-20 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="grid h-full place-items-center">
            <div className="px-6 text-center">
              <div className="grid w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-2xl place-items-center">
                AI
              </div>
              <h2 className="mb-1 text-xl font-semibold text-gray-900">
                Start a new conversation
              </h2>
              <p className="text-sm text-gray-500">
                Type a message below to begin.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
      
          {Array.isArray(data) &&
            data.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                {/* User Message */}
                {m.message && (
                  <div className="flex justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-blue-600 text-white">
                      <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                )}

                {/* Bot Answer */}
                {m.answer && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{m.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {messages?.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                {m.message && (
                  <div className="flex justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-blue-600 text-white">
                      <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                )}

                {m.answer && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{m.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          {loading && (
             <div className="flex justify-start">
              <div className="px-4 py-2 text-gray-900 bg-gray-200 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute right-4 bottom-24 p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 z-10 px-4 pt-2 pb-4 bg-gray-50">
        <div className="w-full max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex items-center w-full gap-2 px-2 py-2 bg-white border border-gray-300 shadow-sm rounded-2xl">
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
                className="flex-1 bg-transparent resize-none outline-none px-3 py-2 leading-6 max-h-[200px] min-h-[44px] overflow-none placeholder:text-gray-400"
              />
              <button type="button" className="p-2 rounded-full hover:bg-gray-100">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <button
              type="submit"
              className="grid mb-3 text-white bg-blue-900 rounded-full shadow-md size-10 place-items-center hover:bg-blue-800"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
