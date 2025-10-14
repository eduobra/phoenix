import { axiosInstace, axiosInstaceBackend } from "@/lib/axiosInstanct";
import { Authorization } from "@/utils/cookies";
import { computeHmac } from "@/utils/hmac";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export type ChatHistortLists = {
  session_id: string;
  updated_at: Date;
  topic: string;
};

export interface Conversations {
  id: number;
  user_id: string;
  session_id: string;
  message: string;
  messages:Message[];
  answer: null | string;
  role: "user" | "assistant";
  created_at: Date;
  updated_at: Date;
}

export interface SendMessageResponse {
  response: Response;
  session_id: string;
}

export interface Response {
  messages: Message[];
}

export interface Message {
  content: string;
  additional_kwargs: AdditionalKwargs;
  response_metadata: ResponseMetadata;
  type: Type;
  name: null | string;
  id: string;
  example: boolean;
  usage_metadata?: UsageMetadata;
}

export interface AdditionalKwargs {
  refusal?: null;
}

export interface ResponseMetadata {
  token_usage?: TokenUsage;
  model_name?: string;
  system_fingerprint?: string;
  id?: string;
  service_tier?: null;
  prompt_filter_results?: PromptFilterResult[];
  finish_reason?: string;
  logprobs?: null;
  content_filter_results?: ResponseMetadataContentFilterResults;
}

export interface ResponseMetadataContentFilterResults {
  hate: Hate;
  protected_material_code: ProtectedMaterialCode;
  protected_material_text: ProtectedMaterialCode;
  self_harm: Hate;
  sexual: Hate;
  violence: Hate;
}

export interface Hate {
  filtered: boolean;
  severity: string;
}

export interface ProtectedMaterialCode {
  filtered: boolean;
  detected: boolean;
}

export interface PromptFilterResult {
  prompt_index: number;
  content_filter_results: PromptFilterResultContentFilterResults;
}

export interface PromptFilterResultContentFilterResults {
  hate: Hate;
  jailbreak: ProtectedMaterialCode;
  self_harm: Hate;
  sexual: Hate;
  violence: Hate;
}

export interface TokenUsage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens_details: CompletionTokensDetails;
  prompt_tokens_details: PromptTokensDetails;
}

export interface CompletionTokensDetails {
  accepted_prediction_tokens: number;
  audio_tokens: number;
  reasoning_tokens: number;
  rejected_prediction_tokens: number;
}

export interface PromptTokensDetails {
  audio_tokens: number;
  cached_tokens: number;
}

export enum Type {
  AI = "ai",
  Human = "human",
}

export interface UsageMetadata {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_token_details: InputTokenDetails;
  output_token_details: OutputTokenDetails;
}

export interface InputTokenDetails {
  audio: number;
  cache_read: number;
}

export interface OutputTokenDetails {
  audio: number;
  reasoning: number;
}
export interface ConversationResponse {
  trace_id: string;
  messages: {
    id: number;
    user_id: number;
    session_id: string;
    role: "user" | "assistant";
    content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }[];
}
export const useChatHistoryLists = () => {
  const authorization = Authorization();
  return useQuery<ChatHistortLists[]>({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const response = await axiosInstace.get<ChatHistortLists[]>("/chat-history", {
        headers: {
          Authorization: authorization,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};



export const useSendMessageMutation = () => {
  const authorization = Authorization();

  return useMutation<
    SendMessageResponse,
    SendMessageResponse,
    { session_id: string; input: string; stream: boolean; signal?: AbortSignal }
  >({
    mutationFn: async (payload) => {
      const { signal, ...body } = payload;
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body,
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);
      console.log("xApiKey",xApiKey)
      // ✅ Normal (non-streaming) behavior
      if (!body.stream) {
        const response = await axiosInstace.post(`/send-message`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
            "x-api-key": xApiKey,
          },
          signal,
        });
        return response.data;
      }

      // ✅ Streaming behavior (same pattern as your working widget)
      const res = await fetch(`/api/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (part.startsWith("data:")) {
            const cleaned = part.replace(/^data:\s*/, "").trim();
            if (cleaned && cleaned !== "[DONE]") {
              fullText += cleaned; // accumulate streamed content
            }
          }
        }
      }

      // ✅ Return structured response compatible with your sendMessage()
      return {
        session_id: body.session_id,
        response: {
          messages: [
            {
              id: crypto.randomUUID(),
              content: fullText,
              additional_kwargs: {},
              response_metadata: {},
              type: "ai",
              name: null,
              example: false,
            },
          ],
        },
      } as SendMessageResponse;
    },
  });
};




export const useConversationLists = () => {
  const authorization = Authorization();
  const { conversationId } = useParams();
  return useQuery<ConversationResponse>({
    queryKey: ["conversations", { conversationId }],
    queryFn: async () => {
      const response = await axiosInstace.get<ConversationResponse>(
        `/conversations?session_id=${conversationId}`,
        {
          headers: { Authorization: authorization },
        }
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};




export const useSendWidgetMessage = () => {
  return useMutation<
    AsyncGenerator<string, void, unknown>, // streamed text
    Error,
    { input: string; stream: true }
  >({
    mutationFn: async ({ input }) => {
      const res = await fetch("/api/chat-widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, stream: true }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      async function* streamGenerator() {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (part.startsWith("data:")) {
              const cleaned = part.replace(/^data:\s*/, "").trim();
              if (cleaned && cleaned !== "[DONE]") {
                yield cleaned; // 👈 only yield clean text
              }
            }
          }
        }
      }

      return streamGenerator();
    },
  });
};

export const useSoftDeleteConversation = () => {
  const authorization = Authorization();

  return useMutation<
    { success: boolean; message: string }, // ✅ response
    Error,
    { session_id: string } // ✅ payload
  >({
    mutationFn: async ({ session_id }) => {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: { session_id },
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);

      const res = await fetch(`/api/soft-delete?session_id=${session_id}`, {
        method: "DELETE", // ✅ Correct HTTP method
        headers: {
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete conversation");
      }

      return res.json();
    },
  });
};


//   const payloadObj = {
//     input: inputValue,
//     session_id: "25752600-d4a8-4364-9696-2cf1efe6ffc6",
//     stream: false,
//   };
//   const payload = JSON.stringify(payloadObj);

//   const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
//   const messageToSign = JSON.stringify({
//     body: payloadObj,
//     header: sessionStorage.getItem("jwt_token"),
//   });
//   const xApiKey = await computeHmac(messageToSign, secretKey);

//   // 4️⃣ Send API request
//  const res = await fetch("/api/send-message", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
//       "x-api-key": xApiKey,
//     },
//     body: payload,
//   });
