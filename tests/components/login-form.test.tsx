import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/hooks/use-sounds", () => ({
  useSounds: () => ({
    playTap: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playSwipe: vi.fn(),
  }),
}));

import { LoginForm } from "@/components/login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    push.mockClear();
    refresh.mockClear();
  });

  it("muestra errores de validación cuando los campos están vacíos", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
    expect(screen.getByText(/contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it("envía credenciales correctas y redirige a /", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Carlos", token: "t" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), "user@suragaming.com");
    await user.type(screen.getByLabelText(/contraseña/i), "SURA2026!$");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/surabank/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("muestra error del servidor cuando login falla", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Credenciales inválidas" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), "user@suragaming.com");
    await user.type(screen.getByLabelText(/contraseña/i), "wrong");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("muestra error de red si fetch lanza", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), "user@suragaming.com");
    await user.type(screen.getByLabelText(/contraseña/i), "x");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(await screen.findByText(/error de red/i)).toBeInTheDocument();
  });
});
