import type { Graph } from "@/api/types";
import { useGetStatusQuery } from "@/api/queries";
import { useActiveRequestId } from "@/provider";
import { convertGraphToReactFlow } from "../config";
import FlowCanvas from "./flow-canvas";

export function FlowView({ requestId }: { requestId: number }) {
  const status = useGetStatusQuery(requestId);

  const { nodes, edges } = (status.data && convertGraphToReactFlow(status.data as Graph)) || { nodes: [], edges: [] };
  console.log(nodes, edges);

  if (!status.data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col size-full">
      <FlowCanvas nodes={nodes} edges={edges} />
    </main>
  );
}

export default function FlowViewWrapper() {
  const { requestId } = useActiveRequestId();

  return requestId && <FlowView requestId={requestId} />;
}
