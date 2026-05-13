import { NextResponse } from "next/server";
import { createClient } from "@libsql/client/web";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json(
      { stage: "env", error: "TURSO_DATABASE_URL no seteada" },
      { status: 500 },
    );
  }

  try {
    const client = createClient({ url, authToken: token });
    const result = await client.execute({
      sql: "SELECT count(*) as cnt FROM User",
      args: [],
    });
    return NextResponse.json({
      stage: "libsql-direct-ok",
      tursoUrl: url,
      tokenLength: token?.length ?? 0,
      result: result.rows,
      libsqlClientVersion: "@libsql/client/web@0.17.3",
    });
  } catch (e) {
    return NextResponse.json(
      {
        stage: "libsql-direct-failed",
        tursoUrl: url,
        tokenLength: token?.length ?? 0,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
      { status: 500 },
    );
  }
}
