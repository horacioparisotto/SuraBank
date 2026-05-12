import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/server", () => {
  const redirects: Array<{ url: string }> = [];
  const passes: Array<true> = [];
  return {
    NextResponse: {
      redirect: vi.fn((url: URL) => {
        const r = { type: "redirect" as const, url: url.toString() };
        redirects.push(r);
        return r;
      }),
      next: vi.fn(() => {
        const r = { type: "next" as const };
        passes.push(true);
        return r;
      }),
    },
    // Re-export the type symbol so the import doesn't fail
    NextRequest: class {},
  };
});

import { proxy } from "@/proxy";

function makeReq(pathname: string, token?: string) {
  return {
    cookies: { get: () => (token ? { value: token } : undefined) },
    nextUrl: { pathname },
    url: `http://localhost:3000${pathname}`,
  } as unknown as import("next/server").NextRequest;
}

describe("proxy (auth middleware)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirige a /login si no hay token y se va a /", () => {
    const res = proxy(makeReq("/"));
    expect((res as { type: string; url?: string }).url).toContain("/login");
  });

  it("redirige a /login si no hay token y se va a /movements", () => {
    const res = proxy(makeReq("/movements/123"));
    expect((res as { type: string; url?: string }).url).toContain("/login");
  });

  it("redirige a / si está logueado y va a /login", () => {
    const res = proxy(makeReq("/login", "tk"));
    expect((res as { type: string; url?: string }).url?.endsWith("/")).toBe(true);
  });

  it("permite pasar / con token", () => {
    const res = proxy(makeReq("/", "tk"));
    expect((res as { type: string }).type).toBe("next");
  });

  it("permite pasar /login sin token", () => {
    const res = proxy(makeReq("/login"));
    expect((res as { type: string }).type).toBe("next");
  });
});
