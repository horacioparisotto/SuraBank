import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CardsCarousel } from "@/components/cards-carousel";
import { LastMovements } from "@/components/last-movements";

vi.mock("@/hooks/use-sounds", () => ({
  useSounds: () => ({
    playTap: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playSwipe: vi.fn(),
  }),
}));

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{ui}</QueryClientProvider>;
}

describe("CardsCarousel", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renderiza tarjetas devueltas por la API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            issuer: "Mastercard",
            name: "Carlos",
            expDate: "02/30",
            lastDigits: 1234,
            balance: "100.00",
            currency: "USD",
          },
        ],
      }),
    );
    render(wrap(<CardsCarousel />));
    await waitFor(() => expect(screen.getByText("Carlos")).toBeInTheDocument());
    expect(screen.getByText("100.00")).toBeInTheDocument();
  });

  it("muestra estado vacío cuando no hay tarjetas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(wrap(<CardsCarousel />));
    await waitFor(() => expect(screen.getByText(/aún no tenés tarjetas/i)).toBeInTheDocument());
  });

  it("muestra error en fallo de red", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );
    render(wrap(<CardsCarousel />));
    await waitFor(() =>
      expect(screen.getByText(/no pudimos cargar tus tarjetas/i)).toBeInTheDocument(),
    );
  });
});

describe("LastMovements", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renderiza últimos movimientos", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            title: "Adobe",
            subtitle: "Pago",
            amount: "10",
            transactionType: "SUS",
            date: "2026-05-10T00:00:00Z",
          },
        ],
      }),
    );
    render(wrap(<LastMovements />));
    await waitFor(() => expect(screen.getByText("Adobe")).toBeInTheDocument());
  });

  it("muestra estado vacío", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(wrap(<LastMovements />));
    await waitFor(() =>
      expect(screen.getByText(/no tenés movimientos recientes/i)).toBeInTheDocument(),
    );
  });

  it("muestra error en fallo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );
    render(wrap(<LastMovements />));
    await waitFor(() =>
      expect(screen.getByText(/no pudimos cargar los movimientos/i)).toBeInTheDocument(),
    );
  });
});
