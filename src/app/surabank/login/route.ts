import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginRequestSchema } from "@/lib/schemas";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = LoginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = generateToken();
  await prisma.user.update({ where: { id: user.id }, data: { token } });
  await setAuthCookie(token);

  return NextResponse.json({ name: user.name, token });
}
