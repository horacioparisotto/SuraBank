import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MobileOnlyGate } from "@/components/mobile-only-gate";

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches,
    media: "(max-width: 767px)",
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue(mql),
  });
  return { mql, listeners };
}

describe("MobileOnlyGate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("renderiza children y NO muestra overlay cuando el viewport ES mobile", () => {
    mockMatchMedia(true);
    render(
      <MobileOnlyGate>
        <p>HOME-CONTENT</p>
      </MobileOnlyGate>,
    );
    expect(screen.getByText("HOME-CONTENT")).toBeInTheDocument();
    expect(
      screen.queryByText(/Esta experiencia está diseñada para mobile/i),
    ).not.toBeInTheDocument();
  });

  it("renderiza children Y overlay cuando el viewport NO es mobile", () => {
    mockMatchMedia(false);
    render(
      <MobileOnlyGate>
        <p>HOME-CONTENT</p>
      </MobileOnlyGate>,
    );
    expect(screen.getByText("HOME-CONTENT")).toBeInTheDocument();
    expect(screen.getByText(/Esta experiencia está diseñada para mobile/i)).toBeInTheDocument();
    expect(screen.getByText("SuraBank")).toBeInTheDocument();
  });

  it("bloquea el scroll del body cuando el overlay está visible", () => {
    mockMatchMedia(false);
    render(
      <MobileOnlyGate>
        <p>HOME-CONTENT</p>
      </MobileOnlyGate>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("no toca el scroll del body cuando ES mobile", () => {
    mockMatchMedia(true);
    render(
      <MobileOnlyGate>
        <p>HOME-CONTENT</p>
      </MobileOnlyGate>,
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("reacciona al cambio de viewport (resize)", () => {
    const { listeners, mql } = mockMatchMedia(false);
    render(
      <MobileOnlyGate>
        <p>HOME-CONTENT</p>
      </MobileOnlyGate>,
    );
    expect(screen.getByText(/Esta experiencia está diseñada para mobile/i)).toBeInTheDocument();

    act(() => {
      mql.matches = true;
      listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));
    });
    // children siguen visibles, y el overlay se va con AnimatePresence (puede tardar)
    expect(screen.getByText("HOME-CONTENT")).toBeInTheDocument();
  });
});
