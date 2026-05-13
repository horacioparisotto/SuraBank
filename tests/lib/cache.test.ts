import { describe, it, expect, beforeEach, vi } from "vitest";

// Hoisted refs so vi.mock can use them
const redisMock = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    get = redisMock.get;
    set = redisMock.set;
    del = redisMock.del;
  },
}));

describe("cache layer (no Redis configured)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("cacheEnabled es false sin env vars", async () => {
    const mod = await import("@/lib/cache");
    expect(mod.cacheEnabled).toBe(false);
  });

  it("cacheGet devuelve null sin Redis", async () => {
    const mod = await import("@/lib/cache");
    expect(await mod.cacheGet("foo")).toBeNull();
  });

  it("cacheSet no rompe sin Redis", async () => {
    const mod = await import("@/lib/cache");
    await expect(mod.cacheSet("foo", { x: 1 })).resolves.toBeUndefined();
  });

  it("cacheInvalidate no rompe sin Redis", async () => {
    const mod = await import("@/lib/cache");
    await expect(mod.cacheInvalidate("a", "b")).resolves.toBeUndefined();
  });

  it("cacheKeys construye keys por user", async () => {
    const mod = await import("@/lib/cache");
    expect(mod.cacheKeys.cards(7)).toBe("sb:cards:u7");
    expect(mod.cacheKeys.movementsLast(42)).toBe("sb:movements:last:u42");
  });
});

describe("cache layer (Redis up)", () => {
  beforeEach(() => {
    vi.resetModules();
    redisMock.get.mockReset();
    redisMock.set.mockReset();
    redisMock.del.mockReset();
    process.env.UPSTASH_REDIS_REST_URL = "https://test.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "tok";
  });

  it("cacheEnabled es true con env vars", async () => {
    const mod = await import("@/lib/cache");
    expect(mod.cacheEnabled).toBe(true);
  });

  it("cacheGet devuelve el valor del Redis", async () => {
    redisMock.get.mockResolvedValue({ ok: 1 });
    const mod = await import("@/lib/cache");
    expect(await mod.cacheGet("foo")).toEqual({ ok: 1 });
    expect(redisMock.get).toHaveBeenCalledWith("foo");
  });

  it("cacheGet devuelve null si Redis tira error", async () => {
    redisMock.get.mockRejectedValue(new Error("boom"));
    const mod = await import("@/lib/cache");
    expect(await mod.cacheGet("foo")).toBeNull();
  });

  it("cacheSet llama Redis con TTL por default", async () => {
    redisMock.set.mockResolvedValue("OK");
    const mod = await import("@/lib/cache");
    await mod.cacheSet("k", { a: 1 });
    expect(redisMock.set).toHaveBeenCalledWith("k", { a: 1 }, { ex: 60 });
  });

  it("cacheSet acepta TTL custom", async () => {
    redisMock.set.mockResolvedValue("OK");
    const mod = await import("@/lib/cache");
    await mod.cacheSet("k", { a: 1 }, 30);
    expect(redisMock.set).toHaveBeenCalledWith("k", { a: 1 }, { ex: 30 });
  });

  it("cacheSet swallowea errores", async () => {
    redisMock.set.mockRejectedValue(new Error("nope"));
    const mod = await import("@/lib/cache");
    await expect(mod.cacheSet("k", 1)).resolves.toBeUndefined();
  });

  it("cacheInvalidate llama del con todas las keys", async () => {
    redisMock.del.mockResolvedValue(2);
    const mod = await import("@/lib/cache");
    await mod.cacheInvalidate("a", "b");
    expect(redisMock.del).toHaveBeenCalledWith("a", "b");
  });

  it("cacheInvalidate con 0 keys no llama Redis", async () => {
    const mod = await import("@/lib/cache");
    await mod.cacheInvalidate();
    expect(redisMock.del).not.toHaveBeenCalled();
  });

  it("cacheInvalidate swallowea errores", async () => {
    redisMock.del.mockRejectedValue(new Error("nope"));
    const mod = await import("@/lib/cache");
    await expect(mod.cacheInvalidate("a")).resolves.toBeUndefined();
  });
});
