/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Send, User, Bot } from "lucide-react";

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

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Fake bot reply after 1s (you can replace with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `🤖 This is a sample response to: "${text}"`,
          createdAt: new Date(),
        },
      ]);
    }, 1000);

    setInput("");
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
            <p className="mb-4 text-sm">Hi! I’m your AI assistant. Choose a topic to begin:</p>
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
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[75%] ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                  <div className="mt-1 text-[10px] text-gray-400">
                    {msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
