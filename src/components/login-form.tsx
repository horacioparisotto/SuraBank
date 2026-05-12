"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { LoginRequestSchema, type LoginRequest } from "@/lib/schemas";

export function LoginForm() {
  const router = useRouter();
  const { playTap, playSuccess, playError } = useSounds();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/surabank/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.error ?? "No pudimos iniciar sesión. Intentá de nuevo.");
        playError();
        return;
      }
      playSuccess();
      router.push("/");
      router.refresh();
    } catch {
      setServerError("Error de red. Verificá tu conexión.");
      playError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-ink font-semibold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Ingresa tu email"
          aria-invalid={!!errors.email}
          className="bg-surface placeholder:text-ink-muted/70 h-14 rounded-2xl px-5 text-base shadow-sm ring-0"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-xs" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-ink font-semibold">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          aria-invalid={!!errors.password}
          className="bg-surface placeholder:text-ink-muted/70 h-14 rounded-2xl px-5 text-base shadow-sm ring-0"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-xs" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <label className="text-ink-muted flex items-center gap-2 text-sm">
        <Checkbox id="remember" />
        <span>Recordarme</span>
      </label>

      {serverError && (
        <p className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm" role="alert">
          {serverError}
        </p>
      )}

      <div className="mt-auto pb-2">
        <Button
          type="submit"
          disabled={submitting}
          onClick={() => playTap()}
          className="bg-brand hover:bg-brand-hover h-14 w-full rounded-2xl text-base font-semibold text-white shadow-md disabled:opacity-70"
        >
          {submitting ? "Ingresando…" : "Ingresar"}
        </Button>
      </div>
    </motion.form>
  );
}
