import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE } from "@/lib/auth";

export async function getServerUserOrRedirect() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) redirect("/login");
  const user = await prisma.user.findUnique({ where: { token } });
  if (!user) {
    // Token presente pero inválido (rotado, deploy distinto, etc.).
    // Limpiamos la cookie para que el proxy no vuelva a redirigirnos en loop.
    store.delete(AUTH_COOKIE);
    redirect("/login");
  }
  return user;
}
