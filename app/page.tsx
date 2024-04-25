"use client";
import DatabaseNode from "@/components/db-node/database-node";
import EditorPopup from "@/components/editor-popup/editor-popup";
import FlowCanvas from "@/components/flow-canvas/flow-canvas";
import useCanvas from "@/hooks/useCanvas";
import useDatabaseFunctions from "@/hooks/useDatabaseFunctions";
import useLocalStore from "@/stores/local.store";
import { FormattedDatabaseSchemaTable } from "@/types/schema.types";
import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { FaCheck, FaDatabase } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { ReactFlowProvider } from "reactflow";
import { toast } from "sonner";

export default function Home() {
  const [connectionString, setConnectionString] = useState("");
  const [schema, setSchema] = useState<FormattedDatabaseSchemaTable[]>([]);

  const isEditorOpen = useLocalStore((state) => state.isEditorOpen);
  const savedUrls = useLocalStore((state) => state.savedUrls);
  const saveUrl = useLocalStore((state) => state.saveUrl);

  const { getDatabaseSchema, testDatabaseConnection, parseDatabaseSchema } =
    useDatabaseFunctions();
  const { createSchemaNodes, createSchemaEdges } = useCanvas();

  return (
    <main className="flex relative flex-col w-full gap-y-3">
      <p className="text-2xl font-bold">Connect to Your Database</p>
      <div className="flex gap-x-3">
        <div className="relative border border-border-default rounded-md w-full pl-10 pr-4 py-2 flex items-center shadow-sm">
          <FaDatabase className="absolute left-3 text-slate-400" />
          <input
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
            placeholder="postgres://username:password@host:port/database"
            type="text"
            className="w-full outline-none"
          />
        </div>

        <button
          onClick={async () => {
            if ((await testDatabaseConnection(connectionString)) === true) {
              toast("Connection was successful", {
                icon: <FaCheck />,
              });
              const dbSchema = await getDatabaseSchema(connectionString);
              if (dbSchema) {
                toast("Schema is retrived", {
                  icon: <FaCheck />,
                });
                setSchema(parseDatabaseSchema(dbSchema));
                saveUrl(connectionString);
              }
            } else {
              toast("Connection failed", {
                icon: <FaCircleXmark />,
              });
            }
          }}
          className="px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 font-semibold shadow-sm"
        >
          Connect
        </button>
      </div>
      {savedUrls.length ? (
        <div className="overflow-x-auto overflow-y-hidden flex">
          {savedUrls.map((url) => (
            <div
              key={url}
              onClick={() => setConnectionString(url)}
              className="max-w-56 text-xs flex items-center hover:bg-slate-50 truncate px-3 py-1.5 border border-border-default rounded-full cursor-pointer"
            >
              {url}
            </div>
          ))}
        </div>
      ) : null}
      <AnimatePresence>{isEditorOpen ? <EditorPopup /> : null}</AnimatePresence>
      {schema.length ? (
        <>
          <ReactFlowProvider>
            <FlowCanvas
              initialEdges={createSchemaEdges(schema)}
              initialNodes={createSchemaNodes(schema)}
            />
          </ReactFlowProvider>
        </>
      ) : null}
    </main>
  );
}
