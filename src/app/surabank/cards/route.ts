import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { cacheGet, cacheSet, cacheKeys } from "@/lib/cache";
import type { CardDTO } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const key = cacheKeys.cards(user.id);
  const cached = await cacheGet<CardDTO[]>(key);
  if (cached) {
    return NextResponse.json(cached, { headers: { "x-cache": "HIT" } });
  }

  const cards = await prisma.card.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
  });
  const dto: CardDTO[] = cards.map((c) => ({
    id: c.id,
    issuer: c.issuer,
    name: c.name,
    expDate: c.expDate,
    lastDigits: c.lastDigits,
    balance: c.balance,
    currency: c.currency,
  }));

  await cacheSet(key, dto);
  return NextResponse.json(dto, { headers: { "x-cache": "MISS" } });
}
