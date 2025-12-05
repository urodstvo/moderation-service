import { type Node as RFNode, type Edge as RFEdge, Position } from "@xyflow/react";
import type { Graph, Node } from "@/api/types";

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 100;
export const START_NODE_WIDTH = 200;
export const START_NODE_HEIGHT = 50;
export const HORIZONTAL_SPACING = 300;
export const VERTICAL_SPACING = 100;

interface LayoutNode extends Node {
  calculatedX?: number;
  calculatedY?: number;
  depth: number;
  column: number;
  visited: boolean;
  children: string[];
  parents: string[];
}

export function convertGraphToReactFlow(graph: Graph): {
  nodes: RFNode[];
  edges: RFEdge[];
} {
  const nodeMap = new Map<string, LayoutNode>();
  const START_NODE_ID = "start-node";

  // Инициализация нод
  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, {
      ...node,
      depth: 0,
      column: 0,
      visited: false,
      children: [],
      parents: [],
    });
  });

  // Построение связей
  graph.edges.forEach((edge) => {
    const fromNode = nodeMap.get(edge.from);

    if (fromNode) {
      edge.to.forEach((toId) => {
        const toNode = nodeMap.get(toId);

        if (toNode) {
          fromNode.children.push(toId);
          toNode.parents.push(edge.from);
        }
      });
    }
  });

  // Находим корневые ноды (без родителей)
  const rootNodes: LayoutNode[] = [];
  nodeMap.forEach((node) => {
    if (node.parents.length === 0) {
      rootNodes.push(node);
    }
  });

  // Обход в ширину для вычисления глубины
  const queue: { nodeId: string; depth: number }[] = [];

  rootNodes.forEach((node) => {
    node.depth = 0;
    node.visited = true;
    queue.push({ nodeId: node.id, depth: 0 });
  });

  if (rootNodes.length === 0 && graph.nodes.length > 0) {
    const firstNode = nodeMap.get(graph.nodes[0].id);
    if (firstNode) {
      firstNode.depth = 0;
      firstNode.visited = true;
      queue.push({ nodeId: firstNode.id, depth: 0 });
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNode = nodeMap.get(current.nodeId)!;

    currentNode.children.forEach((childId) => {
      const childNode = nodeMap.get(childId);
      if (childNode && !childNode.visited) {
        childNode.depth = current.depth + 1;
        childNode.visited = true;
        queue.push({ nodeId: childId, depth: childNode.depth });
      }
    });
  }

  // Группировка по глубине
  const depthGroups = new Map<number, LayoutNode[]>();

  nodeMap.forEach((node) => {
    if (!depthGroups.has(node.depth)) {
      depthGroups.set(node.depth, []);
    }
    depthGroups.get(node.depth)!.push(node);
  });

  // Расчет колонок с учетом ширины нод
  const maxColumnsByDepth = new Map<number, number>();

  // Вычисляем максимальное количество колонок на каждом уровне
  depthGroups.forEach((nodes, depth) => {
    maxColumnsByDepth.set(depth, nodes.length);
  });

  // Распределяем ноды по колонкам с центрированием
  depthGroups.forEach((nodes, depth) => {
    const columnCount = nodes.length;

    // Расчет горизонтального центра для уровня
    const totalWidthNeeded = columnCount * NODE_WIDTH + (columnCount - 1) * HORIZONTAL_SPACING;

    nodes.forEach((node, index) => {
      // Расчет позиции с центрированием
      const levelStartX = -totalWidthNeeded / 2 + NODE_WIDTH / 2;
      node.column = index;

      // Сохраняем расчетные позиции
      node.calculatedX = levelStartX + index * (NODE_WIDTH + HORIZONTAL_SPACING);
      node.calculatedY = depth * (NODE_HEIGHT + VERTICAL_SPACING);
    });
  });

  const rfNodes: RFNode[] = [];
  const rfEdges: RFEdge[] = [];

  // Добавляем стартовую ноду (если есть корневые ноды)
  if (rootNodes.length > 0) {
    // Позиционируем стартовую ноду над корневыми
    const firstRootDepth = rootNodes[0].depth;
    const rootLevelNodes = depthGroups.get(firstRootDepth) || [];

    // Находим центр корневых нод для позиционирования стартовой ноды
    let minX = Infinity;
    let maxX = -Infinity;

    rootLevelNodes.forEach((node) => {
      const x = node.calculatedX || 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    });

    const centerX = (minX + maxX) / 2;
    const startNodeY = -(START_NODE_HEIGHT + VERTICAL_SPACING);

    rfNodes.push({
      id: START_NODE_ID,
      type: "startNode",
      position: {
        x: centerX - START_NODE_WIDTH / 2,
        y: startNodeY,
      },
      data: {
        label: "Начало",
        status: "completed",
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: {
        width: START_NODE_WIDTH,
        height: START_NODE_HEIGHT,
      },
    });

    // Добавляем ребра от стартовой ноды к корневым
    rootNodes.forEach((rootNode) => {
      rfEdges.push({
        id: `edge-${START_NODE_ID}-${rootNode.id}`,
        source: START_NODE_ID,
        target: rootNode.id,
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 2 },
      });
    });
  }

  // Добавляем обычные ноды
  nodeMap.forEach((node) => {
    rfNodes.push({
      id: node.id,
      type: "statusNode",
      position: {
        x: (node.calculatedX || 0) - NODE_WIDTH / 2,
        y: node.calculatedY || 0,
      },
      data: {
        label: node.title,
        status: node.status,
        start: node.start,
        end: node.end,
        details: node.details,
        group: node.group,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      },
    });
  });

  // Добавляем ребра из графа
  graph.edges.forEach((edge, edgeIndex) => {
    edge.to.forEach((toId, toIndex) => {
      rfEdges.push({
        id: `edge-${edge.from}-${toId}-${edgeIndex}-${toIndex}`,
        source: edge.from,
        target: toId,
        type: "smoothstep",
        animated: true,
        style: { strokeWidth: 2 },
      });
    });
  });

  return { nodes: rfNodes, edges: rfEdges };
}
