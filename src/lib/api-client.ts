import type { CardDTO, LoginResponse, TransactionDTO } from "@/lib/schemas";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch("/surabank/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handle<LoginResponse>(res);
  },

  async logout(): Promise<void> {
    await fetch("/surabank/logout", { method: "POST" });
  },

  async cards(): Promise<CardDTO[]> {
    const res = await fetch("/surabank/cards", { credentials: "same-origin" });
    return handle<CardDTO[]>(res);
  },

  async lastMovements(): Promise<TransactionDTO[]> {
    const res = await fetch("/surabank/movements/last", { credentials: "same-origin" });
    return handle<TransactionDTO[]>(res);
  },

  async allMovements(): Promise<TransactionDTO[]> {
    const res = await fetch("/surabank/movements", { credentials: "same-origin" });
    return handle<TransactionDTO[]>(res);
  },
};
