import { Brain, ChevronsRight, Coins, File, Info, Link, PanelRight } from "lucide-react";

import { Wrench } from "lucide-react";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { Button } from "../ui/button";
import { ReactNode, useState } from "react";
import dayjs from "dayjs";
import DocumentTree from "../TreeTrace/ChainTree";
import { useTraceById } from "@/query";
import { TraceNode } from "@/types/trace";
import Skeleton from "@mui/material/Skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Separator } from "../ui/separator";

import TraceRunId from "./TraceRunId";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toLocaleString()}ms`;

  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(2)}min`;

  const hours = minutes / 60;
  return `${hours.toFixed(2)}h`;
}
function NodeIcon({ type }: { type: TraceNode["run_type"] }) {
  const runType: Record<TraceNode["run_type"], { bgColor: string; icon: ReactNode }> = {
    llm: {
      bgColor: "bg-orange-500",
      icon: <Brain className="text-white" />,
    },
    tool: {
      bgColor: "bg-green-600",
      icon: <Wrench className="text-white" />,
    },
    chain: {
      bgColor: "bg-sky-400",
      icon: <Link className="text-white" />,
    },
    retriever: {
      bgColor: "bg-purple-400",
      icon: <File className="text-white" />,
    },
  };

  const normalizedType = type?.toLowerCase?.() ?? "";
  const asd = runType[normalizedType as keyof typeof runType] ?? {
    bgColor: "bg-sky-400",
    icon: <Link className="text-white" />,
  };
  return <div className={`flex items-center justify-center w-5 h-5 p-1 rounded-md ${asd.bgColor}`}>{asd.icon}</div>;
}

function RenderNode({ node, isRoot = false }: { node: TraceNode; isRoot?: boolean }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <TreeNode node={node} isRoot={isRoot}>
      {hasChildren && node.children!.map((child) => <RenderNode key={child.run_id} node={child} />)}
    </TreeNode>
  );
}

