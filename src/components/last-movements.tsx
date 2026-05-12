"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { TransactionItem } from "@/components/transaction-item";

function TxSkeleton() {
  return <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />;
}

export function LastMovements() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movements", "last"],
    queryFn: api.lastMovements,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <TxSkeleton />
        <TxSkeleton />
        <TxSkeleton />
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
  if (data.length === 0) {
    return (
      <p className="bg-surface text-ink-muted rounded-xl px-4 py-6 text-center text-sm">
        No tenés movimientos recientes.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.map((tx, idx) => (
        <motion.li
          key={tx.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.06, ease: "easeOut" }}
        >
          <TransactionItem tx={tx} />
        </motion.li>
      ))}
    </ul>
  );
}
