import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merge clases simples", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("dedup con tailwind-merge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("ignora falsy", () => {
    expect(cn("a", undefined, false, null, "b")).toBe("a b");
  });
  it("acepta arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
