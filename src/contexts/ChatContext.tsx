"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { create, StoreApi, useStore } from "zustand";
type Msg = {
  created_at: string | number | Date; id: string; message: string; answer: string 
};
type ContextState = {
  conversationId: string | null;
  messages: Msg[];

  setConversationId: (id: string | null) => void;
  addMessage: (msg: Msg) => void;
  updateMessageAnswer: (id: string, answer: string) => void;
  resetMessages: () => void;
  removeMessage: (id: string) => void;
};
const ChatContext = createContext<StoreApi<ContextState> | null>(null);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [value] = useState(() => {
    return create<ContextState>()((set) => ({
      conversationId: null,
      messages: [],
    
      setConversationId: (conversationId) => set({ conversationId }),
      
      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),

      updateMessageAnswer: (id, answer) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, answer } : m)),
        })),

      removeMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })), 
      resetMessages: () => set({ messages: [], conversationId: null }),
    }));
  });

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = <T,>(selector: (state: ContextState) => T) => {
  const store = useContext(ChatContext);
  if (!store) {
    throw new Error("useChat must be used within a useChat");
  }
  return useStore(store, selector);
};
