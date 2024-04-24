import {
  DatabaseSchemaRow,
  FormattedDatabaseSchemaTable,
} from "@/types/schema.types";

export default function useDatabaseFunctions() {
  async function testDatabaseConnection(connectionString: string) {
    const response = await fetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ connectionString }),
    });

    return response.ok;
  }

  async function getDatabaseSchema(connectionString: string) {
    const response = await fetch("/api/schema", {
      method: "POST",
      body: JSON.stringify({ connectionString }),
    });

    const schema = await response.json();

    return schema;
  }

  function parseDatabaseSchema(
    schema: DatabaseSchemaRow[]
): FormattedDatabaseSchemaTable[] {
    const tableNames = Array.from(new Set(schema.map((row) => row.table_name)));

    return tableNames.map((tableName) => {
      const columns = schema.filter((row) => row.table_name === tableName);

      return { tableName, columns };
    });
  }

  return { testDatabaseConnection, getDatabaseSchema, parseDatabaseSchema };
}
