"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { TransactionItem } from "@/components/transaction-item";
import { Input } from "@/components/ui/input";
import type { TransactionDTO } from "@/lib/schemas";

function groupByDate(list: TransactionDTO[]) {
  const formatter = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const groups = new Map<string, TransactionDTO[]>();
  for (const tx of list) {
    const key = formatter.format(new Date(tx.date));
    const bucket = groups.get(key) ?? [];
    bucket.push(tx);
    groups.set(key, bucket);
  }
  return Array.from(groups.entries());
}

export function AllMovements() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movements", "all"],
    queryFn: api.allMovements,
  });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.transactionType.toLowerCase().includes(q),
    );
  }, [data, query]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }
  if (isError || !data) {
    return (
      <p className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm">
        No pudimos cargar los movimientos.
      </p>
    );
  }

  const grouped = groupByDate(filtered);

  return (
    <div className="flex flex-col gap-5">
      <Input
        type="search"
        placeholder="Buscar por título, tipo…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar movimientos"
        className="bg-surface placeholder:text-ink-muted/70 h-12 rounded-2xl px-4 text-sm shadow-sm"
      />
      {filtered.length === 0 ? (
        <p className="bg-surface text-ink-muted rounded-xl px-4 py-6 text-center text-sm">
          Sin resultados para “{query}”.
        </p>
      ) : (
        grouped.map(([day, list]) => (
          <section key={day}>
            <h2 className="text-ink-muted mb-2 text-xs font-semibold tracking-wider uppercase">
              {day}
            </h2>
            <ul className="flex flex-col gap-2">
              {list.map((tx, idx) => (
                <motion.li
                  key={tx.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  <TransactionItem tx={tx} />
                </motion.li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
