export type RUNType<T extends "chain" | "llm" | "tool" | "retriever"> = T extends "chain"
  ? ChainRun
  : T extends "llm"
    ? LLMRun
    : T extends "tool"
      ? ToolRun
      : T extends "retriever"
        ? RetrieverRun
        : never;

export type ToolRun = {
  test: 1;
};
export type RetrieverRun = {
  test: 1;
};

export type OutputsMessage = {
  content: string;
  example: boolean;
  id: string;
  type: string;
};

export type DefaultResponse = {
  inputs: {
    messages: string[] | OutputsMessage[];
    remaining_steps: number;
  };
  outputs: {
    output: {
      content: string;
      type: string;
    };
    messages: OutputsMessage[];
  };
};

export interface LLMRun {
  id: string;
  name: string;
  start_time: Date;
  run_type: string;
  end_time: Date;
  extra: Extra;
  error: null;
  serialized: Serialized;
  events: Event[];
  inputs: Inputs;
  outputs: Outputs;
  reference_example_id: null;
  parent_run_id: string;
  tags: string[];

  session_id: string;
  child_run_ids: null;
  child_runs: null;
  feedback_stats: null;
  app_path: string;
  manifest_id: null;
  status: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_token_details: PromptCostDetailsClass;
  completion_token_details: CompletionCostDetailsClass;
  first_token_time: null;
  total_cost: number;
  prompt_cost: number;
  completion_cost: number;
  prompt_cost_details: PromptCostDetailsClass;
  completion_cost_details: CompletionCostDetailsClass;
  parent_run_ids: string[];
  trace_id: string;
  dotted_order: string;
  in_dataset: boolean;
}

export interface CompletionCostDetailsClass {
  audio: number;
  reasoning: number;
}

export interface Event {
  name: string;
  time: Date;
}

export interface Extra {
  batch_size: number;
  invocation_params: InvocationParams;
  metadata: Metadata;
  options: Options;
  runtime: Runtime;
}

export interface InvocationParams {
  _type: string;
  azure_deployment: string;
  model: string;
  model_name: string;
  parallel_tool_calls: boolean;
  stop: null;
  stream: boolean;
  temperature: number;
  tools: Tool[];
}

export interface Tool {
  function: Function;
  type: string;
}

export interface Function {
  description: string;
  name: string;
  parameters: Parameters;
}

export interface Parameters {
  type: string;
}

export interface Metadata {
  checkpoint_ns: string;
  langgraph_checkpoint_ns: string;
  langgraph_node: string;
  langgraph_path: string[];
  langgraph_step: number;
  langgraph_triggers: string[];
  ls_model_name: string;
  ls_model_type: string;
  ls_provider: string;
  ls_run_depth: number;
  ls_temperature: number;
}

export interface Options {
  stop: null;
}

export interface Runtime {
  langchain_core_version: string;
  langchain_version: string;
  library: string;
  library_version: string;
  platform: string;
  py_implementation: string;
  runtime: string;
  runtime_version: string;
  sdk: string;
  sdk_version: string;
}

export interface Inputs {
  messages: Array<OpenaiAPIKey[]>;
}

export interface OpenaiAPIKey {
  id: string[];
  kwargs?: OpenaiAPIKeyKwargs;
  lc: number;
  type: string;
}

export interface OpenaiAPIKeyKwargs {
  content: string;
  type: string;
  id?: string;
}

export interface Outputs {
  generations: Array<Generation[]>;
  llm_output: LlmOutput;
  run: null;
  type: string;
}

export interface Generation {
  generation_info: GenerationInfo;
  message: Message;
  text: string;
  type: string;
}

export interface GenerationInfo {
  content_filter_results: ContentFilterResults;
  finish_reason: string;
  logprobs: null;
}

export interface ContentFilterResults {
  hate: Hate;
  protected_material_text?: Jailbreak;
  self_harm: Hate;
  sexual: Hate;
  violence: Hate;
  jailbreak?: Jailbreak;
}

export interface Hate {
  filtered: boolean;
  severity: Severity;
}

export enum Severity {
  Safe = "safe",
}

export interface Jailbreak {
  detected: boolean;
  filtered: boolean;
}

export interface Message {
  id: string[];
  kwargs: PurpleKwargs;
  lc: number;
  type: string;
}

