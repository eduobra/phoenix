import { ReactNode } from "react";
import { Brain, Wrench, Link, File, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { TraceNode } from "@/types/trace";
import { useTrace } from "@/contexts/TraceContext";

interface TreeNodeProps {
  node: TraceNode;
  level?: number;
  isLast?: boolean;
  parentLines?: boolean[];
}

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
      bgColor: "bg-orange-500 w-4 h-4 flex-shrink-0",
      icon: <Brain className="text-white" />,
    },
    tool: {
      bgColor: "bg-green-600 w-4 h-4 flex-shrink-0",
      icon: <Wrench className="text-white" />,
    },
    chain: {
      bgColor: "bg-sky-400 w-4 h-4 flex-shrink-0",
      icon: <Link className="text-white" />,
    },
    retriever: {
      bgColor: "bg-purple-400 w-4 h-4 flex-shrink-0",
      icon: <File className="text-white" />,
    },
  };
  const normalizedType = (type?.toLowerCase?.() ?? "") as keyof typeof runType;

  const asd =
    runType[normalizedType] ??
    ({
      bgColor: "bg-sky-400",
      icon: <Link className="text-white" />,
    } as const);
  return <div className={`flex items-center justify-center w-5 h-5 p-1 rounded-md ${asd.bgColor}`}>{asd.icon}</div>;
}

const TreeNode = ({ node, level = 0, isLast = false, parentLines = [] }: TreeNodeProps) => {
  const setTrace = useTrace((state) => state.setTrace);
  const trace = useTrace((state) => state.trace);
  const hasChildren = node.children && node.children.length > 0;
  const start = dayjs(node.start_time);
  const end = dayjs(node.end_time);
  const runtimeMs = end.diff(start);
  const runtimeSec = formatDuration(runtimeMs);

  const handleClick = () => {
    setTrace(node);
  };

  return (
    <div className="relative">
      <svg className="absolute bottom-0 pointer-events-none -top-1 left-1" style={{ width: "100%", height: "100%" }}>
        {parentLines.map(
          (shouldShow, idx) =>
            shouldShow && <line key={idx} x1={idx * 20 + 10} y1={0} x2={idx * 20 + 10} y2="100%" strokeWidth="1" />
        )}

        {level > 0 && (
          <>
            {/* Vertical line */}
            <line
              x1={level * 20 + 10}
              y1={0}
              x2={level * 20 + 10}
              y2={isLast ? 10 : "100%"}
              className="stroke-blue-500 fill-none"
              strokeWidth="1"
            />
            {/* Curved horizontal connector */}
            <path
              d={`M ${level * 20 + 10} 10 C ${level * 20 + 10} 20, ${level * 20 + 20} 22, ${level * 20 + 30} 15`}
              className="stroke-blue-500 fill-none"
              fill="none"
              strokeWidth="1"
            />
          </>
        )}
      </svg>

      <div
        onClick={handleClick}
        className={cn(
          "group relative flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors hover:bg-card-500/10",
          "text-sm select-none rounded-sm",
          trace?.run_id === node.run_id ? "bg-card-500/10" : ""
        )}
        style={{ paddingLeft: `${level * 20 + 4}px` }}
      >
        <div className="flex items-center justify-center flex-shrink-0 w-4 h-4"></div>

        <div className="flex justify-between w-full">
          <div className="flex">
            <NodeIcon type={node.run_type} />
            <div className="flex flex-col ml-2">
              <div className="flex flex-wrap items-center gap-x-2">
                <p className="text-sm font-medium leading-tight truncate">{node.name}</p>
                {node.model ? (
                  <div className="px-2 py-0.5 border border-gray-300 rounded-lg text-xs">{node.model}</div>
                ) : (
                  <span className="text-sm text-card-foreground-500">{runtimeSec}</span>
                )}
              </div>

              {node.model && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-card-foreground-500">{runtimeSec}</span>
                  <div className="flex items-center px-2 py-0.5 border border-gray-300 rounded-lg text-xs gap-1">
                    <Coins size={15} />
                    {node.total_tokens?.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {hasChildren && (
        <div className="relative">
          {node.children!.map((child, index) => (
            <TreeNode
              key={child.run_id}
              node={child}
              level={level + 1}
              isLast={index === node.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
