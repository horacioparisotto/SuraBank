import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerUserOrRedirect } from "@/lib/server-auth";
import { AllMovements } from "@/components/all-movements";
import { TabBar } from "@/components/tab-bar";

export const dynamic = "force-dynamic";

export default async function MovementsPage() {
  await getServerUserOrRedirect();
  return (
    <div className="bg-bg flex min-h-screen flex-col">
      <main className="flex-1 px-5 pt-10 pb-6">
        <header className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Volver"
            className="bg-surface text-ink hover:text-brand flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-ink text-2xl font-bold">Movimientos</h1>
        </header>
        <section className="mt-6">
          <AllMovements />
        </section>
      </main>
      <TabBar />
    </div>
  );
}
