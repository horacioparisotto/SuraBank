import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IssuerLogo } from "@/components/issuer-logo";

describe("IssuerLogo", () => {
  it("renderiza SVG Mastercard", () => {
    render(<IssuerLogo issuer="Mastercard" />);
    expect(screen.getByLabelText("Mastercard")).toBeInTheDocument();
  });

  it("renderiza SVG Visa", () => {
    render(<IssuerLogo issuer="Visa" />);
    expect(screen.getByLabelText("Visa")).toBeInTheDocument();
  });

  it("fallback a texto cuando el issuer es desconocido", () => {
    render(<IssuerLogo issuer="Amex" />);
    expect(screen.getByText("Amex")).toBeInTheDocument();
  });
});
