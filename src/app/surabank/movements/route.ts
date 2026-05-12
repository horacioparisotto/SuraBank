import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import type { TransactionDTO, TransactionType } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const txs = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
  const dto: TransactionDTO[] = txs.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    amount: t.amount,
    transactionType: t.transactionType as TransactionType,
    date: t.date.toISOString(),
  }));
  return NextResponse.json(dto);
}
