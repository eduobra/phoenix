import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Coins } from "lucide-react";
import { Separator } from "../ui/separator";
import { TraceNode } from "@/types/trace";

type Props = {
  usage: TraceNode;
};

const UsageToken = (props: Props) => {
  const { usage } = props;
  const totalTokens = usage.total_tokens;
  const totalCost = usage.prompt_cost + usage.completion_cost;
  const inputPercent = (usage.prompt_cost / totalCost) * 100;
  const outputPercent = (usage.completion_cost / totalCost) * 100;
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 p-1 text-sm text-gray-500 border border-gray-200 rounded-md cursor-pointer ">
          <Coins className="w-3 h-3 text-muted-foreground" /> {totalTokens.toLocaleString()}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between mb-1 text-xs font-medium text-muted-foreground">
          <span>INPUT COST</span>
          <span>OUTPUT COST</span>
        </div>

        <div className="flex justify-between mb-1 font-semibold">
          <span>
            <span className="text-md">{inputPercent.toFixed(2)}% </span>
            <span className="text-xs text-muted-foreground ">/ ${parseFloat(usage.prompt_cost.toFixed(6))}</span>
          </span>
          <span className="text-right">
            {outputPercent.toFixed(2)}%{" "}
            <span className="text-xs text-muted-foreground">/ ${parseFloat(usage.completion_cost.toFixed(6))}</span>
          </span>
        </div>

        <div className="relative w-full h-2 overflow-hidden rounded bg-muted">
          <div className="absolute top-0 left-0 h-full bg-green-500" style={{ width: `${inputPercent}%` }} />

          <div
            className="absolute top-0 left-[${inputPercent}%] h-full bg-purple-500"
            style={{ width: `${outputPercent}%`, left: `${inputPercent}%` }}
          />
        </div>

        <Separator className="my-2" />

        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 mb-1 font-medium text-emerald-700">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>INPUT</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3 text-muted-foreground" />
              <span>
                {usage.prompt_tokens} / ${parseFloat(usage.prompt_cost.toFixed(6))}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>cache read</span>
            <span>0 / $0</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>audio</span>
            <span>0 / $0</span>
          </div>
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 mb-1 font-medium text-purple-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>OUTPUT</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3 text-muted-foreground" />
              <span>
                {usage.completion_tokens} / ${parseFloat(usage.completion_cost.toFixed(6))}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>cache read</span>
            <span>0 / $0</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>audio</span>
            <span>0 / $0</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UsageToken;
