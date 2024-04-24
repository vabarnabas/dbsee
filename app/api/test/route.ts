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
    client.release();
    return new Response("Success", { status: 200 });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
