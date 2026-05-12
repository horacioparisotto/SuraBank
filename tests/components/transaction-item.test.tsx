import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionItem } from "@/components/transaction-item";
import type { TransactionDTO } from "@/lib/schemas";

const base: TransactionDTO = {
  id: 1,
  title: "Adobe",
  subtitle: "Pago de suscripción",
  amount: "125.00",
  transactionType: "SUS",
  date: "2026-05-10T10:30:00Z",
};

describe("TransactionItem", () => {
  it("renderiza title, subtitle y amount", () => {
    render(<TransactionItem tx={base} />);
    expect(screen.getByText("Adobe")).toBeInTheDocument();
    expect(screen.getByText("Pago de suscripción")).toBeInTheDocument();
    expect(screen.getByText("$125.00")).toBeInTheDocument();
  });

  it.each([
    ["SUS", "text-tx-sus"],
    ["CASH_IN", "text-tx-cash-in"],
    ["CASH_OUT", "text-tx-cash-out"],
  ] as const)("aplica color correcto para %s", (type, expected) => {
    const { container } = render(<TransactionItem tx={{ ...base, transactionType: type }} />);
    expect(container.innerHTML).toContain(expected);
  });

  it("cae a CASH_OUT si recibe un tipo desconocido", () => {
    const { container } = render(
      <TransactionItem tx={{ ...base, transactionType: "FOO" as never }} />,
    );
    expect(container.innerHTML).toContain("text-tx-cash-out");
  });
});
