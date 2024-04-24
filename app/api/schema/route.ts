import { Pool } from "pg";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.connectionString) {
    return new Response("Missing 'connectionString' parameter.", {
      status: 400,
    });
  }

  const pool = new Pool({ connectionString: body.connectionString });

  try {
    const client = await pool.connect();

    const result = await client.query(`
    WITH primary_keys AS (
        SELECT table_name, column_name, constraint_name
        FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE
        WHERE constraint_schema = 'public' AND constraint_name LIKE '%_pkey'
    )
    
    , contraints AS (
        SELECT        
            SPLIT_PART(REGEXP_REPLACE(rc.constraint_name, '^_', ''), '_', 1) AS constraint_table,
            SPLIT_PART(REGEXP_REPLACE(rc.constraint_name, '^_', ''), '_', 2) AS constraint_column,
            SPLIT_PART(REGEXP_REPLACE(rc.unique_constraint_name, '^_', ''), '_', 1) AS unique_constraint_table,
             pk.column_name AS unique_constraint_column
        FROM
            INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
        LEFT JOIN
            primary_keys pk ON rc.unique_constraint_name = pk.constraint_name
        WHERE
            rc.constraint_schema = 'public'
    )
    
    SELECT c.table_name, c.column_name, c.data_type, co.unique_constraint_table AS relation_table, co.unique_constraint_column AS relation_column, CASE WHEN pk.table_name IS NOT NULL THEN 'true' END AS is_pk
    FROM INFORMATION_SCHEMA.COLUMNS c
    LEFT JOIN contraints co ON c.column_name = co.constraint_column AND c.table_name = co.constraint_table
    LEFT JOIN primary_keys pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
    WHERE c.table_schema = 'public'`);

    client.release();
    return Response.json(result.rows);
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
