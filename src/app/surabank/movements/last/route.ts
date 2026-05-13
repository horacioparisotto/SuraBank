import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { cacheGet, cacheSet, cacheKeys } from "@/lib/cache";
import type { TransactionDTO, TransactionType } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const key = cacheKeys.movementsLast(user.id);
  const cached = await cacheGet<TransactionDTO[]>(key);
  if (cached) {
    return NextResponse.json(cached, { headers: { "x-cache": "HIT" } });
  }

  const txs = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 5,
  });
  const dto: TransactionDTO[] = txs.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    amount: t.amount,
    transactionType: t.transactionType as TransactionType,
    date: t.date.toISOString(),
  }));

  await cacheSet(key, dto);
  return NextResponse.json(dto, { headers: { "x-cache": "MISS" } });
}
