import { TraceNode } from "@/types/trace";
import TreeNode from "./TreeNode";

interface DocumentTreeProps {
  data: TraceNode[];
}

const DocumentTree = ({ data }: DocumentTreeProps) => {
  return (
    <div className="w-full h-full overflow-auto overflow-x-hidden scroll-thin ">
      {data.map((node, index) => (
        <TreeNode key={node.run_id} node={node} level={0} isLast={index === data.length - 1} parentLines={[]} />
      ))}
    </div>
  );
};

export default DocumentTree;
