import errorHandler from "@/libs/errorHandler";
import {
  DatabaseSchemaRow,
  FormattedDatabaseSchemaTable,
} from "@/types/schema.types";
import { FaCircleXmark } from "react-icons/fa6";
import { toast } from "sonner";

export default function useDatabaseFunctions() {
  async function testDatabaseConnection(connectionString: string) {
    return await errorHandler(async () => {
      const response = await fetch("/api/test", {
        method: "POST",
        body: JSON.stringify({ connectionString }),
      });

      return response.ok;
    });
  }

  async function getDatabaseSchema(connectionString: string) {
    return await errorHandler(async () => {
      const response = await fetch("/api/schema", {
        method: "POST",
        body: JSON.stringify({ connectionString }),
      });

      const schema = await response.json();

      return schema;
    });
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

  async function runQueryOnDatabase(connectionString: string, query: string) {
    return await errorHandler(
      async () => {
        const response = await fetch("/api/query", {
          method: "POST",
          body: JSON.stringify({ connectionString, query }),
        });

        const queryResult = await response.json();

        return queryResult;
      },
      {
        onError: () =>
          toast(
            "Failed to execute database query. Please check your query syntax.",
            {
              icon: <FaCircleXmark />,
            }
          ),
      }
    );
  }

  return {
    testDatabaseConnection,
    getDatabaseSchema,
    parseDatabaseSchema,
    runQueryOnDatabase,
  };
}
