"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone } from "lucide-react";

const MOBILE_QUERY = "(max-width: 767px)";
const SPLASH_DURATION_MS = 400;

export function MobileOnlyGate({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  // Solo animamos cuando el viewport CAMBIA, no en el primer paint.
  const [hasChanged, setHasChanged] = useState(false);
  // Tapa el primer paint en desktop con un splash brevísimo para evitar
  // el "snap" cuando los hijos del overlay se montan después del effect.
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- subscribe to MediaQueryList on mount
    setIsMobile(mq.matches);
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

  // Bloquear scroll del body mientras el overlay está visible
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
  const showSplashOverlay = showSplash && showOverlay && !hasChanged;

  return (
    <>
      {children}

      {/* Splash brevísimo SOLO en el primer paint en desktop */}
      <AnimatePresence>
        {showSplashOverlay && (
          <motion.div
            key="mobile-gate-splash"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#1e40ff] to-[#0b1f8a]"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm"
            >
              <Smartphone className="h-10 w-10 text-white" aria-hidden />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={hasChanged ? { scale: 0.85 } : false}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm"
              >
                <Smartphone className="h-10 w-10 text-white" aria-hidden />
              </motion.div>
              <h1 className="font-display text-5xl font-extrabold tracking-tight">SuraBank</h1>
            </div>
            <div className="max-w-md space-y-3">
              <p className="text-xl font-semibold">Esta experiencia está diseñada para mobile</p>
              <p className="text-base text-white/85">
                Achicá la ventana del navegador hasta el tamaño de un celular (menos de 768&nbsp;px
                de ancho) o abrí esta URL desde tu teléfono.
              </p>
            </div>
            <p className="text-xs tracking-widest text-white/60 uppercase">
              Tip · DevTools → Toggle device toolbar (Ctrl+Shift+M)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
