import { describe, it, expect } from "vitest";
import {
  CardSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  TransactionSchema,
  TransactionTypeSchema,
} from "@/lib/schemas";

describe("schemas", () => {
  describe("TransactionTypeSchema", () => {
    it.each(["SUS", "CASH_IN", "CASH_OUT"])("acepta tipo válido %s", (t) => {
      expect(TransactionTypeSchema.parse(t)).toBe(t);
    });
    it("rechaza tipo inválido", () => {
      expect(() => TransactionTypeSchema.parse("UNKNOWN")).toThrow();
    });
  });

  describe("LoginRequestSchema", () => {
    it("acepta email + password válidos", () => {
      const v = LoginRequestSchema.parse({ email: "a@b.com", password: "x" });
      expect(v.email).toBe("a@b.com");
    });
    it("rechaza email inválido", () => {
      const r = LoginRequestSchema.safeParse({ email: "no-email", password: "x" });
      expect(r.success).toBe(false);
    });
    it("rechaza password vacío", () => {
      const r = LoginRequestSchema.safeParse({ email: "a@b.com", password: "" });
      expect(r.success).toBe(false);
    });
  });

  describe("LoginResponseSchema", () => {
    it("valida respuesta correcta", () => {
      const v = LoginResponseSchema.parse({ name: "Carlos", token: "abc" });
      expect(v.name).toBe("Carlos");
    });
  });

  describe("CardSchema", () => {
    it("valida shape de tarjeta", () => {
      const v = CardSchema.parse({
        id: 1,
        issuer: "Mastercard",
        name: "Carlos",
        expDate: "02/30",
        lastDigits: 1234,
        balance: "100.00",
        currency: "USD",
      });
      expect(v.id).toBe(1);
    });
    it("rechaza balance numérico (debe ser string)", () => {
      const r = CardSchema.safeParse({
        id: 1,
        issuer: "Visa",
        name: "x",
        expDate: "12/30",
        lastDigits: 1,
        balance: 100,
        currency: "USD",
      });
      expect(r.success).toBe(false);
    });
  });

  describe("TransactionSchema", () => {
    it("valida una transacción completa", () => {
      const v = TransactionSchema.parse({
        id: 1,
        title: "Adobe",
        subtitle: "Pago",
        amount: "10.00",
        transactionType: "SUS",
        date: "2026-05-12T00:00:00.000Z",
      });
      expect(v.transactionType).toBe("SUS");
    });
  });
});
