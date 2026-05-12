import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, setAuthCookie, clearAuthCookie, getUserFromRequest } from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generateToken devuelve un string hex de 64 chars", () => {
    const t = generateToken();
    expect(t).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generateToken produce valores distintos", () => {
    expect(generateToken()).not.toBe(generateToken());
  });

  it("setAuthCookie llama cookies().set con flags correctas", async () => {
    const set = vi.fn();
    (cookies as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ set });
    await setAuthCookie("token123");
    expect(set).toHaveBeenCalledWith(
      expect.any(String),
      "token123",
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
  });

  it("clearAuthCookie llama cookies().delete", async () => {
    const del = vi.fn();
    (cookies as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ delete: del });
    await clearAuthCookie();
    expect(del).toHaveBeenCalled();
  });

  it("getUserFromRequest devuelve null si no hay token", async () => {
    const req = {
      headers: { get: () => null },
      cookies: { get: () => undefined },
    } as unknown as import("next/server").NextRequest;
    const u = await getUserFromRequest(req);
    expect(u).toBeNull();
  });

  it("getUserFromRequest usa Authorization header si está presente", async () => {
    (prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
      name: "Carlos",
    });
    const req = {
      headers: { get: (k: string) => (k === "authorization" ? "abc" : null) },
      cookies: { get: () => undefined },
    } as unknown as import("next/server").NextRequest;
    const u = await getUserFromRequest(req);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { token: "abc" } });
    expect(u?.name).toBe("Carlos");
  });

  it("getUserFromRequest cae a cookie si no hay header", async () => {
    (prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 2,
      name: "Other",
    });
    const req = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: "cookie-token" }) },
    } as unknown as import("next/server").NextRequest;
    const u = await getUserFromRequest(req);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { token: "cookie-token" } });
    expect(u?.id).toBe(2);
  });
});
