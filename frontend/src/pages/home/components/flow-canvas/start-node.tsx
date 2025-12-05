import { Handle, Position } from "@xyflow/react";

export default function StartNode() {
  return (
    <div className="w-[200px] h-[50px] border rounded p-2 bg-neutral-800 justify-center items-center flex">
      <Handle type="source" position={Position.Bottom} />
      <span>Начальный узел</span>
    </div>
  );
}
