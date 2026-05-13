"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const MOBILE_QUERY = "(max-width: 767px)";
const SPLASH_DURATION_MS = 450;

/**
 * Wrapper que muestra un overlay si el viewport NO es mobile.
 *
 * Problema que resuelve: el server SSR no sabe el viewport. Si dependemos solo
 * del `useEffect`, el browser pinta la página de login antes de que React
 * decida mostrar el overlay → flash blanco horrible.
 *
 * Solución: un overlay-CSS inicial siempre presente que se oculta vía media query
 * en mobile. React, después de montar, toma el control y muestra el splash + gate
 * según el viewport real.
 */
export function MobileOnlyGate({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- subscribe on mount
    setIsMobile(mq.matches);
    setMounted(true);
    const onChange = () => {
      setHasChanged(true);
      setIsMobile(mq.matches);
    };
    mq.addEventListener("change", onChange);
    const t = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => {
      mq.removeEventListener("change", onChange);
      clearTimeout(t);
    };
  }, []);

  // Bloquear scroll del body mientras el overlay está visible (desktop)
  useEffect(() => {
    if (isMobile === false) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile]);

  const showOverlay = isMobile === false;
  const showContent = showOverlay && (hasChanged || !showSplash);

  return (
    <>
      {children}

      {/* Overlay-CSS inicial: SIEMPRE en el DOM, pero solo visible si !mobile via media query.
          Esto cubre el primer paint antes de que React decida.
          Cuando `mounted` se vuelve true (después del effect), React toma el control con
          AnimatePresence y este nodo desaparece — la transición es seamless porque el splash
          de React renderiza el mismo gradiente y texto en el mismo lugar. */}
      {!mounted && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1e40ff] to-[#0b1f8a] text-white md:flex"
        >
          <p className="text-xs tracking-[0.3em] text-white/70 uppercase">Cargando</p>
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/15">
            <div className="loading-bar h-full w-1/2 bg-white/70" />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="mobile-gate"
            role="alert"
            aria-live="polite"
            initial={hasChanged ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#1e40ff] to-[#0b1f8a] px-8 text-center text-white"
          >
            <AnimatePresence>
              {!showContent && (
                <motion.div
                  key="splash"
                  initial={false}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-xs tracking-[0.3em] text-white/70 uppercase">Cargando</p>
                  <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: SPLASH_DURATION_MS / 1000,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1/2 bg-white/70"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showContent && (
                <motion.div
                  key="gate-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                      <Smartphone className="h-10 w-10 text-white" aria-hidden />
                    </div>
                    <h1 className="font-display text-5xl font-extrabold tracking-tight">
                      SuraBank
                    </h1>
                  </div>
                  <div className="max-w-md space-y-3">
                    <p className="text-xl font-semibold">
                      Esta experiencia está diseñada para mobile
                    </p>
                    <p className="text-base text-white/85">
                      Achicá la ventana del navegador hasta el tamaño de un celular (menos de
                      768&nbsp;px de ancho) o abrí esta URL desde tu teléfono.
                    </p>
                  </div>
                  <p className="text-xs tracking-widest text-white/60 uppercase">
                    Tip · DevTools → Toggle device toolbar (Ctrl+Shift+M)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
