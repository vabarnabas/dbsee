import React from "react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { FaX } from "react-icons/fa6";
import useLocalStore from "@/stores/local.store";

export default function EditorPopup() {
  const closeEditor = useLocalStore((state) => state.closeEditor);
  const editorContent = useLocalStore((state) => state.editorContent);
  const setEditorContent = useLocalStore((state) => state.setEditorContent);

  return (
    <motion.div
      initial={{ height: "0%" }}
      animate={{ height: "45vh" }}
      exit={{ height: "0%" }}
      transition={{
        ease: "easeInOut",
        duration: 0.25,
        bounce: 1,
      }}
      className="w-full absolute bottom-0 bg-white border shadow-sm border-border-default rounded-md z-50"
    >
      <div className="relative h-full flex flex-col">
        <div className="py-2 px-4 flex flex-grow justify-between items-center">
          <p className="font-bold">Console</p>
          <motion.div className="h-1.5 w-10 rounded-full bg-slate-800" />
          <FaX
            onClick={() => closeEditor()}
            className="text-sm cursor-pointer hover:text-red-500"
          />
        </div>
        <Editor
          className="rounded-b-lg overflow-hidden flex flex-grow"
          defaultLanguage="sql"
          theme="vs-dark"
          value={editorContent}
          onChange={(e) => setEditorContent(e || "")}
        />
      </div>
    </motion.div>
  );
}
