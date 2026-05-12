import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardItem } from "@/components/card-item";
import type { CardDTO } from "@/lib/schemas";

const card: CardDTO = {
  id: 1,
  issuer: "Mastercard",
  name: "Carlos Sura",
  expDate: "02/30",
  lastDigits: 1234,
  balance: "978.85",
  currency: "USD",
};

describe("CardItem", () => {
  it("renderiza balance, número enmascarado, nombre y expDate", () => {
    render(<CardItem card={card} />);
    expect(screen.getByText("978.85")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText(/1234/)).toBeInTheDocument();
    expect(screen.getByText("Carlos Sura")).toBeInTheDocument();
    expect(screen.getByText("02/30")).toBeInTheDocument();
  });

  it("alterna paleta de colores por index", () => {
    const { container, rerender } = render(<CardItem card={card} index={0} />);
    const a = container.querySelector("[data-testid='card-item']")?.className ?? "";
    rerender(<CardItem card={card} index={1} />);
    const b = container.querySelector("[data-testid='card-item']")?.className ?? "";
    expect(a).not.toBe(b);
  });
});
