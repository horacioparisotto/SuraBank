import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearAuthCookie, getUserFromRequest } from "@/lib/auth";
import { cacheInvalidate, cacheKeys } from "@/lib/cache";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { token: null } });
    await cacheInvalidate(cacheKeys.cards(user.id), cacheKeys.movementsLast(user.id));
  }
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
