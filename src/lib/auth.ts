import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "surabank_token";

export function generateToken(): string {
  // Token ficticio — el enunciado no exige JWT. Random URL-safe string.
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

/**
 * Resolve the current user from either the cookie or the `Authorization` header
 * (the enunciado pide `Authorization: token` para /cards y /movements).
 */
export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization")?.trim();
  let token = authHeader ?? null;
  if (!token) {
    const cookieToken = req.cookies.get(AUTH_COOKIE)?.value;
    if (cookieToken) token = cookieToken;
  }
  if (!token) return null;
  return prisma.user.findUnique({ where: { token } });
}
