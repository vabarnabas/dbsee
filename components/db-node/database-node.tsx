import useLocalStore from "@/stores/local.store";
import { FormattedDatabaseSchemaColumn } from "@/types/schema.types";
import { FaFileCode } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import { Handle, Position } from "reactflow";

interface Props {
  data: Record<string, any>;
}

export default function DatabaseNode({ data }: Props) {
  const openEditor = useLocalStore((state) => state.openEditor);

  return (
    <div className="bg-white border border-border-default hover:bg-slate-50 shadow-md rounded-md py-3">
      <div>
        <div className="flex items-center justify-between gap-x-6 mb-2 px-3">
          <p className="font-bold text-xl">{data.tableName}</p>
          <FaFileCode
            onClick={() => openEditor()}
            className="text-slate-300 hover:text-red-500 cursor-pointer"
          />
        </div>
        {data.columns.sort((a: FormattedDatabaseSchemaColumn) => {
          if (a.is_pk) {
            return -1;
          } else {
            return 1;
          }
        })
          ? data.columns.map((column: FormattedDatabaseSchemaColumn) => (
              <div
                key={`${data.tableName}_${column.column_name}`}
                className="relative flex"
              >
                <div className="w-full flex justify-between gap-x-6 items-center px-4">
                  <div className="flex gap-x-1.5 items-center">
                    <p className="">{column.column_name}</p>
                    {column.is_pk === "true" ? (
                      <IoKey className="text-sm text-amber-500" />
                    ) : null}
                  </div>
                  <p className="">{column.data_type}</p>
                </div>
                <Handle
                  className="-left-4"
                  type="target"
                  position={Position.Left}
                  id={`${data.tableName}_${column.column_name}_target`}
                  isConnectable
                />
                <Handle
                  className="-right-4"
                  type="source"
                  position={Position.Right}
                  id={`${data.tableName}_${column.column_name}_source`}
                  isConnectable
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
