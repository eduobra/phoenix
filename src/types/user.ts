import { Dispatch, SetStateAction } from "react";

// src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
   image?: string | null;
}

export interface Message {
  id: string;
  sender: "user" | "bot";  // ✅ clearer
  content: string;
  timestamp: string;
  animated?: boolean;
  flowNote?: {
    from: string;
    to: string;
    via?: string;
  };
}

export interface AuthError {
  message: string;
}

export interface ChatPageProps {
  conversationId: string;
}
export interface GoogleDecoded {
  email: string;
  name: string;
  sub: string;
}
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleData: { email: string; google_id: string; full_name: string }) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export interface Props {
  conversationId: string;
}
export interface ChatAreaProps {
  messages: Message[];
  conversationId: string;
  logout: () => void;   
  sessionToken?: string;
    user: User | null;
}

export interface Session  {
  session_id: string;
  topic: string;
  updated_at: string;
};

export interface SideNavProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  user?: User | null;
  logout: () => void;
  conversationId: string;
  setSelectedId: (id: string | null) => void;
  setSessionId:(id: string | null) => void;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}



// export interface AIMessage {
//   type: "ai" | "user";
//   content: string;
//   timestamp?: string;
//   tool_calls?: unknown[]; 
// }

export interface ToolCall {
  name?: string;
}

export interface ToolResponseMetadata {
  __handoff_destination?: string;
}

export type AIMessage =
  | {
      type: "bot";
      content: string;
      timestamp?: string;
      tool_calls?: ToolCall[];
      name?: string; // Agent name like "supervisor"
    }
  | {
      type: "tool";
      content: string;
      timestamp?: string;
      response_metadata?: ToolResponseMetadata;
    }
  | {
      type: "user";
      content: string;
      timestamp?: string;
    };

export type SessionChat = {
  session_id: string;
  topic: string;
  updated_at: string;
};

export type RawSession = {
  session_id: string;
  updated_at: string;
  topic: string;
};


export type RawMessage = {
  id: number;            // unique message id from backend
  session_id: string;    // session this message belongs to
  user_id: string;       // sender (user id)
  message: string;       // user’s message
  answer?: string;       // bot’s reply (optional)
  created_at: string;    // when it was created
  updated_at?: string;   // when it was last updated
};

export type AuthToken = {
  type: "manual" | "msal" | "google";
  token: string;
};