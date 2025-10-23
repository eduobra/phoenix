export interface TreeTraceListsType {
  results: TraceNode[];
}

export type TraceNode = {
  run_id: string;
  name: string;
  run_type: "chain" | "llm" | "tool" | "retriever";
  start_time: string;
  end_time: string;
  total_tokens: number;
  children: TraceNode[];
  model: string | null;
  total_cost: number;
  prompt_cost: number;
  status: "success" | "error";
  completion_cost: number;
  prompt_tokens: number;
  completion_tokens: number;
};

export interface ResponseChild {
  run_id: string;
  name: string;
  run_type: RunType;
  model: null;
  start_time: Date;
  end_time: Date;
  total_tokens: number;
  children: PurpleChild[];
}

export interface PurpleChild {
  run_id: string;
  name: string;
  run_type: RunType;
  model: null;
  start_time: Date;
  end_time: Date;
  total_tokens: number;
  children: FluffyChild[];
}

export interface FluffyChild {
  run_id: string;
  name: string;
  run_type: RunType;
  model: null;
  start_time: Date;
  end_time: Date;
  total_tokens: number;
  children: TentacledChild[];
}

export interface TentacledChild {
  run_id: string;
  name: string;
  run_type: RunType;
  model: null | string;
  start_time: Date;
  end_time: Date;
  total_tokens: number;
  children: TentacledChild[];
}

export enum RunType {
  Chain = "chain",
  Llm = "llm",
  Tool = "tool",
}
