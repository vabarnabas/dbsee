import React, { useState } from "react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { FaX } from "react-icons/fa6";
import useLocalStore from "@/stores/local.store";
import { FaPlay, FaSave } from "react-icons/fa";
import useDatabaseFunctions from "@/hooks/useDatabaseFunctions";
import ObjectTable from "../object-table/object-table";

export default function EditorPopup() {
  const [queryResult, setQueryResult] = useState<
    Record<string, any>[] | undefined
  >(undefined);
  const { runQueryOnDatabase } = useDatabaseFunctions();
  const closeEditor = useLocalStore((state) => state.closeEditor);
  const editorContent = useLocalStore((state) => state.editorContent);
  const setEditorContent = useLocalStore((state) => state.setEditorContent);
  const currentDatabase = useLocalStore((state) => state.currentDatabase);

  return (
    <motion.div
      initial={{ height: "0%" }}
      animate={{ height: "50vh" }}
      exit={{ height: "0%" }}
      transition={{
        ease: "easeInOut",
        duration: 0.25,
        bounce: 1,
      }}
      className="w-full absolute bottom-0 bg-white border shadow-sm border-border-default rounded-md z-40"
    >
      <div className="relative h-full flex flex-col">
        <div className="py-2 px-4 flex flex-shrink-0 justify-between items-center">
          <p className="font-bold">Console</p>
          <FaX
            onClick={() => closeEditor()}
            className="text-sm cursor-pointer hover:text-red-500"
          />
        </div>
        <div className="absolute bg-white p-2 border border-border-default rounded-md flex gap-x-3 shadow-sm right-4 top-12 z-50">
          <FaSave className="cursor-pointer hover:text-emerald-500" />
          <FaPlay
            onClick={async () => {
              if (editorContent.length) {
                const queryResult = await runQueryOnDatabase(
                  currentDatabase,
                  editorContent
                );
                setQueryResult(queryResult);
              }
            }}
            className="cursor-pointer hover:text-emerald-500"
          />
        </div>
        <Editor
          className="overflow-hidden flex flex-grow"
          defaultLanguage="sql"
          theme="vs-dark"
          height={queryResult ? "50%" : undefined}
          value={editorContent}
          onChange={(e) => setEditorContent(e || "")}
        />
        {queryResult ? (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="w-full overflow-auto h-full max-h-fit">
              <ObjectTable data={queryResult} />
            </div>
            <div
              id="text"
              className="flex py-1.5 border-t border-border-default px-4"
            >
              <p className="text-sm">{`Returned ${queryResult.length} rows`}</p>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
