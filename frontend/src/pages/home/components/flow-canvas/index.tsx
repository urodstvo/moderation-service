import { ReactFlow, useNodesState, useEdgesState, Background, type Node, type Edge, Controls } from "@xyflow/react";
import FlowNode from "./flow-node";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import StartNode from "./start-node";

type FlowCanvasProps = {
  nodes: Node[];
  edges: Edge[];
};

const nodeTypes = {
  statusNode: FlowNode,
  startNode: StartNode,
};

export default function FlowCanvas(props: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  console.log("flow canvas", nodes, edges);

  useEffect(() => {
    setNodes(props.nodes);
    setEdges(props.edges);
  }, [props.nodes, props.edges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      colorMode="dark"
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
