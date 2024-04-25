import { Pool } from "pg";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.query || !body.connectionString) {
    return new Response("Missing parameter(s).", {
      status: 400,
    });
  }

  const pool = new Pool({ connectionString: body.connectionString });

  try {
    const client = await pool.connect();

    const result = await client.query(body.query);

    client.release();
    return Response.json(result.rows);
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
