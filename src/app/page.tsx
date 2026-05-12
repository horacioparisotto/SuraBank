import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { getServerUserOrRedirect } from "@/lib/server-auth";
import { CardsCarousel } from "@/components/cards-carousel";
import { LastMovements } from "@/components/last-movements";
import { TabBar } from "@/components/tab-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getServerUserOrRedirect();

  return (
    <div className="bg-bg flex min-h-screen flex-col">
      <main className="flex-1 px-5 pt-10 pb-6">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-ink-muted text-sm">Hola</p>
            <h1 className="font-display text-ink text-2xl font-bold">{user.name}</h1>
          </div>
          <div className="flex items-center gap-3 pt-1.5">
            <Link
              href="/movements"
              aria-label="Ver todos los movimientos"
              className="bg-surface text-ink hover:text-brand flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              type="button"
              aria-label="Notificaciones"
              className="bg-surface text-ink flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
              tabIndex={-1}
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="mt-6">
          <CardsCarousel />
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-ink text-lg font-bold">Últimos movimientos</h2>
            <Link
              href="/movements"
              className="text-brand text-xs font-medium hover:underline"
              aria-label="Ver todos los movimientos"
            >
              Ver todos
            </Link>
          </div>
          <LastMovements />
        </section>
      </main>
      <TabBar />
    </div>
  );
}
