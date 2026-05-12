import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
  usePathname: () => "/",
}));

vi.mock("@/hooks/use-sounds", () => ({
  useSounds: () => ({
    playTap: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playSwipe: vi.fn(),
  }),
}));

vi.mock("@/lib/api-client", () => ({
  api: {
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));

import { TabBar } from "@/components/tab-bar";
import { api } from "@/lib/api-client";

describe("TabBar", () => {
  beforeEach(() => {
    replace.mockClear();
    refresh.mockClear();
    (api.logout as ReturnType<typeof vi.fn>).mockClear();
  });

  it("renderiza enlaces Home, Movements y botón Logout", () => {
    render(<TabBar />);
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
    expect(screen.getByLabelText("Movimientos")).toBeInTheDocument();
    expect(screen.getByLabelText("Cerrar sesión")).toBeInTheDocument();
  });

  it("Home está marcado como activo cuando pathname=/", () => {
    render(<TabBar />);
    expect(screen.getByLabelText("Home").className).toContain("text-brand");
  });

  it("ejecuta logout y redirige a /login al hacer click en Logout", async () => {
    const user = userEvent.setup();
    render(<TabBar />);
    await user.click(screen.getByLabelText("Cerrar sesión"));
    expect(api.logout).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/login");
    expect(refresh).toHaveBeenCalled();
  });
});
