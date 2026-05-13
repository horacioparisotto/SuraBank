import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SQL = "SELECT count(*) as cnt FROM User";

async function tryEndpoint(url: string, token: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      requests: [{ type: "execute", stmt: { sql: SQL } }],
    }),
  });
  const text = await res.text();
  return { status: res.status, body: text.slice(0, 500) };
}

export async function GET() {
  const rawUrl = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!rawUrl || !token) {
    return NextResponse.json({ stage: "env", url: !!rawUrl, token: !!token }, { status: 500 });
  }

  const httpsBase = rawUrl.replace(/^libsql:\/\//, "https://");
  try {
    const v2 = await tryEndpoint(`${httpsBase}/v2/pipeline`, token);
    const v3 = await tryEndpoint(`${httpsBase}/v3/pipeline`, token);
    return NextResponse.json({
      stage: "raw-fetch-test",
      tursoUrl: rawUrl,
      httpsBase,
      tokenLength: token.length,
      tokenPrefix: token.slice(0, 24),
      tokenSuffix: token.slice(-24),
      v2,
      v3,
    });
  } catch (e) {
    return NextResponse.json(
      {
        stage: "raw-fetch-failed",
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
      { status: 500 },
    );
  }
}
