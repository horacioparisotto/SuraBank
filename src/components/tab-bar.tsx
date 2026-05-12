"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useSounds } from "@/hooks/use-sounds";

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { playTap } = useSounds();

  const handleLogout = async () => {
    playTap();
    await api.logout();
    router.replace("/login");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  const tap = () => playTap();

  return (
    <nav
      aria-label="Navegación principal"
      className="border-border/60 bg-surface/95 sticky right-0 bottom-0 left-0 z-10 flex items-center justify-around border-t px-4 py-3 backdrop-blur"
    >
      <Link
        href="/"
        onClick={tap}
        aria-label="Home"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          isActive("/") ? "text-brand" : "text-ink-muted hover:text-ink",
        )}
      >
        <Home className="h-6 w-6" />
      </Link>
      <Link
        href="/movements"
        onClick={tap}
        aria-label="Movimientos"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
          isActive("/movements") ? "text-brand" : "text-ink-muted hover:text-ink",
        )}
      >
        <ScrollText className="h-6 w-6" />
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Cerrar sesión"
        className="text-ink-muted hover:text-destructive flex h-10 w-10 items-center justify-center rounded-full transition-colors"
      >
        <LogOut className="h-6 w-6" />
      </button>
    </nav>
  );
}