export interface PurpleKwargs {
  additional_kwargs: AdditionalKwargs;
  content: string;
  id: string;
  invalid_tool_calls: [];
  response_metadata: ResponseMetadata;
  tool_calls: [];
  type: string;
  usage_metadata: UsageMetadata;
}

export interface PromptFilterResult {
  content_filter_results: ContentFilterResults;
  prompt_index: number;
}

export interface TokenUsage {
  completion_tokens: number;
  completion_tokens_details: CompletionTokensDetails;
  prompt_tokens: number;
  prompt_tokens_details: PromptTokensDetails;
  total_tokens: number;
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

export interface UsageMetadata {
  input_token_details: PromptCostDetailsClass;
  input_tokens: number;
  output_token_details: CompletionCostDetailsClass;
  output_tokens: number;
  total_tokens: number;
}

export interface PromptCostDetailsClass {
  audio: number;
  cache_read: number;
}

export interface LlmOutput {
  id: string;
  model_name: string;
  prompt_filter_results: PromptFilterResult[];
  service_tier: null;
  system_fingerprint: string;
  token_usage: TokenUsage;
}

export interface Serialized {
  id: string[];
  kwargs: SerializedKwargs;
  lc: number;
  name: string;
  type: string;
}

export interface SerializedKwargs {
  azure_endpoint: string;
  deployment_name: string;
  disabled_params: DisabledParams;
  model_name: string;
  openai_api_key: OpenaiAPIKey;
  openai_api_type: string;
  openai_api_version: string;
  output_version: string;
  temperature: number;
  validate_base_url: boolean;
}

export interface DisabledParams {
  parallel_tool_calls: null;
}

export interface ChainRun {
  id: string;
  name: string;
  start_time: Date;
  run_type: string;
  end_time: Date;
  extra: Extra;
  error: null;
  serialized: null;
  events: Event[];
  inputs: Inputs;
  outputs: Outputs;
  reference_example_id: null;
  parent_run_id: null;
  tags: [];
  session_id: string;
  child_run_ids: string[];
  child_runs: null;
  feedback_stats: null;
  app_path: string;
  manifest_id: null;
  status: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_token_details: PromptCostDetailsClass;
  completion_token_details: CompletionCostDetailsClass;
  first_token_time: null;
  total_cost: number;
  prompt_cost: number;
  completion_cost: number;
  prompt_cost_details: PromptCostDetailsClass;
  completion_cost_details: CompletionCostDetailsClass;
  parent_run_ids: [];
  trace_id: string;
  dotted_order: string;
  in_dataset: boolean;
}

export interface CompletionCostDetailsClass {
  audio: number;
  reasoning: number;
}

export interface Event {
  name: string;
  time: Date;
}

export interface Extra {
  metadata: Metadata;
  runtime: Runtime;
}

export interface Metadata {
  ls_run_depth: number;
}

export interface Runtime {
  langchain_core_version: string;
  langchain_version: string;
  library: string;
  library_version: string;
  platform: string;
  py_implementation: string;
  runtime: string;
  runtime_version: string;
  sdk: string;
  sdk_version: string;
}

export interface AdditionalKwargs {
  refusal?: null;
}

export interface ResponseMetadata {
  content_filter_results?: ContentFilterResults;
  finish_reason?: string;
  id?: string;
  logprobs?: null;
  model_name?: string;
  prompt_filter_results?: PromptFilterResult[];
  service_tier?: null;
  system_fingerprint?: string;
  token_usage?: TokenUsage;
}

export interface ContentFilterResults {
  hate: Hate;
  protected_material_text?: Jailbreak;
  self_harm: Hate;
  sexual: Hate;
  violence: Hate;
  jailbreak?: Jailbreak;
}

export interface Hate {
  filtered: boolean;
}

export interface Jailbreak {
  detected: boolean;
  filtered: boolean;
}

export interface PromptFilterResult {
  content_filter_results: ContentFilterResults;
  prompt_index: number;
}

export interface TokenUsage {
  completion_tokens: number;
  completion_tokens_details: CompletionTokensDetails;
  prompt_tokens: number;
  prompt_tokens_details: PromptTokensDetails;
  total_tokens: number;
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

export interface UsageMetadata {
  input_token_details: PromptCostDetailsClass;
  input_tokens: number;
  output_token_details: CompletionCostDetailsClass;
  output_tokens: number;
  total_tokens: number;
}

export interface PromptCostDetailsClass {
  audio: number;
  cache_read: number;
}
