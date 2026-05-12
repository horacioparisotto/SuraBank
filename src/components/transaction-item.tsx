import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionDTO, TransactionType } from "@/lib/schemas";

const TYPE_STYLES: Record<
  TransactionType,
  { icon: typeof ArrowDown; bg: string; text: string; amountColor: string }
> = {
  SUS: {
    icon: ArrowUpDown,
    bg: "bg-tx-sus-bg",
    text: "text-tx-sus",
    amountColor: "text-tx-sus",
  },
  CASH_IN: {
    icon: ArrowDown,
    bg: "bg-tx-cash-in-bg",
    text: "text-tx-cash-in",
    amountColor: "text-tx-cash-in",
  },
  CASH_OUT: {
    icon: ArrowUp,
    bg: "bg-tx-cash-out-bg",
    text: "text-tx-cash-out",
    amountColor: "text-tx-cash-out",
  },
};

export function TransactionItem({ tx }: { tx: TransactionDTO }) {
  const style = TYPE_STYLES[tx.transactionType] ?? TYPE_STYLES.CASH_OUT;
  const Icon = style.icon;
  return (
    <article
      data-testid="transaction-item"
      className="bg-surface flex items-center gap-3 rounded-2xl p-3 shadow-sm"
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", style.bg)}>
        <Icon className={cn("h-5 w-5", style.text)} aria-hidden />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-ink text-sm font-semibold">{tx.title}</span>
        <span className="text-ink-muted text-xs">{tx.subtitle}</span>
      </div>
      <span className={cn("text-sm font-semibold", style.amountColor)}>${tx.amount}</span>
    </article>
  );
}
