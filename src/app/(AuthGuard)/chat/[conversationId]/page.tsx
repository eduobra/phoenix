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
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";

import Markdown from "@/components/mark-down";

type Msg = { id: string; message: string; answer: string };

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

  // AbortController ref used across send/cancel
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto scroll when data/messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
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

    // Add user's message immediately
    setMessages((prev) => [...prev, { id, message: inputValue, answer: "" }]);
    setInputValue("");

    // reset textarea height while typing
    if (inputRef.current) inputRef.current.style.height = "44px";

    // create abort controller and store it
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // show stop button
    setLoading(true);

    try {
      const res = await mutateAsync({
        input: inputValue,
        session_id: conversationId,
        stream: false,
        signal: controller.signal, // pass signal so mutation can abort
      });

      // attach answer to the message
      setMessages((prev) =>
        prev.map((value) =>
          value.id === id
            ? {
                ...value,
                answer:
                  res?.response?.messages?.[res.response.messages.length - 1]?.content ?? "",
              }
            : value
        )
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // If aborted, we typically handle removal in cancelMessage.
      // But also log other errors for debugging.
      if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
        console.log("Request aborted by user.");
      } else {
        console.error("Send message error:", err);
      }
    } finally {
      // cleanup: hide stop button and clear stored controller
      abortControllerRef.current = null;
      setLoading(false);
      if (inputRef.current) inputRef.current.style.height = "0px";
    }
  };

  // Cancel / stop message generation
  const cancelMessage = () => {
    if (abortControllerRef.current) {
      // abort the in-flight request
      abortControllerRef.current.abort();
      abortControllerRef.current = null;

      // remove the last pending user message (optional behavior)
      setMessages((prev) => {
        // Only remove if the last message has no answer (was pending)
        const last = prev[prev.length - 1];
        if (!last) return prev;
        if (last.answer) return prev; // last already answered
        return prev.slice(0, -1);
      });

      // stop loading UI
      setLoading(false);
    }
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
          {/* existing conversation history */}
          {Array.isArray(data) &&
            data.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                {m.message && (
                  <div className="flex justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-300 text-black">
                      <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                )}

                {m.answer && (
                  <div className="flex flex-col items-start gap-1">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-gray-900 overflow-x-auto">
                      <Markdown content={m.answer} />
                    </div>


                     {/* Action icons */}
                    <div className="flex items-center gap-3 px-2">
                      {/* Copy */}
                      <button
                        className="p-1 rounded hover:bg-gray-300"
                        title="Copy"
                        onClick={() => navigator.clipboard.writeText(m.answer ?? "")}
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
                  </div>
                )}
              </div>
            ))}

          {/* messages created during this session */}
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-2">
              {m.message && (
                <div className="flex justify-end">
                  <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-black">
                    <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
              )}

              {m.answer && (
                <div className="flex flex-col items-start gap-1">
                  <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200 text-gray-900 overflow-x-auto">
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
                </div>
              )}
            </div>
          ))}

          {/* inline loader bubble when sending */}
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
        className="absolute left-1/2 bottom-24 transform -translate-x-1/2 p-2 text-black bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        {/* <ChevronDown className="w-5 h-5" /> */}
        {/* <MoveDown strokeWidth={1} className="w-4 h-4"  /> */}
        <ArrowDown size={18} absoluteStrokeWidth />
      </button>
    )}

    {/* Input Area */}
    <div className="sticky bottom-0 z-10 px-4 pt-2 pb-4 bg-gray-50 ">
      <div className="w-full max-w-3xl mx-auto ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end gap-2 "
        >
          <div className="flex items-center w-full gap-2 px-2 py-2 bg-white border border-gray-300 shadow-sm rounded-2xl">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
            >
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
              className="flex-1 bg-transparent resize-none outline-none  px-3 py-2 leading-6 max-h-[200px] min-h-[44px] placeholder:text-gray-400"
            />

            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Mic className="w-5 h-5 text-gray-500" />

            </button>
            {loading ? (
              <button
                type="button"
                onClick={cancelMessage}
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full shadow-md hover:bg-gray-900 transition-colors"
                title="Stop generating"
              >
                <div className="w-3.5 h-3.5 bg-white rounded-sm" />
              </button>
            ) : (
              <button
                type="submit"
                className="grid  text-white bg-black rounded-full shadow-md size-10 place-items-center hover:bg-blue-800 cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
          )}
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default Page;
