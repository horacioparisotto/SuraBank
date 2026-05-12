import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearAuthCookie, getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { token: null } });
  }
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
