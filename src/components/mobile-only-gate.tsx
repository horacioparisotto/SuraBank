"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Smartphone } from "lucide-react";

const MOBILE_QUERY = "(max-width: 767px)";

export function MobileOnlyGate({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mientras hidrata, render del contenido para evitar flash (mobile-first)
  if (isMobile === null || isMobile) {
    return <>{children}</>;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#1e40ff] to-[#0b1f8a] px-8 text-center text-white"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
          <Smartphone className="h-10 w-10 text-white" aria-hidden />
        </div>
        <h1 className="font-display text-5xl font-extrabold tracking-tight">SuraBank</h1>
      </div>
      <div className="max-w-md space-y-3">
        <p className="text-xl font-semibold">Esta experiencia está diseñada para mobile</p>
        <p className="text-base text-white/85">
          Achicá la ventana del navegador hasta el tamaño de un celular (menos de 768&nbsp;px de
          ancho) o abrí esta URL desde tu teléfono.
        </p>
      </div>
      <p className="text-xs tracking-widest text-white/60 uppercase">
        Tip · DevTools → Toggle device toolbar (Ctrl+Shift+M)
      </p>
    </div>
  );
}
