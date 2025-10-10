"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import { useConversationLists, useSendMessageMutation } from "@/query";
import { useParams } from "next/navigation";
import { v4 as uuid } from "uuid";

type Msg = { id: string; message: string; answer: string };

const Page = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data, isLoading } = useConversationLists();
  const { mutateAsync } = useSendMessageMutation();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const id = uuid();

    setMessages((prev) => [...prev, { id, message: inputValue, answer: "" }]);

    const res = await mutateAsync({
      input: inputValue,
      session_id: conversationId,
      stream: false,
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              answer: res.response.messages[res.response.messages.length - 1].content,
            }
          : msg
      )
    );

    setInputValue("");
  };

  const handleInputGrow = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "44px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
  };

  if (isLoading) return <>Loading...</>;

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      <div className="flex-1 p-4 overflow-y-auto">
        {!data?.messages?.length ? (
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
            {data.messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[100%] bg-blue-600 text-white">
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl max-w-[100%] bg-gray-200 text-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {messages.map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <div className="px-4 py-2 rounded-2xl max-w-[100%] bg-blue-600 text-white">
                    <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                  </div>
                </div>
                {m.answer && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl max-w-[100%] bg-gray-200 text-gray-900">
                      <p className="text-sm whitespace-pre-wrap">{m.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

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
                className="flex-1 px-2 py-2 leading-6 bg-transparent outline-none resize-none placeholder:text-gray-400"
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
