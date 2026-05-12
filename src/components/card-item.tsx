import { cn } from "@/lib/utils";
import { IssuerLogo } from "@/components/issuer-logo";
import type { CardDTO } from "@/lib/schemas";

const PALETTE = [
  "bg-[#1e40ff] text-white", // primary blue
  "bg-[#ff6b6b] text-white", // coral
  "bg-[#0f172a] text-white", // ink fallback
];

export function CardItem({ card, index = 0 }: { card: CardDTO; index?: number }) {
  const palette = PALETTE[index % PALETTE.length];
  return (
    <article
      data-testid="card-item"
      className={cn(
        "relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-3xl p-5 shadow-lg",
        palette,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-white/85">Balance</span>
        <IssuerLogo issuer={card.issuer} />
      </div>
      <div>
        <div className="flex items-end gap-2">
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold tracking-wide uppercase">
            {card.currency}
          </span>
          <span className="font-display text-3xl leading-none font-bold">{card.balance}</span>
        </div>
        <p className="mt-3 font-mono text-base tracking-[0.2em] text-white/90">
          **** **** **** {card.lastDigits}
        </p>
      </div>
      <div className="flex items-end justify-between text-sm">
        <span className="font-medium">{card.name}</span>
        <span className="text-right text-xs text-white/70">
          <span className="block">Exp. Date</span>
          <span className="block text-sm text-white">{card.expDate}</span>
        </span>
      </div>
    </article>
  );
}
