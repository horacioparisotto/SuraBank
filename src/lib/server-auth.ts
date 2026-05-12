import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE } from "@/lib/auth";

export async function getServerUserOrRedirect() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await prisma.user.findUnique({ where: { token } });
  if (!user) redirect("/login");
  return user;
}