function TreeNode({
  children,
  isRoot = false,
  node,
}: {
  children?: React.ReactNode;
  isRoot?: boolean;
  node: TraceNode;
}) {
  const hasChildren = !!children;

  const start = dayjs(node.start_time);
  const end = dayjs(node.end_time);
  const runtimeMs = end.diff(start);
  const runtimeSec = formatDuration(runtimeMs);

  return (
    <li
      className={`relative pl-3 ${
        !isRoot
          ? "before:content-[''] before:absolute before:-top-[0.50rem] before:-left-2 before:border-l before:border-gray-300 " +
            (hasChildren ? "before:h-[calc(100%+0.9rem)]" : "before:h-12") +
            " last:before:h-[18px]"
          : ""
      }`}
    >
      <div
        className={`relative ${
          !isRoot
            ? "before:content-[''] before:absolute before:top-2 before:-left-5 before:w-5 before:h-1 before:border-l before:border-b before:border-gray-300 before:rounded-bl-sm"
            : ""
        }`}
      >
        <div
          className="inline-block text-sm border border-transparent rounded-sm cursor-pointer select-none "
          // 👈 toggle on click
        >
          <div className="flex flex-wrap items-start">
            <NodeIcon type={node.run_type} />
            <div className="flex flex-col ml-2">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="text-sm font-medium leading-tight truncate">{node.name}</p>
                {node.model ? (
                  <div className="px-2 py-0.5 border border-gray-300 rounded-lg text-xs">{node.model}</div>
                ) : (
                  <span className="text-sm text-gray-500">{runtimeSec}</span>
                )}
              </div>

              {node.model && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{runtimeSec}</span>
                  <div className="flex items-center px-2 py-0.5 border border-gray-300 rounded-lg text-xs gap-1">
                    <Coins size={15} />
                    {node.total_tokens?.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 👇 toggle visibility of children */}
      {hasChildren && <ul className="ml-4">{children}</ul>}
    </li>
  );
}
interface SkeletonNodeProps {
  depth?: number;
  maxDepth?: number;
  childrenCount?: number;
}

const SkeletonNode: React.FC<SkeletonNodeProps> = ({ depth = 0, maxDepth = 3, childrenCount = 3 }) => {
  if (depth > maxDepth) return null;

  return (
    <div className="flex flex-col space-y-2">
      {/* current node */}
      <div className="flex items-center space-x-2">
        <Skeleton className={`h-4 w-full`} />
      </div>

      {/* child nodes */}
      <div className="pl-6 space-y-2">
        {[...Array(childrenCount)].map((_, i) => (
          <SkeletonNode key={i} depth={depth + 1} maxDepth={maxDepth} childrenCount={Math.max(1, childrenCount - 1)} />
        ))}
      </div>
    </div>
  );
};

const DocumentTreeSkeleton = () => {
  return (
    <div className="p-2 space-y-3">
      {[...Array(2)].map((_, i) => (
        <SkeletonNode key={i} />
      ))}
    </div>
  );
};
const DocumentTreeContent = ({ traceId }: { traceId: string }) => {
  const { data, isLoading, isError, error } = useTraceById(traceId);
  const results = data?.results || [];
  if (isLoading) {
    return <DocumentTreeSkeleton />;
  }
  if (isError) {
    return <div className="text-sm text-destructive">{error.response?.data.error || "Something went wrong"}</div>;
  }

  const result = results[0];
  const totalCost = result.prompt_cost + result.completion_cost;
  const inputPercent = (result.prompt_cost / totalCost) * 100;
  const outputPercent = (result.completion_cost / totalCost) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between p-2 border-b border-bgray-300/50">
        <div className="flex items-center gap-2">
          <p className="text-sm font-extralight">Trace</p>

          <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-2 p-1 text-sm text-gray-500 border border-gray-200 rounded-md cursor-pointer ">
                <Coins className="w-3 h-3 text-muted-foreground" /> {results[0].total_tokens}
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
                  <span className="text-xs text-muted-foreground ">/ ${parseFloat(result.prompt_cost.toFixed(6))}</span>
                </span>
                <span className="text-right">
                  {outputPercent.toFixed(2)}%{" "}
                  <span className="text-xs text-muted-foreground">
                    / ${parseFloat(result.completion_cost.toFixed(6))}
                  </span>
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
                      {result.prompt_tokens} / ${parseFloat(result.prompt_cost.toFixed(6))}
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
                      {result.completion_tokens} / ${parseFloat(result.completion_cost.toFixed(6))}
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
        </div>
        <Button variant="ghost" size="icon" aria-label="panel">
          <PanelRight size={20} />
        </Button>
      </div>
      <DocumentTree data={results} />
    </div>
  );
};

const TraceHistory = ({ traceId }: { traceId: string }) => {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const onToggleSheet = () => {
    setSheetOpen((prev) => !prev);
  };
  return (
    <>
      <button onClick={onToggleSheet} className="p-1 rounded hover:bg-gray-300" title="More">
        <Info className="w-4 h-4 text-gray-600" />
      </button>

      <Sheet open={sheetOpen} onOpenChange={onToggleSheet}>
        <SheetContent side="right" className="w-[1200px] max-xl:w-full [&>button:first-of-type]:hidden p-0  ">
          <div className="flex flex-col h-full">
            <SheetHeader className="flex-row items-center flex-shrink-0 gap-2 p-1 border-b border-b-gray-300/50">
              <Button size="icon" variant="outline" onClick={onToggleSheet}>
                <ChevronsRight />
              </Button>
              <p className="text-sm"> {traceId}</p>
            </SheetHeader>
            <div className="flex flex-1 h-full p-0 overflow-hidden ">
              <div className="flex flex-col h-full w-[450px]">
                <div className="flex-1 h-full overflow-hidden border-r border-r-gray-300/50">
                  <DocumentTreeContent traceId={traceId} />
                </div>
              </div>
              <div className="flex-1 max-w-3xl p-2 mx-auto space-y-6 overflow-auto">
                <TraceRunId traceId={traceId} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TraceHistory;
