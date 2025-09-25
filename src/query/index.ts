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
  answer: null | string;
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
  return useMutation<SendMessageResponse, SendMessageResponse, { session_id: string; input: string; stream: boolean }>({
    mutationFn: async (payload) => {
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "supersecretkey";
      const messageToSign = JSON.stringify({
        body: payload,
        header: authorization.split(" ")[1],
      });
      const xApiKey = await computeHmac(messageToSign, secretKey);

      const response = await axiosInstace.post(`/chat`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
          "x-api-key": xApiKey,
        },
      });
      return response.data;
    },
  });
};

export const useConversationLists = () => {
  const authorization = Authorization();
  const { conversationId } = useParams();
  return useQuery<Conversations[]>({
    queryKey: ["conversations", { conversationId }],
    queryFn: async () => {
      const response = await axiosInstace.get<Conversations[]>(`/conversations?session_id=${conversationId}`, {
        headers: {
          Authorization: authorization,
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
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
