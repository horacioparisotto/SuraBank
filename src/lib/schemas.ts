import { z } from "zod";

export const TransactionTypeSchema = z.enum(["SUS", "CASH_IN", "CASH_OUT"]);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  name: z.string(),
  token: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const CardSchema = z.object({
  id: z.number(),
  issuer: z.string(),
  name: z.string(),
  expDate: z.string(),
  lastDigits: z.number(),
  balance: z.string(),
  currency: z.string(),
});
export type CardDTO = z.infer<typeof CardSchema>;

export const TransactionSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  amount: z.string(),
  transactionType: TransactionTypeSchema,
  date: z.string(),
});
export type TransactionDTO = z.infer<typeof TransactionSchema>;
