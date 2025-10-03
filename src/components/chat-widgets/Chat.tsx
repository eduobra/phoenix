/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Bot } from "lucide-react";
import TypingIndicator from "@/components/ui/TypingIndicator";
import { useSendMessageMutation, useSendWidgetMessage } from "@/query";
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  createdAt: Date;
};

const starterTopics = [
  "What can you do?",
  "Show me a demo",
  "How can AI help my business?",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync } = useSendWidgetMessage();
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

const handleSend = async (text: string) => {
  if (!text.trim()) return;

  const userMsg: Message = {
    id: Date.now(),
    sender: "user",
    text,
    createdAt: new Date(),
  };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");

  const botMsgId = Date.now() + 1;
  setMessages((prev) => [
    ...prev,
    { id: botMsgId, sender: "bot", text: "", createdAt: new Date() },
  ]);
  setTyping(true);

  try {
    const stream = await mutateAsync({ input: text, stream: true });

    let botText = "";

    for await (const chunk of stream) {
     
      if (
        botText.length > 0 &&
        !/[ \n.,!?]$/.test(botText) &&
        !/^[ \n.,!?]/.test(chunk)
      ) {
        botText += " ";
      }

      // Type each character with a delay
      for (const char of chunk) {
        botText += char;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: botText } : m))
        );
        await new Promise((r) => setTimeout(r, 20)); 
      }
    }

    setTyping(false);
  } catch (err) {
    console.error("Streaming error:", err);
    setTyping(false);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === botMsgId ? { ...m, text: "⚠️ Failed to load response." } : m
      )
    );
  }
};




return (
  <div className="flex flex-col h-full">
    {/* Messages area */}
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <img
            src="/agent_logo.png"
            alt="Company Logo"
            className="w-36 h-36 mb-2 object-contain"
          />
          <p className="mb-4 text-sm">
            Hi! I’m your AI assistant. Choose a topic to begin:
          </p>
          <div className="flex flex-col gap-2 w-full">
            {starterTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSend(topic)}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-indigo-500 hover:bg-indigo-600"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end gap-2 max-w-[75%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                > 
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-800 whitespace-pre-wrap"
                  }`}
                >
                  {msg.sender === "bot" && msg.text ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : msg.text ? (
                    msg.text
                  ) : msg.sender === "bot" && typing ? (
                    <TypingIndicator />
                  ) : null}

                  <div className="mt-1 text-[10px] text-gray-400">
                    {msg.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>


      
    {/* Input area */}
    {messages.length > 0 && (
      <div className="p-3 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    )}
  </div>
);

};

export default Chat;
