"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { useSendMessageMutation } from "@/query";
import { v4 as uuid } from "uuid";

const Page = () => {
  type Msg = { id: string; sender: "user" | "bot"; content: string };
  const { mutateAsync } = useSendMessageMutation();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    //     input: inputValue,
    //     session_id: "25752600-d4a8-4364-9696-2cf1efe6ffc6",
    //     stream: false,
    //   };
    if (!inputValue.trim()) return;
    const id = String(Date.now());
    const user: Msg = { id, sender: "user", content: inputValue };
    const bot: Msg = { id: id + "-b", sender: "bot", content: "Sample response." };
    const mesasge = await mutateAsync({
      session_id: uuid(),
      input: inputValue,
      stream: false,
    });
    console.log({ mesasge });
    setMessages((prev) => [...prev, user, bot]);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
    }
  };

  const handleInputGrow = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "44px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-card-50">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center">
            <div className="px-6 text-center">
              <div className="grid w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-2xl place-items-center">
                AI
              </div>
              <h2 className="mb-1 text-xl font-semibold text-card-foreground-900">Start a new conversation</h2>
              <p className="text-sm text-card-foreground-500">Type a message below to begin.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex w-full ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[100%] ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-card-200 text-card-foreground-900"}`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 px-4 pt-2 pb-4 bg-card-50">
        <div className="w-full max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex items-center w-full gap-2 px-2 py-2 bg-background border border-gray-300 shadow-sm rounded-2xl">
              <button type="button" className="p-2 rounded-full hover:bg-card-100">
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
                placeholder="Type your message..."
                className="flex-1 px-2 py-2 leading-6 bg-transparent outline-none resize-none placeholder:text-card-foreground-400"
              />
              <button type="button" className="p-2 rounded-full hover:bg-card-100">
                <Mic className="w-5 h-5 text-card-foreground-500" />
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
