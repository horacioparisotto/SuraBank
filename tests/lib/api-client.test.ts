import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/lib/api-client";

const ok = (body: unknown) =>
  ({
    ok: true,
    json: async () => body,
  }) as Response;
const fail = (status: number, body: unknown = { error: "fail" }) =>
  ({
    ok: false,
    status,
    json: async () => body,
  }) as Response;

describe("api-client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("login OK", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok({ name: "Carlos", token: "t" })));
    const r = await api.login("a@b.com", "x");
    expect(r.token).toBe("t");
  });

  it("login lanza con mensaje del server", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(fail(401, { error: "Credenciales inválidas" })),
    );
    await expect(api.login("a", "b")).rejects.toThrow("Credenciales inválidas");
  });

  it("login lanza con código si no hay body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("not json");
        },
      } as Response),
    );
    await expect(api.login("a", "b")).rejects.toThrow("Error 500");
  });

  it("logout llama fetch con POST", async () => {
    const f = vi.fn().mockResolvedValue(ok({}));
    vi.stubGlobal("fetch", f);
    await api.logout();
    expect(f).toHaveBeenCalledWith("/surabank/logout", { method: "POST" });
  });

  it("cards devuelve array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([{ id: 1 }])));
    const r = await api.cards();
    expect(r).toHaveLength(1);
  });

  it("lastMovements devuelve array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([])));
    const r = await api.lastMovements();
    expect(r).toEqual([]);
  });

  it("allMovements devuelve array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([{ id: 1 }, { id: 2 }])));
    const r = await api.allMovements();
    expect(r).toHaveLength(2);
  });
});
