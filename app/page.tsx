"use client";
import EditorPopup from "@/components/editor-popup/editor-popup";
import FlowCanvas from "@/components/flow-canvas/flow-canvas";
import useCanvas from "@/hooks/useCanvas";
import useDatabaseFunctions from "@/hooks/useDatabaseFunctions";
import useLocalStore from "@/stores/local.store";
import usePersistingStore from "@/stores/persisting.store";
import { FormattedDatabaseSchemaTable } from "@/types/schema.types";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaDatabase } from "react-icons/fa";
import { FaCircleXmark, FaDiagramProject, FaX } from "react-icons/fa6";
import { HiTerminal } from "react-icons/hi";
import { ReactFlowProvider } from "reactflow";
import { toast } from "sonner";

export default function Home() {
  const [connectionString, setConnectionString] = useState("");
  const [schema, setSchema] = useState<FormattedDatabaseSchemaTable[]>([]);

  const isEditorOpen = useLocalStore((state) => state.isEditorOpen);
  const setCurrentDatabase = useLocalStore((state) => state.setCurrentDatabase);
  const savedUrls = usePersistingStore((state) => state.savedUrls);
  const saveUrl = usePersistingStore((state) => state.saveUrl);

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
              setSchema([]);
              const dbSchema = await getDatabaseSchema(connectionString);
              if (dbSchema) {
                toast("Schema is retrived", {
                  icon: <FaCheck />,
                });
                setSchema(parseDatabaseSchema(dbSchema));
                saveUrl(connectionString);
                setCurrentDatabase(connectionString);
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
        <div className="overflow-x-auto overflow-y-hidden flex gap-x-2">
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
      {schema.length ? (
        <div className="relative h-full w-full flex flex-col">
          <div className="flex items-center">
            <div className="group border w-max px-3 flex items-center gap-x-2 rounded-t-md cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-x-1">
                <FaDiagramProject className="text-slate-500 text-sm" />
                Schema
              </div>
              <FaX className="group-hover:opacity-100 opacity-0 text-xs hover:text-red-500" />
            </div>
            <div className="group border w-max px-3 flex items-center gap-x-2 rounded-t-md cursor-pointer hover:bg-slate-50">
              <div className="flex items-center gap-x-1">
                <HiTerminal className="text-slate-500 text-sm" />
                Console
              </div>
              <FaX className="group-hover:opacity-100 opacity-0 text-xs hover:text-red-500" />
            </div>
          </div>
          <ReactFlowProvider>
            <AnimatePresence>
              {isEditorOpen ? <EditorPopup /> : null}
            </AnimatePresence>
            <FlowCanvas
              initialEdges={createSchemaEdges(schema)}
              initialNodes={createSchemaNodes(schema)}
            />
          </ReactFlowProvider>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center flex-col">
          <div className="h-20 aspect-square bg-pink-500/20 flex items-center justify-center rounded-full">
            <FaDatabase className="text-pink-500 text-4xl" />
          </div>
          <p className="font-bold text-xl mt-3 max-w-96 text-center">
            You are not yet connected to a Database
          </p>
          <p className="text-sm mt-1 max-w-56 text-center">
            Use a database connection string to connect to your database
          </p>
        </div>
      )}
    </main>
  );
}
