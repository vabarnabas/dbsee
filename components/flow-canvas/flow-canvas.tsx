import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import DatabaseNode from "../db-node/database-node";
import { FaFileCode } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import useLocalStore from "@/stores/local.store";

interface Props {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export default function FlowCanvas({ initialEdges, initialNodes }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

  const openEditor = useLocalStore((state) => state.openEditor);

  const nodeTypes = useMemo(() => ({ databaseNode: DatabaseNode }), []);

  return (
    <div className="w-full h-full border rounded-md border-border-default shadow-sm">
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
      >
        <Panel
          className="bg-white text-2xl p-2 border border-border-default rounded-md flex gap-x-4 shadow-sm"
          position="top-right"
        >
          <FaShuffle className=" hover:text-pink-500 cursor-pointer" />
          <FaFileCode
            onClick={() => openEditor()}
            className=" hover:text-pink-500 cursor-pointer"
          />
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
