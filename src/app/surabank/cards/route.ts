import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import type { CardDTO } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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
  return NextResponse.json(dto);
}
