import { FormattedDatabaseSchemaTable } from "@/types/schema.types";
import { Edge, Node } from "reactflow";

export default function useCanvas() {
  function createSchemaNodes(schema: FormattedDatabaseSchemaTable[]): Node[] {
    return schema.map((table, idx) => ({
      id: table.tableName,
      position: { x: idx * 450, y: 0 },
      data: { tableName: table.tableName, columns: table.columns },
      type: "databaseNode",
    }));
  }

  function createSchemaEdges(schema: FormattedDatabaseSchemaTable[]): Edge[] {
    return schema
      .flatMap((table) => table.columns)
      .filter(
        (column) =>
          column.relation_table !== null && column.relation_column !== null
      )
      .map((column) => {
        const sourceHandle = `${column.table_name}_${column.column_name}_source`;
        const targetHandle = `${column.relation_table}_${column.relation_column}_target`;

        const id = `${sourceHandle}->${targetHandle}`;

        return {
          id,
          source: column.table_name!,
          target: column.relation_table!,
          sourceHandle,
          targetHandle,
        };
      });
  }

  return { createSchemaNodes, createSchemaEdges };
}
