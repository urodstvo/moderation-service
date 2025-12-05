import { Check } from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { StatusType } from "@/api/types";
import { Spinner } from "@/components/ui/spinner";

export type FlowNodeData = Node<
  {
    label: string;
    status: StatusType;
    start: string;
    end: string;
    details: string;
    group: string;
  },
  "statusNode"
>;

export default function FlowNode(props: NodeProps<FlowNodeData>) {
  return (
    <div className="w-[200px] h-[100px] border rounded p-2 bg-neutral-600 ">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="w-full flex space-between items-center">
        <span className="h-fit flex-1">{props.data.label}</span>
        {props.data.status === "processing" && <Spinner />}
        {props.data.status === "completed" && <Check size={16} />}
      </div>
    </div>
  );
}
