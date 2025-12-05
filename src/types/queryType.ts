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
  messages: Message[];
  answer: null | string;
  role: "user" | "assistant";
  created_at: Date;
  updated_at: Date;
}

export interface SendMessageResponse {
  response: Response;
  session_id: string;
  run_id: string;
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
export interface ChatHistoryList {
  session_id: string;
  updated_at: string;
  topic: string;
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

export type SettingsPayload = {
  theme?: string;
  accent_color?: string;
  language?: string;
  session_timeout_control?: number;
  time_zone?: string;
};