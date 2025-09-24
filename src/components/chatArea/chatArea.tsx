"use client";

import { AIMessage, AuthToken, ChatAreaProps, Message } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { Plus, Mic, ArrowUp, ChevronDown } from "lucide-react"; // ✅ added ChevronDown
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
  const chatContainerRef = useRef<HTMLDivElement>(null); // ✅ added
  const [showScrollButton, setShowScrollButton] = useState(false); // ✅ added
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [errorModal, setErrorModal] = useState<{ title?: string; message: string } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ track scroll position
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ manual scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

  // const saveMessageToDB = async (conversationId: string, sender: string, content: string) => {
  //   try {
  //     await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/conversations/${conversationId}/messages`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({ sender, content }),
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Failed to save message:", error);
  //   }
  // };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

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
      // 2️⃣ Build payload
      const payloadObj = {
        input: inputValue,
        session_id: "25752600-d4a8-4364-9696-2cf1efe6ffc6",
        stream: false,
      };
      const payload = JSON.stringify(payloadObj);

      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: payloadObj,
        header: sessionStorage.getItem("jwt_token"),
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);

      // 4️⃣ Send API request
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

      const getLastMessage = (messages: AIMessage[] = []): AIMessage | undefined =>
        messages.length > 0 ? messages[messages.length - 1] : undefined;

      let flowTrail: string | null = null;

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
        //saveMessageToDB(conversationId, "user", inputValue);
      } catch (error) {
      console.error("Error sending message:", error);
      setErrorModal({
        title: "Error",
        message: "Something went wrong. Unable to connect to server.",
      });
    } finally {
      clearTimeout(longResponseTimeout);
      setIsTyping(false);
      setTypingMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 relative">
      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col items-stretch"
      >
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
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
          <p className="text-gray-500 text-center mt-4">No messages yet.</p>
        )}

        {isTyping && <TypingIndicator message={typingMessage} />}
        <div ref={messagesEndRef} />
      </div>

     
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-3 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition-all duration-300 animate-bounce"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 z-10 bg-gray-50 px-4 pb-4 pt-2">
        <div className="mx-auto w-full max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex w-full items-end gap-2 rounded-2xl border border-gray-300 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <button type="button" className="shrink-0 p-2 rounded-full hover:bg-gray-100">
                <Plus className="h-5 w-5 text-gray-500" />
              </button>
            <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); 
                    sendMessage();      
                  }
                }}
                rows={1}
                placeholder="Type your message..."
                className="flex-1 bg-transparent resize-none outline-none px-3 py-2 leading-6 max-h-[200px] min-h-[44px] overflow-y-auto placeholder:text-gray-400"
              />
              <button type="button" className="shrink-0 p-2 rounded-full hover:bg-gray-100">
                <Mic className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <button
              type="submit"
              className="grid size-10 place-items-center rounded-full bg-blue-900 text-white hover:bg-blue-800 shadow-md mb-3"
            >
              <ArrowUp className="h-5 w-10" />
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
