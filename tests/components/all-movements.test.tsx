import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AllMovements } from "@/components/all-movements";

const sample = [
  {
    id: 1,
    title: "Adobe",
    subtitle: "Pago de suscripción",
    amount: "125.00",
    transactionType: "SUS",
    date: "2026-05-10T10:30:00Z",
  },
  {
    id: 2,
    title: "Camila Montenegro",
    subtitle: "Pago recibido",
    amount: "95.00",
    transactionType: "CASH_IN",
    date: "2026-05-09T14:00:00Z",
  },
];

function wrap(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{ui}</QueryClientProvider>;
}

describe("AllMovements", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra todas las transacciones agrupadas por fecha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => sample }));
    render(wrap(<AllMovements />));
    await waitFor(() => expect(screen.getByText("Adobe")).toBeInTheDocument());
    expect(screen.getByText("Camila Montenegro")).toBeInTheDocument();
  });

  it("filtra por búsqueda", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => sample }));
    const user = userEvent.setup();
    render(wrap(<AllMovements />));
    await waitFor(() => expect(screen.getByText("Adobe")).toBeInTheDocument());

    await user.type(screen.getByLabelText(/buscar movimientos/i), "Adobe");
    expect(screen.getByText("Adobe")).toBeInTheDocument();
    expect(screen.queryByText("Camila Montenegro")).not.toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay resultados", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => sample }));
    const user = userEvent.setup();
    render(wrap(<AllMovements />));
    await waitFor(() => expect(screen.getByText("Adobe")).toBeInTheDocument());

    await user.type(screen.getByLabelText(/buscar movimientos/i), "Zzz");
    expect(screen.getByText(/sin resultados/i)).toBeInTheDocument();
  });

  it("muestra error si la query falla", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );
    render(wrap(<AllMovements />));
    await waitFor(() =>
      expect(screen.getByText(/no pudimos cargar los movimientos/i)).toBeInTheDocument(),
    );
  });
});
