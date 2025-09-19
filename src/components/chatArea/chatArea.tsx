"use client";

import { AIMessage, AuthToken, ChatAreaProps, Message } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp } from "lucide-react";
import TypingIndicator from "@/components/ui/TypingIndicator";
import { computeHmac } from "@/utils/hmac";
import { v4 as uuidv4 } from "uuid";
import Typewriter from "@/components/ui/Typewriter";
import FlowTrace from "../ui/FlowTrace";
import Modal from "@/components/ui/Modal"; // <-- import the modal component
import { getAuthToken } from "@/lib/utils";

export default function ChatArea({
  messages: initialMessages,
  conversationId,
  sessionToken,
}: ChatAreaProps & { sessionToken: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [errorModal, setErrorModal] = useState<{ title?: string; message: string } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

  const saveMessageToDB = async (conversationId: string, sender: string, content: string) => {
    try {
      console.log(1);
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ sender, content }),
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    console.log(`jwt ${sessionStorage.getItem("jwt_token")}`);

    const timestamp = new Date().toISOString();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    if (inputRef.current) inputRef.current.style.height = "44px";

    setIsTyping(true);
    setTypingMessage("");

    const longResponseTimeout = setTimeout(() => {
      setTypingMessage("Analyzing your question");
    }, 2500);

    try {
      // 1️⃣ Get the current user's auth token

      const payloadObj = {
        input: inputValue,
        session_id: "25752600-d4a8-4364-9696-2cf1efe6ffc6",
        stream: false,
      };
      const payload = JSON.stringify(payloadObj);

      // 2️⃣ Build HMAC (x-api-key)
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: payloadObj,
        header: sessionStorage.getItem("jwt_token"),
      });

      const xApiKey = await computeHmac(messageToSign, secretKey);

      // 3️⃣ Send request to Next.js API route
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
          "x-api-key": xApiKey,
        },
        body: payload,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorModal({ title: "Unauthorized", message: "Please login again." });
        } else if (res.status === 403) {
          setErrorModal({ title: "Forbidden", message: "Access denied." });
        } else {
          setErrorModal({ title: `Failed ${res.status}`, message: res.statusText });
        }
        return;
      }

      const data = await res.json();

      let aiMessageContent = "⚠️ No response generated.";

      const getLastValidAiMessage = (messages: AIMessage[] = []): AIMessage | undefined =>
        [...messages]
          .reverse()
          .find(
            (msg) =>
              msg.type === "bot" && Boolean(msg.content?.trim()) && (!msg.tool_calls || msg.tool_calls.length === -1)
          );

      const extractFlowTrail = (messages: AIMessage[] = []) => {
        const trail: string[] = [];
        for (const msg of messages) {
          if (msg.type === "bot" && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
            const tool = msg.tool_calls[0];
            const toolName = tool?.name;
            const fromAgent = msg.name || "supervisor";
            if (toolName) trail.push(`🧠 ${fromAgent} → ${toolName}`);
          } else if (msg.type === "tool" && msg.response_metadata?.__handoff_destination) {
            trail.push(`→ 🤖 ${msg.response_metadata.__handoff_destination}`);
          }
        }
        return trail.length ? trail.join(" ") : null;
      };

      //let aiMessage: AIMessage | undefined;
      let flowTrail: string | null = null;

      const getLastMessage = (messages: AIMessage[] = []): AIMessage | undefined =>
        messages.length > 0 ? messages[messages.length - 1] : undefined;

      if (Array.isArray(data?.messages)) {
        const lastMsg = getLastMessage(data.messages);
        aiMessageContent = lastMsg?.content?.trim() || aiMessageContent;
        flowTrail = extractFlowTrail(data.messages);
      } else if (Array.isArray(data?.response?.messages)) {
        const lastMsg = getLastMessage(data.response.messages);
        aiMessageContent = lastMsg?.content?.trim() || aiMessageContent;
        flowTrail = extractFlowTrail(data.response.messages);
      } else if (data?.reply || data?.output) {
        aiMessageContent = data.reply || data.output;
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + "-bot",
        sender: "bot",
        content: aiMessageContent,
        timestamp: new Date().toISOString(),
        animated: true,
        ...(flowTrail ? { flowNote: { from: "🧠", to: "🤖", via: flowTrail } } : {}),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      saveMessageToDB(conversationId, "user", inputValue);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorModal({ title: "Error", message: "Something went wrong. Unable to connect to server." });
    } finally {
      clearTimeout(longResponseTimeout);
      setIsTyping(false);
      setTypingMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Messages */}
      <div className="flex flex-col items-stretch flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl break-words max-w-[80%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.sender === "bot" && msg.animated ? (
                  <Typewriter text={msg.content} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.flowNote && (
                  <div className="mt-1">
                    <FlowTrace from={msg.flowNote.from} to={msg.flowNote.to} via={msg.flowNote.via} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-center text-gray-500">No messages yet.</p>
        )}

        {isTyping && <TypingIndicator message={typingMessage} />}
        <div ref={messagesEndRef} />
      </div>

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
            <div className="flex items-end w-full gap-2 px-2 py-2 bg-white border border-gray-300 shadow-sm rounded-2xl focus-within:ring-2 focus-within:ring-blue-500">
              <button type="button" className="p-2 rounded-full shrink-0 hover:bg-gray-100">
                <Plus className="w-5 h-5 text-gray-500" />
              </button>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={handleInput}
                rows={1}
                placeholder="Type your message..."
                className="flex-1 bg-transparent resize-none outline-none px-3 py-2 leading-6 max-h-[200px] min-h-[44px] overflow-y-auto placeholder:text-gray-400"
              />
              <button type="button" className="p-2 rounded-full shrink-0 hover:bg-gray-100">
                <Mic className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <button
              type="submit"
              className="grid mb-3 text-white bg-blue-500 rounded-full shadow-md size-10 place-items-center hover:bg-blue-600"
            >
              <ArrowUp className="w-10 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={!!errorModal}
        title={errorModal?.title}
        message={errorModal?.message || ""}
        onClose={() => setErrorModal(null)}
      />
    </div>
  );
}
